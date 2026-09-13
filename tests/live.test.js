const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { encodeMonoWav, inspectLiveWav } = require("./.build/lib/live-audio.js");
const { LiveChunkQueue } = require("./.build/components/live/chunk-queue.js");

async function main() {
  const silence = encodeMonoWav(new Float32Array(16000 * 5), 16000);
  assert.deepEqual(inspectLiveWav(silence), { duration: 5, rms: 0 });
  const speech = encodeMonoWav(new Float32Array(16000 * 5).fill(0.25), 16000);
  assert.equal(inspectLiveWav(speech).duration, 5);
  assert.ok(Math.abs(inspectLiveWav(speech).rms - 0.25) < 0.0001);
  assert.throws(() => inspectLiveWav(new ArrayBuffer(50)));
  assert.throws(() => inspectLiveWav(encodeMonoWav(new Float32Array(16000 * 9), 16000)));
  assert.throws(() => inspectLiveWav(encodeMonoWav(new Float32Array(16000), 1)));
  const damaged = speech.slice(0);
  new DataView(damaged).setUint32(40, 200, true);
  assert.throws(() => inspectLiveWav(damaged));
  const samples = new DataView(encodeMonoWav(new Float32Array([-2, 2, NaN]), 16000));
  assert.equal(samples.getInt16(44, true), -32768);
  assert.equal(samples.getInt16(46, true), 32767);
  assert.equal(samples.getInt16(48, true), 0);

  // Exercise the actual browser worklet: continuous audio produces complete,
  // independent chunks, plus the final partial chunk when Stop is pressed.
  let Processor;
  const messages = [];
  const scope = { Float32Array, Math, sampleRate: 16000,
    AudioWorkletProcessor: class { constructor() { this.port = { postMessage: (msg) => messages.push(msg) }; } },
    registerProcessor: (_name, processor) => { Processor = processor; },
  };
  vm.runInNewContext(readFileSync(path.join(__dirname, "../public/live-audio-worklet.js"), "utf8"), scope);
  const processor = new Processor({ processorOptions: { chunkSeconds: 5 } });
  for (let i = 0; i < 1250; i++) processor.process([[new Float32Array(128).fill(0.5), new Float32Array(128).fill(0.25)]]);
  processor.process([[new Float32Array(4000).fill(0.5)]]);
  processor.port.onmessage({ data: "flush" });
  assert.deepEqual(messages.map((msg) => msg.type), ["chunk", "chunk", "chunk", "flushed"]);
  assert.deepEqual(messages.slice(0, 3).map((msg) => inspectLiveWav(encodeMonoWav(msg.samples, msg.sampleRate)).duration), [5, 5, 0.25]);
  assert.equal(messages[0].samples[0], 0.375);
  processor.process([[new Float32Array(80000)]]);
  assert.equal(messages.length, 4, "no new audio is emitted after stop");

  const order = [];
  const releases = [];
  const counts = [];
  const errors = [];
  const nextTurn = () => new Promise((resolve) => setImmediate(resolve));
  const queue = new LiveChunkQueue(async (value) => {
    order.push(value);
    await new Promise((resolve) => releases.push(resolve));
  }, (count) => counts.push(count), (err) => errors.push(err), 2);
  assert.equal(queue.push(1), true);
  assert.equal(queue.push(2), true);
  assert.equal(queue.push(3), false, "bounded backlog rejects overflow");
  assert.deepEqual(order, [1], "only one provider call runs at once");
  releases.shift()();
  await nextTurn();
  assert.deepEqual(order, [1, 2]);
  releases.shift()();
  await nextTurn();
  assert.equal(counts.at(-1), 0);
  assert.deepEqual(errors, []);
  queue.close();
  assert.equal(queue.push(4), false);

  let aborted = false;
  const cancelled = new LiveChunkQueue(async (_value, signal) => {
    await new Promise((resolve) => signal.addEventListener("abort", () => { aborted = true; resolve(); }));
  }, () => {}, () => assert.fail("cancellation should not become an error"));
  cancelled.push(1);
  cancelled.close();
  await nextTurn();
  assert.equal(aborted, true);

  const failed = new LiveChunkQueue(async () => { throw new Error("provider unavailable"); }, () => {}, (err) => errors.push(err));
  failed.push(1);
  failed.push(2);
  await nextTurn();
  assert.equal(errors.length, 1);
  assert.equal(failed.push(3), false, "provider failure stops future requests");
  console.log("Live audio: WAV validation, independent worklet chunks, final flush, sequential requests, backpressure and cancellation PASS");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
