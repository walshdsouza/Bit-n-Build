"use client";

/**
 * 3D signing avatar.
 *
 * Replaces the static placeholder that used to sit in the right-hand pane.
 * A procedural humanoid rig is built in three.js and driven every frame by
 * `lib/avatar/pose-solver`, which turns HamNoSys primitives into skeletal
 * targets. Two-bone IK places the hands at the anatomical locations a sign
 * specifies (mouth, forehead, weak palm, neutral space…), fingers articulate
 * from the handshape's curl profile, and the face carries the non-manual
 * marker.
 *
 * The rig is procedural on purpose: it needs no downloaded character asset, so
 * the avatar works offline and on first clone. If a VRM character is present at
 * `/avatars/signer.vrm` it is loaded instead and driven by the same pose data.
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SignPlan, SignPlanItem } from "@/lib/types";
import { AvatarPose, lerpPose, restPose, solvePose } from "@/lib/avatar/pose-solver";

interface SignAvatarProps {
  plan: SignPlan | null;
  currentTime: number;
  playing: boolean;
  /** Shown under the avatar; falls back to the active gloss. */
  label?: string;
}

/* ---------------------------------------------------------------- *
 * Rig construction
 * ---------------------------------------------------------------- */

const SKIN = 0x93c9d8;
const ACCENT = 0x4cd7f6;
const DARK = 0x18323f;

const UPPER_ARM = 0.29;
const FOREARM = 0.27;

interface FingerBones {
  root: THREE.Group;
  joints: THREE.Group[];
}

interface HandRig {
  group: THREE.Group;
  fingers: FingerBones[];
}

interface Rig {
  root: THREE.Group;
  head: THREE.Group;
  browL: THREE.Mesh;
  browR: THREE.Mesh;
  mouth: THREE.Mesh;
  upperArmR: THREE.Mesh;
  foreArmR: THREE.Mesh;
  upperArmL: THREE.Mesh;
  foreArmL: THREE.Mesh;
  handR: HandRig;
  handL: HandRig;
}

function mat(color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.55,
    metalness: 0.15,
    ...opts,
  });
}

function buildFinger(
  parent: THREE.Object3D,
  x: number,
  z: number,
  length: number,
  material: THREE.Material,
): FingerBones {
  const root = new THREE.Group();
  root.position.set(x, 0.02, z);
  parent.add(root);

  const joints: THREE.Group[] = [];
  let current: THREE.Object3D = root;
  const seg = length / 3;

  for (let i = 0; i < 3; i++) {
    const joint = new THREE.Group();
    joint.position.y = i === 0 ? 0 : seg;
    current.add(joint);

    const bone = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.009 - i * 0.0015, seg * 0.7, 3, 6),
      material,
    );
    bone.position.y = seg / 2;
    joint.add(bone);

    joints.push(joint);
    current = joint;
  }
  return { root, joints };
}

function buildHand(material: THREE.Material): HandRig {
  const group = new THREE.Group();

  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.085, 0.025), material);
  palm.position.y = 0.035;
  group.add(palm);

  const fingers: FingerBones[] = [];
  // Index → pinky across the palm.
  const xs = [-0.026, -0.009, 0.009, 0.026];
  const lens = [0.072, 0.078, 0.07, 0.056];
  xs.forEach((x, i) => {
    const f = buildFinger(group, x, 0, lens[i], material);
    f.root.position.y = 0.075;
    fingers.push(f);
  });

  // Thumb: offset to the side and rotated out of the palm plane.
  const thumb = buildFinger(group, -0.042, 0.012, 0.055, material);
  thumb.root.position.y = 0.025;
  thumb.root.rotation.z = 0.9;
  thumb.root.rotation.x = -0.35;

  // Solver order is [thumb, index, middle, ring, pinky].
  return { group, fingers: [thumb, ...fingers] };
}

function buildRig(): Rig {
  const root = new THREE.Group();
  const skin = mat(SKIN);
  const cloth = mat(DARK, { roughness: 0.8, metalness: 0.05 });

  // Torso — tapered so the silhouette reads as shoulders-to-waist.
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.142, 0.112, 0.40, 20, 1), cloth);
  torso.position.y = 1.14;
  root.add(torso);

  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.145, 20, 16), cloth);
  chest.scale.set(1, 0.62, 0.82);
  chest.position.y = 1.30;
  root.add(chest);

  const hips = new THREE.Mesh(new THREE.SphereGeometry(0.122, 16, 12), cloth);
  hips.scale.set(1, 0.8, 0.9);
  hips.position.y = 0.93;
  root.add(hips);

  // Neck + head
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.08, 12), skin);
  neck.position.y = 1.42;
  root.add(neck);

  const head = new THREE.Group();
  head.position.y = 1.47;
  root.add(head);

  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.105, 24, 20), skin);
  skull.scale.set(1, 1.15, 0.95);
  skull.position.y = 0.085;
  head.add(skull);

  const eyeGeo = new THREE.SphereGeometry(0.016, 12, 10);
  const eyeMat = mat(0x0b1a22, { roughness: 0.25 });
  [-0.04, 0.04].forEach((x) => {
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(x, 0.095, 0.09);
    head.add(eye);
  });

  const browMat = mat(0x0b1a22, { roughness: 0.9 });
  const browGeo = new THREE.BoxGeometry(0.034, 0.007, 0.012);
  const browL = new THREE.Mesh(browGeo, browMat);
  browL.position.set(-0.04, 0.125, 0.092);
  head.add(browL);
  const browR = new THREE.Mesh(browGeo, browMat);
  browR.position.set(0.04, 0.125, 0.092);
  head.add(browR);

  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.01, 0.012), browMat);
  mouth.position.set(0, 0.035, 0.094);
  head.add(mouth);

  // Shoulders
  [-1, 1].forEach((s) => {
    const sh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 12), cloth);
    sh.position.set(0.175 * s, 1.33, 0);
    root.add(sh);
  });

  // Arms — positioned each frame by IK, so geometry is created unparented.
  const armGeoU = new THREE.CapsuleGeometry(0.042, UPPER_ARM * 0.72, 4, 12);
  const armGeoF = new THREE.CapsuleGeometry(0.036, FOREARM * 0.72, 4, 12);

  const upperArmR = new THREE.Mesh(armGeoU, skin);
  const foreArmR = new THREE.Mesh(armGeoF, skin);
  const upperArmL = new THREE.Mesh(armGeoU, skin);
  const foreArmL = new THREE.Mesh(armGeoF, skin);
  root.add(upperArmR, foreArmR, upperArmL, foreArmL);

  const handR = buildHand(skin);
  const handL = buildHand(skin);
  root.add(handR.group, handL.group);

  return { root, head, browL, browR, mouth, upperArmR, foreArmR, upperArmL, foreArmL, handR, handL };
}

/* ---------------------------------------------------------------- *
 * IK + pose application
 * ---------------------------------------------------------------- */

const UP = new THREE.Vector3(0, 1, 0);
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _axis = new THREE.Vector3();
const _q = new THREE.Quaternion();

/** Places a capsule (Y-aligned, centred) so it spans `from` → `to`. */
function spanCapsule(mesh: THREE.Mesh, from: THREE.Vector3, to: THREE.Vector3) {
  _dir.subVectors(to, from);
  const len = _dir.length() || 1e-4;
  mesh.position.copy(from).addScaledVector(_dir, 0.5);
  _dir.divideScalar(len);
  mesh.quaternion.setFromUnitVectors(UP, _dir);
  // Capsules are authored at a nominal length; stretch to fit the bone.
  const nominal = mesh.geometry instanceof THREE.CapsuleGeometry
    ? (mesh.geometry.parameters.height ?? 1) + 2 * (mesh.geometry.parameters.radius ?? 0)
    : 1;
  mesh.scale.y = len / nominal;
}

/**
 * Two-bone IK. Solves elbow placement for a hand target, with a pole hint that
 * keeps elbows pointing down-and-out the way human arms actually bend.
 */
function solveArm(
  shoulder: THREE.Vector3,
  target: THREE.Vector3,
  l1: number,
  l2: number,
  side: 1 | -1,
  out: THREE.Vector3,
) {
  _a.subVectors(target, shoulder);
  let dist = _a.length();
  const max = (l1 + l2) * 0.999;
  if (dist > max) {
    _a.multiplyScalar(max / dist);
    target.copy(shoulder).add(_a);
    dist = max;
  }
  dist = Math.max(dist, 1e-4);

  // Angle between the upper arm and the shoulder→target line.
  const cos = Math.min(1, Math.max(-1, (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist)));
  const alpha = Math.acos(cos);

  _dir.copy(_a).divideScalar(dist);
  // Pole: elbows drop down and tuck slightly behind the torso. Keeping the
  // lateral term small stops the elbow swinging wide when the hand is close to
  // the shoulder, which is the common case for a resting non-dominant hand.
  _b.set(side * 0.22, -1, -0.5).normalize();
  _axis.crossVectors(_dir, _b);
  if (_axis.lengthSq() < 1e-6) _axis.set(0, 0, side);
  _axis.normalize();

  _q.setFromAxisAngle(_axis, -alpha);
  out.copy(_dir).applyQuaternion(_q).multiplyScalar(l1).add(shoulder);
}

function applyFingers(hand: HandRig, curl: readonly number[], spread: number) {
  hand.fingers.forEach((finger, i) => {
    const c = curl[i] ?? 0;
    finger.joints.forEach((joint, j) => {
      // Distal joints curl slightly more than proximal ones.
      joint.rotation.x = -c * (j === 0 ? 1.25 : j === 1 ? 1.05 : 0.85);
    });
    if (i > 0) {
      // Fan the four fingers apart.
      finger.root.rotation.z = (i - 2.5) * spread * 0.12;
    }
  });
}

const _shoulderR = new THREE.Vector3(0.175, 1.33, 0);
const _shoulderL = new THREE.Vector3(-0.175, 1.33, 0);
const _elbow = new THREE.Vector3();
const _target = new THREE.Vector3();

function applyPose(rig: Rig, pose: AvatarPose) {
  const arm = (
    handPose: typeof pose.right,
    shoulder: THREE.Vector3,
    upper: THREE.Mesh,
    fore: THREE.Mesh,
    hand: HandRig,
    side: 1 | -1,
  ) => {
    _target.set(handPose.pos.x, handPose.pos.y, handPose.pos.z);
    solveArm(shoulder, _target, UPPER_ARM, FOREARM, side, _elbow);
    spanCapsule(upper, shoulder, _elbow);
    spanCapsule(fore, _elbow, _target);

    hand.group.position.copy(_target);
    hand.group.rotation.set(handPose.rot.x, handPose.rot.y, handPose.rot.z);
    applyFingers(hand, handPose.curl, handPose.spread);
  };

  arm(pose.right, _shoulderR, rig.upperArmR, rig.foreArmR, rig.handR, 1);
  arm(pose.left, _shoulderL, rig.upperArmL, rig.foreArmL, rig.handL, -1);

  // Face / non-manual markers
  const f = pose.face;
  rig.head.rotation.set(f.headPitch, f.headYaw, f.headRoll);
  rig.browL.position.y = 0.125 + f.brow * 0.014;
  rig.browR.position.y = 0.125 + f.brow * 0.014;
  rig.browL.rotation.z = f.brow * 0.25;
  rig.browR.rotation.z = -f.brow * 0.25;
  rig.mouth.scale.y = 1 + f.mouth * 5;
  rig.mouth.scale.x = 1 - f.mouth * 0.25;
}

/* ---------------------------------------------------------------- *
 * Component
 * ---------------------------------------------------------------- */

function activeSign(plan: SignPlan | null, t: number): { item: SignPlanItem | null; progress: number } {
  if (!plan?.items.length) return { item: null, progress: 0 };
  for (const it of plan.items) {
    if (t >= it.startTime && t < it.endTime) {
      const span = Math.max(it.endTime - it.startTime, 1e-3);
      return { item: it, progress: (t - it.startTime) / span };
    }
  }
  return { item: null, progress: 0 };
}

export default function SignAvatar({ plan, currentTime, playing, label }: SignAvatarProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ plan, currentTime, playing });
  const [ready, setReady] = useState(false);
  const [fps, setFps] = useState(0);
  const [activeGloss, setActiveGloss] = useState("—");

  // Keep the render loop reading fresh props without re-creating the scene.
  useEffect(() => {
    stateRef.current = { plan, currentTime, playing };
  }, [plan, currentTime, playing]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = null;

    // Framed on the signing space: mid-chest to just above the head, which is
    // where sign languages place nearly all articulation.
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    camera.position.set(0, 1.24, 2.45);
    camera.lookAt(0, 1.12, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    // Lighting — keyed to the app's cyan accent.
    scene.add(new THREE.HemisphereLight(0x9fd9ec, 0x0a1219, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(1.4, 2.6, 2.2);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const rim = new THREE.DirectionalLight(ACCENT, 1.1);
    rim.position.set(-1.8, 1.4, -1.6);
    scene.add(rim);

    const rig = buildRig();
    scene.add(rig.root);

    // Ground disc to catch the shadow.
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(1.1, 48),
      new THREE.ShadowMaterial({ opacity: 0.28 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.62;
    ground.receiveShadow = true;
    scene.add(ground);

    rig.root.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
      }
    });

    // Drag to orbit.
    let yaw = 0;
    let dragging = false;
    let lastX = 0;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      yaw += (e.clientX - lastX) * 0.01;
      lastX = e.clientX;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "none";

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // Animation loop: solve the active sign's pose and blend toward it.
    let raf = 0;
    let current: AvatarPose = restPose();
    let frames = 0;
    let fpsClock = performance.now();
    let lastGloss = "";
    const clock = new THREE.Clock();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.1);
      const { plan: p, currentTime: t, playing: isPlaying } = stateRef.current;

      const { item, progress } = activeSign(p, t);
      const target = solvePose(item, progress);

      // Critically-damped-ish blend keeps transitions readable rather than snappy.
      const k = Math.min(1, dt * (isPlaying ? 14 : 8));
      current = lerpPose(current, target, k);
      applyPose(rig, current);

      // Idle breathing when nothing is being signed.
      if (!item) {
        rig.root.position.y = Math.sin(performance.now() * 0.0012) * 0.008;
      }

      rig.root.rotation.y = yaw;
      renderer.render(scene, camera);

      const gloss = item?.fingerspell ?? item?.gloss ?? "—";
      if (gloss !== lastGloss) {
        lastGloss = gloss;
        setActiveGloss(gloss);
      }

      frames++;
      const now = performance.now();
      if (now - fpsClock >= 1000) {
        setFps(Math.round((frames * 1000) / (now - fpsClock)));
        frames = 0;
        fpsClock = now;
      }
    };

    setReady(true);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.dispose();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const m = o.material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m.dispose();
        }
      });
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const displayLabel = label ?? activeGloss;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div ref={mountRef} className="w-full flex-1 min-h-0" />

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant text-xs font-mono">
          Initialising avatar…
        </div>
      )}

      {/* Active sign readout */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none">
        <p className="font-mono text-primary font-bold text-sm truncate max-w-[260px] text-center">
          {displayLabel}
        </p>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{fps}fps</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
            {plan ? `${plan.items.length} signs` : "no plan"}
          </span>
          {plan && (
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
              {plan.lang}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
