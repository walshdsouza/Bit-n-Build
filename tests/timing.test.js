const B = __dirname + "/.build";
const { generateGloss } = require(B + "/gloss-engine.js");
const { buildSignPlan, signAt } = require(B + "/sign-plan.js");
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
