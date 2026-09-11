import type { RandomEvent } from '../types';

export const events: RandomEvent[] = [
  // --- 1. Investment Opportunity ---
  {
    id: 'investment-opportunity',
    title: 'Investment Opportunity',
    description: 'A friend tells you about a promising startup looking for early investors. It could double your money or go bust.',
    choices: [
      { label: 'Invest $2,000', effects: { cash: -2000, xp: 30, skillXp: { investment: 20 } } },
      { label: 'Invest $500 (small stake)', effects: { cash: -500, xp: 15, skillXp: { investment: 10 } } },
      { label: 'Pass on it', effects: { mood: -5 } },
    ],
    minDay: 10,
    maxDay: 9999,
    minLevel: 2,
  },

  // --- 2. Car Breakdown ---
  {
    id: 'car-breakdown',
    title: 'Car Breakdown',
    description: 'Your car makes a horrible grinding noise and stops in the middle of the road.',
    choices: [
      { label: 'Pay for repairs ($400)', effects: { cash: -400, mood: -10, energy: -10 } },
      { label: 'Try to fix it yourself', effects: { energy: -25, mood: -5, skillXp: { tech: 15 } } },
      { label: 'Ignore it for now', effects: { mood: -15, health: -5 } },
    ],
    minDay: 5,
    maxDay: 9999,
    minLevel: 1,
    requiredConditions: (state) => state.ownedCars.length > 0,
  },

  // --- 3. Rent Increase ---
  {
    id: 'rent-increase',
    title: 'Rent Increase Notice',
    description: 'Your landlord is raising the rent by $200 per month starting next month.',
    choices: [
      { label: 'Accept the increase', effects: { mood: -15 } },
      { label: 'Negotiate (risky)', effects: { mood: -5, skillXp: { communication: 15 } } },
      { label: 'Start looking to move', effects: { energy: -20, mood: -10, xp: 10 } },
    ],
    minDay: 15,
    maxDay: 9999,
    minLevel: 1,
    requiredConditions: (state) => state.rentedHousingId !== null,
  },

  // --- 4. Job Offer ---
  {
    id: 'job-offer-competitor',
    title: 'Job Offer from a Competitor',
    description: 'A rival company offers you a position with a $200 signing bonus. Do you take it?',
    choices: [
      { label: 'Accept the offer', effects: { cash: 200, xp: 25, mood: 10, reputation: 5 } },
      { label: 'Decline politely', effects: { reputation: 3, mood: 5 } },
      { label: 'Use it to negotiate a raise', effects: { xp: 15, skillXp: { communication: 15, sales: 10 } } },
    ],
    minDay: 20,
    maxDay: 9999,
    minLevel: 3,
    requiredConditions: (state) => state.currentJobId !== null,
  },

  // --- 5. Business Partnership ---
  {
    id: 'business-partnership',
    title: 'Business Partnership Proposal',
    description: 'An experienced entrepreneur wants to partner with you on a new venture. They bring connections but want 50% equity.',
    choices: [
      { label: 'Accept the partnership', effects: { cash: -1000, xp: 40, reputation: 10, skillXp: { leadership: 15, management: 10 } } },
      { label: 'Counter with 30% equity', effects: { xp: 20, skillXp: { communication: 15, sales: 10 } } },
      { label: 'Decline', effects: { mood: -5 } },
    ],
    minDay: 30,
    maxDay: 9999,
    minLevel: 5,
  },

  // --- 6. Market Crash ---
  {
    id: 'market-crash',
    title: 'Market Crash',
    description: 'The stock market takes a nosedive. Property values and business revenues are affected. What do you do?',
    choices: [
      { label: 'Sell assets at a loss', effects: { cash: 500, mood: -20, reputation: -5 } },
      { label: 'Hold and ride it out', effects: { mood: -10, xp: 20, skillXp: { investment: 15 } } },
      { label: 'Buy the dip ($3,000)', effects: { cash: -3000, xp: 40, skillXp: { investment: 25 } } },
    ],
    minDay: 60,
    maxDay: 9999,
    minLevel: 5,
  },

  // --- 7. Found Money ---
  {
    id: 'found-money',
    title: 'Lucky Find',
    description: 'You find a wallet on the ground with $300 cash and no ID inside.',
    choices: [
      { label: 'Keep the money', effects: { cash: 300, mood: 10, reputation: -5 } },
      { label: 'Turn it in to police', effects: { reputation: 10, mood: 15, xp: 10 } },
      { label: 'Take half, leave half', effects: { cash: 150, mood: 5 } },
    ],
    minDay: 1,
    maxDay: 9999,
    minLevel: 1,
  },

  // --- 8. Tax Audit ---
  {
    id: 'tax-audit',
    title: 'Tax Audit',
    description: 'The tax authority has flagged your account for an audit. You might owe back taxes.',
    choices: [
      { label: 'Hire an accountant ($500)', effects: { cash: -500, mood: -5, xp: 15 } },
      { label: 'Handle it yourself', effects: { energy: -30, mood: -15, skillXp: { management: 15 } } },
      { label: 'Ignore the notice (risky)', effects: { cash: -800, reputation: -10, mood: -20 } },
    ],
    minDay: 30,
    maxDay: 9999,
    minLevel: 3,
  },

  // --- 9. Employee Quits ---
  {
    id: 'employee-quits',
    title: 'Key Employee Quits',
    description: 'Your best employee just handed in their resignation. They say morale is low.',
    choices: [
      { label: 'Offer a raise to stay ($800)', effects: { cash: -800, mood: -5, reputation: 5 } },
      { label: 'Wish them well and hire new', effects: { energy: -15, mood: -10, xp: 10 } },
      { label: 'Promote from within', effects: { xp: 20, skillXp: { leadership: 15, management: 10 } } },
    ],
    minDay: 20,
    maxDay: 9999,
    minLevel: 3,
    requiredConditions: (state) => state.ownedBusinesses.length > 0,
  },

  // --- 10. Customer Complaint ---
  {
    id: 'customer-complaint',
    title: 'Viral Customer Complaint',
    description: 'A customer posts a scathing review online that starts going viral. Your business reputation is at stake.',
    choices: [
      { label: 'Offer a full refund and apology', effects: { cash: -200, reputation: 5, mood: -5 } },
      { label: 'Respond professionally online', effects: { reputation: 3, xp: 15, skillXp: { communication: 15 } } },
      { label: 'Ignore it', effects: { reputation: -15, mood: -10 } },
    ],
    minDay: 15,
    maxDay: 9999,
    minLevel: 2,
    requiredConditions: (state) => state.ownedBusinesses.length > 0,
  },

  // --- 11. Inheritance ---
  {
    id: 'inheritance',
    title: 'Unexpected Inheritance',
    description: 'A distant relative has passed away and left you a modest inheritance.',
    choices: [
      { label: 'Accept gratefully ($5,000)', effects: { cash: 5000, mood: 5, xp: 10 } },
      { label: 'Accept and invest it', effects: { cash: 3000, xp: 25, skillXp: { investment: 20 } } },
      { label: 'Donate to charity', effects: { reputation: 15, mood: 20, xp: 15 } },
    ],
    minDay: 40,
    maxDay: 9999,
    minLevel: 1,
  },

  // --- 12. Lawsuit ---
  {
    id: 'lawsuit',
    title: 'Lawsuit Filed Against You',
    description: 'Someone has filed a lawsuit claiming damages from an incident at your property or business.',
    choices: [
      { label: 'Settle out of court ($2,000)', effects: { cash: -2000, mood: -10, reputation: -5 } },
      { label: 'Hire a lawyer and fight ($1,000)', effects: { cash: -1000, energy: -20, xp: 25, skillXp: { communication: 10 } } },
      { label: 'Represent yourself', effects: { energy: -30, mood: -20, skillXp: { communication: 20 } } },
    ],
    minDay: 30,
    maxDay: 9999,
    minLevel: 3,
    requiredConditions: (state) => state.ownedProperties.length > 0 || state.ownedBusinesses.length > 0,
  },

  // --- 13. Natural Disaster ---
  {
    id: 'natural-disaster',
    title: 'Storm Damage',
    description: 'A severe storm has caused damage to one of your properties. Repairs are needed urgently.',
    choices: [
      { label: 'Pay for full repairs ($1,500)', effects: { cash: -1500, mood: -10 } },
      { label: 'Do partial repairs ($600)', effects: { cash: -600, mood: -15 } },
      { label: 'File an insurance claim', effects: { energy: -15, mood: -5, xp: 15 } },
    ],
    minDay: 20,
    maxDay: 9999,
    minLevel: 2,
    requiredConditions: (state) => state.ownedProperties.length > 0,
  },

  // --- 14. New Competitor ---
  {
    id: 'new-competitor',
    title: 'New Competitor Opens Nearby',
    description: 'A well-funded competitor has opened right next to your business. Customer traffic is dipping.',
    choices: [
      { label: 'Launch a marketing campaign ($800)', effects: { cash: -800, reputation: 10, xp: 20, skillXp: { sales: 15 } } },
      { label: 'Lower prices temporarily', effects: { cash: -400, reputation: 5, mood: -10 } },
      { label: 'Focus on quality and wait', effects: { mood: -5, xp: 15, skillXp: { management: 10, leadership: 5 } } },
    ],
    minDay: 25,
    maxDay: 9999,
    minLevel: 3,
    requiredConditions: (state) => state.ownedBusinesses.length > 0,
  },

  // --- 15. Celebrity Endorsement ---
  {
    id: 'celebrity-endorsement',
    title: 'Celebrity Endorsement Offer',
    description: 'A local celebrity offers to endorse your business for a fee. It could be huge for brand awareness.',
    choices: [
      { label: 'Accept ($3,000)', effects: { cash: -3000, reputation: 20, mood: 15, xp: 30 } },
      { label: 'Negotiate a lower fee', effects: { cash: -1500, reputation: 10, xp: 20, skillXp: { communication: 15, sales: 10 } } },
      { label: 'Decline', effects: { mood: -5 } },
    ],
    minDay: 40,
    maxDay: 9999,
    minLevel: 5,
    requiredConditions: (state) => state.ownedBusinesses.length > 0,
  },

  // --- 16. Government Grant ---
  {
    id: 'government-grant',
    title: 'Government Grant Opportunity',
    description: 'The government is offering small business grants. The application process is long but the reward is worth it.',
    choices: [
      { label: 'Apply for the grant', effects: { cash: 4000, energy: -25, xp: 30, skillXp: { management: 15 } } },
      { label: 'Hire someone to apply ($500)', effects: { cash: 3500, xp: 15 } },
      { label: 'Skip it (too much paperwork)', effects: { mood: 5 } },
    ],
    minDay: 30,
    maxDay: 9999,
    minLevel: 4,
    requiredConditions: (state) => state.ownedBusinesses.length > 0,
  },

  // --- 17. Stock Tip ---
  {
    id: 'stock-tip',
    title: 'Hot Stock Tip',
    description: 'A friend who works in finance whispers about a stock about to surge. It could be insider trading, or just gossip.',
    choices: [
      { label: 'Invest $1,000', effects: { cash: -1000, xp: 20, skillXp: { investment: 15 } } },
      { label: 'Invest $3,000 (go big)', effects: { cash: -3000, xp: 35, skillXp: { investment: 25 } } },
      { label: 'Report it and walk away', effects: { reputation: 10, mood: 5, xp: 10 } },
    ],
    minDay: 15,
    maxDay: 9999,
    minLevel: 3,
  },

  // --- 18. Property Renovation ---
  {
    id: 'property-renovation',
    title: 'Property Renovation Opportunity',
    description: 'A contractor offers to renovate one of your properties at a discounted rate. It would boost its value significantly.',
    choices: [
      { label: 'Full renovation ($3,000)', effects: { cash: -3000, xp: 25, reputation: 5 } },
      { label: 'Partial renovation ($1,200)', effects: { cash: -1200, xp: 15 } },
      { label: 'Decline (save the money)', effects: { mood: -5 } },
    ],
    minDay: 20,
    maxDay: 9999,
    minLevel: 3,
    requiredConditions: (state) => state.ownedProperties.length > 0,
  },

  // --- 19. Training Scholarship ---
  {
    id: 'training-scholarship',
    title: 'Professional Training Scholarship',
    description: 'You have been selected for a subsidized professional development course. It takes time but the skills are valuable.',
    choices: [
      { label: 'Enroll in management track', effects: { energy: -20, xp: 40, skillXp: { management: 30, leadership: 15 } } },
      { label: 'Enroll in tech track', effects: { energy: -20, xp: 40, skillXp: { tech: 30 } } },
      { label: 'Decline (too busy)', effects: { mood: -5 } },
    ],
    minDay: 25,
    maxDay: 9999,
    minLevel: 4,
  },

  // --- 20. Mystery Business Deal ---
  {
    id: 'mystery-deal',
    title: 'Mystery Business Deal',
    description: 'A stranger in an expensive suit approaches you with a once-in-a-lifetime deal. It sounds almost too good to be true.',
    choices: [
      { label: 'Go all in ($5,000)', effects: { cash: -5000, xp: 50, mood: -10 } },
      { label: 'Invest cautiously ($1,000)', effects: { cash: -1000, xp: 25 } },
      { label: 'Walk away (trust your gut)', effects: { mood: 10, reputation: 5, xp: 10 } },
    ],
    minDay: 15,
    maxDay: 9999,
    minLevel: 2,
  },

  // --- 21. Health Scare ---
  {
    id: 'health-scare',
    title: 'Health Scare',
    description: 'You feel dizzy and nauseous after a long week. Might be nothing, or it might be serious.',
    choices: [
      { label: 'Visit the doctor ($200)', effects: { cash: -200, health: 20, mood: 10, energy: -10 } },
      { label: 'Rest at home', effects: { energy: -15, health: 10, mood: -5 } },
      { label: 'Push through it', effects: { health: -15, mood: -10, energy: -20 } },
    ],
    minDay: 5,
    maxDay: 9999,
    minLevel: 1,
  },

  // --- 22. Networking Event ---
  {
    id: 'networking-event',
    title: 'Exclusive Networking Event',
    description: 'You receive an invite to an exclusive industry networking event. The right connections could change everything.',
    choices: [
      { label: 'Attend ($300 ticket)', effects: { cash: -300, reputation: 10, xp: 25, skillXp: { communication: 15, leadership: 10 } } },
      { label: 'Attend and bring business cards', effects: { cash: -300, reputation: 15, xp: 30, skillXp: { communication: 20, sales: 10 } } },
      { label: 'Skip it', effects: { mood: -5 } },
    ],
    minDay: 20,
    maxDay: 9999,
    minLevel: 3,
  },
];

export const eventsById: Record<string, RandomEvent> = Object.fromEntries(
  events.map((e) => [e.id, e]),
);
