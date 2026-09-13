import type { Vec3 } from "./pose-solver";

type Quaternion = [number, number, number, number];

function quaternion(rot: Vec3): Quaternion {
  const cx = Math.cos(rot.x / 2), sx = Math.sin(rot.x / 2);
  const cy = Math.cos(rot.y / 2), sy = Math.sin(rot.y / 2);
  const cz = Math.cos(rot.z / 2), sz = Math.sin(rot.z / 2);
  return [sx * cy * cz + cx * sy * sz, cx * sy * cz - sx * cy * sz, cx * cy * sz + sx * sy * cz, cx * cy * cz - sx * sy * sz];
}

/** XYZ Euler angles of an orthonormal frame (column vectors). */
export function frameRotation(x: Vec3, y: Vec3, z: Vec3): Vec3 {
  return {
    x: Math.abs(z.x) < 0.9999999 ? Math.atan2(-z.y, z.z) : Math.atan2(y.z, y.y),
    y: Math.asin(Math.max(-1, Math.min(1, z.x))),
    z: Math.abs(z.x) < 0.9999999 ? Math.atan2(-y.x, x.x) : 0,
  };
}

/** Shortest-arc wrist interpolation, including coupled axes and ±π wraps. */
export function blendRotation(from: Vec3, to: Vec3, t: number): Vec3 {
  if (t <= 0) return { ...from };
  if (t >= 1) return { ...to };
  const a = quaternion(from);
  let b = quaternion(to);
  let dot = a.reduce((sum, n, i) => sum + n * b[i], 0);
  if (dot < 0) { b = b.map(n => -n) as Quaternion; dot = -dot; }
  const theta = Math.acos(Math.min(1, dot));
  const sine = Math.sin(theta);
  const wa = sine > 1e-5 ? Math.sin((1 - t) * theta) / sine : 1 - t;
  const wb = sine > 1e-5 ? Math.sin(t * theta) / sine : t;
  const q = a.map((n, i) => n * wa + b[i] * wb);
  const norm = Math.hypot(...q);
  const [x, y, z, w] = q.map(n => n / norm);
  return frameRotation(
    { x: 1 - 2 * (y * y + z * z), y: 2 * (x * y + z * w), z: 2 * (x * z - y * w) },
    { x: 2 * (x * y - z * w), y: 1 - 2 * (x * x + z * z), z: 2 * (y * z + x * w) },
    { x: 2 * (x * z + y * w), y: 2 * (y * z - x * w), z: 1 - 2 * (x * x + y * y) },
  );
}
