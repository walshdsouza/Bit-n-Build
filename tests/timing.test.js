const B = __dirname + "/.build/lib";
const { generateGloss } = require(B + "/gloss-engine.js");
const { buildSignPlan, signAt } = require(B + "/sign-plan.js");
const assert = require("node:assert/strict");

const row = (start, end, gloss, nmm = []) => ({
  startTime: start, endTime: end, sourceText: gloss, gloss, nmm, status: "queued",
});
// Mixed lexical signs and short fingerspelled letters can fit this window;
// independently clamping scaled letters used to make it overrun anyway.
const fitted = buildSignPlan([row(0, 1.2, "HELLO ABCD")], { lang: "ASL" });
assert.ok(fitted.items.every(item => item.endTime - item.startTime >= 0.129));
assert.equal(fitted.duration, 1.2);

const catchup = buildSignPlan([
  row(0, 0.2, "ABCDEFGHIJKLMNOPQRST"),
  row(0.2, 5, "HELLO", [{ time: 0.2, emotion: "negation", intensity: 0.8 }]),
  row(5, 7, "THANK-YOU"),
], { lang: "ASL", duration: 7 });
assert.equal(catchup.items.filter(item => item.sourceIndex === 0).length, 20, "preserve every letter");
assert.equal(catchup.items.find(item => item.sourceIndex === 1).startTime, 2.6);
assert.equal(catchup.items.find(item => item.sourceIndex === 2).startTime, 5, "catch up using later headroom");
assert.equal(catchup.duration, 7, "do not carry avoidable lag into all later rows");
assert.ok(!catchup.items.filter(item => item.sourceIndex === 0).some(item => item.nmm.some(tag => tag.emotion === "negation")), "delayed expression must not attach to previous row");
assert.ok(catchup.items.find(item => item.sourceIndex === 1).nmm.some(tag => tag.emotion === "negation" && tag.time === 2.6));
assert.equal(signAt(catchup, 3).sourceIndex, 1, "seeking resolves actual signed caption");

const overlap = buildSignPlan([row(0, 2, "HELLO"), row(1, 3, "THANK-YOU"), row(3, 4, "HOME")], { lang: "ASL" });
assert.equal(overlap.duration, 4, "overlapping source captions must not multiply total time");
assert.ok(overlap.items.every((item, i) => !i || item.startTime >= overlap.items[i - 1].endTime));
assert.equal(signAt(overlap, -1), null);
assert.equal(signAt(overlap, 4), null);
assert.equal(signAt(overlap, NaN), null);
const gap = buildSignPlan([row(0, 1, "HELLO"), row(3, 4, "HOME")], { lang: "ASL" });
assert.equal(signAt(gap, 2), null, "source silence remains a gap");
console.log("PASS duration redistribution, catch-up, source alignment, expressions, overlap and seeking");
(async () => {
  // Dense speech: far more words than can be signed in the window
  const segs = [
    { start: 0, end: 3, text: "I want water and food and pizza and books and money today." },
    { start: 3, end: 6, text: "She calls her friend." },
    { start: 6, end: 9, text: "I go home." },
  ];
  const { rows } = await generateGloss(segs, { lang: "ISL", rulesOnly: true });
  const plan = buildSignPlan(rows, { lang: "ISL", duration: 9 });
  const durs = plan.items.map(i => i.endTime - i.startTime);
  const min = Math.min(...durs);
  let overlaps = 0;
  for (let i = 1; i < plan.items.length; i++)
    if (plan.items[i].startTime < plan.items[i-1].endTime - 1e-6) overlaps++;
  console.log(`items=${plan.items.length} minDur=${min.toFixed(3)}s maxDur=${Math.max(...durs).toFixed(3)}s`);
  console.log(`overlaps=${overlaps}  planDuration=${plan.duration}  lastEnd=${plan.items.at(-1).endTime}`);
  console.log(`row1 gloss: ${rows[0].gloss}`);
  console.log(`lag at end: ${(plan.items.at(-1).endTime - 9).toFixed(2)}s past the audio`);
  console.log(min >= 0.129 ? "PASS min duration floor" : "FAIL min duration floor");
  console.log(overlaps === 0 ? "PASS no overlaps" : "FAIL overlaps=" + overlaps);
  console.log(plan.duration >= plan.items.at(-1).endTime ? "PASS duration covers all signs" : "FAIL duration truncates");
  // whole timeline reachable
  let unc = 0; for (let t=0;t<plan.duration-0.01;t+=0.05) if(!signAt(plan,t)) unc++;
  console.log(unc === 0 ? "PASS timeline fully covered" : `note: ${unc} idle samples (expected if audio > signing)`);

  const failed = min < 0.129 || overlaps !== 0 || plan.duration < plan.items.at(-1).endTime;
  if (failed) process.exitCode = 1;
})();
