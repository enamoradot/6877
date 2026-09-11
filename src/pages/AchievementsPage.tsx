import { Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { achievements } from '../data/achievements';
import { AchievementCard } from '../components/cards/AchievementCard';

export function AchievementsPage() {
  const { achievements: unlocked } = useGameStore();
  const unlockedSet = new Set(unlocked);
  const unlockedCount = unlocked.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Achievements</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Track your milestones</p>
        </div>
        <div className="flex items-center gap-2 bg-[var(--accent-bg)] text-[var(--accent)] px-3 py-1.5 rounded-lg">
          <Trophy size={16} />
          <span className="text-sm font-bold">{unlockedCount} / {achievements.length}</span>
        </div>
      </div>

      <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
          style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {achievements
          .sort((a, b) => {
            const aUnlocked = unlockedSet.has(a.id) ? 0 : 1;
            const bUnlocked = unlockedSet.has(b.id) ? 0 : 1;
            return aUnlocked - bUnlocked;
          })
          .map(achievement => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isUnlocked={unlockedSet.has(achievement.id)}
            />
          ))}
      </div>
    </div>
  );
}
