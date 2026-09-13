const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const B = __dirname + "/.build/lib";
const ffmpeg = require(B + "/ffmpeg.js");
const originalExec = childProcess.execFile;
const originalExists = fs.existsSync;
const originalExtract = ffmpeg.extractAudioTrack;
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "gesture-youtube-test-"));
const sentinel = path.join(temp, "unrelated.txt");
fs.writeFileSync(sentinel, "keep");
let mode = "success";
let calls = [];
let count = 0;
const check = (condition, message) => { assert.ok(condition, message); count++; };

// Controlled subprocess responses exercise our contract and cleanup without
// a network connection or a platform binary; media.test checks real FFmpeg.
fs.existsSync = (name) => String(name).includes(path.join("vendor", "youtube")) || originalExists(name);
ffmpeg.extractAudioTrack = async (_input, output) => { fs.writeFileSync(output, "prepared audio"); };
childProcess.execFile = (executable, args, options, callback) => {
  calls.push({ executable, args, options });
  queueMicrotask(() => {
    if (mode === "timeout") return callback(Object.assign(new Error("private command line"), { killed: true }), "", "");
    if (mode === "blocked") return callback(new Error("403"), "", "HTTP403 https://signed.example.test/?secret=private");
    if (args.includes("--skip-download")) {
      return callback(null, JSON.stringify({ title: "An actual title", duration: mode === "long" ? 3000 : 20, is_live: mode === "live" }), "");
    }
    const output = args[args.indexOf("-o") + 1];
    fs.writeFileSync(output, "source audio");
    if (mode === "partial") {
      fs.writeFileSync(output + ".frag1", "partial fragment");
      return callback(new Error("download error"), "", "arbitrary subprocess diagnostics");
    }
    if (mode === "large") fs.truncateSync(output, 25 * 1024 * 1024 + 1);
    callback(null, "", "");
  });
  return { kill() {} };
};

(async () => {
  const { downloadYouTubeAudio } = require(B + "/youtube-audio.js");
  const result = await downloadYouTubeAudio("jNQXAC9IVRw", temp);
  check(result.duration === 20 && result.title === "An actual title", "actual metadata preserved");
  check(result.tempFiles.length === 2 && result.tempFiles.includes(result.audioPath), "all output files returned");
  check(calls.length === 2, "one metadata call and one download");
  for (const call of calls) {
    check(!call.options.shell && call.options.windowsHide, "no shell or visible process");
    check(call.args.includes(`node:${process.execPath}`), "explicit running Node executable");
    check(call.args.includes("--no-remote-components") && call.args.includes("--ignore-config") && call.args.includes("--no-plugin-dirs"), "controlled executable configuration");
  }
  result.tempFiles.forEach((name) => fs.unlinkSync(name));
  const reject = async (value, expectedStatus) => {
    await assert.rejects(value, (error) => error.status === expectedStatus && !error.message.includes("signed.example") && !error.message.includes("private command"));
    count++;
    check(fs.readdirSync(temp).join() === "unrelated.txt", "failure removes only this request's files");
  };
  calls = [];
  await reject(downloadYouTubeAudio("invalid; command", temp), 400);
  check(calls.length === 0, "invalid IDs never start subprocesses");
  await reject(downloadYouTubeAudio("jNQXAC9IVRw", temp, { maxDurationSec: -1 }), 400);
  for (const scenario of ["long", "live", "large", "partial", "blocked", "timeout"]) {
    mode = scenario;
    calls = [];
    await reject(downloadYouTubeAudio("jNQXAC9IVRw", temp), { long: 422, live: 422, large: 413, partial: 502, blocked: 502, timeout: 504 }[scenario]);
    if (scenario === "long" || scenario === "live") check(calls.length === 1, "unsupported duration refused before download");
  }
  console.log(`Portable YouTube downloader contracts: ${count} passed`);
})().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => {
  childProcess.execFile = originalExec;
  fs.existsSync = originalExists;
  ffmpeg.extractAudioTrack = originalExtract;
  // Only remove the exact isolated directory created by this test.
  assert.ok(path.resolve(temp).startsWith(path.resolve(os.tmpdir()) + path.sep));
  fs.rmSync(temp, { recursive: true, force: true });
});
