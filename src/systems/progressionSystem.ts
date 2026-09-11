import type { PlayerState, SkillId } from '../types';
import { jobs } from '../data/jobs';
import { businesses } from '../data/businesses';
import { properties } from '../data/properties';
import { cars } from '../data/cars';

export function calculateXpToNextLevel(level: number): number {
  return level * 100 + 50;
}

export function calculateSkillXpToNext(skillLevel: number): number {
  return skillLevel * 50 + 25;
}

export function getAvailableJobs(playerState: PlayerState): typeof jobs {
  return jobs.filter((job) => {
    if (job.requiredLevel > playerState.level) return false;

    for (const [skillId, requiredLevel] of Object.entries(job.requiredSkills)) {
      const skill = playerState.skills[skillId as SkillId];
      if (!skill || skill.level < requiredLevel) return false;
    }

    return true;
  });
}

export function getAvailableBusinesses(playerState: PlayerState): typeof businesses {
  return businesses.filter((biz) => {
    if (biz.startupCost > playerState.cash) return false;

    for (const [skillId, requiredLevel] of Object.entries(biz.requiredSkills)) {
      const skill = playerState.skills[skillId as SkillId];
      if (!skill || skill.level < requiredLevel) return false;
    }

    return true;
  });
}

export function getAffordableProperties(playerState: PlayerState): typeof properties {
  return properties.filter((prop) => prop.purchasePrice <= playerState.cash);
}

export function getAffordableCars(playerState: PlayerState): typeof cars {
  return cars.filter((car) => car.purchasePrice <= playerState.cash);
}

export function getDifficultyMultiplier(day: number): number {
  return 1.0 + (day / 365) * 0.5;
}
