import { useState } from 'react';
import { Activity, UtensilsCrossed, Dumbbell, BookOpen, Tv, Heart } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { activities } from '../data/activities';
import { ActivityCard } from '../components/cards/ActivityCard';

const categories = [
  { id: 'all', label: 'All', icon: <Activity size={14} /> },
  { id: 'food', label: 'Food', icon: <UtensilsCrossed size={14} /> },
  { id: 'exercise', label: 'Exercise', icon: <Dumbbell size={14} /> },
  { id: 'leisure', label: 'Leisure', icon: <Tv size={14} /> },
  { id: 'education', label: 'Education', icon: <BookOpen size={14} /> },
  { id: 'health', label: 'Health', icon: <Heart size={14} /> },
];

const activityCategories: Record<string, string> = {
  'eat-fast-food': 'food',
  'eat-restaurant': 'food',
  'cook-at-home': 'food',
  'go-to-gym': 'exercise',
  'rest-sleep': 'health',
  'read-book': 'education',
  'watch-tv': 'leisure',
  'socialize': 'leisure',
  'take-course': 'education',
  'go-shopping': 'leisure',
  'visit-doctor': 'health',
  'meditate': 'health',
};

export function ActivitiesPage() {
  const [filter, setFilter] = useState('all');
  const { player, doActivity } = useGameStore();

  const filtered = filter === 'all'
    ? activities
    : activities.filter(a => activityCategories[a.id] === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Activities</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Take care of yourself and develop your skills</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filter === cat.id
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map(activity => {
          const notEnoughEnergy = player.energy < activity.energyCost;
          const notEnoughMoney = activity.cost > 0 && player.cash < activity.cost;
          const canDo = !notEnoughEnergy && !notEnoughMoney;
          const reason = notEnoughEnergy ? 'Not enough energy' : notEnoughMoney ? 'Not enough money' : undefined;

          return (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onDo={() => doActivity(activity.id)}
              canDo={canDo}
              reason={reason}
            />
          );
        })}
      </div>
    </div>
  );
}
