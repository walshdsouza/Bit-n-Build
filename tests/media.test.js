const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const B = __dirname + "/.build/lib";
const { transcribeAudioFile } = require(B + "/whisper.js");
const { extractAudioTrack } = require(B + "/ffmpeg.js");
const ffmpeg = require("@ffmpeg-installer/ffmpeg").path;

(async () => {
  const originalFetch = global.fetch;
  let requests = 0;
  let assertions = 0;
  const audio = new Blob([new Uint8Array([1, 2, 3])], { type: "audio/wav" });
  global.fetch = async () => { requests++; throw new Error("Unexpected network request"); };
  const rejected = async (promise, match) => { await assert.rejects(promise, match); assertions++; };
  try {
    await rejected(transcribeAudioFile(audio, "speech.wav"), (error) => error.status === 422 && /not configured/.test(error.message));
    assert.equal(requests, 0); assertions++;
    await rejected(transcribeAudioFile(new Blob([]), "empty.wav", "test-groq-key"), (error) => error.status === 400);
    assert.equal(requests, 0); assertions++;

    global.fetch = async (url, options) => {
      assert.equal(url, "https://api.groq.com/openai/v1/audio/translations"); assertions++;
      assert.equal(options.headers.Authorization, "Bearer test-groq-key"); assertions++;
      assert.equal(options.body.get("model"), "whisper-large-v3"); assertions++;
      assert.equal(options.body.get("file").name, "speech.wav"); assertions++;
      return Response.json({ text: "Real spoken words.", duration: 4, segments: [{ start: "0", end: "4", text: "Real spoken words." }, { text: null }] });
    };
    const result = await transcribeAudioFile(audio, "speech.wav", "test-groq-key", "test-openai-key");
    assert.deepEqual(result, { text: "Real spoken words.", duration: 4, segments: [{ start: 0, end: 4, text: "Real spoken words." }], provider: "groq-whisper" }); assertions++;

    global.fetch = async (url, options) => {
      assert.equal(url, "https://api.openai.com/v1/audio/translations"); assertions++;
      assert.equal(options.body.get("model"), "whisper-1"); assertions++;
      return Response.json({ text: "Actual transcript without timestamps.", duration: 5 });
    };
    const fallback = await transcribeAudioFile(audio, "speech.wav", null, "test-openai-key");
    assert.equal(fallback.provider, "openai-whisper"); assertions++;
    assert.deepEqual(fallback.segments, [{ start: 0, end: 5, text: "Actual transcript without timestamps." }]); assertions++;

    global.fetch = async () => Response.json({ text: "", segments: [] });
    await rejected(transcribeAudioFile(audio, "speech.wav", "test-groq-key"), (error) => error.status === 422 && error.code === "NO_SPEECH");
    global.fetch = async () => Response.json({ text: "Invented words during silence.", segments: [{ start: 0, end: 20, text: "Invented words during silence.", no_speech_prob: 0.99, avg_logprob: -1.8 }] });
    await rejected(transcribeAudioFile(audio, "speech.wav", "test-groq-key"), (error) => error.code === "NO_SPEECH");
    const mostlyNoise = { text: "Background hallucination. Weak fragment.", duration: 100, segments: [
      { start: 0, end: 95, text: "Background hallucination.", no_speech_prob: 0.94, avg_logprob: -1.6 },
      { start: 95, end: 100, text: "Weak fragment.", no_speech_prob: 0.61, avg_logprob: -0.52 },
    ] };
    global.fetch = async () => Response.json(mostlyNoise);
    await rejected(transcribeAudioFile(audio, "speech.wav", "test-groq-key"), (error) => error.code === "NO_SPEECH");
    global.fetch = async () => Response.json({ ...mostlyNoise, segments: [mostlyNoise.segments[0], {
      ...mostlyNoise.segments[1], text: "Actual brief speech.", no_speech_prob: 0.1,
    }] });
    assert.equal((await transcribeAudioFile(audio, "speech.wav", "test-groq-key")).text, "Actual brief speech."); assertions++;
    global.fetch = async () => Response.json({ ...mostlyNoise, segments: [mostlyNoise.segments[0], {
      start: 95, end: 100, text: "Speech without confidence metadata.",
    }] });
    assert.equal((await transcribeAudioFile(audio, "speech.wav", "test-groq-key")).text, "Speech without confidence metadata."); assertions++;
    global.fetch = async () => Response.json({ text: "Quiet real words. Invented words.", duration: 6, segments: [
      { start: 0, end: 3, text: "Quiet real words.", no_speech_prob: 0.8, avg_logprob: -0.2 },
      { start: 3, end: 6, text: "Invented words.", no_speech_prob: 0.99, avg_logprob: -1.8 },
    ] });
    const filtered = await transcribeAudioFile(audio, "speech.wav", "test-groq-key");
    assert.equal(filtered.text, "Quiet real words."); assertions++;
    assert.equal(filtered.segments.length, 1); assertions++;
    // Background noise can produce confident-looking hallucinations even
    // when one of the two metrics is acceptable. Neither is reliable speech.
    global.fetch = async () => Response.json({ text: "Thank you. Browser.", duration: 30, segments: [
      { start: 0, end: 20, text: "Thank you.", no_speech_prob: 0.95, avg_logprob: -0.63 },
      { start: 20, end: 30, text: "Browser.", no_speech_prob: 0.29, avg_logprob: -1.71 },
    ] });
    await rejected(transcribeAudioFile(audio, "speech.wav", "test-groq-key"), (error) => error.code === "NO_SPEECH");
    global.fetch = async () => Response.json(null);
    await rejected(transcribeAudioFile(audio, "speech.wav", "test-groq-key"), (error) => error.status === 502);
    global.fetch = async () => new Response("private provider account details", { status: 401 });
    await rejected(transcribeAudioFile(audio, "speech.wav", "test-groq-key"), (error) => error.status === 502 && /service is unavailable/.test(error.message) && !error.message.includes("private provider"));
    global.fetch = async () => new Response("quota", { status: 429 });
    await rejected(transcribeAudioFile(audio, "speech.wav", "test-groq-key"), (error) => error.status === 429);
    global.fetch = async () => { throw new Error("Network failed"); };
    await rejected(transcribeAudioFile(audio, "speech.wav", "test-groq-key"), (error) => error.status === 502);
  } finally {
    global.fetch = originalFetch;
  }

  // Exercise the installed binary and actual extraction, not a stub.
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "gesture-media-test-"));
  try {
    const source = path.join(temp, "source.wav");
    const output = path.join(temp, "speech.mp3");
    execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-f", "lavfi", "-i", "sine=frequency=440:duration=1", "-y", source], { stdio: "pipe" });
    await extractAudioTrack(source, output);
    assert.ok(fs.statSync(output).size > 500); assertions++;
    execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-i", output, "-f", "null", "-"], { stdio: "pipe" });
    assertions++;
    const invalid = path.join(temp, "invalid.mp4");
    fs.writeFileSync(invalid, "not media");
    await rejected(extractAudioTrack(invalid, path.join(temp, "invalid.mp3")), /Failed to extract audio/);
    const silent = path.join(temp, "silent.wav");
    execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=16000:cl=mono", "-t", "1", "-y", silent], { stdio: "pipe" });
    await rejected(extractAudioTrack(silent, path.join(temp, "silent.mp3")), /No audible sound/);
  } finally {
    // The only recursive removal is the exact directory created by this test.
    assert.ok(path.resolve(temp).startsWith(path.resolve(os.tmpdir()) + path.sep));
    fs.rmSync(temp, { recursive: true, force: true });
  }
  console.log(`Transcription contracts and real FFmpeg extraction: ${assertions} passed`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
