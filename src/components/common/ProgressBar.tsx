import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  color = 'var(--accent)',
  size = 'md',
  showLabel = false,
  label,
  className = '',
}) => {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-xs font-medium text-[var(--text-tertiary)]">
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full rounded-full bg-[var(--bg-tertiary)] overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className="h-full rounded-full animate-progress transition-all duration-300"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};
