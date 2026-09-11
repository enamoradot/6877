import React from 'react';
import { BookOpen, MessageSquare, Users, ShoppingBag, Monitor, Crown, TrendingUp, Dumbbell } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { ProgressBar } from '../components/common/ProgressBar';
import type { SkillId } from '../types';

const skillMeta: Record<SkillId, { icon: React.ReactNode; color: string; tips: string[] }> = {
  communication: {
    icon: <MessageSquare className="w-5 h-5" />,
    color: 'var(--info)',
    tips: ['Work as a cashier or vendor', 'Do social activities'],
  },
  management: {
    icon: <Users className="w-5 h-5" />,
    color: 'var(--accent)',
    tips: ['Work management jobs', 'Run a business'],
  },
  sales: {
    icon: <ShoppingBag className="w-5 h-5" />,
    color: 'var(--warning)',
    tips: ['Work sales jobs', 'Run a store or cafe'],
  },
  tech: {
    icon: <Monitor className="w-5 h-5" />,
    color: '#8b5cf6',
    tips: ['Work tech jobs', 'Start a tech business'],
  },
  leadership: {
    icon: <Crown className="w-5 h-5" />,
    color: '#f59e0b',
    tips: ['Work executive jobs', 'Manage employees'],
  },
  investment: {
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'var(--success)',
    tips: ['Buy properties', 'Respond to investment events'],
  },
  fitness: {
    icon: <Dumbbell className="w-5 h-5" />,
    color: 'var(--danger)',
    tips: ['Exercise regularly', 'Work physical jobs'],
  },
};

export const SkillsPage: React.FC = () => {
  const { player } = useGameStore();

  const skills = Object.values(player.skills);
  const totalLevels = skills.reduce((sum, s) => sum + s.level, 0);
  const avgLevel = skills.length > 0 ? (totalLevels / skills.length).toFixed(1) : '0';

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <BookOpen className="w-6 h-6" /> Skills
      </h1>

      {/* Summary */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex flex-wrap gap-6">
        <div>
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Total Skill Levels</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{totalLevels}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Average Level</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{avgLevel}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Skills</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{skills.length}</p>
        </div>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => {
          const meta = skillMeta[skill.id];
          return (
            <div
              key={skill.id}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--border-hover)] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
                >
                  {meta.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[var(--text-primary)]">{skill.name}</p>
                    <span className="text-sm font-semibold" style={{ color: meta.color }}>
                      Lv. {skill.level}
                    </span>
                  </div>
                </div>
              </div>

              <ProgressBar
                value={skill.xp}
                max={skill.xpToNextLevel}
                color={meta.color}
                size="md"
                showLabel
                label={`${skill.xp} / ${skill.xpToNextLevel} XP`}
              />

              <div className="mt-3">
                <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">How to improve:</p>
                <ul className="text-xs text-[var(--text-secondary)] space-y-0.5">
                  {meta.tips.map((tip, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)]" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
