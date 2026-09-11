import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subValue,
  trend,
  color,
  className = '',
}) => {
  return (
    <div
      className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 hover:shadow-md hover:border-[var(--border-hover)] transition-all ${className}`}
    >
      <div className="flex items-start justify-between">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: color ? `${color}20` : 'var(--accent-bg)' }}
        >
          <span style={{ color: color || 'var(--accent)' }}>{icon}</span>
        </div>
        {trend && (
          <span className="flex items-center">
            {trend === 'up' && (
              <TrendingUp className="w-4 h-4 text-[var(--success)]" />
            )}
            {trend === 'down' && (
              <TrendingDown className="w-4 h-4 text-[var(--danger)]" />
            )}
            {trend === 'neutral' && (
              <Minus className="w-4 h-4 text-[var(--text-tertiary)]" />
            )}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">
          {label}
        </p>
        <p className="text-xl font-bold text-[var(--text-primary)] mt-0.5">
          {value}
        </p>
        {subValue && (
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
};
