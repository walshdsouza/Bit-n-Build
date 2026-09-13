import { test, expect, firefox, type Browser, type BrowserContext, type Page, type Frame } from "@playwright/test";
import { copyFileSync, cpSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { buildSync } from "../../extension/node_modules/esbuild/lib/main";
// web-ext's documented remote installer talks to an actual Firefox add-on runtime.
// @ts-expect-error web-ext does not publish TypeScript declarations for its installer.
import { connect } from "../../extension/node_modules/web-ext/lib/firefox/remote.js";

test.describe.configure({ mode: "serial", timeout: 120000 });
let browser: Browser, context: BrowserContext, page: Page, frame: Frame;
const fixtureDir = path.resolve("logs/firefox-capture-addon");
const probeBackground = `
const probe = {requests:[], aborted:0};
globalThis.fetch = async (url, options) => {
 if (url !== 'https://unmute-ai.vercel.app/api/live') throw Error('Unexpected external request');
 const blob=options.body.get('audio'), bytes=await blob.arrayBuffer(), audio=new AudioContext();
 const decoded=await audio.decodeAudioData(bytes.slice(0)); await audio.close();
 probe.requests.push({url,credentials:options.credentials,type:blob.type,size:blob.size,duration:decoded.duration,rate:new DataView(bytes).getUint32(24,true)});
 return new Response(JSON.stringify({speech:false,text:'',segments:[],plan:{signs:[],duration:0}}),{status:200,headers:{'Content-Type':'application/json'}});
};
browser.runtime.onMessage.addListener(async m => {
 if(m.type==='TEST_METRICS')return probe;
 if(m.type==='TEST_BLOB') { try{return {instance:m.blob instanceof Blob,type:typeof m.blob.arrayBuffer,size:(await m.blob.arrayBuffer()).byteLength};}catch(e){return {error:String(e)}} }
});
`;
const harness = `
import {captureExtensionMeetingAudio,requestExtensionLiveAudio} from ${JSON.stringify(path.resolve("extension/src/pipeline/meetingCapture.ts"))};
const probe=window.__capture={chunks:[],statuses:[],errors:[],responses:[],ready:false,stopped:false};
let controller,capture;
for(const source of ['tab','microphone','mixed']) {
 const button=document.createElement('button');button.textContent='Start '+source;button.onclick=async()=>{
 controller?.abort();controller=new AbortController();probe.ready=false;probe.stopped=false;
 try { capture=await captureExtensionMeetingAudio(location.pathname.includes('sidebar')?'sidebar':'widget')(chunk=>{
  const form=new FormData();form.append('audio',chunk.audio,'meeting.wav');
  requestExtensionLiveAudio(form,controller.signal).then(r=>probe.responses.push(r.status)).catch(e=>probe.errors.push(e.message));
  (async()=>{const bytes=await chunk.audio.arrayBuffer(),audio=new AudioContext(), decoded=await audio.decodeAudioData(bytes.slice(0));
   const pcm=decoded.getChannelData(0);const rms=Math.sqrt(pcm.reduce((s,v)=>s+v*v,0)/pcm.length);await audio.close();
   const view=new DataView(bytes);let s='';new Uint8Array(bytes).forEach(v=>s+=String.fromCharCode(v));
   probe.chunks.push({duration:decoded.duration,rate:view.getUint32(24,true),channels:view.getUint16(22,true),rms,header:String.fromCharCode(...new Uint8Array(bytes,0,4)),base64:btoa(s)});})();
 },()=>{probe.stopped=true},error=>probe.errors.push(error),controller.signal,{source:source==='microphone'?'microphone':'tab',includeMicrophone:source==='mixed',onStatus:s=>probe.statuses.push(s)});probe.ready=true;
 }catch(e){probe.errors.push(e.message)};
 };document.body.appendChild(button);
}
const stop=document.createElement('button');stop.textContent='Stop';stop.onclick=async()=>{await capture?.stop();probe.stopped=true};document.body.appendChild(stop);
const cancel=document.createElement('button');cancel.textContent='Cancel';cancel.onclick=()=>controller?.abort();document.body.appendChild(cancel);
`;

async function metrics() { return frame.evaluate(() => (window as unknown as { __capture: { chunks: {duration:number;rate:number;channels:number;rms:number;header:string;base64:string}[]; statuses:{state:string;level:number}[]; errors:string[];responses:number[];ready:boolean;stopped:boolean} }).__capture); }
async function start(mode="tab") { await frame.getByRole("button",{name:`Start ${mode}`,exact:true}).click(); await expect.poll(async()=>({ready:(await metrics()).ready,errors:(await metrics()).errors})).toEqual({ready:true,errors:[]}); }

test.beforeAll(async () => {
 mkdirSync(path.join(fixtureDir,"dist"),{recursive:true}); cpSync("extension/icons",path.join(fixtureDir,"icons"),{recursive:true});
 const manifest=JSON.parse(readFileSync("extension/manifest.json","utf8"));
 manifest.background.scripts.unshift("dist/test-background.js");
 manifest.content_scripts=manifest.content_scripts.filter((entry:{js:string[]})=>entry.js.includes("dist/meet-bridge.js"));
 manifest.content_scripts.push({matches:["https://meet.google.com/*"],js:["dist/test-content.js"],run_at:"document_idle"});
 writeFileSync(path.join(fixtureDir,"dist/test-content.js"),'document.documentElement.dataset.extensionBase=browser.runtime.getURL("").slice(0,-1);');
 writeFileSync(path.join(fixtureDir,"manifest.json"),JSON.stringify(manifest));
 for(const name of ["background","meet-bridge","page-hook"]) buildSync({entryPoints:[`extension/src/${name==='background'?'background/background':`content-scripts/${name}`}.ts`],outfile:path.join(fixtureDir,`dist/${name}.js`),bundle:true,format:"iife",platform:"browser"});
 copyFileSync("public/live-audio-worklet.js",path.join(fixtureDir,"dist/live-audio-worklet.js"));
 writeFileSync(path.join(fixtureDir,"dist/test-background.js"),probeBackground);
 buildSync({stdin:{contents:harness,resolveDir:process.cwd(),loader:"ts"},outfile:path.join(fixtureDir,"dist/widget.js"),bundle:true,format:"iife",platform:"browser"});
 for(const name of ["widget","sidebar"]) writeFileSync(path.join(fixtureDir,`dist/${name}.html`),'<html><body><script src="widget.js"></script></body></html>');
 const repaired=path.resolve("logs/firefox-runtime-155/firefox.exe");
 browser=await firefox.launch({headless:true,executablePath:process.env.PLAYWRIGHT_FIREFOX_EXECUTABLE || (existsSync(repaired)?repaired:undefined),args:["--start-debugger-server","6024"],firefoxUserPrefs:{"devtools.debugger.remote-enabled":true,"devtools.debugger.prompt-connection":false,"xpinstall.signatures.required":false,"media.autoplay.default":0,"media.navigator.streams.fake":true,"media.navigator.permission.disabled":true,"media.webspeech.synth.enabled":false}});
 const remote=await connect(6024); await remote.installTemporaryAddon(fixtureDir,false); remote.disconnect();
 context=await browser.newContext({viewport:{width:1280,height:900}});
 await context.route("https://meet.google.com/**",r=>r.fulfill({contentType:"text/html",headers:{"Content-Security-Policy":"script-src 'self' 'nonce-fixture'; object-src 'none'"},body:'<!doctype html><h1>Controlled synthetic meeting</h1>'}));
 page=await context.newPage();
 await page.addInitScript(()=>{
  const probe={contexts:[] as AudioContext[],micRequests:0};Object.assign(window,{__audio:probe});
  const Native=AudioContext;window.AudioContext=class extends Native{constructor(options?:AudioContextOptions){super(options);probe.contexts.push(this)}};
  const native=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia=options=>{probe.micRequests++;return native(options)};
 });
 await page.goto("https://meet.google.com/test-room");
 await expect.poll(()=>page.evaluate(()=>Boolean((RTCPeerConnection as typeof RTCPeerConnection & {__gesturesyncPatched?:boolean}).__gesturesyncPatched))).toBe(true);
 // Genuine WebRTC negotiation and receiving track, with only a generated test tone.
 await page.evaluate(async()=>{
  const audio=new AudioContext(),tone=audio.createOscillator(),gain=audio.createGain(),destination=audio.createMediaStreamDestination();
  gain.gain.value=.12;tone.frequency.value=440;tone.connect(gain).connect(destination);tone.start();await audio.resume();
  const sender=new RTCPeerConnection(),receiver=new RTCPeerConnection();
  sender.onicecandidate=e=>{if(e.candidate)void receiver.addIceCandidate(e.candidate)};
  receiver.onicecandidate=e=>{if(e.candidate)void sender.addIceCandidate(e.candidate)};
  const received=new Promise<MediaStreamTrack>(resolve=>{receiver.ontrack=e=>resolve(e.track)});
  destination.stream.getTracks().forEach(track=>sender.addTrack(track,destination.stream));
  await sender.setLocalDescription(await sender.createOffer());await receiver.setRemoteDescription(sender.localDescription!);
  await receiver.setLocalDescription(await receiver.createAnswer());await sender.setRemoteDescription(receiver.localDescription!);
  const track=await received;Object.assign(window,{__rtc:{sender,receiver,track,tone,gain,audio}});
 });
 await expect.poll(()=>page.evaluate(async()=>{
  const receiver=(window as unknown as {__rtc:{receiver:RTCPeerConnection}}).__rtc.receiver;
  const stats=await receiver.getStats();let bytes=0;
  stats.forEach(stat=>{if(stat.type==='inbound-rtp' && stat.kind==='audio')bytes+=stat.bytesReceived||0});
  return bytes;
 })).toBeGreaterThan(1000);
 // The fixture obtains the generated UUID from an extension-owned content script.
 const base=await page.evaluate(()=>document.documentElement.dataset.extensionBase);
 expect(base).toMatch(/^moz-extension:\/\//);
 await page.evaluate(url=>{const iframe=document.createElement('iframe');iframe.src=url+'/dist/widget.html';iframe.style.cssText='width:900px;height:120px';document.body.appendChild(iframe)},base!);
 await expect.poll(()=>page.frames().find(f=>f.url().endsWith('/dist/widget.html'))?.url()).toBeTruthy();
 frame=page.frames().find(f=>f.url().endsWith('/dist/widget.html'))!;
 await expect(frame.getByRole('button',{name:'Start tab',exact:true})).toBeVisible();
});
test.afterAll(async()=>{await browser?.close();});
test.afterEach(async()=>{
 if(test.info().status!==test.info().expectedStatus && frame){
  const result=await metrics();
  console.log(JSON.stringify({errors:result.errors,statuses:result.statuses.slice(-5),ready:result.ready,chunks:result.chunks.length,responses:result.responses}));
  console.log(await page.evaluate(()=>{const rtc=(window as unknown as {__rtc:{sender:RTCPeerConnection;receiver:RTCPeerConnection;track:MediaStreamTrack}}).__rtc;return {sender:rtc.sender.connectionState,receiver:rtc.receiver.connectionState,track:[rtc.track.enabled,rtc.track.muted,rtc.track.readyState]}}));
 }
});

test('real Firefox WebRTC capture produces independent 16 kHz WAVs and drains the final stop tail',async()=>{
 await start(); await expect.poll(async()=>(await metrics()).chunks.length,{timeout:24000}).toBe(2);
 await page.waitForTimeout(1000); await frame.getByRole('button',{name:'Stop',exact:true}).click();
 await expect.poll(async()=>(await metrics()).stopped).toBe(true);
 await expect.poll(async()=>(await metrics()).chunks.length).toBe(3);
 await expect.poll(async()=>(await metrics()).responses.length).toBe(3);
 const result=await metrics();
 for(const chunk of result.chunks){expect(chunk.header).toBe('RIFF');expect(chunk.rate).toBe(16000);expect(chunk.channels).toBe(1);expect(chunk.rms).toBeGreaterThan(.01)}
 expect(result.chunks[0].duration).toBeCloseTo(5,2);expect(result.chunks[1].duration).toBeCloseTo(5,2);expect(result.chunks[2].duration).toBeGreaterThan(.5);expect(result.chunks[2].duration).toBeLessThan(3);
 expect(result.statuses.some(s=>s.state==='receiving'&&s.level>0)).toBe(true);expect(result.errors).toEqual([]);
 const mic=await page.evaluate(()=>(window as unknown as {__audio:{micRequests:number}}).__audio.micRequests);expect(mic).toBe(0);
 const requests=await frame.evaluate(()=>(window as unknown as {browser:{runtime:{sendMessage:(message:object)=>Promise<{requests:{credentials:string;type:string;rate:number}[]}>}}}).browser.runtime.sendMessage({type:'TEST_METRICS'}));expect(requests.requests).toHaveLength(3);
 for(const request of requests.requests){expect(request.credentials).toBe('omit');expect(request.type).toBe('audio/wav');expect(request.rate).toBe(16000)}
 writeFileSync('logs/firefox-live-synthetic.wav',Buffer.from(result.chunks[0].base64,'base64'));
 const verification={browser:browser.version(),chunks:result.chunks.map(({base64,...chunk})=>{void base64;return chunk}),requests:requests.requests};
 writeFileSync('logs/firefox-capture-verification.json',JSON.stringify(verification,null,2));
 await test.info().attach('Firefox decoded PCM metrics',{body:JSON.stringify(verification),contentType:'application/json'});
});

test('real Firefox reports silence, muted and suspended inputs, explicitly adds a microphone, and cancels without a tail',async()=>{
 await start('mixed');expect(await page.evaluate(()=>(window as unknown as {__audio:{micRequests:number}}).__audio.micRequests)).toBe(1);
 await expect.poll(async()=>(await metrics()).statuses.at(-1)?.state).toBe('receiving');
 await page.evaluate(async()=>{const p=(window as unknown as {__audio:{contexts:AudioContext[]}}).__audio;await p.contexts.at(-1)!.suspend()});
 await expect.poll(async()=>(await metrics()).statuses.at(-1)?.state).toBe('suspended');
 await page.evaluate(async()=>{const p=(window as unknown as {__audio:{contexts:AudioContext[]}}).__audio;await p.contexts.at(-1)!.resume()});
 await expect.poll(async()=>(await metrics()).statuses.at(-1)?.state).toBe('receiving');
 await frame.getByRole('button',{name:'Cancel',exact:true}).click();const count=(await metrics()).chunks.length;await page.waitForTimeout(5500);expect((await metrics()).chunks).toHaveLength(count);
 await start();
 await page.evaluate(()=>{(window as unknown as {__rtc:{gain:GainNode}}).__rtc.gain.gain.value=0});
 await expect.poll(async()=>(await metrics()).statuses.at(-1)?.state).toBe('silent');
 await page.evaluate(()=>{(window as unknown as {__rtc:{track:MediaStreamTrack}}).__rtc.track.enabled=false});
 await expect.poll(async()=>(await metrics()).statuses.at(-1)?.state).toBe('muted');
 await frame.getByRole('button',{name:'Cancel',exact:true}).click();
 await page.evaluate(()=>{const r=(window as unknown as {__rtc:{track:MediaStreamTrack;gain:GainNode}}).__rtc;r.track.enabled=true;r.gain.gain.value=.12});
});

test('real Firefox view disconnect releases ownership and runtime Blob behavior is measured',async()=>{
 await start('microphone');
 const before=await frame.evaluate(()=>(window as unknown as {browser:{runtime:{sendMessage:(message:object)=>Promise<object>}}}).browser.runtime.sendMessage({type:'TEST_BLOB',blob:new Blob(['test'],{type:'audio/wav'})}));
 writeFileSync('logs/firefox-blob-probe.json',JSON.stringify(before,null,2));
 await test.info().attach('Firefox legacy Blob runtime probe',{body:JSON.stringify(before),contentType:'application/json'});
 const url=frame.url();await page.locator('iframe').evaluate(element=>element.remove());
 await expect.poll(()=>page.evaluate(()=>(window as unknown as {__audio:{contexts:AudioContext[]}}).__audio.contexts.at(-1)?.state)).toBe('closed');
 await page.evaluate(url=>{const iframe=document.createElement('iframe');iframe.src=url;iframe.style.cssText='width:900px;height:120px';document.body.appendChild(iframe)},url);
 await expect.poll(()=>page.frames().find(f=>f.url().endsWith('/dist/widget.html'))?.url()).toBeTruthy();frame=page.frames().find(f=>f.url().endsWith('/dist/widget.html'))!;
 await start();await frame.getByRole('button',{name:'Stop',exact:true}).click();await expect.poll(async()=>(await metrics()).stopped).toBe(true);
});


