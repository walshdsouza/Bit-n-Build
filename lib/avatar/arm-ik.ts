import { Vec3 } from "./pose-solver";

/** Anatomical two-bone IK in avatar-local coordinates. */
export function solveArmIK(shoulder: Vec3, requested: Vec3, upper: number, lower: number, side: number) {
  const dx = requested.x - shoulder.x;
  const dy = requested.y - shoulder.y;
  const dz = requested.z - shoulder.z;
  const length = Math.hypot(dx, dy, dz);
  const direction = length > 1e-8
    ? { x: dx / length, y: dy / length, z: dz / length }
    : { x: 0, y: -1, z: 0 };
  // Stay clear of both singularities: a locked elbow and a fully folded arm.
  const distance = Math.max(Math.abs(upper - lower) + 1e-4, Math.min((upper + lower) * 0.985, length));
  const target = {
    x: shoulder.x + direction.x * distance,
    y: shoulder.y + direction.y * distance,
    z: shoulder.z + direction.z * distance,
  };
  const along = (upper * upper + distance * distance - lower * lower) / (2 * distance);
  const height = Math.sqrt(Math.max(0, upper * upper - along * along));
  // Project a down/outward pole onto the plane perpendicular to the arm.
  // Rotating by a negative angle around cross(direction, pole), as the old
  // NEXA solve did, bends AWAY from the pole and raises both elbows.
  let pole = { x: side * 0.45, y: -0.85, z: 0.2 };
  let projection = pole.x * direction.x + pole.y * direction.y + pole.z * direction.z;
  let bend = {
    x: pole.x - direction.x * projection,
    y: pole.y - direction.y * projection,
    z: pole.z - direction.z * projection,
  };
  let bendLength = Math.hypot(bend.x, bend.y, bend.z);
  if (bendLength < 1e-6) {
    pole = Math.abs(direction.z) < 0.9 ? { x: 0, y: 0, z: 1 } : { x: side, y: 0, z: 0 };
    projection = pole.x * direction.x + pole.y * direction.y + pole.z * direction.z;
    bend = {
      x: pole.x - direction.x * projection,
      y: pole.y - direction.y * projection,
      z: pole.z - direction.z * projection,
    };
    bendLength = Math.hypot(bend.x, bend.y, bend.z);
  }
  return {
    target,
    elbow: {
      x: shoulder.x + direction.x * along + bend.x / bendLength * height,
      y: shoulder.y + direction.y * along + bend.y / bendLength * height,
      z: shoulder.z + direction.z * along + bend.z / bendLength * height,
    },
  };
}
