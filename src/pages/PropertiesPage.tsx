import React, { useState } from 'react';
import { Home, Filter, Key, TrendingUp } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { properties } from '../data/properties';
import { formatMoney } from '../utils/format';
import { Badge } from '../components/common/Badge';
import type { PropertyType } from '../types';

const propertyTypes: { value: PropertyType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'apartment', label: 'Apartments' },
  { value: 'house', label: 'Houses' },
  { value: 'villa', label: 'Villas' },
  { value: 'commercial', label: 'Commercial' },
];

const typeBadgeVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent'> = {
  apartment: 'default',
  house: 'info',
  villa: 'accent',
  commercial: 'success',
};

export const PropertiesPage: React.FC = () => {
  const {
    player,
    ownedProperties,
    activeHousingId,
    rentedHousingId,
    housingRentCost,
    buyProperty,
    sellProperty,
    rentHousing,
    moveToOwned,
    upgradeProperty,
    toggleRentOut,
  } = useGameStore();
  const [filter, setFilter] = useState<PropertyType | 'all'>('all');

  const myProperties = ownedProperties.map((op) => ({
    owned: op,
    data: properties.find((p) => p.id === op.propertyId)!,
  })).filter((p) => p.data);

  const availableToBuy = properties
    .filter((p) => !ownedProperties.some((op) => op.propertyId === p.id))
    .filter((p) => filter === 'all' || p.type === filter);

  const availableToRent = properties
    .filter((p) => !ownedProperties.some((op) => op.propertyId === p.id))
    .filter((p) => p.type !== 'commercial')
    .filter((p) => filter === 'all' || p.type === filter);

  const rentedProperty = rentedHousingId ? properties.find((p) => p.id === rentedHousingId) : null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <Home className="w-6 h-6" /> Properties
      </h1>

      {/* Current housing */}
      {(activeHousingId || rentedHousingId) && (
        <div className="bg-[var(--bg-card)] border-2 border-[var(--accent)] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wide mb-2">
            Current Home
          </h2>
          {activeHousingId && (
            <p className="text-lg font-bold text-[var(--text-primary)]">
              {properties.find((p) => p.id === activeHousingId)?.name || 'Owned Property'}
              <span className="text-xs text-[var(--success)] ml-2">(Owned)</span>
            </p>
          )}
          {rentedHousingId && !activeHousingId && (
            <div>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {rentedProperty?.name || 'Rented Property'}
                <span className="text-xs text-[var(--warning)] ml-2">(Renting)</span>
              </p>
              <p className="text-sm text-[var(--text-tertiary)] mt-1">
                Rent: {formatMoney(housingRentCost)}/month
              </p>
            </div>
          )}
        </div>
      )}

      {/* My properties */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
          My Properties ({myProperties.length})
        </h2>
        {myProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myProperties.map(({ owned, data }) => {
              const isLivingHere = activeHousingId === data.id;
              const appreciation = data.purchasePrice * data.appreciationRate * (player.totalDaysPlayed - owned.purchasedDay + 1) / 30;
              const currentValue = owned.purchasedPrice + appreciation;
              return (
                <div
                  key={data.id}
                  className={`bg-[var(--bg-card)] border rounded-xl p-4 transition-all ${
                    isLivingHere ? 'border-[var(--accent)]' : 'border-[var(--border)]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-bold text-[var(--text-primary)]">{data.name}</p>
                    <Badge variant={typeBadgeVariant[data.type] || 'default'} size="sm">
                      {data.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)]">{data.description}</p>

                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-[var(--text-secondary)]">
                    <span>Bought: {formatMoney(owned.purchasedPrice)}</span>
                    <span className="flex items-center gap-1 text-[var(--success)]">
                      <TrendingUp className="w-3 h-3" /> ~{formatMoney(currentValue)}
                    </span>
                    <span>Maint: {formatMoney(data.maintenanceCost)}/mo</span>
                    {owned.isRented && (
                      <span className="text-[var(--money)]">Income: {formatMoney(owned.rentIncome)}/mo</span>
                    )}
                  </div>

                  {isLivingHere && (
                    <div className="mt-2">
                      <Badge variant="accent" size="sm">
                        <Key className="w-3 h-3 mr-1" /> Living Here
                      </Badge>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    {!isLivingHere && data.type !== 'commercial' && (
                      <button
                        onClick={() => moveToOwned(data.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all"
                      >
                        Move In
                      </button>
                    )}
                    <button
                      onClick={() => toggleRentOut(data.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        owned.isRented
                          ? 'bg-[var(--warning)] bg-opacity-10 border-[var(--warning)] text-[var(--warning)]'
                          : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]'
                      }`}
                    >
                      {owned.isRented ? 'Stop Renting Out' : 'Rent Out'}
                    </button>
                    <button
                      onClick={() => upgradeProperty(data.id)}
                      disabled={player.cash < data.upgradeCost}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      Upgrade ({formatMoney(data.upgradeCost)})
                    </button>
                    <button
                      onClick={() => sellProperty(data.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--danger)] bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--danger)] transition-all"
                    >
                      Sell
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-8 text-center">
            <Home className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3 opacity-40" />
            <p className="text-[var(--text-tertiary)]">No properties owned yet</p>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        <Filter className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
        {propertyTypes.map((pt) => (
          <button
            key={pt.value}
            onClick={() => setFilter(pt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filter === pt.value
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)]'
            }`}
          >
            {pt.label}
          </button>
        ))}
      </div>

      {/* Available to buy */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
          Available to Buy
        </h2>
        {availableToBuy.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableToBuy.map((prop) => {
              const canAfford = player.cash >= prop.purchasePrice;
              return (
                <div
                  key={prop.id}
                  className={`bg-[var(--bg-card)] border rounded-xl p-4 transition-all ${
                    canAfford ? 'border-[var(--border)] hover:border-[var(--accent)]' : 'border-[var(--border)] opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-bold text-[var(--text-primary)]">{prop.name}</p>
                    <Badge variant={typeBadgeVariant[prop.type] || 'default'} size="sm">
                      {prop.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)]">{prop.description}</p>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--money)]">{formatMoney(prop.purchasePrice)}</span>
                    <span>Maint: {formatMoney(prop.maintenanceCost)}/mo</span>
                    <span>Rent Income: {formatMoney(prop.incomeIfRented)}/mo</span>
                    <span>Appreciation: {(prop.appreciationRate * 100).toFixed(1)}%/mo</span>
                  </div>
                  {canAfford ? (
                    <button
                      onClick={() => buyProperty(prop.id)}
                      className="mt-3 w-full py-2 rounded-lg font-semibold text-sm text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      Buy ({formatMoney(prop.purchasePrice)})
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
          <p className="text-center py-4 text-[var(--text-tertiary)]">No properties match this filter</p>
        )}
      </div>

      {/* Available to rent */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
          Available to Rent
        </h2>
        {availableToRent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableToRent.map((prop) => {
              const isCurrentRental = rentedHousingId === prop.id;
              return (
                <div
                  key={prop.id}
                  className={`bg-[var(--bg-card)] border rounded-xl p-4 transition-all ${
                    isCurrentRental ? 'border-[var(--accent)]' : 'border-[var(--border)] hover:border-[var(--accent)]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-bold text-[var(--text-primary)]">{prop.name}</p>
                    <Badge variant={typeBadgeVariant[prop.type] || 'default'} size="sm">
                      {prop.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)]">{prop.description}</p>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--warning)]">{formatMoney(prop.rentPrice)}/month</span>
                  </div>
                  {isCurrentRental ? (
                    <p className="mt-3 text-center text-xs text-[var(--accent)] font-semibold py-2">
                      Currently Renting
                    </p>
                  ) : (
                    <button
                      onClick={() => rentHousing(prop.id)}
                      className="mt-3 w-full py-2 rounded-lg font-semibold text-sm bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all"
                    >
                      Rent ({formatMoney(prop.rentPrice)}/mo)
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-4 text-[var(--text-tertiary)]">No rentals match this filter</p>
        )}
      </div>
    </div>
  );
};
