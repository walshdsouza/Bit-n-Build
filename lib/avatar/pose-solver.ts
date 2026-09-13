/**
 * Pose solver: sign notation → skeletal targets.
 *
 * This is the motion-synthesis stage GenASL describes, but driven by Kozha's
 * HamNoSys primitives instead of retrieved motion-capture clips. Because every
 * sign is a *description* (handshape + direction + location + movement) rather
 * than a recording, we can synthesise a sign the moment someone adds a
 * dictionary entry — which is exactly what made adding ISL tractable.
 *
 * Pure functions only: no three.js imports here, so this stays testable and
 * the renderer can be swapped (procedural rig today, VRM/CWASA tomorrow).
 */

import {
  BodyLocation,
  ExtFingerDir,
  HandConfig,
  HandShape,
  SignPlanItem,
  SignMovement,
} from "../types";
import { blendRotation, frameRotation } from "./rotation";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface HandPose {
  /** World-ish position relative to avatar origin (metres, y-up). */
  pos: Vec3;
  /** Euler rotation in radians. */
  rot: Vec3;
  /** Per-finger curl 0 (straight) … 1 (fully closed): thumb→pinky. */
  curl: [number, number, number, number, number];
  /** Finger spread 0…1. */
  spread: number;
  visible: boolean;
}

export interface FacePose {
  /** -1 (furrowed/down) … 1 (raised). */
  brow: number;
  /** 0 (closed) … 1 (open). */
  mouth: number;
  /** Head rotation in radians. */
  headPitch: number;
  headYaw: number;
  headRoll: number;
}

export interface AvatarPose {
  right: HandPose;
  left: HandPose;
  face: FacePose;
}

const v = (x: number, y: number, z: number): Vec3 => ({ x, y, z });

/* ---------------------------------------------------------------- *
 * Articulatory tables
 * ---------------------------------------------------------------- */

/**
 * Body locations in avatar-local space.
 * Origin at hips, y-up, +z toward viewer (toward the camera).
 *
 * Calibration notes:
 *  - Shoulder joints sit at y≈1.36, x=±0.175 (see _shoulderR/_shoulderL in SignAvatar).
 *  - All face targets need z≥0.16 to be comfortably in front of the face mesh.
 *  - neutral_space is the large signing zone directly in front of the chest
 *    (roughly 15–45 cm forward, between waist and chin height).
 *  - x values follow the DOMINANT hand convention (right-hand = positive x);
 *    the solver mirrors for the non-dominant side.
 */
const LOCATION_POINTS: Record<BodyLocation, Vec3> = {
  // ── Face / head area ──────────────────────────────────────────────────────
  head:        v(0.00, 1.64, 0.16),
  forehead:    v(0.05, 1.70, 0.18),
  eyes:        v(0.05, 1.63, 0.18),
  nose:        v(0.02, 1.57, 0.20),
  mouth:       v(0.03, 1.52, 0.19),
  chin:        v(0.03, 1.47, 0.18),
  cheek:       v(0.13, 1.57, 0.16),
  neck:        v(0.00, 1.42, 0.14),
  // ── Torso ─────────────────────────────────────────────────────────────────
  shoulders:   v(0.18, 1.38, 0.14),  // near the collar-bone — a common anchor
  chest:       v(0.06, 1.26, 0.22),  // mid-sternum, clearly forward of body
  stomach:     v(0.05, 1.04, 0.20),
  // ── Signing space (the main articulation zone) ────────────────────────────
  neutral_space: v(0.22, 1.20, 0.32), // forearm's length in front, waist-chest height
  // ── Side anchors ──────────────────────────────────────────────────────────
  shoulder_l:  v(-0.22, 1.38, 0.14),
  shoulder_r:  v( 0.22, 1.38, 0.14),
  // Against the weak hand (two-handed ISL/BSL fingerspelling base).
  palm_weak:   v(-0.08, 1.16, 0.36),
};

/** Direction unit vectors. */
const DIR_VECTORS: Record<ExtFingerDir, Vec3> = {
  u: v(0, 1, 0),
  d: v(0, -1, 0),
  l: v(-1, 0, 0),
  r: v(1, 0, 0),
  o: v(0, 0, 1),
  i: v(0, 0, -1),
  ul: v(-0.71, 0.71, 0),
  ur: v(0.71, 0.71, 0),
  dl: v(-0.71, -0.71, 0),
  dr: v(0.71, -0.71, 0),
  ol: v(-0.71, 0, 0.71),
  or: v(0.71, 0, 0.71),
};

/** Handshape → finger curl profile (thumb, index, middle, ring, pinky). */
const SHAPE_CURLS: Record<HandShape, [number, number, number, number, number]> = {
  fist: [0.85, 1, 1, 1, 1],
  flat: [0.15, 0, 0, 0, 0],
  finger2: [0.9, 0, 1, 1, 1],
  finger23: [0.9, 0, 0, 1, 1],
  finger23spread: [0.9, 0, 0, 1, 1],
  finger2345: [0.2, 0, 0, 0, 0],
  pinch12: [0.55, 0.55, 1, 1, 1],
  pinchall: [0.6, 0.6, 0.6, 0.6, 0.6],
  cee12: [0.45, 0.45, 1, 1, 1],
  ceeall: [0.45, 0.45, 0.45, 0.45, 0.45],
};

const SHAPE_SPREAD: Partial<Record<HandShape, number>> = {
  finger23spread: 1,
  finger2345: 0.8,
  flat: 0.15,
};

const MOVEMENT_AMPLITUDE: Record<string, number> = {
  small: 0.05,
  medium: 0.10,
  large: 0.18,
};

/** Smooth acceleration and deceleration without overshooting a sign target. */
export function easeMotion(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  return t * t * t * (10 + t * (-15 + 6 * t));
}

/* ---------------------------------------------------------------- *
 * Solver
 * ---------------------------------------------------------------- */

function mirrorX(p: Vec3): Vec3 {
  return v(-p.x, p.y, p.z);
}

/** Converts extended-finger direction + palm orientation into wrist Euler angles. */
function wristRotation(h: HandConfig, mirror: boolean, twist = 0): Vec3 {
  const direction = DIR_VECTORS[h.extFingerDir] ?? DIR_VECTORS.u;
  const length = Math.hypot(direction.x, direction.y, direction.z);
  const y = v((mirror ? -direction.x : direction.x) / length, direction.y / length, direction.z / length);
  const palm = DIR_VECTORS[h.palmOr as ExtFingerDir] ?? DIR_VECTORS.o;
  let z = v(mirror ? -palm.x : palm.x, palm.y, palm.z);
  let dot = y.x * z.x + y.y * z.y + y.z * z.z;
  z = v(z.x - y.x * dot, z.y - y.y * dot, z.z - y.z * dot);
  if (Math.hypot(z.x, z.y, z.z) < 1e-6) {
    // Some coarse dictionary entries specify parallel palm/finger vectors.
    // Preserve finger direction and use a stable perpendicular palm normal.
    z = Math.abs(y.z) > 0.8 ? v(0, -1, 0) : v(0, 0, 1);
    dot = y.x * z.x + y.y * z.y + y.z * z.z;
    z = v(z.x - y.x * dot, z.y - y.y * dot, z.z - y.z * dot);
  }
  const normalLength = Math.hypot(z.x, z.y, z.z);
  z = v(z.x / normalLength, z.y / normalLength, z.z / normalLength);
  const x = v(y.y * z.z - y.z * z.y, y.z * z.x - y.x * z.z, y.x * z.y - y.y * z.x);
  const angle = mirror ? -twist : twist;
  const c = Math.cos(angle), s = Math.sin(angle);
  return frameRotation(
    v(x.x * c - z.x * s, x.y * c - z.y * s, x.z * c - z.z * s),
    y,
    v(z.x * c + x.x * s, z.y * c + x.y * s, z.z * c + x.z * s),
  );
}

/**
 * Movement offset at normalised progress `t` (0→1 through the sign).
 * Produces the characteristic trajectory for each HamNoSys movement type.
 */
function movementOffset(m: SignMovement, t: number): Vec3 {
  const amp = MOVEMENT_AMPLITUDE[m.size ?? "medium"] ?? 0.1;
  const reps = Math.max(m.repetitions ?? 1, 1);
  const phase = easeMotion(t) * reps;
  const dir = m.direction ? DIR_VECTORS[m.direction] : DIR_VECTORS.o;

  switch (m.type) {
    case "straight": {
      // Repeated strokes must return between contacts; a single stroke ends
      // at its target. Previously repetitions were silently clamped away.
      const k = (reps === 1 ? easeMotion(t) : (1 - Math.cos(phase * Math.PI * 2)) * 0.5) * amp;
      return v(dir.x * k, dir.y * k, dir.z * k);
    }
    case "curved": {
      const a = Math.min(phase, 1) * Math.PI;
      const k = Math.sin(a) * amp;
      return v(dir.x * k, dir.y * k + Math.sin(a) * amp * 0.5, dir.z * k);
    }
    case "circle": {
      const a = phase * Math.PI * 2;
      return v(Math.cos(a) * amp, Math.sin(a) * amp, 0);
    }
    case "wavy": {
      const k = Math.min(phase, 1) * amp;
      return v(dir.x * k, Math.sin(phase * Math.PI * 4) * amp * 0.4, dir.z * k);
    }
    case "zigzag": {
      const k = Math.min(phase, 1) * amp;
      const z = (Math.abs(((phase * 4) % 2) - 1) - 0.5) * amp * 0.8;
      return v(dir.x * k + z, dir.y * k, dir.z * k);
    }
    case "tap":
    case "contact": {
      // Zero velocity at contact and release avoids the cusp in abs(sin()).
      const pulse = Math.sin(phase * Math.PI) ** 2;
      return v(0, 0, -pulse * amp * 0.6);
    }
    case "twist": {
      return v(0, 0, 0); // expressed as roll below
    }
    case "nod": {
      return v(0, -(Math.sin(phase * Math.PI) ** 2) * amp * 0.6, 0);
    }
    default:
      return v(0, 0, 0);
  }
}

function twistRoll(m: SignMovement, t: number): number {
  if (m.type !== "twist") return 0;
  const reps = Math.max(m.repetitions ?? 1, 1);
  return Math.sin(easeMotion(t) * reps * Math.PI * 2) * 0.9;
}

/** Non-manual marker → face pose. */
export function solveFace(nmm: string | undefined, intensity = 0.7, t = 0): FacePose {
  const base: FacePose = { brow: 0, mouth: 0.1, headPitch: 0, headYaw: 0, headRoll: 0 };
  const k = intensity;

  switch (nmm) {
    case "wh-question_browDown":
      return { ...base, brow: -0.9 * k, headPitch: 0.12 * k, mouth: 0.25 };
    case "yes-no_browUp":
      return { ...base, brow: 0.9 * k, headPitch: 0.1 * k };
    case "raised_brow":
    case "topic_eyebrow":
      return { ...base, brow: 0.75 * k, headPitch: -0.08 * k };
    case "negative_headshake":
      return { ...base, brow: -0.2 * k, headYaw: Math.sin(t * Math.PI * 6) * 0.35 * k };
    case "positive_headnod":
      return { ...base, headPitch: Math.sin(t * Math.PI * 4) * 0.22 * k };
    // ISL: a side-to-side head tilt for assent, distinct from the ASL nod.
    case "head_tilt_affirm":
      return { ...base, headRoll: Math.sin(t * Math.PI * 3) * 0.3 * k, brow: 0.2 * k };
    case "mouth_open_question":
      return { ...base, brow: -0.7 * k, mouth: 0.7 * k };
    case "puffedCheeks":
      return { ...base, mouth: 0.55 * k };
    case "pursedLips":
      return { ...base, mouth: 0.05, brow: -0.3 * k };
    default:
      return base;
  }
}

/**
 * Neutral signing rest pose.
 * Hands hang slightly in front of the hips with fingers gently curled —
 * the natural position between signs for a standing interpreter.
 * z=0.26 keeps them comfortably visible without over-reaching.
 */
const REST_RIGHT: HandPose = {
  pos: v(0.20, 1.04, 0.26),
  rot: v(2.15, 0.10, 0.20),
  curl: [0.25, 0.22, 0.22, 0.22, 0.22],
  spread: 0.18,
  visible: true,
};

const REST_LEFT: HandPose = {
  ...REST_RIGHT,
  pos: v(-0.20, 1.04, 0.26),
  rot: v(2.15, -0.10, -0.20),
};

export function restPose(): AvatarPose {
  return {
    right: { ...REST_RIGHT, pos: { ...REST_RIGHT.pos }, rot: { ...REST_RIGHT.rot }, curl: [...REST_RIGHT.curl] },
    left: { ...REST_LEFT, pos: { ...REST_LEFT.pos }, rot: { ...REST_LEFT.rot }, curl: [...REST_LEFT.curl] },
    face: solveFace("neutral"),
  };
}

function solveHand(h: HandConfig, m: SignMovement, t: number, mirror: boolean): HandPose {
  const anchor = LOCATION_POINTS[h.location] ?? LOCATION_POINTS.neutral_space;
  const base = mirror ? mirrorX(anchor) : anchor;
  const off = movementOffset(m, t);
  const rot = wristRotation(h, mirror, twistRoll(m, t));

  return {
    pos: v(base.x + (mirror ? -off.x : off.x), base.y + off.y, base.z + off.z),
    rot,
    curl: [...(SHAPE_CURLS[h.shape] ?? SHAPE_CURLS.flat)],
    spread: SHAPE_SPREAD[h.shape] ?? 0.25,
    visible: true,
  };
}

/**
 * Solves the full avatar pose for a sign at normalised progress `t` (0…1).
 *
 * Handles the three articulation patterns:
 *   - one-handed: dominant only, weak hand rests
 *   - two-handed symmetric: weak hand mirrors the dominant
 *   - two-handed asymmetric: weak hand has its own configuration
 */
export function solvePose(item: SignPlanItem | null, t: number): AvatarPose {
  if (!item?.entry) return restPose();
  t = Number.isFinite(t) ? Math.max(0, Math.min(1, t)) : 0;

  const entry = item.entry;
  // Prosody emphasis slightly enlarges depth while preserving body landmarks.
  const emphasis = 0.90 + item.emphasis * 0.20;
  const right = solveHand(entry.dominant, entry.movement, t, false);

  // Scale z (depth) only — keeps the hand on the correct body plane
  // while still making emphatic signs feel bigger.
  right.pos.z *= emphasis;

  let left: HandPose;
  if (entry.twoHanded && entry.nonDominant) {
    left = solveHand(entry.nonDominant, entry.movement, t, true);
  } else if (entry.twoHanded) {
    left = solveHand(entry.dominant, entry.movement, t, true);
  } else {
    left = { ...REST_LEFT, pos: { ...REST_LEFT.pos }, rot: { ...REST_LEFT.rot }, curl: [...REST_LEFT.curl] };
  }
  if (entry.twoHanded) left.pos.z *= emphasis;

  const nmm = item.nmm[0];
  const face = solveFace(nmm?.emotion, nmm?.intensity ?? 0.7, t);

  return { right, left, face };
}

/** Blend targets and finger shapes, with shortest-arc quaternion wrist motion. */
export function lerpPose(a: AvatarPose, b: AvatarPose, k: number): AvatarPose {
  k = Math.max(0, Math.min(1, k));
  const lv = (x: Vec3, y: Vec3): Vec3 =>
    v(x.x + (y.x - x.x) * k, x.y + (y.y - x.y) * k, x.z + (y.z - x.z) * k);
  const ln = (x: number, y: number) => x + (y - x) * k;

  const lh = (x: HandPose, y: HandPose): HandPose => ({
    pos: lv(x.pos, y.pos),
    rot: blendRotation(x.rot, y.rot, k),
    curl: x.curl.map((c, i) => ln(c, y.curl[i])) as HandPose["curl"],
    spread: ln(x.spread, y.spread),
    visible: k < 0.5 ? x.visible : y.visible,
  });

  return {
    right: lh(a.right, b.right),
    left: lh(a.left, b.left),
    face: {
      brow: ln(a.face.brow, b.face.brow),
      mouth: ln(a.face.mouth, b.face.mouth),
      headPitch: ln(a.face.headPitch, b.face.headPitch),
      headYaw: ln(a.face.headYaw, b.face.headYaw),
      headRoll: ln(a.face.headRoll, b.face.headRoll),
    },
  };
}
