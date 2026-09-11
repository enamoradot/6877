import { User, Calendar, Star, Save, RotateCcw, Download, Shield, Zap, Heart, Smile, UtensilsCrossed } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { formatMoney, formatPercent } from '../utils/format';
import { useTheme } from '../hooks/useTheme';
import { ProgressBar } from '../components/common/ProgressBar';

export function ProfilePage() {
  const {
    player, time, currentJobId, ownedProperties, ownedCars, ownedBusinesses,
    achievements, saveGame, resetGame, loadGame,
  } = useGameStore();
  const { theme, setTheme } = useTheme();

  const initials = player.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
          {initials}
        </div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">{player.name}</h1>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="px-2 py-0.5 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] text-xs font-bold">
            Level {player.level}
          </span>
          <span className="text-xs text-[var(--text-tertiary)]">Day {player.day}</span>
        </div>
        <div className="mt-3 max-w-xs mx-auto">
          <div className="flex justify-between text-xs text-[var(--text-tertiary)] mb-1">
            <span>XP</span>
            <span>{player.xp} / {player.xpToNextLevel}</span>
          </div>
          <ProgressBar value={player.xp} max={player.xpToNextLevel} color="var(--accent)" size="sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-[var(--money)]">{formatMoney(player.cash)}</p>
          <p className="text-xs text-[var(--text-tertiary)]">Cash</p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-[var(--accent)]">{formatMoney(player.netWorth)}</p>
          <p className="text-xs text-[var(--text-tertiary)]">Net Worth</p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-[var(--text-primary)]">{player.totalDaysPlayed}</p>
          <p className="text-xs text-[var(--text-tertiary)]">Days Played</p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-[var(--warning)]">{achievements.length}</p>
          <p className="text-xs text-[var(--text-tertiary)]">Achievements</p>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Stats</h2>
        <div className="space-y-3">
          {[
            { label: 'Energy', value: player.energy, icon: <Zap size={14} />, color: '#f59e0b' },
            { label: 'Health', value: player.health, icon: <Heart size={14} />, color: '#ef4444' },
            { label: 'Mood', value: player.mood, icon: <Smile size={14} />, color: '#3b82f6' },
            { label: 'Hunger', value: player.hunger, icon: <UtensilsCrossed size={14} />, color: '#f97316' },
            { label: 'Reputation', value: player.reputation, icon: <Star size={14} />, color: '#8b5cf6' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1 text-[var(--text-secondary)]" style={{ color: stat.color }}>
                  {stat.icon} {stat.label}
                </span>
                <span className="font-semibold text-[var(--text-primary)]">{formatPercent(stat.value)}</span>
              </div>
              <ProgressBar value={stat.value} max={100} color={stat.color} size="sm" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Skills Overview</h2>
        <div className="space-y-2">
          {Object.values(player.skills).map(skill => (
            <div key={skill.id} className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-secondary)] w-24">{skill.name}</span>
              <div className="flex-1">
                <ProgressBar value={skill.xp} max={skill.xpToNextLevel} color="var(--accent)" size="sm" />
              </div>
              <span className="text-xs font-bold text-[var(--accent)] w-10 text-right">Lv.{skill.level}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Assets</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-[var(--text-primary)]">{ownedProperties.length}</p>
            <p className="text-xs text-[var(--text-tertiary)]">Properties</p>
          </div>
          <div>
            <p className="text-lg font-bold text-[var(--text-primary)]">{ownedCars.length}</p>
            <p className="text-xs text-[var(--text-tertiary)]">Cars</p>
          </div>
          <div>
            <p className="text-lg font-bold text-[var(--text-primary)]">{ownedBusinesses.length}</p>
            <p className="text-xs text-[var(--text-tertiary)]">Businesses</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Settings</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Theme</span>
            <div className="flex gap-1">
              {(['light', 'dark', 'system'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    theme === t
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => { saveGame(); }}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--success)] text-white font-semibold text-sm hover:opacity-90 transition-all"
        >
          <Save size={16} /> Save
        </button>
        <button
          onClick={() => { loadGame(); }}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--info)] text-white font-semibold text-sm hover:opacity-90 transition-all"
        >
          <Download size={16} /> Load
        </button>
        <button
          onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) resetGame(); }}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--danger)] text-white font-semibold text-sm hover:opacity-90 transition-all"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>
    </div>
  );
}
