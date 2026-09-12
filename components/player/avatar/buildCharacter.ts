/**
 * Procedural android character for the signing avatar.
 *
 * Built to real human proportions (~1.72m) with the joint anchors that
 * `lib/avatar/pose-solver` targets — mouth at 1.51, chin 1.46, chest 1.22,
 * shoulders 1.33 — so the mesh and the sign notation stay in agreement.
 *
 * The design is deliberately hard-surface: glossy ceramic shell panels, a dark
 * under-suit, and emissive rings at the joints. That plays to what procedural
 * geometry and PBR actually do well. Photoreal skin and hair need a scanned or
 * sculpted asset; polished panels, clean seams and glowing trim do not, and
 * they read as intentional design rather than as a failed attempt at a human.
 *
 * Only arms, hands and head articulate; the lower body is static, since sign
 * languages articulate above the waist.
 */

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/* ---------------------------------------------------------------- *
 * Palette
 * ---------------------------------------------------------------- */

export interface CharacterPalette {
  shell: number; // ceramic panels
  shellWarm: number; // face / hands, a touch warmer
  carbon: number; // under-suit
  carbonGloss: number; // armour plates
  glow: number; // emissive trim
  hair: number;
  sclera: number;
  iris: number;
  lip: number;
  brow: number;
}

export const DEFAULT_PALETTE: CharacterPalette = {
  shell: 0xf2eee8,
  shellWarm: 0xf0e4d8,
  carbon: 0x12161b,
  carbonGloss: 0x1b2129,
  glow: 0x4cd7f6,
  hair: 0x2a1c15,
  sclera: 0xf7f5f1,
  iris: 0x6b4f36,
  lip: 0xc08476,
  brow: 0x241a14,
};

/* ---------------------------------------------------------------- *
 * Rig contract (consumed by SignAvatar)
 * ---------------------------------------------------------------- */

export interface FingerBones {
  root: THREE.Group;
  joints: THREE.Group[];
}

export interface HandRig {
  group: THREE.Group;
  fingers: FingerBones[]; // [thumb, index, middle, ring, pinky]
}

export interface Rig {
  root: THREE.Group;
  head: THREE.Group;
  browL: THREE.Mesh;
  browR: THREE.Mesh;
  mouth: THREE.Mesh;
  lidL: THREE.Mesh;
  lidR: THREE.Mesh;
  upperArmR: THREE.Mesh;
  foreArmR: THREE.Mesh;
  upperArmL: THREE.Mesh;
  foreArmL: THREE.Mesh;
  elbowR: THREE.Mesh;
  elbowL: THREE.Mesh;
  handR: HandRig;
  handL: HandRig;
  dispose: () => void;
}

/* ---------------------------------------------------------------- *
 * Materials
 * ---------------------------------------------------------------- */

function makeMaterials(p: CharacterPalette) {
  const disposables: THREE.Material[] = [];
  const track = <T extends THREE.Material>(m: T): T => {
    disposables.push(m);
    return m;
  };

  // Ceramic shell: high clearcoat over a near-white base is what reads as
  // polished hard-surface rather than plastic.
  const shell = track(
    new THREE.MeshPhysicalMaterial({
      color: p.shell,
      roughness: 0.26,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.07,
      reflectivity: 0.6,
    }),
  );

  const shellWarm = track(
    new THREE.MeshPhysicalMaterial({
      color: p.shellWarm,
      roughness: 0.3,
      metalness: 0.0,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
    }),
  );

  const carbon = track(
    new THREE.MeshPhysicalMaterial({
      color: p.carbon,
      roughness: 0.72,
      metalness: 0.05,
      sheen: 0.4,
      sheenRoughness: 0.8,
      sheenColor: new THREE.Color(0x3a4654),
    }),
  );

  const carbonGloss = track(
    new THREE.MeshPhysicalMaterial({
      color: p.carbonGloss,
      roughness: 0.22,
      metalness: 0.35,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    }),
  );

  // Emissive trim. Kept above 1.0 so the bloom pass picks it up.
  const glow = track(
    new THREE.MeshStandardMaterial({
      color: 0x0a1a20,
      emissive: new THREE.Color(p.glow),
      emissiveIntensity: 2.6,
      roughness: 0.3,
      metalness: 0,
    }),
  );

  const glowSoft = track(
    new THREE.MeshStandardMaterial({
      color: 0x0a1a20,
      emissive: new THREE.Color(p.glow),
      emissiveIntensity: 1.5,
      roughness: 0.4,
    }),
  );

  const hair = track(
    new THREE.MeshPhysicalMaterial({
      color: p.hair,
      roughness: 0.34,
      metalness: 0.08,
      sheen: 0.9,
      sheenColor: new THREE.Color(0x7a5641),
      clearcoat: 0.4,
      clearcoatRoughness: 0.25,
    }),
  );

  const sclera = track(new THREE.MeshPhysicalMaterial({
    color: p.sclera, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04,
  }));
  const iris = track(new THREE.MeshPhysicalMaterial({
    color: p.iris, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.04,
    emissive: new THREE.Color(p.glow), emissiveIntensity: 0.25,
  }));
  const pupil = track(new THREE.MeshBasicMaterial({ color: 0x080505 }));
  const brow = track(new THREE.MeshStandardMaterial({ color: p.brow, roughness: 0.62 }));
  const lip = track(new THREE.MeshPhysicalMaterial({
    color: p.lip, roughness: 0.38, clearcoat: 0.5,
  }));
  const seam = track(new THREE.MeshStandardMaterial({ color: 0x2c343d, roughness: 0.5 }));

  return {
    shell, shellWarm, carbon, carbonGloss, glow, glowSoft,
    hair, sclera, iris, pupil, brow, lip, seam, disposables,
  };
}

type Mats = ReturnType<typeof makeMaterials>;

/* ---------------------------------------------------------------- *
 * Helpers
 * ---------------------------------------------------------------- */

function lathe(profile: [number, number][], segments = 44): THREE.LatheGeometry {
  const pts = profile.map(([r, y]) => new THREE.Vector2(Math.max(r, 0.001), y));
  const g = new THREE.LatheGeometry(pts, segments);
  g.computeVertexNormals();
  return g;
}

/** Emissive ring — the signature detail of the whole design. */
function glowRing(
  mats: Mats,
  geos: THREE.BufferGeometry[],
  radius: number,
  tube: number,
  soft = false,
): THREE.Mesh {
  const g = new THREE.TorusGeometry(radius, tube, 10, 32);
  geos.push(g);
  return new THREE.Mesh(g, soft ? mats.glowSoft : mats.glow);
}

/* ---------------------------------------------------------------- *
 * Body
 * ---------------------------------------------------------------- */

const TORSO_PROFILE: [number, number][] = [
  [0.005, 0.86],
  [0.108, 0.875],
  [0.126, 0.93],
  [0.121, 1.00],
  [0.113, 1.06],
  [0.124, 1.13],
  [0.140, 1.22],
  [0.146, 1.29],
  [0.138, 1.345],
  [0.104, 1.395],
  [0.062, 1.425],
  [0.050, 1.44],
];

function buildTorso(mats: Mats, root: THREE.Group, geos: THREE.BufferGeometry[]) {
  const g = lathe(TORSO_PROFILE);
  geos.push(g);
  const torso = new THREE.Mesh(g, mats.carbon);
  torso.scale.z = 0.74;
  torso.castShadow = true;
  torso.receiveShadow = true;
  root.add(torso);

  // Chest armour plates flanking the sternum.
  for (const side of [-1, 1]) {
    const plateGeo = new RoundedBoxGeometry(0.072, 0.20, 0.055, 4, 0.022);
    geos.push(plateGeo);
    const plate = new THREE.Mesh(plateGeo, mats.carbonGloss);
    plate.position.set(0.063 * side, 1.235, 0.082);
    plate.rotation.set(0.06, -0.24 * side, 0.05 * side);
    plate.castShadow = true;
    root.add(plate);

    // Thin light strip along each plate.
    const stripGeo = new RoundedBoxGeometry(0.008, 0.135, 0.008, 2, 0.004);
    geos.push(stripGeo);
    const strip = new THREE.Mesh(stripGeo, mats.glowSoft);
    strip.position.set(0.094 * side, 1.235, 0.098);
    strip.rotation.z = 0.05 * side;
    root.add(strip);
  }

  // Waist / hip armour
  const waistGeo = lathe([
    [0.116, 1.045],
    [0.128, 1.075],
    [0.126, 1.10],
    [0.116, 1.125],
  ]);
  geos.push(waistGeo);
  const waist = new THREE.Mesh(waistGeo, mats.carbonGloss);
  waist.scale.z = 0.76;
  waist.castShadow = true;
  root.add(waist);

  // Belt + emissive buckle, as in the reference.
  const beltGeo = lathe([
    [0.122, 0.925],
    [0.131, 0.945],
    [0.131, 0.975],
    [0.122, 0.995],
  ]);
  geos.push(beltGeo);
  const belt = new THREE.Mesh(beltGeo, mats.carbonGloss);
  belt.scale.z = 0.78;
  belt.castShadow = true;
  root.add(belt);

  const buckle = glowRing(mats, geos, 0.021, 0.0068);
  buckle.position.set(0, 0.960, 0.101);
  root.add(buckle);

  // Collar ring at the neck line
  const collar = glowRing(mats, geos, 0.055, 0.0075, true);
  collar.position.y = 1.418;
  collar.scale.z = 0.8;
  collar.rotation.x = Math.PI / 2;
  root.add(collar);
}

function buildLowerBody(mats: Mats, root: THREE.Group, geos: THREE.BufferGeometry[]) {
  const pelvisGeo = lathe([
    [0.005, 0.78],
    [0.098, 0.79],
    [0.122, 0.845],
    [0.128, 0.90],
    [0.118, 0.94],
  ]);
  geos.push(pelvisGeo);
  const pelvis = new THREE.Mesh(pelvisGeo, mats.carbon);
  pelvis.scale.z = 0.78;
  pelvis.castShadow = true;
  root.add(pelvis);

  for (const side of [-1, 1]) {
    const hipX = 0.078 * side;
    const footX = 0.094 * side;

    const thighGeo = new THREE.CapsuleGeometry(0.069, 0.27, 6, 20);
    geos.push(thighGeo);
    const thigh = new THREE.Mesh(thighGeo, mats.carbon);
    thigh.position.set(hipX, 0.645, 0.005);
    thigh.rotation.z = -0.035 * side;
    thigh.castShadow = true;
    thigh.receiveShadow = true;
    root.add(thigh);

    // Thigh light seam
    const seamGeo = new RoundedBoxGeometry(0.007, 0.19, 0.007, 2, 0.003);
    geos.push(seamGeo);
    const seam = new THREE.Mesh(seamGeo, mats.glowSoft);
    seam.position.set(hipX + 0.066 * side, 0.66, 0.018);
    root.add(seam);

    const kneeGeo = new THREE.SphereGeometry(0.058, 20, 16);
    geos.push(kneeGeo);
    const knee = new THREE.Mesh(kneeGeo, mats.carbonGloss);
    knee.position.set(hipX + 0.006 * side, 0.475, 0.005);
    knee.castShadow = true;
    root.add(knee);

    const shinGeo = new THREE.CapsuleGeometry(0.052, 0.30, 6, 20);
    geos.push(shinGeo);
    const shin = new THREE.Mesh(shinGeo, mats.carbon);
    shin.position.set(footX - 0.004 * side, 0.295, 0);
    shin.castShadow = true;
    shin.receiveShadow = true;
    root.add(shin);

    const ankleGeo = new THREE.SphereGeometry(0.042, 14, 12);
    geos.push(ankleGeo);
    const ankle = new THREE.Mesh(ankleGeo, mats.carbonGloss);
    ankle.position.set(footX, 0.115, 0);
    root.add(ankle);

    const shoeGeo = new RoundedBoxGeometry(0.096, 0.068, 0.232, 4, 0.030);
    geos.push(shoeGeo);
    const shoe = new THREE.Mesh(shoeGeo, mats.carbonGloss);
    shoe.position.set(footX, 0.035, 0.044);
    shoe.rotation.y = 0.06 * side;
    shoe.castShadow = true;
    shoe.receiveShadow = true;
    root.add(shoe);
  }
}

/* ---------------------------------------------------------------- *
 * Head
 * ---------------------------------------------------------------- */

function buildHead(mats: Mats, root: THREE.Group, geos: THREE.BufferGeometry[]) {
  // Mechanical neck column
  const neckGeo = new THREE.CylinderGeometry(0.044, 0.052, 0.10, 20);
  geos.push(neckGeo);
  const neck = new THREE.Mesh(neckGeo, mats.carbonGloss);
  neck.position.y = 1.405;
  neck.castShadow = true;
  root.add(neck);

  const neckRing = glowRing(mats, geos, 0.047, 0.005, true);
  neckRing.position.y = 1.388;
  neckRing.rotation.x = Math.PI / 2;
  root.add(neckRing);

  const head = new THREE.Group();
  head.position.y = 1.47;
  root.add(head);

  // Cranium — the ellipsoid is ~0.098 x 0.115 x 0.103, which is the surface
  // every facial feature below has to sit proud of.
  const skullGeo = new THREE.SphereGeometry(0.101, 44, 34);
  geos.push(skullGeo);
  const skull = new THREE.Mesh(skullGeo, mats.shellWarm);
  skull.scale.set(0.97, 1.14, 1.02);
  skull.position.y = 0.087;
  skull.castShadow = true;
  skull.receiveShadow = true;
  head.add(skull);

  const jawGeo = new THREE.SphereGeometry(0.079, 32, 26);
  geos.push(jawGeo);
  const jaw = new THREE.Mesh(jawGeo, mats.shellWarm);
  jaw.scale.set(0.95, 0.82, 0.98);
  jaw.position.set(0, 0.028, 0.012);
  jaw.castShadow = true;
  head.add(jaw);

  // Panel seams across the face plate — the detail that reads "android".
  const foreheadSeamGeo = new THREE.TorusGeometry(0.030, 0.0022, 8, 24, Math.PI * 0.9);
  geos.push(foreheadSeamGeo);
  const foreheadSeam = new THREE.Mesh(foreheadSeamGeo, mats.seam);
  foreheadSeam.position.set(-0.012, 0.146, 0.070);
  foreheadSeam.rotation.set(0.5, 0.2, -0.9);
  head.add(foreheadSeam);

  const cheekSeamGeo = new THREE.TorusGeometry(0.052, 0.0022, 8, 28, Math.PI * 0.8);
  geos.push(cheekSeamGeo);
  for (const side of [-1, 1]) {
    const cs = new THREE.Mesh(cheekSeamGeo, mats.seam);
    cs.position.set(0.052 * side, 0.072, 0.058);
    cs.rotation.set(0.25, 0.85 * side, 0.4 * side);
    head.add(cs);
  }

  // Temple plates with emissive rings
  for (const side of [-1, 1]) {
    const templeGeo = new THREE.SphereGeometry(0.030, 16, 12);
    geos.push(templeGeo);
    const temple = new THREE.Mesh(templeGeo, mats.carbonGloss);
    temple.scale.set(0.36, 1.0, 0.9);
    temple.position.set(0.093 * side, 0.100, 0.026);
    head.add(temple);

    const ring = glowRing(mats, geos, 0.0105, 0.0032);
    ring.position.set(0.104 * side, 0.100, 0.030);
    ring.rotation.y = Math.PI / 2;
    head.add(ring);
  }

  // Ears
  const earGeo = new THREE.SphereGeometry(0.024, 16, 12);
  geos.push(earGeo);
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(earGeo, mats.shellWarm);
    ear.scale.set(0.42, 1, 0.72);
    ear.position.set(0.098 * side, 0.062, -0.012);
    head.add(ear);
  }

  // Nose
  const noseGeo = new THREE.ConeGeometry(0.021, 0.055, 16);
  geos.push(noseGeo);
  const nose = new THREE.Mesh(noseGeo, mats.shellWarm);
  nose.position.set(0, 0.072, 0.101);
  nose.rotation.x = Math.PI * 0.52;
  nose.castShadow = true;
  head.add(nose);

  // Eyes. Iris/pupil/catchlight ride on the FRONT of the eyeball, and the whole
  // eye sits proud of the cranium — placed at its centre they vanish inside.
  const scleraGeo = new THREE.SphereGeometry(0.0215, 26, 20);
  const irisGeo = new THREE.SphereGeometry(0.0115, 22, 18);
  const pupilGeo = new THREE.SphereGeometry(0.0058, 14, 12);
  const glintGeo = new THREE.SphereGeometry(0.0032, 10, 8);
  const lidGeo = new THREE.SphereGeometry(0.0235, 26, 20, 0, Math.PI * 2, 0, Math.PI * 0.5);
  geos.push(scleraGeo, irisGeo, pupilGeo, glintGeo, lidGeo);

  const lids: THREE.Mesh[] = [];
  for (const side of [-1, 1]) {
    const ex = 0.038 * side;
    const ey = 0.093;
    const ez = 0.085;

    const eye = new THREE.Mesh(scleraGeo, mats.sclera);
    eye.position.set(ex, ey, ez);
    head.add(eye);

    const ir = new THREE.Mesh(irisGeo, mats.iris);
    ir.position.set(ex, ey, ez + 0.0155);
    head.add(ir);

    const pu = new THREE.Mesh(pupilGeo, mats.pupil);
    pu.position.set(ex, ey, ez + 0.0205);
    head.add(pu);

    const gl = new THREE.Mesh(glintGeo, mats.sclera);
    gl.position.set(ex - 0.007 * side, ey + 0.008, ez + 0.0225);
    head.add(gl);

    const lid = new THREE.Mesh(lidGeo, mats.shellWarm);
    lid.position.set(ex, ey, ez);
    lid.scale.setScalar(1.02);
    lids.push(lid);
    head.add(lid);
  }

  // Brows — heavier than life, because brow position is grammatical in sign
  // languages and has to read at playback distance.
  const browGeo = new RoundedBoxGeometry(0.046, 0.0115, 0.013, 3, 0.005);
  geos.push(browGeo);
  const browL = new THREE.Mesh(browGeo, mats.brow);
  browL.position.set(-0.038, 0.124, 0.090);
  head.add(browL);
  const browR = new THREE.Mesh(browGeo, mats.brow);
  browR.position.set(0.038, 0.124, 0.090);
  head.add(browR);

  const mouthGeo = new RoundedBoxGeometry(0.048, 0.013, 0.014, 3, 0.006);
  geos.push(mouthGeo);
  const mouth = new THREE.Mesh(mouthGeo, mats.lip);
  mouth.position.set(0, 0.029, 0.092);
  head.add(mouth);

  // Hair. thetaLength is deliberately short: a full-revolution shell reaching
  // past the equator wraps around the FRONT of the head and hides the face.
  const hairGeo = new THREE.SphereGeometry(0.1065, 40, 32, 0, Math.PI * 2, 0, Math.PI * 0.34);
  geos.push(hairGeo);
  const hair = new THREE.Mesh(hairGeo, mats.hair);
  hair.scale.set(0.99, 1.16, 1.04);
  hair.position.y = 0.083;
  hair.castShadow = true;
  head.add(hair);

  const fringeGeo = new THREE.SphereGeometry(0.086, 28, 20, 0, Math.PI, 0, Math.PI * 0.40);
  geos.push(fringeGeo);
  const fringe = new THREE.Mesh(fringeGeo, mats.hair);
  fringe.scale.set(1.18, 0.58, 1.16);
  fringe.position.set(0.012, 0.147, 0.014);
  fringe.rotation.set(0.26, 0.3, 0.10);
  fringe.castShadow = true;
  head.add(fringe);

  const napeGeo = new THREE.SphereGeometry(0.105, 32, 24, 0, Math.PI * 1.25, 0, Math.PI * 0.66);
  geos.push(napeGeo);
  const nape = new THREE.Mesh(napeGeo, mats.hair);
  nape.scale.set(1.02, 1.12, 1.03);
  nape.position.set(0, 0.076, -0.006);
  nape.rotation.y = Math.PI * 0.875;
  nape.castShadow = true;
  head.add(nape);

  // Shoulder-length falls either side, so the silhouette isn't a bare skull.
  const fallGeo = new THREE.CapsuleGeometry(0.036, 0.14, 6, 16);
  geos.push(fallGeo);
  for (const side of [-1, 1]) {
    const fall = new THREE.Mesh(fallGeo, mats.hair);
    fall.scale.set(1, 1, 0.62);
    fall.position.set(0.086 * side, -0.01, -0.028);
    fall.rotation.z = 0.10 * side;
    fall.castShadow = true;
    head.add(fall);
  }

  return { head, browL, browR, mouth, lidL: lids[0], lidR: lids[1] };
}

/* ---------------------------------------------------------------- *
 * Hands
 * ---------------------------------------------------------------- */

function buildFinger(
  parent: THREE.Object3D,
  x: number,
  z: number,
  length: number,
  radius: number,
  mats: Mats,
  geos: THREE.BufferGeometry[],
): FingerBones {
  const root = new THREE.Group();
  root.position.set(x, 0, z);
  parent.add(root);

  const joints: THREE.Group[] = [];
  let current: THREE.Object3D = root;
  const seg = length / 3;

  for (let i = 0; i < 3; i++) {
    const joint = new THREE.Group();
    joint.position.y = i === 0 ? 0 : seg;
    current.add(joint);

    const r = radius * (1 - i * 0.16);

    // White shell segment...
    const boneGeo = new THREE.CapsuleGeometry(r, seg * 0.58, 4, 12);
    geos.push(boneGeo);
    const bone = new THREE.Mesh(boneGeo, mats.shell);
    bone.position.y = seg * 0.52;
    bone.castShadow = true;
    joint.add(bone);

    // ...with a dark knuckle band between segments, which is what gives the
    // hands their articulated, mechanical read.
    const kGeo = new THREE.SphereGeometry(r * 1.02, 12, 10);
    geos.push(kGeo);
    const knuckle = new THREE.Mesh(kGeo, mats.carbonGloss);
    joint.add(knuckle);

    joints.push(joint);
    current = joint;
  }
  return { root, joints };
}

function buildHand(mats: Mats, geos: THREE.BufferGeometry[], side: 1 | -1): HandRig {
  const group = new THREE.Group();

  const palmGeo = new RoundedBoxGeometry(0.078, 0.088, 0.030, 5, 0.014);
  geos.push(palmGeo);
  const palm = new THREE.Mesh(palmGeo, mats.shell);
  palm.position.y = 0.040;
  palm.castShadow = true;
  group.add(palm);

  // Emissive disc on the back of the hand — straight from the reference.
  const disc = glowRing(mats, geos, 0.0145, 0.0042);
  disc.position.set(0, 0.044, -0.017);
  group.add(disc);

  // Thenar eminence — the pad at the base of the thumb.
  const thenarGeo = new THREE.SphereGeometry(0.026, 16, 12);
  geos.push(thenarGeo);
  const thenar = new THREE.Mesh(thenarGeo, mats.shell);
  thenar.scale.set(0.85, 1.25, 0.7);
  thenar.position.set(-0.026 * side, 0.028, 0.004);
  group.add(thenar);

  // Wrist cuff
  const cuffGeo = new THREE.CylinderGeometry(0.035, 0.031, 0.030, 20);
  geos.push(cuffGeo);
  const cuff = new THREE.Mesh(cuffGeo, mats.carbonGloss);
  cuff.position.y = -0.012;
  cuff.castShadow = true;
  group.add(cuff);

  const cuffRing = glowRing(mats, geos, 0.034, 0.0038, true);
  cuffRing.position.y = -0.003;
  cuffRing.rotation.x = Math.PI / 2;
  group.add(cuffRing);

  const fingers: FingerBones[] = [];
  const xs = [-0.0285, -0.0095, 0.0095, 0.0285];
  const lens = [0.076, 0.083, 0.075, 0.060];
  const radii = [0.0105, 0.0110, 0.0105, 0.0092];

  xs.forEach((x, i) => {
    const f = buildFinger(group, x * side, 0, lens[i], radii[i], mats, geos);
    f.root.position.y = 0.082;
    fingers.push(f);
  });

  const thumb = buildFinger(group, -0.040 * side, 0.014, 0.058, 0.0125, mats, geos);
  thumb.root.position.y = 0.024;
  thumb.root.rotation.z = 0.95 * side;
  thumb.root.rotation.x = -0.38;

  return { group, fingers: [thumb, ...fingers] };
}

/* ---------------------------------------------------------------- *
 * Assembly
 * ---------------------------------------------------------------- */

export const UPPER_ARM = 0.29;
export const FOREARM = 0.27;

export function buildCharacter(palette: CharacterPalette = DEFAULT_PALETTE): Rig {
  const root = new THREE.Group();
  const mats = makeMaterials(palette);
  const geos: THREE.BufferGeometry[] = [];

  buildTorso(mats, root, geos);
  buildLowerBody(mats, root, geos);
  const face = buildHead(mats, root, geos);

  // Shoulder pauldrons — sized to overlap the upper arm so the joint never
  // shows a gap as the arm swings through the signing space.
  const shoulderGeo = new THREE.SphereGeometry(0.072, 24, 18);
  geos.push(shoulderGeo);
  for (const side of [-1, 1]) {
    const sh = new THREE.Mesh(shoulderGeo, mats.carbonGloss);
    sh.scale.set(1, 0.94, 0.96);
    sh.position.set(0.172 * side, 1.328, 0);
    sh.castShadow = true;
    root.add(sh);

    const ring = glowRing(mats, geos, 0.040, 0.0042, true);
    ring.position.set(0.196 * side, 1.320, 0.006);
    ring.rotation.y = Math.PI / 2;
    root.add(ring);
  }

  // Arms — placed by IK each frame, so they are created unparented.
  const upperGeo = new THREE.CapsuleGeometry(0.053, UPPER_ARM * 0.62, 6, 20);
  const foreGeo = new THREE.CapsuleGeometry(0.044, FOREARM * 0.66, 6, 20);
  const jointGeo = new THREE.SphereGeometry(0.047, 20, 16);
  geos.push(upperGeo, foreGeo, jointGeo);

  const mk = (g: THREE.BufferGeometry, m: THREE.Material) => {
    const mesh = new THREE.Mesh(g, m);
    mesh.castShadow = true;
    root.add(mesh);
    return mesh;
  };

  const upperArmR = mk(upperGeo, mats.shell);
  const foreArmR = mk(foreGeo, mats.shell);
  const upperArmL = mk(upperGeo, mats.shell);
  const foreArmL = mk(foreGeo, mats.shell);
  const elbowR = mk(jointGeo, mats.carbonGloss);
  const elbowL = mk(jointGeo, mats.carbonGloss);

  // Elbow rings ride along as children, so they follow the IK solution.
  for (const elbow of [elbowR, elbowL]) {
    const ring = glowRing(mats, geos, 0.050, 0.0052);
    ring.rotation.y = Math.PI / 2;
    elbow.add(ring);
  }

  const handR = buildHand(mats, geos, 1);
  const handL = buildHand(mats, geos, -1);
  root.add(handR.group, handL.group);

  const dispose = () => {
    geos.forEach((g) => g.dispose());
    mats.disposables.forEach((m) => m.dispose());
  };

  return {
    root,
    ...face,
    upperArmR, foreArmR, upperArmL, foreArmL,
    elbowR, elbowL,
    handR, handL,
    dispose,
  };
}
