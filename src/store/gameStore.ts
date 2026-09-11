import { create } from 'zustand';
import type {
  PlayerState,
  TimeState,
  SkillId,
  SkillState,
  OwnedProperty,
  OwnedCar,
  OwnedBusiness,
  Notification,
  NotificationType,
  FinanceRecord,
  RandomEvent,
  GameSpeed,
  EventEffects,
} from '../types';
import { jobsById } from '../data/jobs';
import { propertiesById } from '../data/properties';
import { carsById } from '../data/cars';
import { businessesById } from '../data/businesses';
import { activities as activitiesData } from '../data/activities';
import { events } from '../data/events';
import { achievements } from '../data/achievements';
import { generateId, pickRandom, percentChance } from '../utils/helpers';
import { clamp, getTimePeriod } from '../utils/format';
import {
  calculatePropertyValue,
  calculateCarValue,
  calculateBusinessRevenue,
} from '../systems/economySystem';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeSkill(id: SkillId, name: string): SkillState {
  return { id, name, level: 1, xp: 0, xpToNextLevel: 50 };
}

function initialSkills(): Record<SkillId, SkillState> {
  return {
    communication: makeSkill('communication', 'Communication'),
    management: makeSkill('management', 'Management'),
    sales: makeSkill('sales', 'Sales'),
    tech: makeSkill('tech', 'Technology'),
    leadership: makeSkill('leadership', 'Leadership'),
    investment: makeSkill('investment', 'Investment'),
    fitness: makeSkill('fitness', 'Fitness'),
  };
}

function initialPlayerState(): PlayerState {
  return {
    name: 'Player',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    cash: 500,
    netWorth: 500,
    energy: 80,
    mood: 60,
    hunger: 50,
    health: 80,
    reputation: 10,
    skills: initialSkills(),
    day: 1,
    totalDaysPlayed: 0,
  };
}

function initialTimeState(): TimeState {
  return {
    hour: 8,
    period: 'morning',
    day: 1,
    month: 1,
    year: 2024,
    dayOfWeek: 0,
    isPaused: false,
    speed: 1,
  };
}

// ---------------------------------------------------------------------------
// Store interface
// ---------------------------------------------------------------------------

export interface GameStore {
  // State
  player: PlayerState;
  time: TimeState;
  currentJobId: string | null;
  ownedProperties: OwnedProperty[];
  ownedCars: OwnedCar[];
  ownedBusinesses: OwnedBusiness[];
  activeHousingId: string | null;
  rentedHousingId: string | null;
  housingRentCost: number;
  achievements: string[];
  notifications: Notification[];
  financeHistory: FinanceRecord[];
  isGameOver: boolean;
  hasStarted: boolean;
  onboardingStep: number;
  activeEvent: RandomEvent | null;

  // Player actions
  startGame: (name: string) => void;
  addCash: (amount: number, category: string, description: string) => void;
  spendCash: (amount: number, category: string, description: string) => boolean;
  addXp: (amount: number) => void;
  modifyEnergy: (amount: number) => void;
  modifyMood: (amount: number) => void;
  modifyHunger: (amount: number) => void;
  modifyHealth: (amount: number) => void;
  modifyReputation: (amount: number) => void;
  addSkillXp: (skillId: SkillId, amount: number) => void;
  updateNetWorth: () => void;

  // Time actions
  advanceTime: (hours: number) => void;
  setSpeed: (speed: GameSpeed) => void;
  togglePause: () => void;

  // Job actions
  setJob: (jobId: string) => void;
  work: () => void;
  quitJob: () => void;

  // Property actions
  buyProperty: (propertyId: string) => void;
  sellProperty: (propertyId: string) => void;
  rentHousing: (propertyId: string) => void;
  moveToOwned: (propertyId: string) => void;
  upgradeProperty: (propertyId: string) => void;
  toggleRentOut: (propertyId: string) => void;

  // Car actions
  buyCar: (carId: string) => void;
  sellCar: (carId: string) => void;
  maintainCar: (carId: string) => void;

  // Activity actions
  doActivity: (activityId: string) => void;

  // Business actions
  startBusiness: (businessId: string) => void;
  hireEmployee: (businessId: string) => void;
  fireEmployee: (businessId: string) => void;
  upgradeBusiness: (businessId: string) => void;
  collectBusinessRevenue: () => void;

  // Daily processing
  processDailyExpenses: () => void;
  processMonthlyExpenses: () => void;
  checkRandomEvent: () => void;
  processBusinesses: () => void;
  checkAchievements: () => void;

  // Event actions
  triggerEvent: (eventId: string) => void;
  resolveEvent: (choiceIndex: number) => void;

  // Notification actions
  addNotification: (message: string, type: NotificationType) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;

  // Save/Load
  saveGame: () => void;
  loadGame: () => boolean;
  resetGame: () => void;
  autoSave: () => void;

  // Onboarding
  nextOnboardingStep: () => void;
  skipOnboarding: () => void;

  // Computed
  getDailyIncome: () => number;
  getDailyExpenses: () => number;
  getPropertyValue: (propertyId: string) => number;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useGameStore = create<GameStore>()((set, get) => ({
  // ===== Initial State =====
  player: initialPlayerState(),
  time: initialTimeState(),
  currentJobId: null,
  ownedProperties: [],
  ownedCars: [],
  ownedBusinesses: [],
  activeHousingId: null,
  rentedHousingId: null,
  housingRentCost: 0,
  achievements: [],
  notifications: [],
  financeHistory: [],
  isGameOver: false,
  hasStarted: false,
  onboardingStep: 0,
  activeEvent: null,

  // ===== Player Actions =====

  startGame: (name: string) => {
    set({
      player: { ...initialPlayerState(), name },
      hasStarted: true,
      onboardingStep: -1,
    });
  },

  addCash: (amount: number, category: string, description: string) => {
    set((state) => {
      const newCash = state.player.cash + amount;
      const record: FinanceRecord = {
        day: state.time.day,
        month: state.time.month,
        year: state.time.year,
        type: 'income',
        category,
        amount,
        description,
      };
      return {
        player: {
          ...state.player,
          cash: newCash,
          netWorth: state.player.netWorth + amount,
        },
        financeHistory: [...state.financeHistory, record],
      };
    });
  },

  spendCash: (amount: number, category: string, description: string): boolean => {
    const state = get();
    if (state.player.cash < amount) return false;
    set((s) => {
      const record: FinanceRecord = {
        day: s.time.day,
        month: s.time.month,
        year: s.time.year,
        type: 'expense',
        category,
        amount,
        description,
      };
      return {
        player: {
          ...s.player,
          cash: s.player.cash - amount,
          netWorth: s.player.netWorth - amount,
        },
        financeHistory: [...s.financeHistory, record],
      };
    });
    return true;
  },

  addXp: (amount: number) => {
    set((state) => {
      let { xp, level, xpToNextLevel, energy } = state.player;
      xp += amount;
      while (xp >= xpToNextLevel) {
        xp -= xpToNextLevel;
        level += 1;
        xpToNextLevel = level * 100 + 50;
        energy = clamp(energy + 20, 0, 100);
      }
      return {
        player: { ...state.player, xp, level, xpToNextLevel, energy },
      };
    });
  },

  modifyEnergy: (amount: number) => {
    set((state) => ({
      player: {
        ...state.player,
        energy: clamp(state.player.energy + amount, 0, 100),
      },
    }));
  },

  modifyMood: (amount: number) => {
    set((state) => ({
      player: {
        ...state.player,
        mood: clamp(state.player.mood + amount, 0, 100),
      },
    }));
  },

  modifyHunger: (amount: number) => {
    set((state) => {
      const newHunger = clamp(state.player.hunger + amount, 0, 100);
      let health = state.player.health;
      if (newHunger > 90) {
        health = clamp(health - 2, 0, 100);
      }
      return {
        player: { ...state.player, hunger: newHunger, health },
      };
    });
  },

  modifyHealth: (amount: number) => {
    set((state) => {
      const newHealth = clamp(state.player.health + amount, 0, 100);
      if (newHealth <= 0) {
        return {
          player: { ...state.player, health: 0 },
          isGameOver: true,
        };
      }
      return {
        player: { ...state.player, health: newHealth },
      };
    });
  },

  modifyReputation: (amount: number) => {
    set((state) => ({
      player: {
        ...state.player,
        reputation: clamp(state.player.reputation + amount, 0, 100),
      },
    }));
  },

  addSkillXp: (skillId: SkillId, amount: number) => {
    set((state) => {
      const skill = { ...state.player.skills[skillId] };
      skill.xp += amount;
      while (skill.xp >= skill.xpToNextLevel) {
        skill.xp -= skill.xpToNextLevel;
        skill.level += 1;
        skill.xpToNextLevel = skill.level * 50 + 25;
      }
      return {
        player: {
          ...state.player,
          skills: { ...state.player.skills, [skillId]: skill },
        },
      };
    });
  },

  updateNetWorth: () => {
    set((state) => {
      let netWorth = state.player.cash;

      for (const op of state.ownedProperties) {
        const prop = propertiesById[op.propertyId];
        if (prop) {
          netWorth += calculatePropertyValue(prop, op, state.player.totalDaysPlayed);
        }
      }

      for (const oc of state.ownedCars) {
        const car = carsById[oc.carId];
        if (car) {
          netWorth += calculateCarValue(car, oc, state.player.totalDaysPlayed);
        }
      }

      for (const ob of state.ownedBusinesses) {
        const biz = businessesById[ob.businessId];
        if (biz) {
          netWorth += biz.startupCost * (ob.level / biz.level) * 0.7;
        }
      }

      return {
        player: { ...state.player, netWorth: Math.round(netWorth) },
      };
    });
  },

  // ===== Time Actions =====

  advanceTime: (hours: number) => {
    set((state) => {
      let { hour, day, month, year, dayOfWeek } = state.time;
      let newPlayer = { ...state.player };
      let shouldProcessDaily = false;
      let shouldProcessMonthly = false;

      hour += hours;

      while (hour >= 24) {
        hour -= 24;
        day += 1;
        dayOfWeek = (dayOfWeek + 1) % 7;
        newPlayer.totalDaysPlayed += 1;
        newPlayer.day = day;
        shouldProcessDaily = true;

        // Hunger increases and energy decreases each day
        newPlayer.hunger = clamp(newPlayer.hunger + 10, 0, 100);
        newPlayer.energy = clamp(newPlayer.energy - 5, 0, 100);

        // High hunger drains health
        if (newPlayer.hunger > 90) {
          newPlayer.health = clamp(newPlayer.health - 3, 0, 100);
        }

        if (day > 30) {
          day = 1;
          month += 1;
          shouldProcessMonthly = true;
          if (month > 12) {
            month = 1;
            year += 1;
          }
        }
      }

      const period = getTimePeriod(hour);

      if (newPlayer.health <= 0) {
        return {
          time: { ...state.time, hour, period, day, month, year, dayOfWeek },
          player: { ...newPlayer, health: 0 },
          isGameOver: true,
        };
      }

      return {
        time: { ...state.time, hour, period, day, month, year, dayOfWeek },
        player: newPlayer,
        _shouldProcessDaily: shouldProcessDaily,
        _shouldProcessMonthly: shouldProcessMonthly,
      };
    });

    // Post-update processing
    const state = get();
    const fullState = state as GameStore & {
      _shouldProcessDaily?: boolean;
      _shouldProcessMonthly?: boolean;
    };

    if (fullState._shouldProcessDaily) {
      state.processDailyExpenses();
      state.processBusinesses();
      state.collectBusinessRevenue();
      state.checkRandomEvent();
      state.checkAchievements();
      state.updateNetWorth();

      // Auto-save every 5 game days
      if (state.player.totalDaysPlayed > 0 && state.player.totalDaysPlayed % 5 === 0) {
        state.autoSave();
      }
    }
    if (fullState._shouldProcessMonthly) {
      state.processMonthlyExpenses();
    }
  },

  setSpeed: (speed: GameSpeed) => {
    set((state) => ({
      time: { ...state.time, speed },
    }));
  },

  togglePause: () => {
    set((state) => ({
      time: { ...state.time, isPaused: !state.time.isPaused },
    }));
  },

  // ===== Job Actions =====

  setJob: (jobId: string) => {
    set({ currentJobId: jobId });
    get().addNotification(
      `Started working as ${jobsById[jobId]?.name ?? 'Unknown'}!`,
      'success',
    );
  },

  work: () => {
    const state = get();
    if (!state.currentJobId) return;
    const job = jobsById[state.currentJobId];
    if (!job) return;
    if (state.player.energy < job.energyCost) {
      state.addNotification('Too tired to work! Rest first.', 'warning');
      return;
    }

    state.advanceTime(job.hoursPerShift);
    state.addCash(job.salary, 'salary', `Shift at ${job.name}`);
    state.modifyEnergy(-job.energyCost);
    state.addXp(job.xpReward);

    for (const [skillId, xpAmount] of Object.entries(job.skillXpRewards)) {
      if (xpAmount) {
        state.addSkillXp(skillId as SkillId, xpAmount);
      }
    }

    state.addNotification(`Worked a shift at ${job.name} and earned $${job.salary}!`, 'money');
  },

  quitJob: () => {
    const state = get();
    const jobName = state.currentJobId ? jobsById[state.currentJobId]?.name : 'your job';
    set({ currentJobId: null });
    get().addNotification(`Quit ${jobName}.`, 'info');
  },

  // ===== Property Actions =====

  buyProperty: (propertyId: string) => {
    const state = get();
    const prop = propertiesById[propertyId];
    if (!prop) return;

    if (!state.spendCash(prop.purchasePrice, 'property', `Purchased ${prop.name}`)) {
      state.addNotification('Not enough cash to buy this property!', 'warning');
      return;
    }

    const owned: OwnedProperty = {
      propertyId,
      purchasedPrice: prop.purchasePrice,
      purchasedDay: state.player.totalDaysPlayed,
      isRented: false,
      rentIncome: 0,
      condition: prop.condition,
    };

    set((s) => ({
      ownedProperties: [...s.ownedProperties, owned],
    }));
    get().updateNetWorth();
    get().addNotification(`Purchased ${prop.name}!`, 'success');
  },

  sellProperty: (propertyId: string) => {
    const state = get();
    const owned = state.ownedProperties.find((p) => p.propertyId === propertyId);
    if (!owned) return;
    const prop = propertiesById[propertyId];
    if (!prop) return;

    const value = calculatePropertyValue(prop, owned, state.player.totalDaysPlayed);

    set((s) => ({
      ownedProperties: s.ownedProperties.filter((p) => p.propertyId !== propertyId),
      activeHousingId: s.activeHousingId === propertyId ? null : s.activeHousingId,
    }));

    get().addCash(value, 'property', `Sold ${prop.name}`);
    get().updateNetWorth();
    get().addNotification(`Sold ${prop.name} for $${value.toLocaleString()}!`, 'money');
  },

  rentHousing: (propertyId: string) => {
    const prop = propertiesById[propertyId];
    if (!prop) return;

    set({
      rentedHousingId: propertyId,
      housingRentCost: prop.rentPrice,
      activeHousingId: null,
    });
    get().addNotification(`Now renting ${prop.name} for $${prop.rentPrice}/month.`, 'info');
  },

  moveToOwned: (propertyId: string) => {
    const state = get();
    const owned = state.ownedProperties.find((p) => p.propertyId === propertyId);
    if (!owned) return;

    // Can't live in a property you're renting out
    if (owned.isRented) {
      state.addNotification('Stop renting it out before moving in!', 'warning');
      return;
    }

    set({
      activeHousingId: propertyId,
      rentedHousingId: null,
      housingRentCost: 0,
    });
    const prop = propertiesById[propertyId];
    get().addNotification(`Moved into ${prop?.name ?? 'your property'}!`, 'success');
  },

  upgradeProperty: (propertyId: string) => {
    const state = get();
    const prop = propertiesById[propertyId];
    if (!prop) return;
    const owned = state.ownedProperties.find((p) => p.propertyId === propertyId);
    if (!owned) return;

    if (!state.spendCash(prop.upgradeCost, 'property', `Upgraded ${prop.name}`)) {
      state.addNotification('Not enough cash to upgrade!', 'warning');
      return;
    }

    set((s) => ({
      ownedProperties: s.ownedProperties.map((p) =>
        p.propertyId === propertyId
          ? { ...p, condition: clamp(p.condition + 15, 0, 100) }
          : p,
      ),
    }));
    get().addNotification(`Upgraded ${prop.name}!`, 'success');
  },

  toggleRentOut: (propertyId: string) => {
    const state = get();
    if (state.activeHousingId === propertyId) {
      state.addNotification("Can't rent out the property you live in!", 'warning');
      return;
    }
    const prop = propertiesById[propertyId];

    set((s) => ({
      ownedProperties: s.ownedProperties.map((p) =>
        p.propertyId === propertyId
          ? {
              ...p,
              isRented: !p.isRented,
              rentIncome: !p.isRented ? (prop?.incomeIfRented ?? 0) : 0,
            }
          : p,
      ),
    }));

    const owned = get().ownedProperties.find((p) => p.propertyId === propertyId);
    if (owned?.isRented) {
      get().addNotification(`Now renting out ${prop?.name}!`, 'success');
    } else {
      get().addNotification(`Stopped renting out ${prop?.name}.`, 'info');
    }
  },

  // ===== Car Actions =====

  buyCar: (carId: string) => {
    const state = get();
    const car = carsById[carId];
    if (!car) return;

    if (!state.spendCash(car.purchasePrice, 'car', `Purchased ${car.name}`)) {
      state.addNotification('Not enough cash to buy this car!', 'warning');
      return;
    }

    const owned: OwnedCar = {
      carId,
      purchasedPrice: car.purchasePrice,
      purchasedDay: state.player.totalDaysPlayed,
      condition: car.condition,
      fuelLevel: 100,
    };

    set((s) => ({ ownedCars: [...s.ownedCars, owned] }));
    get().updateNetWorth();
    get().addNotification(`Purchased ${car.name}!`, 'success');
  },

  sellCar: (carId: string) => {
    const state = get();
    const owned = state.ownedCars.find((c) => c.carId === carId);
    if (!owned) return;
    const car = carsById[carId];
    if (!car) return;

    const value = calculateCarValue(car, owned, state.player.totalDaysPlayed);

    set((s) => ({
      ownedCars: s.ownedCars.filter((c) => c.carId !== carId),
    }));
    get().addCash(value, 'car', `Sold ${car.name}`);
    get().updateNetWorth();
    get().addNotification(`Sold ${car.name} for $${value.toLocaleString()}!`, 'money');
  },

  maintainCar: (carId: string) => {
    const state = get();
    const car = carsById[carId];
    if (!car) return;

    const cost = Math.round(car.maintenanceCostPerMonth * 0.5);
    if (!state.spendCash(cost, 'car', `Maintained ${car.name}`)) {
      state.addNotification('Not enough cash for car maintenance!', 'warning');
      return;
    }

    set((s) => ({
      ownedCars: s.ownedCars.map((c) =>
        c.carId === carId
          ? { ...c, condition: clamp(c.condition + 20, 0, 100) }
          : c,
      ),
    }));
    get().addNotification(`Maintained ${car.name}. Condition improved!`, 'success');
  },

  // ===== Activity Actions =====

  doActivity: (activityId: string) => {
    const state = get();
    const activity = activitiesData.find(a => a.id === activityId);
    if (!activity) return;
    if (state.player.energy < activity.energyCost) {
      get().addNotification('Not enough energy for this activity!', 'warning');
      return;
    }
    if (activity.cost > 0 && state.player.cash < activity.cost) {
      get().addNotification('Not enough money for this activity!', 'warning');
      return;
    }
    if (activity.cost > 0) {
      get().spendCash(activity.cost, 'activity', activity.name);
    }
    if (activity.energyCost > 0) get().modifyEnergy(-activity.energyCost);
    if (activity.moodEffect !== 0) get().modifyMood(activity.moodEffect);
    if (activity.hungerEffect !== 0) get().modifyHunger(-activity.hungerEffect);
    if (activity.healthEffect !== 0) get().modifyHealth(activity.healthEffect);
    if (activity.skillXp) {
      for (const [skillId, amount] of Object.entries(activity.skillXp)) {
        get().addSkillXp(skillId as SkillId, amount);
      }
    }
    get().advanceTime(activity.timeCost);
    get().addXp(5);
    get().addNotification(`Completed: ${activity.name}`, 'success');
  },

  // ===== Business Actions =====

  startBusiness: (businessId: string) => {
    const state = get();
    const biz = businessesById[businessId];
    if (!biz) return;

    if (!state.spendCash(biz.startupCost, 'business', `Started ${biz.name}`)) {
      state.addNotification('Not enough cash to start this business!', 'warning');
      return;
    }

    const owned: OwnedBusiness = {
      businessId,
      employees: 0,
      level: 1,
      customerSatisfaction: biz.customerSatisfaction,
      reputation: biz.reputation,
      revenue: 0,
      expenses: 0,
      daysProfitable: 0,
      daysUnprofitable: 0,
    };

    set((s) => ({ ownedBusinesses: [...s.ownedBusinesses, owned] }));
    get().updateNetWorth();
    get().addNotification(`Started ${biz.name}!`, 'success');
  },

  hireEmployee: (businessId: string) => {
    const state = get();
    const owned = state.ownedBusinesses.find((b) => b.businessId === businessId);
    if (!owned) return;
    const biz = businessesById[businessId];
    if (!biz) return;

    if (owned.employees >= biz.maxEmployees) {
      state.addNotification('Maximum employees reached!', 'warning');
      return;
    }

    const hireCost = Math.round(biz.employeeCost * 0.5);
    if (!state.spendCash(hireCost, 'business', `Hired employee at ${biz.name}`)) {
      state.addNotification('Not enough cash to hire!', 'warning');
      return;
    }

    set((s) => ({
      ownedBusinesses: s.ownedBusinesses.map((b) =>
        b.businessId === businessId
          ? { ...b, employees: b.employees + 1 }
          : b,
      ),
    }));
    get().addNotification(`Hired a new employee at ${biz.name}!`, 'success');
  },

  fireEmployee: (businessId: string) => {
    const state = get();
    const owned = state.ownedBusinesses.find((b) => b.businessId === businessId);
    if (!owned || owned.employees <= 0) return;

    set((s) => ({
      ownedBusinesses: s.ownedBusinesses.map((b) =>
        b.businessId === businessId
          ? { ...b, employees: b.employees - 1 }
          : b,
      ),
    }));
    const biz = businessesById[businessId];
    get().addNotification(`Fired an employee at ${biz?.name}.`, 'info');
  },

  upgradeBusiness: (businessId: string) => {
    const state = get();
    const biz = businessesById[businessId];
    if (!biz) return;
    const owned = state.ownedBusinesses.find((b) => b.businessId === businessId);
    if (!owned) return;

    const cost = biz.upgradeCost * owned.level;
    if (!state.spendCash(cost, 'business', `Upgraded ${biz.name}`)) {
      state.addNotification('Not enough cash to upgrade business!', 'warning');
      return;
    }

    set((s) => ({
      ownedBusinesses: s.ownedBusinesses.map((b) =>
        b.businessId === businessId
          ? { ...b, level: b.level + 1 }
          : b,
      ),
    }));
    get().updateNetWorth();
    get().addNotification(`Upgraded ${biz.name} to level ${owned.level + 1}!`, 'success');
  },

  collectBusinessRevenue: () => {
    const state = get();
    for (const owned of state.ownedBusinesses) {
      const biz = businessesById[owned.businessId];
      if (!biz) continue;

      const monthlyRevenue = calculateBusinessRevenue(biz, owned);
      const dailyRevenue = Math.round(monthlyRevenue / 30);
      const dailyExpenses = Math.round(
        (biz.operatingCost + owned.employees * biz.employeeCost) / 30,
      );
      const dailyProfit = dailyRevenue - dailyExpenses;

      if (dailyProfit > 0) {
        get().addCash(dailyProfit, 'business', `Revenue from ${biz.name}`);
      } else if (dailyProfit < 0) {
        get().spendCash(Math.abs(dailyProfit), 'business', `Operating loss at ${biz.name}`);
      }

      set((s) => ({
        ownedBusinesses: s.ownedBusinesses.map((b) =>
          b.businessId === owned.businessId
            ? {
                ...b,
                revenue: dailyRevenue,
                expenses: dailyExpenses,
                daysProfitable:
                  dailyProfit > 0 ? b.daysProfitable + 1 : b.daysProfitable,
                daysUnprofitable:
                  dailyProfit <= 0 ? b.daysUnprofitable + 1 : b.daysUnprofitable,
              }
            : b,
        ),
      }));
    }
  },

  // ===== Daily Processing =====

  processDailyExpenses: () => {
    const state = get();

    // Housing rent (daily portion)
    if (state.housingRentCost > 0) {
      const dailyRent = Math.round(state.housingRentCost / 30);
      if (dailyRent > 0) {
        get().spendCash(dailyRent, 'housing', 'Daily rent');
      }
    }

    // Car fuel costs
    for (const oc of state.ownedCars) {
      const car = carsById[oc.carId];
      if (car) {
        get().spendCash(car.fuelCostPerDay, 'car', `Fuel for ${car.name}`);
      }
    }

    // Rental income from owned properties
    for (const op of state.ownedProperties) {
      if (op.isRented) {
        const prop = propertiesById[op.propertyId];
        if (prop) {
          const dailyIncome = Math.round(prop.incomeIfRented / 30);
          get().addCash(dailyIncome, 'rental', `Rent from ${prop.name}`);
        }
      }
    }

    // Property condition degrades slowly
    set((s) => ({
      ownedProperties: s.ownedProperties.map((p) => ({
        ...p,
        condition: clamp(p.condition - 0.1, 0, 100),
      })),
    }));

    // Car condition degrades
    set((s) => ({
      ownedCars: s.ownedCars.map((c) => ({
        ...c,
        condition: clamp(c.condition - 0.2, 0, 100),
      })),
    }));
  },

  processMonthlyExpenses: () => {
    const state = get();

    // Property maintenance
    for (const op of state.ownedProperties) {
      const prop = propertiesById[op.propertyId];
      if (prop) {
        get().spendCash(prop.maintenanceCost, 'property', `Maintenance for ${prop.name}`);
      }
    }

    // Car insurance + maintenance
    for (const oc of state.ownedCars) {
      const car = carsById[oc.carId];
      if (car) {
        const monthlyCar = car.maintenanceCostPerMonth + car.insuranceCostPerMonth;
        get().spendCash(monthlyCar, 'car', `Monthly costs for ${car.name}`);
      }
    }

    get().addNotification('Monthly bills processed.', 'info');
  },

  checkRandomEvent: () => {
    const state = get();
    if (state.activeEvent) return;
    if (!percentChance(20)) return;

    const eligible = events.filter((e) => {
      if (state.player.totalDaysPlayed < e.minDay) return false;
      if (state.player.totalDaysPlayed > e.maxDay) return false;
      if (state.player.level < e.minLevel) return false;
      if (e.requiredConditions) {
        // Build a GameState-like object for the condition check
        const gameState = {
          player: state.player,
          time: state.time,
          currentJobId: state.currentJobId,
          ownedProperties: state.ownedProperties,
          ownedCars: state.ownedCars,
          ownedBusinesses: state.ownedBusinesses,
          activeHousingId: state.activeHousingId,
          rentedHousingId: state.rentedHousingId,
          housingRentCost: state.housingRentCost,
          achievements: new Set(state.achievements),
          notifications: state.notifications,
          financeHistory: state.financeHistory,
          isGameOver: state.isGameOver,
          hasStarted: state.hasStarted,
          onboardingStep: state.onboardingStep,
        };
        if (!e.requiredConditions(gameState)) return false;
      }
      return true;
    });

    if (eligible.length === 0) return;

    const event = pickRandom(eligible);
    set({ activeEvent: event });
    get().addNotification(`Event: ${event.title}`, 'info');
  },

  processBusinesses: () => {
    set((state) => ({
      ownedBusinesses: state.ownedBusinesses.map((b) => {
        // Random satisfaction drift
        const drift = (Math.random() - 0.5) * 6;
        const employeeBonus = b.employees * 0.5;
        return {
          ...b,
          customerSatisfaction: clamp(
            b.customerSatisfaction + drift + employeeBonus * 0.1,
            10,
            100,
          ),
          reputation: clamp(
            b.reputation + (b.customerSatisfaction > 60 ? 0.2 : -0.3),
            0,
            100,
          ),
        };
      }),
    }));
  },

  checkAchievements: () => {
    const state = get();
    const currentAchievements = new Set(state.achievements);
    const newAchievements: string[] = [];

    // Build GameState-like for condition checks
    const gameState = {
      player: state.player,
      time: state.time,
      currentJobId: state.currentJobId,
      ownedProperties: state.ownedProperties,
      ownedCars: state.ownedCars,
      ownedBusinesses: state.ownedBusinesses,
      activeHousingId: state.activeHousingId,
      rentedHousingId: state.rentedHousingId,
      housingRentCost: state.housingRentCost,
      achievements: currentAchievements,
      notifications: state.notifications,
      financeHistory: state.financeHistory,
      isGameOver: state.isGameOver,
      hasStarted: state.hasStarted,
      onboardingStep: state.onboardingStep,
    };

    for (const ach of achievements) {
      if (currentAchievements.has(ach.id)) continue;
      try {
        if (ach.condition(gameState)) {
          newAchievements.push(ach.id);

          // Apply rewards
          if (ach.reward) {
            if (ach.reward.xp) get().addXp(ach.reward.xp);
            if (ach.reward.cash) get().addCash(ach.reward.cash, 'achievement', ach.name);
            if (ach.reward.mood) get().modifyMood(ach.reward.mood);
            if (ach.reward.reputation) get().modifyReputation(ach.reward.reputation);
            if (ach.reward.energy) get().modifyEnergy(ach.reward.energy);
            if (ach.reward.health) get().modifyHealth(ach.reward.health);
          }

          get().addNotification(`Achievement unlocked: ${ach.name}!`, 'achievement');
        }
      } catch {
        // Skip broken conditions silently
      }
    }

    if (newAchievements.length > 0) {
      set((s) => ({
        achievements: [...s.achievements, ...newAchievements],
      }));
    }
  },

  // ===== Event Actions =====

  triggerEvent: (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      set({ activeEvent: event });
    }
  },

  resolveEvent: (choiceIndex: number) => {
    const state = get();
    if (!state.activeEvent) return;

    const choice = state.activeEvent.choices[choiceIndex];
    if (!choice) {
      set({ activeEvent: null });
      return;
    }

    const effects: EventEffects = choice.effects;

    if (effects.cash) {
      if (effects.cash > 0) {
        get().addCash(effects.cash, 'event', state.activeEvent.title);
      } else {
        get().spendCash(Math.abs(effects.cash), 'event', state.activeEvent.title);
      }
    }
    if (effects.xp) get().addXp(effects.xp);
    if (effects.energy) get().modifyEnergy(effects.energy);
    if (effects.mood) get().modifyMood(effects.mood);
    if (effects.hunger) get().modifyHunger(effects.hunger);
    if (effects.health) get().modifyHealth(effects.health);
    if (effects.reputation) get().modifyReputation(effects.reputation);

    if (effects.skillXp) {
      for (const [skillId, amount] of Object.entries(effects.skillXp)) {
        if (amount) {
          get().addSkillXp(skillId as SkillId, amount);
        }
      }
    }

    set({ activeEvent: null });
    get().addNotification(
      `Resolved: ${state.activeEvent.title} - ${choice.label}`,
      'info',
    );
  },

  // ===== Notification Actions =====

  addNotification: (message: string, type: NotificationType) => {
    const notification: Notification = {
      id: generateId(),
      message,
      type,
      timestamp: Date.now(),
      read: false,
    };
    set((state) => ({
      notifications: [...state.notifications.slice(-49), notification],
    }));
  },

  dismissNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  // ===== Save / Load =====

  saveGame: () => {
    try {
      const state = get();
      const saveData = {
        player: state.player,
        time: state.time,
        currentJobId: state.currentJobId,
        ownedProperties: state.ownedProperties,
        ownedCars: state.ownedCars,
        ownedBusinesses: state.ownedBusinesses,
        activeHousingId: state.activeHousingId,
        rentedHousingId: state.rentedHousingId,
        housingRentCost: state.housingRentCost,
        achievements: state.achievements,
        financeHistory: state.financeHistory.slice(-200),
        onboardingStep: state.onboardingStep,
      };
      localStorage.setItem('lifeSimSave', JSON.stringify(saveData));
    } catch {
      // localStorage not available or full
    }
  },

  loadGame: (): boolean => {
    try {
      const raw = localStorage.getItem('lifeSimSave');
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data || !data.player) return false;

      set({
        player: data.player,
        time: data.time,
        currentJobId: data.currentJobId ?? null,
        ownedProperties: data.ownedProperties ?? [],
        ownedCars: data.ownedCars ?? [],
        ownedBusinesses: data.ownedBusinesses ?? [],
        activeHousingId: data.activeHousingId ?? null,
        rentedHousingId: data.rentedHousingId ?? null,
        housingRentCost: data.housingRentCost ?? 0,
        achievements: data.achievements ?? [],
        financeHistory: data.financeHistory ?? [],
        onboardingStep: data.onboardingStep ?? -1,
        hasStarted: true,
        isGameOver: false,
        notifications: [],
        activeEvent: null,
      });
      return true;
    } catch {
      return false;
    }
  },

  resetGame: () => {
    try {
      localStorage.removeItem('lifeSimSave');
    } catch {
      // Ignore
    }
    set({
      player: initialPlayerState(),
      time: initialTimeState(),
      currentJobId: null,
      ownedProperties: [],
      ownedCars: [],
      ownedBusinesses: [],
      activeHousingId: null,
      rentedHousingId: null,
      housingRentCost: 0,
      achievements: [],
      notifications: [],
      financeHistory: [],
      isGameOver: false,
      hasStarted: false,
      onboardingStep: 0,
      activeEvent: null,
    });
  },

  autoSave: () => {
    get().saveGame();
  },

  // ===== Onboarding =====

  nextOnboardingStep: () => {
    set((state) => ({
      onboardingStep: state.onboardingStep + 1,
    }));
  },

  skipOnboarding: () => {
    set({ onboardingStep: -1 });
  },

  // ===== Computed =====

  getDailyIncome: (): number => {
    const state = get();
    let income = 0;

    if (state.currentJobId) {
      const job = jobsById[state.currentJobId];
      if (job) income += job.salary;
    }

    for (const ob of state.ownedBusinesses) {
      const biz = businessesById[ob.businessId];
      if (biz) {
        income += Math.round(calculateBusinessRevenue(biz, ob) / 30);
      }
    }

    for (const op of state.ownedProperties) {
      if (op.isRented) {
        const prop = propertiesById[op.propertyId];
        if (prop) income += Math.round(prop.incomeIfRented / 30);
      }
    }

    return income;
  },

  getDailyExpenses: (): number => {
    const state = get();
    let expenses = 0;

    if (state.housingRentCost > 0) {
      expenses += Math.round(state.housingRentCost / 30);
    }

    for (const oc of state.ownedCars) {
      const car = carsById[oc.carId];
      if (car) {
        expenses += car.fuelCostPerDay;
        expenses += Math.round(
          (car.maintenanceCostPerMonth + car.insuranceCostPerMonth) / 30,
        );
      }
    }

    for (const ob of state.ownedBusinesses) {
      const biz = businessesById[ob.businessId];
      if (biz) {
        expenses += Math.round(
          (biz.operatingCost + ob.employees * biz.employeeCost) / 30,
        );
      }
    }

    for (const op of state.ownedProperties) {
      const prop = propertiesById[op.propertyId];
      if (prop) {
        expenses += Math.round(prop.maintenanceCost / 30);
      }
    }

    return expenses;
  },

  getPropertyValue: (propertyId: string): number => {
    const state = get();
    const owned = state.ownedProperties.find((p) => p.propertyId === propertyId);
    if (!owned) return 0;
    const prop = propertiesById[propertyId];
    if (!prop) return 0;
    return calculatePropertyValue(prop, owned, state.player.totalDaysPlayed);
  },
}));
