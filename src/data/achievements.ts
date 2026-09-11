import type { Achievement } from '../types';

export const achievements: Achievement[] = [
  // --- Money Milestones ---
  {
    id: 'first-paycheck',
    name: 'First Paycheck',
    description: 'Earn your very first paycheck from a job.',
    icon: '💵',
    condition: (state) => state.player.cash > 500 || state.financeHistory.some((r) => r.type === 'income' && r.category === 'salary'),
    reward: { xp: 20 },
  },
  {
    id: 'first-10k',
    name: 'Five Figures',
    description: 'Accumulate $10,000 in cash.',
    icon: '💰',
    condition: (state) => state.player.cash >= 10000,
    reward: { xp: 50 },
  },
  {
    id: 'first-100k',
    name: 'Six Figures',
    description: 'Accumulate $100,000 in cash.',
    icon: '🏦',
    condition: (state) => state.player.cash >= 100000,
    reward: { xp: 100 },
  },
  {
    id: 'millionaire',
    name: 'Millionaire',
    description: 'Reach a net worth of $1,000,000.',
    icon: '💎',
    condition: (state) => state.player.netWorth >= 1000000,
    reward: { xp: 500, reputation: 10 },
  },
  {
    id: 'multi-millionaire',
    name: 'Multi-Millionaire',
    description: 'Reach a net worth of $5,000,000.',
    icon: '👑',
    condition: (state) => state.player.netWorth >= 5000000,
    reward: { xp: 1000, reputation: 20 },
  },

  // --- Vehicle Milestones ---
  {
    id: 'first-car',
    name: 'First Car',
    description: 'Purchase your first vehicle.',
    icon: '🚗',
    condition: (state) => state.ownedCars.length >= 1,
    reward: { xp: 30, mood: 10 },
  },
  {
    id: 'car-collector',
    name: 'Car Collector',
    description: 'Own 5 cars at the same time.',
    icon: '🏎️',
    condition: (state) => state.ownedCars.length >= 5,
    reward: { xp: 200, reputation: 10 },
  },

  // --- Property Milestones ---
  {
    id: 'first-property',
    name: 'First Property',
    description: 'Purchase your first property.',
    icon: '🏠',
    condition: (state) => state.ownedProperties.length >= 1,
    reward: { xp: 50, mood: 15 },
  },
  {
    id: 'property-mogul',
    name: 'Property Mogul',
    description: 'Own 5 properties at the same time.',
    icon: '🏙️',
    condition: (state) => state.ownedProperties.length >= 5,
    reward: { xp: 300, reputation: 15 },
  },

  // --- Business Milestones ---
  {
    id: 'first-business',
    name: 'Entrepreneur',
    description: 'Start your first business.',
    icon: '🏪',
    condition: (state) => state.ownedBusinesses.length >= 1,
    reward: { xp: 75, reputation: 5 },
  },
  {
    id: 'business-empire',
    name: 'Business Empire',
    description: 'Own 3 businesses at the same time.',
    icon: '🏭',
    condition: (state) => state.ownedBusinesses.length >= 3,
    reward: { xp: 400, reputation: 15 },
  },

  // --- Level Milestones ---
  {
    id: 'level-5',
    name: 'Getting Started',
    description: 'Reach level 5.',
    icon: '⭐',
    condition: (state) => state.player.level >= 5,
    reward: { cash: 200 },
  },
  {
    id: 'level-10',
    name: 'Experienced',
    description: 'Reach level 10.',
    icon: '🌟',
    condition: (state) => state.player.level >= 10,
    reward: { cash: 500 },
  },
  {
    id: 'level-25',
    name: 'Seasoned Veteran',
    description: 'Reach level 25.',
    icon: '🔥',
    condition: (state) => state.player.level >= 25,
    reward: { cash: 2000 },
  },
  {
    id: 'level-50',
    name: 'Living Legend',
    description: 'Reach level 50.',
    icon: '🏆',
    condition: (state) => state.player.level >= 50,
    reward: { cash: 10000, reputation: 20 },
  },

  // --- Skill Milestones ---
  {
    id: 'skill-master',
    name: 'Skill Master',
    description: 'Max out any single skill to level 10.',
    icon: '🎓',
    condition: (state) => Object.values(state.player.skills).some((s) => s.level >= 10),
    reward: { xp: 200 },
  },
  {
    id: 'jack-of-all-trades',
    name: 'Jack of All Trades',
    description: 'Raise all skills to at least level 5.',
    icon: '🎯',
    condition: (state) => Object.values(state.player.skills).every((s) => s.level >= 5),
    reward: { xp: 500, reputation: 10 },
  },

  // --- Longevity ---
  {
    id: '30-days',
    name: 'First Month',
    description: 'Survive your first 30 days.',
    icon: '📅',
    condition: (state) => state.player.totalDaysPlayed >= 30,
    reward: { xp: 30, mood: 10 },
  },
  {
    id: '365-days',
    name: 'One Year Anniversary',
    description: 'Play for a full 365 days.',
    icon: '🎉',
    condition: (state) => state.player.totalDaysPlayed >= 365,
    reward: { xp: 200, cash: 1000 },
  },

  // --- Reputation ---
  {
    id: 'max-reputation',
    name: 'Public Figure',
    description: 'Reach 100 reputation.',
    icon: '🌍',
    condition: (state) => state.player.reputation >= 100,
    reward: { xp: 300, cash: 2000 },
  },
];

export const achievementsById: Record<string, Achievement> = Object.fromEntries(
  achievements.map((a) => [a.id, a]),
);
