import React from 'react';
import { Car, Wrench, Fuel, Shield, Gauge } from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { formatMoney } from '../../utils/format';
import type { Car as CarType, OwnedCar, CarCategory } from '../../types';

interface CarCardProps {
  car: CarType;
  owned?: OwnedCar;
  onBuy?: () => void;
  onSell?: () => void;
  onMaintain?: () => void;
  canAfford?: boolean;
}

const categoryBadge: Record<CarCategory, { label: string; variant: 'default' | 'info' | 'accent' | 'warning' | 'success' }> = {
  economy: { label: 'Economy', variant: 'default' },
  sedan: { label: 'Sedan', variant: 'info' },
  suv: { label: 'SUV', variant: 'success' },
  luxury: { label: 'Luxury', variant: 'accent' },
  sports: { label: 'Sports', variant: 'warning' },
};

export const CarCard: React.FC<CarCardProps> = ({
  car,
  owned,
  onBuy,
  onSell,
  onMaintain,
  canAfford = false,
}) => {
  const catInfo = categoryBadge[car.category];
  const monthlyTotal = car.fuelCostPerDay * 30 + car.maintenanceCostPerMonth + car.insuranceCostPerMonth;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 hover:shadow-md hover:border-[var(--border-hover)] transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-[var(--accent-bg)] flex-shrink-0">
            <Car className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] truncate">
              {car.name}
            </h3>
            <Badge variant={catInfo.variant} size="sm">{catInfo.label}</Badge>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-[var(--text-primary)]">
            {formatMoney(car.purchasePrice)}
          </p>
          <p className="text-[10px] text-[var(--text-tertiary)]">
            ~{formatMoney(monthlyTotal)}/mo costs
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
        {car.description}
      </p>

      {/* Monthly cost breakdown */}
      <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
        <div className="flex flex-col items-center p-2 rounded-lg bg-[var(--bg-tertiary)]">
          <Fuel className="w-3.5 h-3.5 text-[var(--text-tertiary)] mb-0.5" />
          <span className="text-[var(--text-tertiary)]">Fuel</span>
          <span className="font-semibold text-[var(--text-primary)]">{formatMoney(car.fuelCostPerDay)}/day</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-[var(--bg-tertiary)]">
          <Wrench className="w-3.5 h-3.5 text-[var(--text-tertiary)] mb-0.5" />
          <span className="text-[var(--text-tertiary)]">Maintain</span>
          <span className="font-semibold text-[var(--text-primary)]">{formatMoney(car.maintenanceCostPerMonth)}/mo</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-[var(--bg-tertiary)]">
          <Shield className="w-3.5 h-3.5 text-[var(--text-tertiary)] mb-0.5" />
          <span className="text-[var(--text-tertiary)]">Insurance</span>
          <span className="font-semibold text-[var(--text-primary)]">{formatMoney(car.insuranceCostPerMonth)}/mo</span>
        </div>
      </div>

      {/* Bonuses */}
      <div className="flex items-center gap-3 mt-3 text-xs text-[var(--text-tertiary)]">
        <span className="flex items-center gap-1">
          <Gauge className="w-3.5 h-3.5" />
          Speed +{car.speedBonus}
        </span>
        <span>Prestige +{car.prestigeBonus}</span>
      </div>

      {/* Owned section */}
      {owned && (
        <div className="mt-3 pt-3 border-t border-[var(--border)]">
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[var(--text-tertiary)]">Condition</span>
                <span className="text-xs font-semibold text-[var(--text-primary)]">{Math.round(owned.condition)}%</span>
              </div>
              <ProgressBar
                value={owned.condition}
                max={100}
                color={owned.condition > 60 ? 'var(--success)' : owned.condition > 30 ? 'var(--warning)' : 'var(--danger)'}
                size="sm"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[var(--text-tertiary)]">Fuel</span>
                <span className="text-xs font-semibold text-[var(--text-primary)]">{Math.round(owned.fuelLevel)}%</span>
              </div>
              <ProgressBar
                value={owned.fuelLevel}
                max={100}
                color="var(--info)"
                size="sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4">
        {owned ? (
          <>
            {onMaintain && (
              <button
                onClick={onMaintain}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
              >
                <Wrench className="w-4 h-4" />
                Maintain
              </button>
            )}
            {onSell && (
              <button
                onClick={onSell}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger-bg)] transition-colors"
              >
                Sell
              </button>
            )}
          </>
        ) : (
          <button
            onClick={onBuy}
            disabled={!canAfford}
            className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition-opacity ${
              canAfford
                ? 'bg-[var(--accent)] text-white hover:opacity-90'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] cursor-not-allowed'
            }`}
          >
            {canAfford ? 'Buy' : `Need ${formatMoney(car.purchasePrice)}`}
          </button>
        )}
      </div>
    </div>
  );
};
