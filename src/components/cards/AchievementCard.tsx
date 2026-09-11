import { Lock, CheckCircle } from 'lucide-react';

interface AchievementCardProps {
  achievement: { id: string; name: string; description: string; icon: string };
  isUnlocked: boolean;
}

export function AchievementCard({ achievement, isUnlocked }: AchievementCardProps) {
  return (
    <div className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 transition-all ${
      isUnlocked ? 'hover:shadow-md hover:border-[var(--border-hover)]' : 'opacity-60'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          isUnlocked ? 'bg-[var(--accent-bg)]' : 'bg-[var(--bg-tertiary)]'
        }`}>
          {isUnlocked ? achievement.icon : <Lock size={20} className="text-[var(--text-tertiary)]" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`text-sm font-semibold truncate ${
              isUnlocked ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
            }`}>
              {achievement.name}
            </h3>
            {isUnlocked && <CheckCircle size={14} className="text-[var(--success)] flex-shrink-0" />}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
}
