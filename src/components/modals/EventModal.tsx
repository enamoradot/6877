import { AlertTriangle, Sparkles } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { formatMoney } from '../../utils/format';

export function EventModal() {
  const { activeEvent, resolveEvent } = useGameStore();
  if (!activeEvent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl max-w-md w-full shadow-2xl animate-slide-up overflow-hidden">
        <div className="bg-gradient-to-r from-[var(--accent)] to-purple-500 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Random Event</p>
            <h2 className="text-lg font-bold text-white">{activeEvent.title}</h2>
          </div>
        </div>

        <div className="p-5">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">{activeEvent.description}</p>

          <div className="space-y-2">
            {activeEvent.choices.map((choice, index) => {
              const effects = choice.effects;
              const hints: string[] = [];
              if (effects.cash && effects.cash > 0) hints.push(`+${formatMoney(effects.cash)}`);
              if (effects.cash && effects.cash < 0) hints.push(formatMoney(effects.cash));
              if (effects.xp) hints.push(`+${effects.xp} XP`);
              if (effects.reputation && effects.reputation > 0) hints.push(`+${effects.reputation} Rep`);
              if (effects.reputation && effects.reputation < 0) hints.push(`${effects.reputation} Rep`);
              if (effects.mood && effects.mood > 0) hints.push(`+${effects.mood} Mood`);
              if (effects.health && effects.health < 0) hints.push(`${effects.health} Health`);
              if (effects.energy && effects.energy < 0) hints.push(`${effects.energy} Energy`);

              return (
                <button
                  key={index}
                  onClick={() => resolveEvent(index)}
                  className="w-full text-left p-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-bg)] transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                      {choice.label}
                    </span>
                    {hints.length > 0 && (
                      <div className="flex gap-1.5">
                        {hints.map((hint, i) => (
                          <span key={i} className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            hint.startsWith('+') || hint.startsWith('$') ? 'bg-[var(--success-bg)] text-[var(--success)]'
                            : hint.startsWith('-') ? 'bg-[var(--danger-bg)] text-[var(--danger)]'
                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                          }`}>
                            {hint}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
