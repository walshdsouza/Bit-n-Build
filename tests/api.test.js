const BASE = "http://localhost:3111";
let pass = 0, fail = 0; const fails = [];
const check = (n, c, d) => { if (c) pass++; else { fail++; fails.push(`${n}${d ? " :: " + d : ""}`); } };

async function req(path, opts = {}) {
  const res = await fetch(BASE + path, opts);
  let body = null;
  try { body = await res.json(); } catch { body = null; }
  return { status: res.status, body };
}
const post = (path, obj) => req(path, {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: typeof obj === "string" ? obj : JSON.stringify(obj),
});

const SEGS = [{ start: 0, end: 3, text: "I dont want pizza." }];

(async () => {
  console.log("=".repeat(70));
  console.log("A. HAPPY PATH — all endpoints");
  console.log("=".repeat(70));

  const sl = await req("/api/sign-languages");
  console.log(`  GET /api/sign-languages -> ${sl.status}, ${sl.body?.languages?.length} languages`);
  check("sign-languages 200", sl.status === 200);
  check("sign-languages lists ASL+ISL+BSL", sl.body?.languages?.length === 3);
  check("ISL marked ready", sl.body?.languages?.find(l => l.code === "ISL")?.ready === true);
  check("ISL two-handed alphabet", sl.body?.languages?.find(l => l.code === "ISL")?.fingerspellingHands === 2);
  check("BSL not ready", sl.body?.languages?.find(l => l.code === "BSL")?.ready === false);

  for (const lang of ["ASL", "ISL", "BSL"]) {
    const t = await post("/api/translate", { segments: SEGS, lang });
    const ok = t.status === 200 && t.body?.plan && t.body?.sigml;
    console.log(`  POST /api/translate ${lang} -> ${t.status} gloss="${t.body?.glossRows?.[0]?.gloss}" signs=${t.body?.stats?.signs}`);
    check(`translate ${lang} 200`, ok, `status ${t.status}`);
  }

  // The contraction fix, verified through the real HTTP path
  const contr = await post("/api/translate", { segments: SEGS, lang: "ISL" });
  check("contraction negation survives API", contr.body?.glossRows?.[0]?.gloss?.includes("NOT"),
    `got "${contr.body?.glossRows?.[0]?.gloss}"`);

  // lang omitted / null must fall back to the default (ASL), not error
  const defLang = await post("/api/translate", { segments: SEGS, lang: null });
  console.log(`  POST /api/translate lang=null -> ${defLang.status}, lang=${defLang.body?.lang}`);
  check("null lang falls back to ASL", defLang.status === 200 && defLang.body?.lang === "ASL");

  const gl = await post("/api/gloss", { segments: SEGS, lang: "ISL" });
  console.log(`  POST /api/gloss -> ${gl.status}, engine=${gl.body?.engine}, rows=${gl.body?.glossRows?.length}`);
  check("gloss 200", gl.status === 200);
  check("gloss returns prosody", Array.isArray(gl.body?.prosody));

  const sg = await post("/api/sigml", { glossRows: gl.body.glossRows, lang: "ISL" });
  console.log(`  POST /api/sigml -> ${sg.status}, ${sg.body?.sigml?.length}B, signs=${sg.body?.stats?.signs}`);
  check("sigml 200", sg.status === 200);
  check("sigml is XML", sg.body?.sigml?.startsWith("<?xml"));
  check("sigml declares lang", sg.body?.sigml?.includes('lang="ISL"'));

  console.log("\n" + "=".repeat(70));
  console.log("B. ERROR PATHS — should fail gracefully, never 500");
  console.log("=".repeat(70));
  const errCases = [
    ["missing segments", "/api/translate", {}],
    ["empty segments", "/api/translate", { segments: [] }],
    ["segments not array", "/api/translate", { segments: "nope" }],
    ["unsupported lang", "/api/translate", { segments: SEGS, lang: "KLINGON" }],
    ["malformed JSON", "/api/translate", "{not json"],
    ["missing glossRows", "/api/sigml", {}],
    ["empty glossRows", "/api/sigml", { glossRows: [] }],
    ["gloss missing segments", "/api/gloss", {}],
    ["gloss bad lang", "/api/gloss", { segments: SEGS, lang: "XX" }],
  ];
  for (const [label, path, body] of errCases) {
    const r = await post(path, body);
    const graceful = r.status >= 400 && r.status < 500 && r.body?.error;
    console.log(`  ${label.padEnd(24)} -> ${r.status} ${r.body?.error ? `"${String(r.body.error).slice(0,50)}"` : "(no error field)"}`);
    check(`graceful 4xx: ${label}`, graceful, `status ${r.status}`);
  }

  console.log("\n" + "=".repeat(70));
  console.log("C. HOSTILE / WEIRD INPUT — must not 500");
  console.log("=".repeat(70));
  const weird = [
    ["xml injection", [{ start: 0, end: 3, text: '</sigml><evil a="' }]],
    ["null text", [{ start: 0, end: 3, text: null }]],
    ["missing text", [{ start: 0, end: 3 }]],
    ["negative times", [{ start: -5, end: -1, text: "I go home." }]],
    ["end before start", [{ start: 10, end: 2, text: "I go home." }]],
    ["NaN times", [{ start: "abc", end: "def", text: "I go home." }]],
    ["huge text", [{ start: 0, end: 3, text: "pizza ".repeat(3000) }]],
    ["emoji only", [{ start: 0, end: 3, text: "🎉🎉🎉" }]],
    ["hindi text", [{ start: 0, end: 3, text: "मैं पानी पीता हूँ" }]],
    ["100 segments", Array.from({ length: 100 }, (_, i) => ({ start: i, end: i + 1, text: "I drink water." }))],
  ];
  for (const [label, segments] of weird) {
    let r;
    try { r = await post("/api/translate", { segments, lang: "ISL" }); }
    catch (e) { r = { status: 0, body: { error: e.message } }; }
    const no500 = r.status !== 500 && r.status !== 0;
    const items = r.body?.plan?.items?.length;
    // any timing corruption?
    let badTiming = false;
    if (r.body?.plan?.items) {
      badTiming = r.body.plan.items.some(i =>
        !Number.isFinite(i.startTime) || !Number.isFinite(i.endTime) || i.endTime < i.startTime);
    }
    console.log(`  ${label.padEnd(18)} -> ${r.status}${items !== undefined ? ` items=${items}` : ""}${badTiming ? "  BAD-TIMING" : ""}${r.body?.error ? ` err="${String(r.body.error).slice(0,40)}"` : ""}`);
    check(`no 500: ${label}`, no500, `status ${r.status}`);
    check(`timing sane: ${label}`, !badTiming);
  }

  console.log("\n" + "=".repeat(70));
  console.log("D. CROSS-LANGUAGE CONSISTENCY");
  console.log("=".repeat(70));
  const sentence = [{ start: 0, end: 4, text: "Yesterday I went to school." }];
  const out = {};
  for (const lang of ["ASL", "ISL"]) {
    const r = await post("/api/translate", { segments: sentence, lang });
    out[lang] = r.body;
    console.log(`  ${lang}: "${r.body.glossRows[0].gloss}"  signs=${r.body.stats.signs} fs=${r.body.stats.fingerspelled}`);
  }
  check("ASL and ISL differ in word order",
    out.ASL.glossRows[0].gloss !== out.ISL.glossRows[0].gloss,
    `both "${out.ASL.glossRows[0].gloss}"`);
  check("ISL is verb-final", out.ISL.glossRows[0].gloss.trim().endsWith("GO"), out.ISL.glossRows[0].gloss);
  check("both front the time marker",
    out.ASL.glossRows[0].gloss.startsWith("YESTERDAY") && out.ISL.glossRows[0].gloss.startsWith("YESTERDAY"));
  // Two-handedness difference in fingerspelling via an OOV name
  const oov = [{ start: 0, end: 4, text: "Sanaro is my friend." }];
  for (const lang of ["ASL", "ISL"]) {
    const r = await post("/api/translate", { segments: oov, lang });
    const fs = r.body.plan.items.filter(i => i.fingerspell);
    const twoH = fs.length ? fs.every(i => i.entry.twoHanded) : null;
    const loc = fs[0]?.entry?.dominant?.location;
    console.log(`  ${lang} fingerspelled ${fs.length} letters, twoHanded=${twoH}, loc=${loc}`);
    check(`${lang} fingerspelling handedness`, lang === "ISL" ? twoH === true : twoH === false, `twoH=${twoH}`);
  }

  console.log("\n" + "=".repeat(70));
  console.log("E. DETERMINISM & PERF");
  console.log("=".repeat(70));
  const a = await post("/api/translate", { segments: sentence, lang: "ISL" });
  const b = await post("/api/translate", { segments: sentence, lang: "ISL" });
  check("deterministic sigml", a.body.sigml === b.body.sigml);
  check("deterministic plan", JSON.stringify(a.body.plan.items) === JSON.stringify(b.body.plan.items));
  const big = Array.from({ length: 200 }, (_, i) => ({ start: i * 3, end: i * 3 + 3, text: "She calls her friend for advice." }));
  const t0 = Date.now();
  const perf = await post("/api/translate", { segments: big, lang: "ISL" });
  const ms = Date.now() - t0;
  console.log(`  200 segments (10 min of speech): ${ms}ms, ${perf.body?.plan?.items?.length} signs, ${(perf.body?.sigml?.length/1024).toFixed(0)}KB SiGML`);
  check("200-segment translate under 5s", ms < 5000, `${ms}ms`);
  check("200-segment produces plan", perf.body?.plan?.items?.length > 0);

  console.log("\n" + "=".repeat(70));
  console.log(`API RESULT: ${pass} passed, ${fail} failed`);
  if (fails.length) { console.log("\nFAILURES:"); fails.forEach(f => console.log("  ✗ " + f)); }
  console.log("=".repeat(70));
  if (fail) process.exitCode = 1;
})();
