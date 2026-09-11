import React, { useState } from 'react';
import { Car, Filter, Wrench, Fuel, Shield } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { cars } from '../data/cars';
import { formatMoney } from '../utils/format';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import type { CarCategory } from '../types';

const carCategories: { value: CarCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'economy', label: 'Economy' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'sports', label: 'Sports' },
  { value: 'suv', label: 'SUV' },
];

const categoryBadgeVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent'> = {
  economy: 'default',
  sedan: 'info',
  luxury: 'accent',
  sports: 'warning',
  suv: 'success',
};

export const CarsPage: React.FC = () => {
  const { player, ownedCars, buyCar, sellCar, maintainCar } = useGameStore();
  const [filter, setFilter] = useState<CarCategory | 'all'>('all');

  const myCars = ownedCars.map((oc) => ({
    owned: oc,
    data: cars.find((c) => c.id === oc.carId)!,
  })).filter((c) => c.data);

  const availableCars = cars
    .filter((c) => !ownedCars.some((oc) => oc.carId === c.id))
    .filter((c) => filter === 'all' || c.category === filter);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <Car className="w-6 h-6" /> Cars
      </h1>

      {/* My cars */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
          My Cars ({myCars.length})
        </h2>
        {myCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myCars.map(({ owned, data }) => (
              <div
                key={data.id}
                className="bg-[var(--bg-card)] border border-[var(--accent)] rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-lg font-bold text-[var(--text-primary)]">{data.name}</p>
                  <Badge variant={categoryBadgeVariant[data.category] || 'default'} size="sm">
                    {data.category}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--text-tertiary)]">{data.description}</p>

                {/* Condition bar */}
                <div className="mt-3">
                  <ProgressBar
                    value={owned.condition}
                    max={100}
                    color={owned.condition > 60 ? 'var(--success)' : owned.condition > 30 ? 'var(--warning)' : 'var(--danger)'}
                    size="sm"
                    label="Condition"
                    showLabel
                  />
                </div>

                <div className="flex flex-wrap gap-3 mt-3 text-xs text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3 h-3" /> {formatMoney(data.fuelCostPerDay)}/day
                  </span>
                  <span className="flex items-center gap-1">
                    <Wrench className="w-3 h-3" /> {formatMoney(data.maintenanceCostPerMonth)}/mo
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> {formatMoney(data.insuranceCostPerMonth)}/mo
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => maintainCar(data.id)}
                    disabled={owned.condition >= 95}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Maintain
                  </button>
                  <button
                    onClick={() => sellCar(data.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--danger)] bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--danger)] transition-all"
                  >
                    Sell ({formatMoney(data.resaleValue)})
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-8 text-center">
            <Car className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3 opacity-40" />
            <p className="text-[var(--text-tertiary)]">No cars owned yet - visit the dealership!</p>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        <Filter className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
        {carCategories.map((cc) => (
          <button
            key={cc.value}
            onClick={() => setFilter(cc.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filter === cc.value
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)]'
            }`}
          >
            {cc.label}
          </button>
        ))}
      </div>

      {/* Dealership */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
          Dealership ({availableCars.length})
        </h2>
        {availableCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableCars.map((car) => {
              const canAfford = player.cash >= car.purchasePrice;
              const monthlyCost = car.maintenanceCostPerMonth + car.insuranceCostPerMonth + car.fuelCostPerDay * 30;
              return (
                <div
                  key={car.id}
                  className={`bg-[var(--bg-card)] border rounded-xl p-4 transition-all ${
                    canAfford ? 'border-[var(--border)] hover:border-[var(--accent)]' : 'border-[var(--border)] opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-bold text-[var(--text-primary)]">{car.name}</p>
                    <Badge variant={categoryBadgeVariant[car.category] || 'default'} size="sm">
                      {car.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)]">{car.description}</p>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--money)]">{formatMoney(car.purchasePrice)}</span>
                    <span>~{formatMoney(monthlyCost)}/mo costs</span>
                    <span>Speed +{car.speedBonus}</span>
                    <span>Prestige +{car.prestigeBonus}</span>
                  </div>
                  {canAfford ? (
                    <button
                      onClick={() => buyCar(car.id)}
                      className="mt-3 w-full py-2 rounded-lg font-semibold text-sm text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      Buy ({formatMoney(car.purchasePrice)})
                    </button>
                  ) : (
                    <p className="mt-3 text-center text-xs text-[var(--danger)] font-medium py-2">
                      Not enough cash
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-4 text-[var(--text-tertiary)]">No cars match this filter</p>
        )}
      </div>
    </div>
  );
};
