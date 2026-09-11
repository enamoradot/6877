// ============================================================
// Life Simulation Game — Master Type Definitions
// ============================================================

// --- Skill System ---

export type SkillId =
  | 'communication'
  | 'management'
  | 'sales'
  | 'tech'
  | 'leadership'
  | 'investment'
  | 'fitness';

export interface SkillState {
  id: SkillId;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

// --- Player ---

export interface PlayerState {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  cash: number;
  netWorth: number;
  energy: number;   // 0-100
  mood: number;      // 0-100
  hunger: number;    // 0-100 (100 = full, 0 = starving)
  health: number;    // 0-100
  reputation: number; // 0-100
  skills: Record<SkillId, SkillState>;
  day: number;
  totalDaysPlayed: number;
}

// --- Time ---

export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';
export type GameSpeed = 1 | 2 | 5;

export interface TimeState {
  hour: number;       // 0-23
  period: TimePeriod;
  day: number;        // 1-30
  month: number;      // 1-12
  year: number;
  dayOfWeek: number;  // 0-6, 0 = Monday
  isPaused: boolean;
  speed: GameSpeed;
}

// --- Jobs ---

export type JobCategory = 'entry' | 'skilled' | 'professional' | 'executive';

export interface Job {
  id: string;
  name: string;
  description: string;
  salary: number; // per shift
  hoursPerShift: number;
  requiredSkills: Partial<Record<SkillId, number>>;
  requiredLevel: number;
  xpReward: number;
  skillXpRewards: Partial<Record<SkillId, number>>;
  stressLevel: number; // 1-5
  energyCost: number;
  promotionJobId?: string;
  category: JobCategory;
}

// --- Properties ---

export type PropertyType = 'apartment' | 'house' | 'villa' | 'commercial';

export interface Property {
  id: string;
  name: string;
  description: string;
  type: PropertyType;
  purchasePrice: number;
  rentPrice: number;       // monthly rent to live there
  maintenanceCost: number; // monthly
  incomeIfRented: number;  // monthly income if player rents it out
  appreciationRate: number; // per month multiplier
  condition: number;       // 0-100
  level: number;           // 1-5
  upgradeCost: number;
}

export interface OwnedProperty {
  propertyId: string;
  purchasedPrice: number;
  purchasedDay: number;
  isRented: boolean;       // rented out by player to tenants
  rentIncome: number;
  condition: number;
}

// --- Cars ---

export type CarCategory = 'economy' | 'sedan' | 'luxury' | 'sports' | 'suv';

export interface Car {
  id: string;
  name: string;
  description: string;
  category: CarCategory;
  purchasePrice: number;
  resaleValue: number;
  fuelCostPerDay: number;
  maintenanceCostPerMonth: number;
  insuranceCostPerMonth: number;
  condition: number;  // 0-100
  speedBonus: number;
  prestigeBonus: number;
}

export interface OwnedCar {
  carId: string;
  purchasedPrice: number;
  purchasedDay: number;
  condition: number;
  fuelLevel: number; // 0-100
}

// --- Businesses ---

export type BusinessType =
  | 'store'
  | 'cafe'
  | 'realEstate'
  | 'tech'
  | 'transport'
  | 'restaurant';

export interface Business {
  id: string;
  name: string;
  description: string;
  type: BusinessType;
  startupCost: number;
  employeeCost: number;   // per employee per month
  operatingCost: number;  // fixed monthly
  baseRevenue: number;    // monthly
  customerSatisfaction: number; // 0-100 starting
  reputation: number;     // 0-100 starting
  level: number;          // 1-5
  upgradeCost: number;
  requiredSkills: Partial<Record<SkillId, number>>;
  maxEmployees: number;
}

export interface OwnedBusiness {
  businessId: string;
  employees: number;
  level: number;
  customerSatisfaction: number;
  reputation: number;
  revenue: number;
  expenses: number;
  daysProfitable: number;
  daysUnprofitable: number;
}

// --- Events ---

export interface EventEffects {
  cash?: number;
  xp?: number;
  energy?: number;
  mood?: number;
  hunger?: number;
  health?: number;
  reputation?: number;
  skillXp?: Partial<Record<SkillId, number>>;
  unlockJob?: string;
  unlockBusiness?: string;
}

export interface EventChoice {
  label: string;
  effects: EventEffects;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
  minDay: number;
  maxDay: number;
  minLevel: number;
  requiredConditions?: (state: GameState) => boolean;
}

// --- Achievements ---

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (state: GameState) => boolean;
  reward?: EventEffects;
}

// --- Notifications ---

export type NotificationType =
  | 'success'
  | 'warning'
  | 'info'
  | 'achievement'
  | 'money';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timestamp: number;
  read: boolean;
}

// --- Finance ---

export type FinanceType = 'income' | 'expense';

export interface FinanceRecord {
  day: number;
  month: number;
  year: number;
  type: FinanceType;
  category: string;
  amount: number;
  description: string;
}

// --- Activities ---

export interface Activity {
  id: string;
  name: string;
  description: string;
  energyCost: number;
  timeCost: number; // hours
  moodEffect: number;
  hungerEffect: number;
  healthEffect: number;
  cost: number;
  skillXp?: Partial<Record<SkillId, number>>;
  available?: (state: GameState) => boolean;
}

// --- Game State (root) ---

export interface GameState {
  player: PlayerState;
  time: TimeState;
  currentJobId: string | null;
  ownedProperties: OwnedProperty[];
  ownedCars: OwnedCar[];
  ownedBusinesses: OwnedBusiness[];
  activeHousingId: string | null;   // propertyId where player lives
  rentedHousingId: string | null;   // propertyId player rents (doesn't own)
  housingRentCost: number;
  achievements: Set<string>;
  notifications: Notification[];
  financeHistory: FinanceRecord[];
  isGameOver: boolean;
  hasStarted: boolean;
  onboardingStep: number;
}
