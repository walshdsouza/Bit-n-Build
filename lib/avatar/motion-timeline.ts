import { SignPlan, SignPlanItem } from "../types";
import { AvatarPose, easeMotion, lerpPose, restPose, solvePose } from "./pose-solver";

/** A shallow transport arc keeps hands clear of the torso between signs. */
function transport(from: AvatarPose, to: AvatarPose, progress: number): AvatarPose {
  const k = easeMotion(progress);
  const pose = lerpPose(from, to, k);
  for (const side of ["right", "left"] as const) {
    const a = from[side].pos;
    const b = to[side].pos;
    const distance = Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
    // No added motion on a stationary supporting hand or between finger letters.
    const arc = Math.min(0.025, distance * 0.08) * 16 * k * k * (1 - k) * (1 - k);
    pose[side].pos.z += arc;
  }
  return pose;
}

export interface MotionSample {
  pose: AvatarPose;
  item: SignPlanItem | null;
  progress: number;
}

/**
 * Sample the media timeline directly. A seek, replay, pause or a slow frame
 * therefore produces exactly the same articulation at the same timestamp.
 * Short preparation and hold phases preserve a readable stroke while joining
 * consecutive signs directly, without dropping both hands to rest each time.
 */
export function sampleMotion(plan: SignPlan | null, time: number): MotionSample {
  const items = plan?.items;
  const t = Number.isFinite(time) ? Math.max(0, time) : 0;
  if (!items?.length) return { pose: restPose(), item: null, progress: 0 };

  let previous: SignPlanItem | null = null;
  for (const item of items) {
    if (item.endTime <= item.startTime) continue;
    if (t < item.startTime) {
      const end = previous?.endTime ?? 0;
      const gap = item.startTime - end;
      const destination = solvePose(item, 0);
      let pose: AvatarPose;
      if (previous && gap <= 0.32) {
        pose = transport(solvePose(previous, 1), destination, (t - end) / gap);
      } else {
        const prepare = Math.min(0.22, gap * 0.4);
        const release = Math.min(0.28, gap * 0.4);
        pose = t >= item.startTime - prepare
          ? transport(restPose(), destination, (t - item.startTime + prepare) / prepare)
          : previous
            ? transport(solvePose(previous, 1), restPose(), (t - end) / release)
            : restPose();
      }
      return { pose, item: null, progress: 0 };
    }
    if (t < item.endTime) {
      const span = item.endTime - item.startTime;
      const elapsed = t - item.startTime;
      const prepare = Math.min(item.fingerspell ? 0.09 : 0.18, span * 0.22);
      const hold = Math.min(0.1, span * 0.12);
      const gap = item.startTime - (previous?.endTime ?? 0);
      const destination = solvePose(item, 0);
      const source = gap > 1e-6 ? destination : previous ? solvePose(previous, 1) : restPose();
      const pose = elapsed < prepare
        ? transport(source, destination, elapsed / prepare)
        : solvePose(item, Math.min(1, (elapsed - prepare) / (span - prepare - hold)));
      return { pose, item, progress: elapsed / span };
    }
    previous = item;
  }

  return {
    pose: previous ? transport(solvePose(previous, 1), restPose(), (t - previous.endTime) / 0.28) : restPose(),
    item: null,
    progress: 0,
  };
}

/** Deterministic secondary motion, disabled for reduced motion preferences. */
export function secondaryMotion(time: number, reducedMotion = false) {
  if (reducedMotion) return { blink: 0, breath: 0, sway: 0 };
  const t = Math.max(0, time);
  const blinkPhase = t % 4.7;
  const blink = blinkPhase > 4.48 ? Math.sin(((blinkPhase - 4.48) / 0.22) * Math.PI) ** 2 : 0;
  return { blink, breath: Math.sin(t * 1.4) * 0.003, sway: Math.sin(t * 0.65) * 0.008 };
}
