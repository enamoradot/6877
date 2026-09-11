import React from 'react';
import { Building2, Users, ArrowUpCircle, UserPlus, UserMinus, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { formatMoney } from '../../utils/format';
import type { Business, OwnedBusiness, BusinessType, SkillId } from '../../types';

interface BusinessCardProps {
  business: Business;
  owned?: OwnedBusiness;
  onStart?: () => void;
  onHire?: () => void;
  onFire?: () => void;
  onUpgrade?: () => void;
  canAfford?: boolean;
}

const typeBadge: Record<BusinessType, { label: string; variant: 'default' | 'info' | 'accent' | 'warning' | 'success' }> = {
  store: { label: 'Store', variant: 'default' },
  cafe: { label: 'Cafe', variant: 'info' },
  restaurant: { label: 'Restaurant', variant: 'warning' },
  realEstate: { label: 'Real Estate', variant: 'accent' },
  tech: { label: 'Tech', variant: 'success' },
  transport: { label: 'Transport', variant: 'info' },
};

const skillNames: Record<SkillId, string> = {
  communication: 'Communication',
  management: 'Management',
  sales: 'Sales',
  tech: 'Tech',
  leadership: 'Leadership',
  investment: 'Investment',
  fitness: 'Fitness',
};

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  owned,
  onStart,
  onHire,
  onFire,
  onUpgrade,
  canAfford = false,
}) => {
  const typeInfo = typeBadge[business.type];
  const reqSkills = Object.entries(business.requiredSkills) as [SkillId, number][];

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 hover:shadow-md hover:border-[var(--border-hover)] transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-[var(--accent-bg)] flex-shrink-0">
            <Building2 className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] truncate">
              {business.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={typeInfo.variant} size="sm">{typeInfo.label}</Badge>
              {owned && <Badge variant="success" size="sm">Owned</Badge>}
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          {owned ? (
            <>
              <p className={`text-lg font-bold ${owned.revenue - owned.expenses >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                {formatMoney(owned.revenue - owned.expenses)}
              </p>
              <p className="text-[10px] text-[var(--text-tertiary)]">net/month</p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {formatMoney(business.startupCost)}
              </p>
              <p className="text-[10px] text-[var(--text-tertiary)]">startup cost</p>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
        {business.description}
      </p>

      {owned ? (
        <>
          {/* Revenue / Expenses */}
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-[var(--success-bg)]">
              <span className="text-[var(--text-tertiary)] flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[var(--success)]" />
                Revenue
              </span>
              <span className="font-semibold text-[var(--success)]">{formatMoney(owned.revenue)}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-[var(--danger-bg)]">
              <span className="text-[var(--text-tertiary)] flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-[var(--danger)]" />
                Expenses
              </span>
              <span className="font-semibold text-[var(--danger)]">{formatMoney(owned.expenses)}</span>
            </div>
          </div>

          {/* Employees */}
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
              <Users className="w-3.5 h-3.5" />
              Employees
            </span>
            <span className="font-semibold text-[var(--text-primary)]">
              {owned.employees} / {business.maxEmployees}
            </span>
          </div>

          {/* Satisfaction & reputation bars */}
          <div className="space-y-2 mt-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[var(--text-tertiary)]">Satisfaction</span>
                <span className="text-xs font-semibold text-[var(--text-primary)]">{Math.round(owned.customerSatisfaction)}%</span>
              </div>
              <ProgressBar
                value={owned.customerSatisfaction}
                max={100}
                color="var(--success)"
                size="sm"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[var(--text-tertiary)]">Reputation</span>
                <span className="text-xs font-semibold text-[var(--text-primary)]">{Math.round(owned.reputation)}%</span>
              </div>
              <ProgressBar
                value={owned.reputation}
                max={100}
                color="var(--accent)"
                size="sm"
              />
            </div>
          </div>

          {/* Level */}
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-[var(--text-tertiary)]">Level</span>
            <Badge variant="accent" size="sm">Lv.{owned.level}</Badge>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {onUpgrade && (
              <button
                onClick={onUpgrade}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
              >
                <ArrowUpCircle className="w-3.5 h-3.5" />
                Upgrade ({formatMoney(business.upgradeCost)})
              </button>
            )}
            {onHire && owned.employees < business.maxEmployees && (
              <button
                onClick={onHire}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--success)] text-[var(--success)] hover:bg-[var(--success-bg)] transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Hire
              </button>
            )}
            {onFire && owned.employees > 0 && (
              <button
                onClick={onFire}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger-bg)] transition-colors"
              >
                <UserMinus className="w-3.5 h-3.5" />
                Fire
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Projected financials */}
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-[var(--bg-tertiary)]">
              <span className="text-[var(--text-tertiary)]">Base Revenue</span>
              <span className="font-semibold text-[var(--success)]">{formatMoney(business.baseRevenue)}/mo</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-[var(--bg-tertiary)]">
              <span className="text-[var(--text-tertiary)]">Operating</span>
              <span className="font-semibold text-[var(--text-primary)]">{formatMoney(business.operatingCost)}/mo</span>
            </div>
          </div>

          {/* Requirements */}
          {reqSkills.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[var(--border)]">
              <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Requirements</p>
              <div className="flex flex-wrap gap-1.5">
                {reqSkills.map(([skill, level]) => (
                  <Badge key={skill} variant="default" size="sm">
                    {skillNames[skill]} Lv.{level}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Start button */}
          <div className="mt-4">
            <button
              onClick={onStart}
              disabled={!canAfford}
              className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition-opacity ${
                canAfford
                  ? 'bg-[var(--accent)] text-white hover:opacity-90'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] cursor-not-allowed'
              }`}
            >
              {canAfford ? 'Start Business' : `Need ${formatMoney(business.startupCost)}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
