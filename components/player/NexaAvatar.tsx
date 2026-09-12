"use client";

/**
 * NEXA signing avatar.
 *
 * Loads the rigged NEXA robot (public/models/nexa.glb, 70 joints with three
 * controllable joints per finger) and drives it from the same
 * `lib/avatar/pose-solver` output as the procedural character — HamNoSys
 * primitives → skeletal targets → two-bone IK and finger curls, retargeted
 * onto NEXA's proportions in `avatar/nexaRig`.
 *
 * The model is only the visual layer: none of the translation pipeline, the
 * sign dictionaries or the motion planning changes. The kit's own demo
 * animations are deliberately not used — they are articulation tests, not
 * validated signs.
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { SignPlan, SignPlanItem } from "@/lib/types";
import { AvatarPose, lerpPose, restPose, solvePose } from "@/lib/avatar/pose-solver";
import { applyNexaPose, NexaSkeleton, readNexaSkeleton } from "./avatar/nexaRig";

interface NexaAvatarProps {
  plan: SignPlan | null;
  currentTime: number;
  playing: boolean;
  label?: string;
  fullBody?: boolean;
  /** Called if the model cannot be loaded, so the caller can fall back. */
  onError?: (message: string) => void;
  /**
   * Where to fetch the GLB. The web app serves it from /public; the browser
   * extension has no server, so it passes a browser.runtime.getURL() path.
   */
  modelUrl?: string;
}

const VIEWS = {
  signing: { y: 1.30, targetY: 1.24, dist: 1.55 },
  full: { y: 1.00, targetY: 0.86, dist: 3.05 },
} as const;

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

export default function NexaAvatar({
  plan,
  currentTime,
  playing,
  label,
  fullBody = false,
  onError,
  modelUrl = "/models/nexa.glb",
}: NexaAvatarProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ plan, currentTime, playing });
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const errorRef = useRef(onError);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const [activeGloss, setActiveGloss] = useState("—");
  const [view, setView] = useState<keyof typeof VIEWS>(fullBody ? "full" : "signing");

  useEffect(() => {
    stateRef.current = { plan, currentTime, playing };
  }, [plan, currentTime, playing]);

  useEffect(() => {
    errorRef.current = onError;
  }, [onError]);

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

    let disposed = false;
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, {
      width: "100%", height: "100%", display: "block",
      cursor: "grab", touchAction: "none",
    });

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.7;

    const key = new THREE.DirectionalLight(0xfff4e8, 1.9);
    key.position.set(1.5, 2.8, 2.3);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 8;
    key.shadow.camera.left = -1.2;
    key.shadow.camera.right = 1.2;
    key.shadow.camera.top = 2.2;
    key.shadow.camera.bottom = -0.4;
    key.shadow.bias = -0.0012;
    key.shadow.normalBias = 0.02;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xcfe9f7, 0.55);
    fill.position.set(-2.0, 1.5, 1.4);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0x4cd7f6, 1.5);
    rim.position.set(-1.3, 2.0, -2.2);
    scene.add(rim);

    scene.add(new THREE.HemisphereLight(0xa8dcec, 0x0d141b, 0.35));

    // Backdrop halo so the figure doesn't float in a void.
    const haloCanvas = document.createElement("canvas");
    haloCanvas.width = haloCanvas.height = 256;
    const hctx = haloCanvas.getContext("2d")!;
    const hgrad = hctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    hgrad.addColorStop(0, "rgba(125,180,210,0.34)");
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
    halo.position.set(0, 1.2, -1.5);
    scene.add(halo);

    const groundGeo = new THREE.CircleGeometry(1.6, 64);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.32 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.001;
    ground.receiveShadow = true;
    scene.add(ground);

    const composer = new EffectComposer(
      renderer,
      new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 2 }),
    );
    composer.addPass(new RenderPass(scene, camera));
    // Threshold above lit white shell, below the emissive LED trim.
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.7, 0.45, 1.6);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

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
    let skeleton: NexaSkeleton | null = null;
    let model: THREE.Object3D | null = null;
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

      if (skeleton) {
        const { item, progress } = activeSign(p, t);
        const target = solvePose(item, progress);

        const k = Math.min(1, dt * (isPlaying ? 14 : 8));
        current = lerpPose(current, target, k);

        if (now > nextBlink) {
          blinkUntil = now + 130;
          nextBlink = now + 2400 + Math.random() * 3200;
        }
        const blink =
          now < blinkUntil ? Math.sin(((blinkUntil - now) / 130) * Math.PI) : 0;

        applyNexaPose(skeleton, current, blink);

        if (model) {
          const breathe = Math.sin(now * 0.0011) * 0.005;
          model.position.y = item ? breathe * 0.35 : breathe;
          model.rotation.y = yaw + (item ? 0 : Math.sin(now * 0.0004) * 0.03);
        }

        const gloss = item?.fingerspell ?? item?.gloss ?? "—";
        if (gloss !== lastGloss) {
          lastGloss = gloss;
          setActiveGloss(gloss);
        }
      }

      composer.render();

      frames++;
      if (now - fpsClock >= 1000) {
        setFps(Math.round((frames * 1000) / (now - fpsClock)));
        frames = 0;
        fpsClock = now;
      }
    };

    new GLTFLoader().load(
      modelUrl,
      (gltf) => {
        if (disposed) return;
        model = gltf.scene;
        model.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
        scene.add(model);

        try {
          skeleton = readNexaSkeleton(model);
          setReady(true);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "NEXA rig could not be read";
          setFailed(msg);
          errorRef.current?.(msg);
        }
      },
      undefined,
      (e) => {
        if (disposed) return;
        const msg =
          e instanceof Error ? e.message : `Failed to load ${modelUrl}`;
        setFailed(msg);
        errorRef.current?.(msg);
      },
    );

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerup", onUp);

      if (model) {
        model.traverse((o) => {
          const m = o as THREE.Mesh;
          if (!m.isMesh) return;
          m.geometry?.dispose();
          const mat = m.material;
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat?.dispose();
        });
      }
      composer.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      haloTex.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      envRT.texture.dispose();
      pmrem.dispose();
      renderer.dispose();
      cameraRef.current = null;
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [fullBody, modelUrl]);

  const displayLabel = label ?? activeGloss;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div ref={mountRef} className="w-full flex-1 min-h-0" />

      {!ready && !failed && (
        <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant text-xs font-mono">
          Loading NEXA…
        </div>
      )}

      {failed && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs font-mono text-error">
          {failed}
        </div>
      )}

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
