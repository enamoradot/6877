import type { OwnedBusiness, OwnedCar, OwnedProperty } from '../types';
import type { Business } from '../types';
import type { Property } from '../types';
import type { Car } from '../types';
import { propertiesById } from '../data/properties';
import { carsById } from '../data/cars';
import { businessesById } from '../data/businesses';
import { jobsById } from '../data/jobs';

interface EconomyState {
  player: { cash: number };
  currentJobId: string | null;
  ownedProperties: OwnedProperty[];
  ownedCars: OwnedCar[];
  ownedBusinesses: OwnedBusiness[];
  housingRentCost: number;
  time: { day: number };
}

export function calculateNetWorth(state: EconomyState): number {
  let total = state.player.cash;

  for (const op of state.ownedProperties) {
    const prop = propertiesById[op.propertyId];
    if (prop) {
      total += calculatePropertyValue(prop, op, state.time.day);
    }
  }

  for (const oc of state.ownedCars) {
    const car = carsById[oc.carId];
    if (car) {
      total += calculateCarValue(car, oc, state.time.day);
    }
  }

  for (const ob of state.ownedBusinesses) {
    const biz = businessesById[ob.businessId];
    if (biz) {
      total += biz.startupCost * (ob.level / biz.level) * 0.7;
    }
  }

  return Math.round(total);
}

export function calculateDailyIncome(state: EconomyState): number {
  let income = 0;

  if (state.currentJobId) {
    const job = jobsById[state.currentJobId];
    if (job) {
      income += job.salary;
    }
  }

  for (const ob of state.ownedBusinesses) {
    const biz = businessesById[ob.businessId];
    if (biz) {
      income += calculateBusinessRevenue(biz, ob) / 30;
    }
  }

  for (const op of state.ownedProperties) {
    if (op.isRented) {
      const prop = propertiesById[op.propertyId];
      if (prop) {
        income += prop.incomeIfRented / 30;
      }
    }
  }

  return Math.round(income);
}

export function calculateDailyExpenses(state: EconomyState): number {
  let expenses = 0;

  expenses += state.housingRentCost / 30;

  for (const oc of state.ownedCars) {
    const car = carsById[oc.carId];
    if (car) {
      expenses += car.fuelCostPerDay;
      expenses += (car.maintenanceCostPerMonth + car.insuranceCostPerMonth) / 30;
    }
  }

  for (const ob of state.ownedBusinesses) {
    const biz = businessesById[ob.businessId];
    if (biz) {
      expenses += (biz.operatingCost + ob.employees * biz.employeeCost) / 30;
    }
  }

  for (const op of state.ownedProperties) {
    const prop = propertiesById[op.propertyId];
    if (prop) {
      expenses += prop.maintenanceCost / 30;
    }
  }

  return Math.round(expenses);
}

export function calculateBusinessRevenue(business: Business, owned: OwnedBusiness): number {
  const levelMultiplier = 1 + (owned.level - 1) * 0.3;
  const employeeMultiplier = 1 + owned.employees * 0.1;
  const satisfactionMultiplier = owned.customerSatisfaction / 100;
  const reputationMultiplier = 0.5 + (owned.reputation / 100) * 0.5;

  return Math.round(
    business.baseRevenue * levelMultiplier * employeeMultiplier * satisfactionMultiplier * reputationMultiplier
  );
}

export function calculatePropertyValue(
  property: Property,
  owned: OwnedProperty,
  currentDay: number
): number {
  const monthsOwned = Math.max(0, (currentDay - owned.purchasedDay) / 30);
  const appreciation = Math.pow(1 + property.appreciationRate, monthsOwned);
  const conditionFactor = owned.condition / 100;
  return Math.round(owned.purchasedPrice * appreciation * conditionFactor);
}

export function calculateCarValue(
  car: Car,
  owned: OwnedCar,
  currentDay: number
): number {
  const daysOwned = Math.max(0, currentDay - owned.purchasedDay);
  const yearsOwned = daysOwned / 365;

  let depreciationRate: number;
  if (yearsOwned <= 1) {
    depreciationRate = 0.10 * yearsOwned;
  } else {
    depreciationRate = 0.10 + 0.05 * (yearsOwned - 1);
  }

  depreciationRate = Math.min(depreciationRate, 0.70);

  const conditionFactor = owned.condition / 100;
  const baseValue = owned.purchasedPrice * (1 - depreciationRate);

  return Math.round(Math.max(baseValue * conditionFactor, owned.purchasedPrice * 0.05));
}
