/**
 * SiGML Translation Engine — connects the public/signs/ lexicon to the avatar.
 *
 * Pipeline:
 *   glossArray → lexicon lookup → fetch() raw SiGML XML → inject NMM block → concat
 *
 * Unknown words fall back to character-by-character fingerspelling using
 * the individual letter .sigml files that ship with the dataset.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NMMTag =
  | "wh-question"
  | "smile"
  | "negation"
  | "topic"
  | "neutral"
  | string; // extensible

// ---------------------------------------------------------------------------
// Module-level lexicon cache — fetched once, shared across all calls
// ---------------------------------------------------------------------------

let lexiconCache: Record<string, string> | null = null;
let lexiconFetchPromise: Promise<Record<string, string>> | null = null;

async function getLexicon(): Promise<Record<string, string>> {
  if (lexiconCache) return lexiconCache;
  if (lexiconFetchPromise) return lexiconFetchPromise;

  lexiconFetchPromise = fetch("/signs/lexicon.json")
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to fetch lexicon: ${r.status}`);
      return r.json();
    })
    .then((data) => {
      lexiconCache = data as Record<string, string>;
      return lexiconCache;
    });

  return lexiconFetchPromise;
}

// ---------------------------------------------------------------------------
// SiGML XML cache — avoid re-fetching the same file repeatedly
// ---------------------------------------------------------------------------

const sigmlXmlCache = new Map<string, string>();

async function fetchSigml(path: string): Promise<string | null> {
  if (sigmlXmlCache.has(path)) return sigmlXmlCache.get(path)!;

  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const text = await res.text();
    sigmlXmlCache.set(path, text);
    return text;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// NMM injection — inserts a <sign_nonmanual> block after the opening tag of
// the first <hamgestural_sign> or <hns_sign> element.
// ---------------------------------------------------------------------------

const NMM_BLOCKS: Record<string, string> = {
  "wh-question": `<sign_nonmanual><facialexpr_tier><facial_expr_eyebrows movement="RB"/></facialexpr_tier></sign_nonmanual>`,
  smile: `<sign_nonmanual><facialexpr_tier><facial_expr_mouth movement="SM"/></facialexpr_tier></sign_nonmanual>`,
  negation: `<sign_nonmanual><facialexpr_tier><facial_expr_eyebrows movement="SQ"/><head_tier><head_movement movement="SH"/></head_tier></facialexpr_tier></sign_nonmanual>`,
  topic: `<sign_nonmanual><facialexpr_tier><facial_expr_eyebrows movement="RB"/><head_tier><head_movement movement="TLT"/></head_tier></facialexpr_tier></sign_nonmanual>`,
  neutral: "",
};

function injectNMM(xml: string, nmmTag: NMMTag): string {
  const block = NMM_BLOCKS[nmmTag] ?? "";
  if (!block) return xml;

  // Match the opening tag of <hamgestural_sign ...> or <hns_sign ...>
  // and inject the NMM block immediately after it.
  return xml.replace(
    /(<(?:hamgestural_sign|hns_sign)[^>]*>)/,
    `$1${block}`,
  );
}

// ---------------------------------------------------------------------------
// Strip outer <sigml> wrapper — we extract the inner content so multiple
// signs can be concatenated under one shared root <sigml> element.
// ---------------------------------------------------------------------------

function extractInnerXml(sigmlText: string): string {
  // Remove XML declaration and outer <sigml>...</sigml> tags, keep the interior.
  return sigmlText
    .replace(/<\?xml[^?]*\?>/gi, "")
    .replace(/^\s*<sigml[^>]*>/i, "")
    .replace(/<\/sigml>\s*$/i, "")
    .trim();
}

// ---------------------------------------------------------------------------
// Core public API
// ---------------------------------------------------------------------------

/**
 * Generates a single, concatenated SiGML document from an array of English gloss words.
 *
 * @param glossArray  English words to sign (already uppercased or not — we normalise).
 * @param nmmTag      Facial expression / non-manual marker to inject into every sign.
 * @returns           A complete SiGML XML string ready to pass to CWASA.playSiGMLText().
 */
export async function generateFluidSiGML(
  glossArray: string[],
  nmmTag: NMMTag = "neutral",
): Promise<string> {
  const lexicon = await getLexicon();
  const innerBlocks: string[] = [];

  // Fetch all signs in parallel per word for maximum speed.
  const fetchWord = async (word: string): Promise<string[]> => {
    const key = word.toUpperCase().trim();
    if (!key) return [];

    const path = lexicon[key];
    if (path) {
      // Direct hit
      const xml = await fetchSigml(path);
      if (xml) return [injectNMM(extractInnerXml(xml), nmmTag)];
    }

    // ── Fingerspelling fallback ──────────────────────────────────────────
    // Split word into individual characters and look each one up.
    const letters = key.replace(/[^A-Z0-9]/g, "").split("");
    const letterBlocks: string[] = [];

    for (const ch of letters) {
      const letterPath = lexicon[ch] ?? lexicon[ch.toLowerCase()];
      if (letterPath) {
        const xml = await fetchSigml(letterPath);
        if (xml) {
          letterBlocks.push(extractInnerXml(xml));
          continue;
        }
      }
      // If even the individual character is missing, skip silently.
      console.warn(`[sigmlEngine] No sign found for character "${ch}" while spelling "${key}"`);
    }

    return letterBlocks;
  };

  // Process words concurrently but preserve order.
  const results = await Promise.all(glossArray.map(fetchWord));
  for (const blocks of results) {
    innerBlocks.push(...blocks);
  }

  if (!innerBlocks.length) {
    // Return minimal valid SiGML to avoid crashing the CWASA player.
    return `<?xml version="1.0" encoding="utf-8"?><sigml></sigml>`;
  }

  return `<?xml version="1.0" encoding="utf-8"?>\n<sigml>\n${innerBlocks.join("\n")}\n</sigml>`;
}

// ---------------------------------------------------------------------------
// Convenience: pre-warm the lexicon at app startup
// ---------------------------------------------------------------------------
export function prewarmLexicon(): void {
  getLexicon().catch(() => {
    // Non-fatal — the engine will try again on first use.
  });
}
