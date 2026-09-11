import React from 'react';
import { MapPin, Home, Wrench, TrendingUp, ArrowUpCircle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { formatMoney } from '../../utils/format';
import type { Property, OwnedProperty, PropertyType } from '../../types';

interface PropertyCardProps {
  property: Property;
  owned?: OwnedProperty;
  onBuy?: () => void;
  onSell?: () => void;
  onRent?: () => void;
  onMoveIn?: () => void;
  onUpgrade?: () => void;
  onToggleRentOut?: () => void;
  canAfford?: boolean;
}

const typeBadge: Record<PropertyType, { label: string; variant: 'default' | 'info' | 'accent' | 'warning' }> = {
  apartment: { label: 'Apartment', variant: 'default' },
  house: { label: 'House', variant: 'info' },
  villa: { label: 'Villa', variant: 'accent' },
  commercial: { label: 'Commercial', variant: 'warning' },
};

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  owned,
  onBuy,
  onSell,
  onRent,
  onMoveIn,
  onUpgrade,
  onToggleRentOut,
  canAfford = false,
}) => {
  const typeInfo = typeBadge[property.type];

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 hover:shadow-md hover:border-[var(--border-hover)] transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-[var(--accent-bg)] flex-shrink-0">
            {property.type === 'commercial' ? (
              <MapPin className="w-5 h-5 text-[var(--accent)]" />
            ) : (
              <Home className="w-5 h-5 text-[var(--accent)]" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] truncate">
              {property.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={typeInfo.variant} size="sm">{typeInfo.label}</Badge>
              <Badge variant="default" size="sm">Lv.{property.level}</Badge>
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-[var(--text-primary)]">
            {formatMoney(property.purchasePrice)}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
        {property.description}
      </p>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
        <div className="flex justify-between p-2 rounded-lg bg-[var(--bg-tertiary)]">
          <span className="text-[var(--text-tertiary)]">Rent</span>
          <span className="font-semibold text-[var(--text-primary)]">{formatMoney(property.rentPrice)}/mo</span>
        </div>
        <div className="flex justify-between p-2 rounded-lg bg-[var(--bg-tertiary)]">
          <span className="text-[var(--text-tertiary)]">Maintenance</span>
          <span className="font-semibold text-[var(--text-primary)]">{formatMoney(property.maintenanceCost)}/mo</span>
        </div>
        {property.incomeIfRented > 0 && (
          <div className="flex justify-between p-2 rounded-lg bg-[var(--success-bg)] col-span-2">
            <span className="text-[var(--text-tertiary)]">Rental Income</span>
            <span className="font-semibold text-[var(--success)]">{formatMoney(property.incomeIfRented)}/mo</span>
          </div>
        )}
        <div className="flex justify-between p-2 rounded-lg bg-[var(--bg-tertiary)] col-span-2">
          <span className="text-[var(--text-tertiary)]">Appreciation</span>
          <span className="font-semibold text-[var(--success)] flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            {(property.appreciationRate * 100).toFixed(1)}%/mo
          </span>
        </div>
      </div>

      {/* Owned section */}
      {owned && (
        <div className="mt-3 pt-3 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[var(--text-tertiary)]">Condition</span>
            <span className="text-xs font-semibold text-[var(--text-primary)]">{Math.round(owned.condition)}%</span>
          </div>
          <ProgressBar
            value={owned.condition}
            max={100}
            color={owned.condition > 60 ? 'var(--success)' : owned.condition > 30 ? 'var(--warning)' : 'var(--danger)'}
            size="sm"
          />
          {owned.isRented && (
            <div className="mt-2 flex items-center gap-1">
              <Badge variant="success" size="sm">Rented Out</Badge>
              <span className="text-xs text-[var(--success)]">+{formatMoney(owned.rentIncome)}/mo</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        {owned ? (
          <>
            {onUpgrade && (
              <button
                onClick={onUpgrade}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
              >
                <ArrowUpCircle className="w-3.5 h-3.5" />
                Upgrade ({formatMoney(property.upgradeCost)})
              </button>
            )}
            {onMoveIn && (
              <button
                onClick={onMoveIn}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-colors"
              >
                Move In
              </button>
            )}
            {onToggleRentOut && (
              <button
                onClick={onToggleRentOut}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--success)] text-[var(--success)] hover:bg-[var(--success-bg)] transition-colors"
              >
                {owned.isRented ? 'Stop Renting' : 'Rent Out'}
              </button>
            )}
            {onSell && (
              <button
                onClick={onSell}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger-bg)] transition-colors"
              >
                Sell
              </button>
            )}
          </>
        ) : (
          <>
            {onBuy && (
              <button
                onClick={onBuy}
                disabled={!canAfford}
                className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-opacity ${
                  canAfford
                    ? 'bg-[var(--accent)] text-white hover:opacity-90'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] cursor-not-allowed'
                }`}
              >
                {canAfford ? 'Buy' : `Need ${formatMoney(property.purchasePrice)}`}
              </button>
            )}
            {onRent && (
              <button
                onClick={onRent}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-colors"
              >
                Rent ({formatMoney(property.rentPrice)}/mo)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
