/**
 * Retargeting layer: our pose solver → the NEXA skeleton.
 *
 * `lib/avatar/pose-solver` works in an anatomical space of its own — hand
 * targets in metres against a ~1.72 m body with shoulders at y=1.328 and a
 * 0.56 m arm reach. NEXA is a different build (shoulders at y=1.250, reach
 * 0.43 m), so targets are mapped onto its body landmarks before being solved.
 *
 * NEXA's bind pose makes the maths simple: a T-pose where every local rest
 * rotation is identity, so each bone's world rotation in bind is identity too
 * and bones point straight down ±X toward their child. Aiming a bone is then
 * just "rotate ±X onto the direction I want", converted into the parent's
 * frame.
 */

import * as THREE from "three";
import { AvatarPose } from "../../../lib/avatar/pose-solver";
import { solveArmIK } from "../../../lib/avatar/arm-ik";

/* ---------------------------------------------------------------- *
 * Skeleton
 * ---------------------------------------------------------------- */

/** Solver order is [thumb, index, middle, ring, pinky]. */
const CURL_ORDER = [
  "Thumb", "Index", "Middle", "Ring", "Little",
] as const;

export interface NexaArm {
  shoulder: THREE.Bone;
  upper: THREE.Bone;
  lower: THREE.Bone;
  hand: THREE.Bone;
  /** [finger][joint] — 3 joints per finger, tips excluded. */
  fingers: THREE.Bone[][];
  /** Rest world position of the upper-arm joint. */
  shoulderRest: THREE.Vector3;
  upperLength: number;
  lowerLength: number;
}

export interface NexaSkeleton {
  root: THREE.Object3D;
  head: THREE.Bone | null;
  chest: THREE.Bone | null;
  /** Anatomical sides: `right` is the avatar's right hand (NEXA's -X). */
  right: NexaArm;
  left: NexaArm;
  face: Record<string, THREE.Bone>;
  reach: number;
}

function need(bones: Map<string, THREE.Bone>, name: string): THREE.Bone {
  const b = bones.get(name);
  if (!b) throw new Error(`NEXA rig is missing the bone "${name}"`);
  return b;
}

function buildArm(bones: Map<string, THREE.Bone>, side: "Left" | "Right"): NexaArm {
  const shoulder = need(bones, `${side}Shoulder`);
  const upper = need(bones, `${side}UpperArm`);
  const lower = need(bones, `${side}LowerArm`);
  const hand = need(bones, `${side}Hand`);

  const wUpper = new THREE.Vector3();
  const wLower = new THREE.Vector3();
  const wHand = new THREE.Vector3();
  upper.getWorldPosition(wUpper);
  lower.getWorldPosition(wLower);
  hand.getWorldPosition(wHand);

  const fingers = CURL_ORDER.map((f) =>
    [1, 2, 3].map((j) => need(bones, `${side}${f}${j}`)),
  );

  return {
    shoulder, upper, lower, hand, fingers,
    shoulderRest: wUpper.clone(),
    upperLength: wUpper.distanceTo(wLower),
    lowerLength: wLower.distanceTo(wHand),
  };
}

/** Collects the bones we drive, from an already-added-to-scene GLB. */
export function readNexaSkeleton(root: THREE.Object3D): NexaSkeleton {
  root.updateMatrixWorld(true);

  const bones = new Map<string, THREE.Bone>();
  root.traverse((o) => {
    if ((o as THREE.Bone).isBone) bones.set(o.name, o as THREE.Bone);
  });

  // NEXA's "Left" bones sit at +X. A viewer facing the avatar sees them on the
  // right, but anatomically they are its left, which is what the solver means.
  const left = buildArm(bones, "Left");
  const right = buildArm(bones, "Right");

  const face: Record<string, THREE.Bone> = {};
  for (const n of [
    "FaceEyeLeft", "FaceEyeRight", "FaceArcLeft", "FaceArcRight",
    "FaceBrowLeft", "FaceBrowRight", "FaceSmile", "FaceMouthOpen",
  ]) {
    const b = bones.get(n);
    if (b) face[n] = b;
  }

  return {
    root,
    head: bones.get("Head") ?? null,
    chest: bones.get("Chest") ?? null,
    right,
    left,
    face,
    reach: right.upperLength + right.lowerLength,
  };
}

/* ---------------------------------------------------------------- *
 * Aiming
 * ---------------------------------------------------------------- */

const _q = new THREE.Quaternion();
const _parentQ = new THREE.Quaternion();
const _restDir = new THREE.Vector3();

/**
 * Points a bone along `dir` (world space).
 *
 * Rest local rotations are identity throughout the rig, so a bone's bind world
 * rotation is identity and its bind direction is ±X. The local rotation needed
 * is therefore the world rotation that maps that axis onto `dir`, expressed in
 * the parent's frame.
 */
function aimBone(bone: THREE.Bone, dir: THREE.Vector3, sideSign: number) {
  _restDir.set(sideSign, 0, 0);
  _q.setFromUnitVectors(_restDir, dir);

  if (bone.parent) {
    bone.parent.getWorldQuaternion(_parentQ);
    _parentQ.invert();
    bone.quaternion.copy(_parentQ).multiply(_q);
  } else {
    bone.quaternion.copy(_q);
  }
  bone.updateMatrixWorld(true);
}

/* ---------------------------------------------------------------- *
 * Pose application
 * ---------------------------------------------------------------- */

/**
 * Solver space → NEXA space.
 *
 * Scaling the offset from the shoulder by a reach ratio sounds reasonable but
 * wrecks the anatomy: NEXA's arms are proportionally shorter than the solver's,
 * so a target at the forehead ended up out beside the head. The torsos are
 * nearly the same size, so a direct landmark map is far better — the solver's
 * shoulder (y=1.328) and head centre (~1.555) land within ~2cm of NEXA's
 * (1.250 and 1.455) under a plain shift, and every location stays in reach.
 *
 * X is negated because the solver calls its dominant hand "+X", while NEXA
 * (facing the camera, anatomicalLeft = +X) puts the dominant right hand at -X.
 */
const X_SCALE = 1.05;
const Y_OFFSET = -0.10;

const _target = new THREE.Vector3();
const _elbow = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _shoulder = new THREE.Vector3();
const _rootQ = new THREE.Quaternion();
const _wristQ = new THREE.Quaternion();
const _bindQ = new THREE.Quaternion();
const _wristEuler = new THREE.Euler();
const Z_AXIS = new THREE.Vector3(0, 0, 1);

/** Maps a solver-space hand target into NEXA space. */
function retarget(posX: number, posY: number, posZ: number, out: THREE.Vector3) {
  out.set(-posX * X_SCALE, posY + Y_OFFSET, posZ);
}

function applyArm(
  root: THREE.Object3D,
  arm: NexaArm,
  hand: AvatarPose["right"],
  /** +1 for NEXA's Left bones (+X), -1 for Right. */
  boneSign: number,
) {
  retarget(hand.pos.x, hand.pos.y, hand.pos.z, _target);

  // Solve in model space, then aim in world space. Orbiting the model or
  // breathing through the chest must carry the whole arm with the body.
  arm.upper.getWorldPosition(_shoulder);
  root.worldToLocal(_shoulder);
  const solved = solveArmIK(_shoulder, _target, arm.upperLength, arm.lowerLength, boneSign);
  _target.set(solved.target.x, solved.target.y, solved.target.z);
  _elbow.set(solved.elbow.x, solved.elbow.y, solved.elbow.z);
  root.localToWorld(_target);
  root.localToWorld(_elbow);
  root.localToWorld(_shoulder);

  _dir.subVectors(_elbow, _shoulder).normalize();
  aimBone(arm.upper, _dir, boneSign);
  _dir.subVectors(_target, _elbow).normalize();
  aimBone(arm.lower, _dir, boneSign);

  // The notation defines the hand in model space, independently of elbow
  // bend. Mirror the solver's X axis, then rotate NEXA's bind ±X fingers to
  // the canonical +Y finger axis. Compensate the forearm parent rotation.
  root.getWorldQuaternion(_rootQ);
  _wristEuler.set(hand.rot.x, -hand.rot.y, -hand.rot.z);
  _wristQ.setFromEuler(_wristEuler);
  _bindQ.setFromAxisAngle(Z_AXIS, boneSign * Math.PI / 2);
  _wristQ.premultiply(_rootQ).multiply(_bindQ);
  arm.lower.getWorldQuaternion(_parentQ);
  arm.hand.quaternion.copy(_parentQ.invert()).multiply(_wristQ);

  applyFingers(arm, hand.curl, hand.spread, boneSign);
}

/**
 * Finger curl, following the rig kit's own convention.
 *
 * In bind, fingers extend along ±X with palms facing +Z, so a curl is a
 * rotation about Y, signed by which side the hand is on. The per-joint angles
 * and the spread are taken from the kit's reference pose code: the knuckle
 * bends furthest, the thumb travels less, and open fingers fan apart while a
 * closing hand brings them together — without that, a closed handshape reads
 * as a splayed paddle.
 */
const JOINT_ANGLE = [1.18, 1.32, 0.9];
const THUMB_SCALE = 0.68;
/** Index, middle, ring, little — applied to the knuckle only. */
const SPREAD = [0.11, 0.025, -0.035, -0.13];

function applyFingers(arm: NexaArm, curl: readonly number[], spread: number, boneSign: number) {
  const s = boneSign; // +1 for the Left (+X) hand
  arm.fingers.forEach((joints, i) => {
    const isThumb = i === 0;
    const c = Math.min(1, Math.max(0, curl[i] ?? 0));

    joints.forEach((joint, j) => {
      const angle = c * JOINT_ANGLE[j] * (isThumb ? THUMB_SCALE : 1);
      if (j === 0 && !isThumb) {
        // Knuckle also carries the spread, which closes as the finger curls.
        joint.rotation.set(0, -s * angle, s * SPREAD[i - 1] * Math.max(0, Math.min(1, spread)) * 2 * (1 - c));
      } else {
        joint.rotation.set(0, -s * angle, 0);
      }
    });
  });
}

/** NMM → the LED face. Elements are shown/hidden by scale. */
const HIDDEN = 0.001;

function setScale(b: THREE.Bone | undefined, s: number) {
  if (b) b.scale.setScalar(s);
}

function applyFace(skel: NexaSkeleton, pose: AvatarPose, blink: number) {
  const f = skel.face;
  const brow = pose.face.brow;
  const mouth = pose.face.mouth;

  const questioning = brow < -0.25;
  const raised = brow > 0.25;
  const smiling = !questioning && mouth < 0.3;

  // Eyes: round by default, happy arcs when smiling, squeezed shut on a blink.
  const eyeOpen = 1 - blink;
  for (const side of ["Left", "Right"]) {
    setScale(f[`FaceArc${side}`], smiling && blink < 0.5 ? 1 : HIDDEN);
    const eye = f[`FaceEye${side}`];
    if (eye) {
      if (smiling && blink < 0.5) eye.scale.setScalar(HIDDEN);
      else eye.scale.set(1, Math.max(eyeOpen, HIDDEN), 1);
    }
    // Brows appear only when the marker calls for them.
    const b = f[`FaceBrow${side}`];
    if (b) {
      b.scale.setScalar(questioning || raised ? 1 : HIDDEN);
      // Lowered brows angle inward; raised ones sit flat.
      const tilt = questioning ? 0.3 : -0.12;
      b.rotation.set(0, 0, side === "Left" ? tilt : -tilt);
      b.position.y = b.userData.restY ?? (b.userData.restY = b.position.y);
      b.position.y += raised ? 0.006 : 0;
    }
  }

  setScale(f.FaceSmile, smiling ? 1 : HIDDEN);
  const open = f.FaceMouthOpen;
  if (open) open.scale.set(0.8, Math.max(mouth * 1.4, HIDDEN), 1);
}

/** Drives the whole rig for one solved pose. */
export function applyNexaPose(skel: NexaSkeleton, pose: AvatarPose, blink: number, breath = 0) {
  if (skel.chest) {
    skel.chest.rotation.x = breath;
    skel.chest.rotation.y = (pose.right.pos.z - pose.left.pos.z) * 0.045;
  }
  skel.root.updateMatrixWorld(true);
  // Solver "right" is the dominant hand, which is NEXA's -X (Right) side.
  applyArm(skel.root, skel.right, pose.right, -1);
  applyArm(skel.root, skel.left, pose.left, 1);

  if (skel.head) {
    skel.head.rotation.set(
      pose.face.headPitch,
      pose.face.headYaw,
      pose.face.headRoll,
    );
  }

  applyFace(skel, pose, blink);
}
