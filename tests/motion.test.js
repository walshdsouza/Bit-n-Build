const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const THREE = require("three");
const B = __dirname + "/.build/lib/avatar";
const { solvePose, restPose, lerpPose, easeMotion } = require(B + "/pose-solver.js");
const { sampleMotion, secondaryMotion } = require(B + "/motion-timeline.js");
const { solveArmIK } = require(B + "/arm-ik.js");
const { readNexaSkeleton, applyNexaPose } = require(__dirname + "/.build/components/player/avatar/nexaRig.js");

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
const near = (a, b, tolerance = 1e-6) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
const rotation = p => new THREE.Quaternion().setFromEuler(new THREE.Euler(p.x, p.y, p.z));
const entry = (location = "neutral_space", shape = "flat", movement = { type: "none" }) => ({
  gloss: "TEST", twoHanded: false,
  dominant: { shape, extFingerDir: "u", palmOr: "o", location }, movement,
});
const item = (start, end, config = entry()) => ({ gloss: config.gloss, startTime: start, endTime: end, entry: config, emphasis: 0.5, nmm: [] });
const plan = items => ({ lang: "ASL", duration: items.at(-1)?.endTime ?? 0, sigml: "", items });

(async () => {
  near(easeMotion(0), 0); near(easeMotion(1), 1);
  assert.ok(easeMotion(0.001) < 1e-7, "transport must accelerate gently");

  const sequence = plan([item(0, 1, entry("forehead")), item(1, 1.6, entry("chest", "fist")), item(1.6, 2, entry("neutral_space"))]);
  for (const boundary of [1, 1.6, 2]) {
    const before = sampleMotion(sequence, boundary - 1e-6).pose;
    const after = sampleMotion(sequence, boundary + 1e-6).pose;
    for (const side of ["right", "left"]) {
      assert.ok(distance(before[side].pos, after[side].pos) < 1e-5, "sign boundary must not snap");
      assert.ok(rotation(before[side].rot).angleTo(rotation(after[side].rot)) < 1e-4, "wrist boundary must not snap");
    }
  }
  const paused = sampleMotion(sequence, 1.08);
  for (const time of [0, 0.1, 1.5, 0.5, 1.08, 2, 0.7]) sampleMotion(sequence, time);
  assert.deepEqual(sampleMotion(sequence, 1.08), paused, "seek order and pause duration must not alter pose");
  assert.deepEqual(sampleMotion(sequence, 0).pose, restPose(), "first sign starts from natural rest");
  const hold = sampleMotion(sequence, 0.98).pose;
  assert.ok(distance(hold.right.pos, solvePose(sequence.items[0], 1).right.pos) < 1e-9, "final articulation must remain readable");
  assert.ok(distance(sampleMotion(sequence, 1.1).pose.left.pos, restPose().left.pos) < 1e-9, "supporting hand must stay still");

  for (const gap of [0.12, 0.7]) {
    const gapped = plan([item(0, 1), item(1 + gap, 2 + gap, entry("chin"))]);
    for (const boundary of [1, 1 + gap]) {
      assert.ok(distance(sampleMotion(gapped, boundary - 1e-6).pose.right.pos, sampleMotion(gapped, boundary + 1e-6).pose.right.pos) < 1e-5, "gap transitions must stay continuous");
    }
  }
  assert.deepEqual(secondaryMotion(4.6, true), { blink: 0, breath: 0, sway: 0 });
  assert.deepEqual(secondaryMotion(4.6), secondaryMotion(4.6), "secondary motion follows the same media clock");

  // Solver outputs are independently mutable, never shared dictionary arrays.
  const clean = restPose(); clean.right.curl[1] = 1;
  assert.equal(restPose().right.curl[1], 0.22);
  const first = solvePose(sequence.items[0], 0); first.right.curl[1] = 1;
  assert.equal(solvePose(sequence.items[0], 0).right.curl[1], 0);

  const wrapA = restPose(), wrapB = restPose();
  wrapA.right.rot = { x: 0, y: 0, z: Math.PI - 0.02 };
  wrapB.right.rot = { x: 0, y: 0, z: -Math.PI + 0.02 };
  const mid = lerpPose(wrapA, wrapB, 0.5).right.rot;
  near(rotation(wrapA.right.rot).angleTo(rotation(mid)), 0.02);

  // The actual extended-finger axis follows the notation for every direction.
  const directions = { u: [0, 1, 0], d: [0, -1, 0], l: [-1, 0, 0], r: [1, 0, 0], o: [0, 0, 1], i: [0, 0, -1], ul: [-1, 1, 0], dr: [1, -1, 0] };
  for (const [name, vector] of Object.entries(directions)) {
    const config = entry(); config.dominant.extFingerDir = name;
    const pose = solvePose(item(0, 1, config), 0.5);
    const actual = new THREE.Vector3(0, 1, 0).applyQuaternion(rotation(pose.right.rot));
    near(actual.distanceTo(new THREE.Vector3(...vector).normalize()), 0);
  }
  const twisted = entry("neutral_space", "flat", { type: "twist" });
  const twistedPose = solvePose(item(0, 1, twisted), 0.3);
  near(new THREE.Vector3(0, 1, 0).applyQuaternion(rotation(twistedPose.right.rot)).distanceTo(new THREE.Vector3(0, 1, 0)), 0);
  const symmetric = item(0, 1, { ...entry(), twoHanded: true, symmetric: true });
  symmetric.emphasis = 1;
  const mirrored = solvePose(symmetric, 0.5);
  near(mirrored.right.pos.x, -mirrored.left.pos.x);
  near(mirrored.right.pos.z, mirrored.left.pos.z);

  const repeated = item(0, 1, entry("neutral_space", "flat", { type: "straight", direction: "o", repetitions: 2 }));
  const base = solvePose(repeated, 0).right.pos.z;
  assert.ok(solvePose(repeated, 0.25).right.pos.z > base + 0.01, "repeated strokes must move");
  near(solvePose(repeated, 0.5).right.pos.z, base);
  assert.ok(solvePose(repeated, 0.75).right.pos.z > base + 0.01, "second stroke must not be clamped away");

  // Reach clamping preserves both limb lengths, including folded/locked cases.
  for (const side of [-1, 1]) {
    const shoulder = { x: side * 0.184, y: 1.25, z: 0 };
    for (const target of [{ x: side * 0.22, y: 1.1, z: 0.32 }, shoulder, { x: side * 2, y: 4, z: 2 }]) {
      const solved = solveArmIK(shoulder, target, 0.225, 0.206, side);
      near(distance(shoulder, solved.elbow), 0.225);
      near(distance(solved.elbow, solved.target), 0.206);
      assert.ok(Object.values(solved.elbow).every(Number.isFinite));
    }
    const natural = solveArmIK(shoulder, { x: side * 0.22, y: 1.1, z: 0.32 }, 0.225, 0.206, side);
    assert.ok(natural.elbow.y < natural.target.y, "elbow must bend down toward its anatomical pole");
  }

  // Exercise the shipped model, including its real bone hierarchy and axes.
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
  const data = fs.readFileSync(path.join(__dirname, "../public/models/nexa.glb"));
  const gltf = await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength), "");
  const root = gltf.scene;
  const skeleton = readNexaSkeleton(root);
  const pose = solvePose(item(0, 1), 0.5);
  const localHands = [];
  for (const yaw of [0, 0.8, -1.1]) {
    root.rotation.y = yaw;
    applyNexaPose(skeleton, pose, 0, 0.003);
    root.updateMatrixWorld(true);
    const hand = skeleton.right.hand;
    const position = root.worldToLocal(hand.getWorldPosition(new THREE.Vector3()));
    localHands.push(position);
    const worldFinger = new THREE.Vector3(-1, 0, 0).applyQuaternion(hand.getWorldQuaternion(new THREE.Quaternion()));
    near(worldFinger.distanceTo(new THREE.Vector3(0, 1, 0)), 0, 1e-5);
    near(skeleton.right.upper.getWorldPosition(new THREE.Vector3()).distanceTo(skeleton.right.lower.getWorldPosition(new THREE.Vector3())), skeleton.right.upperLength, 1e-5);
  }
  near(localHands[0].distanceTo(localHands[1]), 0, 1e-5);
  near(localHands[0].distanceTo(localHands[2]), 0, 1e-5);
  const snapshot = skeleton.right.hand.getWorldPosition(new THREE.Vector3());
  for (let n = 0; n < 10; n++) applyNexaPose(skeleton, pose, 0, 0.003);
  near(snapshot.distanceTo(skeleton.right.hand.getWorldPosition(new THREE.Vector3())), 0, 1e-5);

  console.log("PASS motion: continuous transitions, deterministic seek/pause, readable holds, wrist axes, repetitions, anatomical IK, real NEXA rig/orbit");
})().catch(error => { console.error(error); process.exitCode = 1; });
