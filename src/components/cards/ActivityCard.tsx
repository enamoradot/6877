import { Clock, DollarSign, Zap, Heart, Smile, UtensilsCrossed } from 'lucide-react';
import { formatMoney } from '../../utils/format';

interface ActivityCardProps {
  activity: {
    id: string;
    name: string;
    description: string;
    energyCost: number;
    timeCost: number;
    moodEffect: number;
    hungerEffect: number;
    healthEffect: number;
    cost: number;
    skillXp?: Record<string, number>;
  };
  onDo?: () => void;
  canDo?: boolean;
  reason?: string;
}

function EffectBadge({ icon, value, color }: { icon: React.ReactNode; value: number; color: string }) {
  if (value === 0) return null;
  const sign = value > 0 ? '+' : '';
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded" style={{ color, backgroundColor: color + '15' }}>
      {icon} {sign}{value}
    </span>
  );
}

export function ActivityCard({ activity, onDo, canDo = true, reason }: ActivityCardProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 hover:shadow-md hover:border-[var(--border-hover)] transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{activity.name}</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{activity.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {activity.cost > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                <DollarSign size={12} /> {formatMoney(activity.cost)}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
              <Clock size={12} /> {activity.timeCost}h
            </span>
            <EffectBadge icon={<Zap size={12} />} value={-activity.energyCost} color="#f59e0b" />
            <EffectBadge icon={<Smile size={12} />} value={activity.moodEffect} color="#3b82f6" />
            <EffectBadge icon={<UtensilsCrossed size={12} />} value={activity.hungerEffect} color="#f97316" />
            <EffectBadge icon={<Heart size={12} />} value={activity.healthEffect} color="#ef4444" />
          </div>
        </div>
        <button
          onClick={onDo}
          disabled={!canDo}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        >
          Do
        </button>
      </div>
      {!canDo && reason && (
        <p className="text-xs text-[var(--danger)] mt-2">{reason}</p>
      )}
    </div>
  );
}
