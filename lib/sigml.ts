/**
 * SiGML (Signing Gesture Markup Language) serialisation.
 *
 * This is the Kozha-style bridge that was previously stubbed out in
 * `app/api/sigml/route.ts`: HamNoSys primitives → SiGML XML → CWASA/JASigning
 * WebGL avatar. SiGML is the interchange format the CWASA player consumes, so
 * emitting valid SiGML means our output drops into any JASigning-compatible
 * renderer, not just our own avatar.
 */

import {
  BodyLocation,
  HandConfig,
  NMMTag,
  SignEntry,
  SignLanguageCode,
  SignMovement,
  SignPlanItem,
} from "./types";
import { encodeHamNoSys } from "./hamnosys";

/* ---------------------------------------------------------------- *
 * Vocabulary mapping: our primitives → SiGML attribute values
 * ---------------------------------------------------------------- */

const SIGML_HANDSHAPE: Record<string, string> = {
  fist: "fist",
  flat: "flat",
  finger2: "finger2",
  finger23: "finger23",
  finger2345: "finger2345",
  finger23spread: "finger23spread",
  pinch12: "pinch12",
  pinchall: "pinchall",
  cee12: "cee12",
  ceeall: "ceeall",
};

const SIGML_DIRECTION: Record<string, string> = {
  u: "u", d: "d", l: "l", r: "r", o: "o", i: "i",
  ul: "ul", ur: "ur", dl: "dl", dr: "dr", ol: "ol", or: "or",
};

const SIGML_LOCATION: Record<BodyLocation, string> = {
  head: "head",
  forehead: "forehead",
  eyes: "eyes",
  nose: "nose",
  mouth: "mouth",
  chin: "chin",
  cheek: "cheek",
  neck: "neck",
  shoulders: "shoulders",
  chest: "chest",
  stomach: "stomach",
  neutral_space: "neutral",
  shoulder_l: "shoulderleft",
  shoulder_r: "shoulderright",
  palm_weak: "handweak",
};

/** Our NMM labels → SiGML non-manual facial/head attributes. */
const NMM_TO_SIGML: Record<string, { facial?: string; head?: string; mouth?: string }> = {
  "wh-question_browDown": { facial: "browdown", head: "tilt_forward" },
  "yes-no_browUp": { facial: "browup", head: "tilt_forward" },
  negative_headshake: { facial: "browneutral", head: "shake" },
  topic_eyebrow: { facial: "browup", head: "tilt_back" },
  puffedCheeks: { facial: "puffedcheeks" },
  pursedLips: { mouth: "pursed" },
  neutral: { facial: "neutral" },
  raised_brow: { facial: "browup" },
  positive_headnod: { facial: "neutral", head: "nod" },
  // ISL-specific non-manuals
  head_tilt_affirm: { facial: "neutral", head: "tilt_side" },
  mouth_open_question: { facial: "browdown", mouth: "open" },
};

/* ---------------------------------------------------------------- *
 * XML helpers
 * ---------------------------------------------------------------- */

function esc(s: string): string {
  return s.replace(/[<>&"']/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c]!),
  );
}

function attrs(map: Record<string, string | number | undefined>): string {
  return Object.entries(map)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${k}="${esc(String(v))}"`)
    .join(" ");
}

function handConfigXml(h: HandConfig, tag: string, indent: string): string {
  return [
    `${indent}<${tag} ${attrs({
      handshape: SIGML_HANDSHAPE[h.shape] ?? "flat",
      extfidir: SIGML_DIRECTION[h.extFingerDir],
      palmor: SIGML_DIRECTION[h.palmOr],
    })}/>`,
    `${indent}<handlocation ${attrs({
      location: SIGML_LOCATION[h.location],
      contact: h.location === "palm_weak" ? "touch" : undefined,
    })}/>`,
  ].join("\n");
}

function movementXml(m: SignMovement, indent: string): string {
  if (m.type === "none") return "";
  return `${indent}<handmovement ${attrs({
    movement: m.type,
    direction: m.direction ? SIGML_DIRECTION[m.direction] : undefined,
    size: m.size,
    repetition: m.repetitions && m.repetitions > 1 ? m.repetitions : undefined,
    speed: m.fast ? "fast" : undefined,
  })}/>`;
}

function nonManualXml(nmm: NMMTag[], fallback: string | undefined, indent: string): string {
  const label = nmm[0]?.emotion ?? fallback;
  if (!label) return "";
  const map = NMM_TO_SIGML[label] ?? { facial: "neutral" };
  return `${indent}<sign_nonmanual ${attrs({
    facial: map.facial,
    head: map.head,
    mouthing: map.mouth,
    intensity: nmm[0]?.intensity !== undefined ? nmm[0].intensity.toFixed(2) : undefined,
  })}/>`;
}

/* ---------------------------------------------------------------- *
 * Public API
 * ---------------------------------------------------------------- */

export function signEntryToSigml(
  entry: SignEntry,
  opts: { nmm?: NMMTag[]; startTime?: number } = {},
): string {
  const i = "    ";
  const lines: string[] = [];
  const ham = encodeHamNoSys(entry);

  lines.push(
    `  <hamgestural_sign ${attrs({
      gloss: entry.gloss,
      hamnosys: ham,
      time: opts.startTime !== undefined ? opts.startTime.toFixed(2) : undefined,
    })}>`,
  );

  const nm = nonManualXml(opts.nmm ?? [], entry.nmm, i);
  if (nm) lines.push(nm);

  lines.push(`${i}<sign_manual ${attrs({
    both_hands: entry.twoHanded ? "true" : "false",
    symmetric: entry.twoHanded && entry.symmetric ? "true" : undefined,
  })}>`);

  lines.push(handConfigXml(entry.dominant, "handconfig", i + "  "));

  if (entry.twoHanded && entry.nonDominant) {
    lines.push(`${i}  <!-- non-dominant hand -->`);
    lines.push(handConfigXml(entry.nonDominant, "handconfig2", i + "  "));
  } else if (entry.twoHanded && entry.symmetric) {
    lines.push(`${i}  <!-- non-dominant hand mirrors dominant -->`);
    lines.push(`${i}  <handconfig2 mirror="true"/>`);
  }

  const mv = movementXml(entry.movement, i + "  ");
  if (mv) lines.push(mv);

  lines.push(`${i}</sign_manual>`);
  lines.push(`  </hamgestural_sign>`);
  return lines.join("\n");
}

/** Serialise a whole motion plan into one SiGML document. */
export function buildSigmlDocument(
  items: SignPlanItem[],
  lang: SignLanguageCode,
): string {
  const body = items
    .map((item) => {
      if (item.entry) {
        return signEntryToSigml(item.entry, { nmm: item.nmm, startTime: item.startTime });
      }
      return `  <!-- ${esc(item.gloss)}: no dictionary entry, fingerspelled -->`;
    })
    .filter(Boolean)
    .join("\n");

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<!-- GestureSync AI — SiGML generated for ${lang} -->`,
    `<!-- Pipeline: gloss → HamNoSys → SiGML → CWASA/JASigning WebGL -->`,
    `<sigml lang="${lang}">`,
    body,
    `</sigml>`,
  ].join("\n");
}
