import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";

const directory = path.resolve("logs/demo-video");
const recording = JSON.parse(await readFile(path.join(directory, "recording.json"), "utf8"));
const output = path.resolve("logs/unmute-demo.mp4");
const time = seconds => {
  const ticks = Math.round(Math.max(0, seconds) * 100);
  return `${Math.floor(ticks / 360000)}:${String(Math.floor(ticks / 6000) % 60).padStart(2, "0")}:${String(Math.floor(ticks / 100) % 60).padStart(2, "0")}.${String(ticks % 100).padStart(2, "0")}`;
};
const style = `[Script Info]
ScriptType: v4.00+
PlayResX: 1440
PlayResY: 810
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Segoe UI,24,&H00FFFFFF,&H00FFFFFF,&HBF070709,&HBF070709,0,0,0,0,100,100,0,0,3,8,0,8,20,20,12,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
const captions = recording.cues.map((cue, index) => `Dialogue: 0,${time(cue.start)},${time(recording.cues[index + 1]?.start ?? recording.duration)},Default,,0,0,0,,${cue.text.replace(/[{}\\\r\n]/g, " ")}`).join("\n");
await writeFile(path.join(directory, "captions.ass"), style + captions + "\n");
execFileSync("ffmpeg", [
  "-hide_banner", "-loglevel", "warning", "-y", "-ss", String(recording.start), "-i", recording.rawPath,
  "-t", String(recording.duration), "-vf", "ass=captions.ass", "-c:v", "libx264", "-preset", "medium",
  "-crf", "20", "-pix_fmt", "yuv420p", "-r", "25", "-an", "-movflags", "+faststart", output,
], { cwd: directory, stdio: "inherit" });
console.log(output);
