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

/** Body locations in avatar-local space. Origin at hips, y-up, +z toward viewer. */
const LOCATION_POINTS: Record<BodyLocation, Vec3> = {
  head: v(0.0, 1.62, 0.06),
  forehead: v(0.06, 1.66, 0.12),
  eyes: v(0.06, 1.60, 0.14),
  nose: v(0.03, 1.56, 0.16),
  mouth: v(0.04, 1.51, 0.15),
  chin: v(0.05, 1.46, 0.14),
  cheek: v(0.11, 1.54, 0.10),
  neck: v(0.0, 1.40, 0.10),
  shoulders: v(0.16, 1.34, 0.06),
  chest: v(0.05, 1.22, 0.14),
  stomach: v(0.04, 1.02, 0.14),
  neutral_space: v(0.20, 1.12, 0.28),
  shoulder_l: v(-0.20, 1.34, 0.06),
  shoulder_r: v(0.20, 1.34, 0.06),
  // Against the weak hand — the anchor for two-handed ISL/BSL fingerspelling.
  palm_weak: v(-0.06, 1.14, 0.30),
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

/* ---------------------------------------------------------------- *
 * Solver
 * ---------------------------------------------------------------- */

function mirrorX(p: Vec3): Vec3 {
  return v(-p.x, p.y, p.z);
}

/** Converts extended-finger direction + palm orientation into wrist Euler angles. */
function wristRotation(h: HandConfig, mirror: boolean): Vec3 {
  const d = DIR_VECTORS[h.extFingerDir];
  const p = DIR_VECTORS[h.palmOr as ExtFingerDir] ?? DIR_VECTORS.o;

  // Point the hand along `d`, then roll so the palm faces `p`.
  const pitch = Math.asin(Math.max(-1, Math.min(1, d.y))) - Math.PI / 2;
  const yaw = Math.atan2(d.x, d.z);
  const roll = Math.atan2(p.x, p.y);

  return v(pitch, mirror ? -yaw : yaw, mirror ? -roll : roll);
}

/**
 * Movement offset at normalised progress `t` (0→1 through the sign).
 * Produces the characteristic trajectory for each HamNoSys movement type.
 */
function movementOffset(m: SignMovement, t: number): Vec3 {
  const amp = MOVEMENT_AMPLITUDE[m.size ?? "medium"] ?? 0.1;
  const reps = Math.max(m.repetitions ?? 1, 1);
  const phase = t * reps;
  const dir = m.direction ? DIR_VECTORS[m.direction] : DIR_VECTORS.o;

  switch (m.type) {
    case "straight": {
      // Ease out along the movement direction.
      const k = Math.sin(Math.min(phase, 1) * Math.PI * 0.5) * amp;
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
      // Quick in-and-out contact pulses.
      const pulse = Math.abs(Math.sin(phase * Math.PI));
      return v(0, 0, -pulse * amp * 0.6);
    }
    case "twist": {
      return v(0, 0, 0); // expressed as roll below
    }
    case "nod": {
      return v(0, -Math.abs(Math.sin(phase * Math.PI)) * amp * 0.6, 0);
    }
    default:
      return v(0, 0, 0);
  }
}

function twistRoll(m: SignMovement, t: number): number {
  if (m.type !== "twist") return 0;
  const reps = Math.max(m.repetitions ?? 1, 1);
  return Math.sin(t * reps * Math.PI * 2) * 0.9;
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

/** Hands rest close to the body at waist height, ready to move into signing space. */
const REST_RIGHT: HandPose = {
  pos: v(0.19, 0.97, 0.14),
  rot: v(-0.45, 0, 0.1),
  curl: [0.3, 0.28, 0.28, 0.28, 0.28],
  spread: 0.2,
  visible: true,
};

const REST_LEFT: HandPose = {
  ...REST_RIGHT,
  pos: v(-0.19, 0.97, 0.14),
  rot: v(-0.45, 0, -0.1),
};

export function restPose(): AvatarPose {
  return {
    right: { ...REST_RIGHT, pos: { ...REST_RIGHT.pos }, rot: { ...REST_RIGHT.rot } },
    left: { ...REST_LEFT, pos: { ...REST_LEFT.pos }, rot: { ...REST_LEFT.rot } },
    face: solveFace("neutral"),
  };
}

function solveHand(h: HandConfig, m: SignMovement, t: number, mirror: boolean): HandPose {
  const anchor = LOCATION_POINTS[h.location] ?? LOCATION_POINTS.neutral_space;
  const base = mirror ? mirrorX(anchor) : anchor;
  const off = movementOffset(m, t);
  const rot = wristRotation(h, mirror);
  rot.z += twistRoll(m, t);

  return {
    pos: v(base.x + (mirror ? -off.x : off.x), base.y + off.y, base.z + off.z),
    rot,
    curl: SHAPE_CURLS[h.shape] ?? SHAPE_CURLS.flat,
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

  const entry = item.entry;
  const emphasis = 0.85 + item.emphasis * 0.3; // prosody scales sign size
  const right = solveHand(entry.dominant, entry.movement, t, false);

  // Emphasis pushes the sign further from the body.
  right.pos.x *= emphasis;
  right.pos.z *= emphasis;

  let left: HandPose;
  if (entry.twoHanded && entry.nonDominant) {
    left = solveHand(entry.nonDominant, entry.movement, t, true);
  } else if (entry.twoHanded) {
    left = solveHand(entry.dominant, entry.movement, t, true);
  } else {
    left = { ...REST_LEFT, pos: { ...REST_LEFT.pos }, rot: { ...REST_LEFT.rot } };
  }

  const nmm = item.nmm[0];
  const face = solveFace(nmm?.emotion, nmm?.intensity ?? 0.7, t);

  return { right, left, face };
}

/** Linear interpolation between poses — used to blend sign transitions. */
export function lerpPose(a: AvatarPose, b: AvatarPose, k: number): AvatarPose {
  const lv = (x: Vec3, y: Vec3): Vec3 =>
    v(x.x + (y.x - x.x) * k, x.y + (y.y - x.y) * k, x.z + (y.z - x.z) * k);
  const ln = (x: number, y: number) => x + (y - x) * k;

  const lh = (x: HandPose, y: HandPose): HandPose => ({
    pos: lv(x.pos, y.pos),
    rot: lv(x.rot, y.rot),
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
