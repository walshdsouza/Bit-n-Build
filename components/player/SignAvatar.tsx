"use client";

/**
 * 3D signing avatar.
 *
 * A full-body procedural character (see `avatar/buildCharacter.ts`) driven every
 * frame by `lib/avatar/pose-solver`, which turns HamNoSys primitives into
 * skeletal targets. Two-bone IK places the hands at the anatomical locations a
 * sign specifies, fingers articulate from the handshape's curl profile, and the
 * face carries the non-manual marker.
 *
 * The character is procedural on purpose: it needs no downloaded asset, so the
 * avatar works offline and on first clone.
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { SignPlan, SignPlanItem } from "@/lib/types";
import { AvatarPose, lerpPose, restPose, solvePose } from "@/lib/avatar/pose-solver";
import {
  buildCharacter,
  FOREARM,
  HandRig,
  Rig,
  UPPER_ARM,
} from "./avatar/buildCharacter";

interface SignAvatarProps {
  plan: SignPlan | null;
  currentTime: number;
  playing: boolean;
  label?: string;
  /** Initial framing; the viewer can toggle it. */
  fullBody?: boolean;
}

/**
 * Camera framings. "Signing" is the default because brow and mouth position
 * are grammatical in sign languages — at whole-body distance the face is only
 * a few pixels tall and those markers become unreadable.
 */
const VIEWS = {
  signing: { y: 1.20, targetY: 1.16, dist: 1.95 },
  full: { y: 1.12, targetY: 0.98, dist: 3.30 },
} as const;

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
  const params =
    mesh.geometry instanceof THREE.CapsuleGeometry ? mesh.geometry.parameters : null;
  const nominal = params ? (params.height ?? 1) + 2 * (params.radius ?? 0) : 1;
  mesh.scale.y = len / nominal;
}

/**
 * Two-bone IK. Solves elbow placement for a hand target, with a pole hint that
 * keeps elbows dropping down and slightly behind the torso the way human arms
 * actually hang.
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

  const cos = Math.min(1, Math.max(-1, (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist)));
  const alpha = Math.acos(cos);

  _dir.copy(_a).divideScalar(dist);
  _b.set(side * 0.22, -1, -0.5).normalize();
  _axis.crossVectors(_dir, _b);
  if (_axis.lengthSq() < 1e-6) _axis.set(0, 0, side);
  _axis.normalize();

  _q.setFromAxisAngle(_axis, -alpha);
  out.copy(_dir).applyQuaternion(_q).multiplyScalar(l1).add(shoulder);
}

function applyFingers(hand: HandRig, curl: readonly number[], spread: number, side: 1 | -1) {
  hand.fingers.forEach((finger, i) => {
    const c = curl[i] ?? 0;
    finger.joints.forEach((joint, j) => {
      joint.rotation.x = -c * (j === 0 ? 1.25 : j === 1 ? 1.05 : 0.85);
    });
    if (i > 0) {
      finger.root.rotation.z = (i - 2.5) * spread * 0.12 * side;
    }
  });
}

const _shoulderR = new THREE.Vector3(0.175, 1.328, 0);
const _shoulderL = new THREE.Vector3(-0.175, 1.328, 0);
const _elbow = new THREE.Vector3();
const _target = new THREE.Vector3();

function applyPose(rig: Rig, pose: AvatarPose, blink: number) {
  const arm = (
    handPose: AvatarPose["right"],
    shoulder: THREE.Vector3,
    upper: THREE.Mesh,
    fore: THREE.Mesh,
    elbowMesh: THREE.Mesh,
    hand: HandRig,
    side: 1 | -1,
  ) => {
    _target.set(handPose.pos.x, handPose.pos.y, handPose.pos.z);
    solveArm(shoulder, _target, UPPER_ARM, FOREARM, side, _elbow);
    spanCapsule(upper, shoulder, _elbow);
    spanCapsule(fore, _elbow, _target);
    elbowMesh.position.copy(_elbow);

    hand.group.position.copy(_target);
    hand.group.rotation.set(handPose.rot.x, handPose.rot.y, handPose.rot.z);
    applyFingers(hand, handPose.curl, handPose.spread, side);
  };

  arm(pose.right, _shoulderR, rig.upperArmR, rig.foreArmR, rig.elbowR, rig.handR, 1);
  arm(pose.left, _shoulderL, rig.upperArmL, rig.foreArmL, rig.elbowL, rig.handL, -1);

  const f = pose.face;
  rig.head.rotation.set(f.headPitch, f.headYaw, f.headRoll);

  rig.browL.position.y = 0.121 + f.brow * 0.014;
  rig.browR.position.y = 0.121 + f.brow * 0.014;
  rig.browL.rotation.z = f.brow * 0.22;
  rig.browR.rotation.z = -f.brow * 0.22;

  rig.mouth.scale.y = 1 + f.mouth * 5.5;
  rig.mouth.scale.x = 1 - f.mouth * 0.22;

  // Eyelids: raised brows open the eyes, and `blink` closes them.
  const open = Math.max(0, 1 - blink) * (1 - Math.max(0, -f.brow) * 0.35);
  const lidRot = -Math.PI * 0.5 * open + Math.PI * 0.1;
  rig.lidL.rotation.x = lidRot;
  rig.lidR.rotation.x = lidRot;
}

/* ---------------------------------------------------------------- *
 * Component
 * ---------------------------------------------------------------- */

function activeSign(
  plan: SignPlan | null,
  t: number,
): { item: SignPlanItem | null; progress: number } {
  if (!plan?.items.length) return { item: null, progress: 0 };
  for (const it of plan.items) {
    if (t >= it.startTime && t < it.endTime) {
      const span = Math.max(it.endTime - it.startTime, 1e-3);
      return { item: it, progress: (t - it.startTime) / span };
    }
  }
  return { item: null, progress: 0 };
}

export default function SignAvatar({
  plan,
  currentTime,
  playing,
  label,
  fullBody = true,
}: SignAvatarProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ plan, currentTime, playing });
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [ready, setReady] = useState(false);
  const [fps, setFps] = useState(0);
  const [activeGloss, setActiveGloss] = useState("—");
  const [view, setView] = useState<keyof typeof VIEWS>(fullBody ? "full" : "signing");

  useEffect(() => {
    stateRef.current = { plan, currentTime, playing };
  }, [plan, currentTime, playing]);

  // Reframe without tearing down the scene.
  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    const v = VIEWS[view];
    cam.position.set(0, v.y, v.dist);
    cam.lookAt(0, v.targetY, 0);
  }, [view, ready]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    const v0 = VIEWS[fullBody ? "full" : "signing"];
    camera.position.set(0, v0.y, v0.dist);
    camera.lookAt(0, v0.targetY, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Filmic tone mapping keeps highlights from clipping to flat white, which
    // is most of what separates "3D render" from "plastic toy".
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      width: "100%",
      height: "100%",
      display: "block",
      cursor: "grab",
      touchAction: "none",
    });

    // Image-based lighting: a room environment gives the skin and fabric real
    // directional variation instead of flat ambient.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.45;

    // Three-point studio lighting. Intensities are kept moderate because the
    // bloom threshold below discriminates on linear HDR brightness.
    const key = new THREE.DirectionalLight(0xfff3e6, 1.7);
    key.position.set(1.6, 2.9, 2.4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 8;
    key.shadow.camera.left = -1.4;
    key.shadow.camera.right = 1.4;
    key.shadow.camera.top = 2.4;
    key.shadow.camera.bottom = -0.4;
    key.shadow.bias = -0.0012;
    key.shadow.normalBias = 0.02;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xbfe4f5, 0.5);
    fill.position.set(-2.2, 1.5, 1.4);
    scene.add(fill);

    // Cyan rim to match the app's accent and separate the figure from the bg.
    const rim = new THREE.DirectionalLight(0x4cd7f6, 1.3);
    rim.position.set(-1.4, 2.0, -2.4);
    scene.add(rim);

    scene.add(new THREE.HemisphereLight(0xa8dcec, 0x101820, 0.32));

    const rig = buildCharacter();
    scene.add(rig.root);

    // Backdrop: a large dim panel with a soft halo behind the figure, which is
    // what stops the character reading as floating in a void.
    const haloCanvas = document.createElement("canvas");
    haloCanvas.width = haloCanvas.height = 256;
    const hctx = haloCanvas.getContext("2d")!;
    const hgrad = hctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    hgrad.addColorStop(0, "rgba(120,175,205,0.34)");
    hgrad.addColorStop(0.55, "rgba(50,95,125,0.12)");
    hgrad.addColorStop(1, "rgba(8,14,20,0)");
    hctx.fillStyle = hgrad;
    hctx.fillRect(0, 0, 256, 256);
    const haloTex = new THREE.CanvasTexture(haloCanvas);
    const haloGeo = new THREE.PlaneGeometry(3.2, 3.2);
    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTex, transparent: true, depthWrite: false,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(0, 1.28, -1.5);
    scene.add(halo);

    // Shadow-catching ground.
    const groundGeo = new THREE.CircleGeometry(1.6, 64);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.34 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.001;
    ground.receiveShadow = true;
    scene.add(ground);

    // Soft radial pool under the feet so the figure feels grounded.
    const poolGeo = new THREE.CircleGeometry(0.62, 48);
    const poolCanvas = document.createElement("canvas");
    poolCanvas.width = poolCanvas.height = 128;
    const pctx = poolCanvas.getContext("2d")!;
    const grad = pctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    grad.addColorStop(0, "rgba(76,215,246,0.30)");
    grad.addColorStop(1, "rgba(76,215,246,0)");
    pctx.fillStyle = grad;
    pctx.fillRect(0, 0, 128, 128);
    const poolTex = new THREE.CanvasTexture(poolCanvas);
    const poolMat = new THREE.MeshBasicMaterial({
      map: poolTex, transparent: true, depthWrite: false,
    });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = 0.002;
    scene.add(pool);

    // Drag to orbit.
    let yaw = 0;
    let dragging = false;
    let lastX = 0;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      renderer.domElement.style.cursor = "grabbing";
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      yaw += (e.clientX - lastX) * 0.01;
      lastX = e.clientX;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      renderer.domElement.style.cursor = "grab";
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerup", onUp);

    // Bloom. Passes render into a half-float target, so the values the bloom
    // threshold sees are linear HDR — not the tone-mapped 0..1 the canvas gets.
    // The threshold therefore has to sit ABOVE the brightness of lit white
    // shell (~1.5) but below the emissive trim (~2.5), or the whole character
    // blooms into a white blob instead of just the glowing rings.
    const hdrTarget = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      samples: 2,
    });
    const composer = new EffectComposer(renderer, hdrTarget);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.75, 0.45, 1.75);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      bloom.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let raf = 0;
    let current: AvatarPose = restPose();
    let frames = 0;
    let fpsClock = performance.now();
    let lastGloss = "";
    let nextBlink = performance.now() + 2200;
    let blinkUntil = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.1);
      const now = performance.now();
      const { plan: p, currentTime: t, playing: isPlaying } = stateRef.current;

      const { item, progress } = activeSign(p, t);
      const target = solvePose(item, progress);

      const k = Math.min(1, dt * (isPlaying ? 14 : 8));
      current = lerpPose(current, target, k);

      // Idle blink — cheap, and its absence is uncanny.
      if (now > nextBlink) {
        blinkUntil = now + 130;
        nextBlink = now + 2400 + Math.random() * 3200;
      }
      const blink = now < blinkUntil ? Math.sin(((blinkUntil - now) / 130) * Math.PI) : 0;

      applyPose(rig, current, blink);

      // Breathing / weight shift when idle.
      const breathe = Math.sin(now * 0.0011) * 0.006;
      rig.root.position.y = item ? breathe * 0.35 : breathe;
      rig.root.rotation.y = yaw + (item ? 0 : Math.sin(now * 0.0004) * 0.03);

      composer.render();

      const gloss = item?.fingerspell ?? item?.gloss ?? "—";
      if (gloss !== lastGloss) {
        lastGloss = gloss;
        setActiveGloss(gloss);
      }

      frames++;
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
      rig.dispose();
      composer.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      haloTex.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      poolGeo.dispose();
      poolMat.dispose();
      poolTex.dispose();
      envRT.texture.dispose();
      pmrem.dispose();
      renderer.dispose();
      cameraRef.current = null;
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [fullBody]);

  const displayLabel = label ?? activeGloss;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div ref={mountRef} className="w-full flex-1 min-h-0" />

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant text-xs font-mono">
          Initialising avatar…
        </div>
      )}

      {/* Framing toggle */}
      <button
        onClick={() => setView((v) => (v === "signing" ? "full" : "signing"))}
        title={view === "signing" ? "Show full body" : "Focus on signing space"}
        className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container/80 backdrop-blur-sm border border-outline-variant/30 text-[10px] font-mono text-on-surface-variant hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[13px]">
          {view === "signing" ? "person" : "zoom_in"}
        </span>
        {view === "signing" ? "Full body" : "Signing view"}
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none">
        <p className="font-mono text-primary font-bold text-sm truncate max-w-[260px] text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {displayLabel}
        </p>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{fps}fps</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container/80 backdrop-blur-sm text-on-surface-variant">
            {plan ? `${plan.items.length} signs` : "no plan"}
          </span>
          {plan && (
            <span className="px-2 py-0.5 rounded-full bg-surface-container/80 backdrop-blur-sm text-on-surface-variant">
              {plan.lang}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
