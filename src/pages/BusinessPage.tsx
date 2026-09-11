import React, { useState } from 'react';
import { Building2, Filter, Users, TrendingUp, DollarSign } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { businesses } from '../data/businesses';
import { formatMoney } from '../utils/format';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import type { BusinessType, SkillId } from '../types';

const businessTypes: { value: BusinessType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'store', label: 'Store' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'tech', label: 'Tech' },
  { value: 'realEstate', label: 'Real Estate' },
  { value: 'transport', label: 'Transport' },
];

export const BusinessPage: React.FC = () => {
  const {
    player,
    ownedBusinesses,
    startBusiness,
    hireEmployee,
    fireEmployee,
    upgradeBusiness,
  } = useGameStore();
  const [filter, setFilter] = useState<BusinessType | 'all'>('all');

  const meetsRequirements = (biz: typeof businesses[0]) => {
    if (player.cash < biz.startupCost) return false;
    for (const [skillId, level] of Object.entries(biz.requiredSkills)) {
      if ((player.skills[skillId as SkillId]?.level ?? 0) < (level ?? 0)) return false;
    }
    return true;
  };

  const myBusinesses = ownedBusinesses.map((ob) => ({
    owned: ob,
    data: businesses.find((b) => b.id === ob.businessId)!,
  })).filter((b) => b.data);

  const availableBusinesses = businesses
    .filter((b) => !ownedBusinesses.some((ob) => ob.businessId === b.id))
    .filter((b) => filter === 'all' || b.type === filter);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <Building2 className="w-6 h-6" /> Businesses
      </h1>

      {/* My businesses */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
          My Businesses ({myBusinesses.length})
        </h2>
        {myBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myBusinesses.map(({ owned, data }) => (
              <div
                key={owned.businessId}
                className="bg-[var(--bg-card)] border border-[var(--accent)] rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-lg font-bold text-[var(--text-primary)]">{data.name}</p>
                    <Badge variant="accent" size="sm">{data.type}</Badge>
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-tertiary)]">Lv.{owned.level}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-[var(--success)]" />
                    <span className="text-[var(--text-secondary)]">Revenue:</span>
                    <span className="font-semibold text-[var(--success)]">{formatMoney(owned.revenue)}/mo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-[var(--danger)]" />
                    <span className="text-[var(--text-secondary)]">Expenses:</span>
                    <span className="font-semibold text-[var(--danger)]">{formatMoney(owned.expenses)}/mo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-[var(--info)]" />
                    <span className="text-[var(--text-secondary)]">Employees:</span>
                    <span className="font-semibold">{owned.employees}/{data.maxEmployees}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-[var(--text-secondary)]">Profit: </span>
                    <span className={`font-bold ${owned.revenue - owned.expenses >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                      {formatMoney(owned.revenue - owned.expenses)}/mo
                    </span>
                  </div>
                </div>

                {/* Satisfaction bar */}
                <div className="mt-3">
                  <ProgressBar
                    value={owned.customerSatisfaction}
                    max={100}
                    color="var(--warning)"
                    size="sm"
                    label="Customer Satisfaction"
                    showLabel
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {owned.employees < data.maxEmployees && (
                    <button
                      onClick={() => hireEmployee(data.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all"
                    >
                      Hire (+{formatMoney(data.employeeCost)}/mo)
                    </button>
                  )}
                  {owned.employees > 0 && (
                    <button
                      onClick={() => fireEmployee(data.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--danger)] hover:border-[var(--danger)] transition-all"
                    >
                      Fire Employee
                    </button>
                  )}
                  <button
                    onClick={() => upgradeBusiness(data.id)}
                    disabled={player.cash < data.upgradeCost}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    Upgrade ({formatMoney(data.upgradeCost)})
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-8 text-center">
            <Building2 className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3 opacity-40" />
            <p className="text-[var(--text-tertiary)]">No businesses yet - start one below!</p>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        <Filter className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
        {businessTypes.map((bt) => (
          <button
            key={bt.value}
            onClick={() => setFilter(bt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filter === bt.value
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)]'
            }`}
          >
            {bt.label}
          </button>
        ))}
      </div>

      {/* Available businesses */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
          Start New Business ({availableBusinesses.length})
        </h2>
        {availableBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableBusinesses.map((biz) => {
              const qualified = meetsRequirements(biz);
              return (
                <div
                  key={biz.id}
                  className={`bg-[var(--bg-card)] border rounded-xl p-4 transition-all ${
                    qualified ? 'border-[var(--border)] hover:border-[var(--accent)]' : 'border-[var(--border)] opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-bold text-[var(--text-primary)]">{biz.name}</p>
                    <Badge variant="default" size="sm">{biz.type}</Badge>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)]">{biz.description}</p>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--money)]">
                      Startup: {formatMoney(biz.startupCost)}
                    </span>
                    <span>Revenue: {formatMoney(biz.baseRevenue)}/mo</span>
                    <span>Operating: {formatMoney(biz.operatingCost)}/mo</span>
                    <span>Max Staff: {biz.maxEmployees}</span>
                  </div>
                  {Object.keys(biz.requiredSkills).length > 0 && (
                    <div className="mt-2 text-xs text-[var(--text-tertiary)]">
                      <span className="font-medium">Requires: </span>
                      {Object.entries(biz.requiredSkills).map(([skill, lvl]) => (
                        <span
                          key={skill}
                          className={
                            (player.skills[skill as SkillId]?.level ?? 0) >= (lvl ?? 0)
                              ? 'text-[var(--success)]'
                              : 'text-[var(--danger)]'
                          }
                        >
                          {skill} Lv.{lvl}{' '}
                        </span>
                      ))}
                    </div>
                  )}
                  {qualified ? (
                    <button
                      onClick={() => startBusiness(biz.id)}
                      className="mt-3 w-full py-2 rounded-lg font-semibold text-sm text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      Start Business ({formatMoney(biz.startupCost)})
                    </button>
                  ) : (
                    <p className="mt-3 text-center text-xs text-[var(--danger)] font-medium py-2">
                      {player.cash < biz.startupCost ? 'Not enough cash' : 'Requirements not met'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-[var(--text-tertiary)]">
            <p>No more businesses available in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};
