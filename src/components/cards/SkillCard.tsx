import { Brain, MessageSquare, Users, ShoppingCart, Cpu, Crown, TrendingUp, Dumbbell } from 'lucide-react';

interface SkillCardProps {
  skillId: string;
  skill: { name: string; level: number; xp: number; xpToNextLevel: number };
}

const skillIcons: Record<string, React.ReactNode> = {
  communication: <MessageSquare size={20} />,
  management: <Users size={20} />,
  sales: <ShoppingCart size={20} />,
  tech: <Cpu size={20} />,
  leadership: <Crown size={20} />,
  investment: <TrendingUp size={20} />,
  fitness: <Dumbbell size={20} />,
};

const skillColors: Record<string, string> = {
  communication: '#3b82f6',
  management: '#8b5cf6',
  sales: '#f59e0b',
  tech: '#06b6d4',
  leadership: '#ef4444',
  investment: '#10b981',
  fitness: '#f97316',
};

export function SkillCard({ skillId, skill }: SkillCardProps) {
  const icon = skillIcons[skillId] || <Brain size={20} />;
  const color = skillColors[skillId] || '#6366f1';
  const progress = skill.xpToNextLevel > 0 ? (skill.xp / skill.xpToNextLevel) * 100 : 0;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 hover:shadow-md hover:border-[var(--border-hover)] transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '20', color }}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{skill.name}</h3>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: color + '20', color }}>
            Level {skill.level}
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
          <span>XP</span>
          <span>{skill.xp} / {skill.xpToNextLevel}</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
}
