import React from 'react';
import { Briefcase, Clock, Zap, Star } from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatMoney } from '../../utils/format';
import type { Job, SkillId, JobCategory } from '../../types';

interface JobCardProps {
  job: Job;
  isCurrentJob?: boolean;
  canApply?: boolean;
  onApply?: () => void;
  onQuit?: () => void;
  onWork?: () => void;
}

const categoryBadge: Record<JobCategory, { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'accent' }> = {
  entry: { label: 'Entry Level', variant: 'default' },
  skilled: { label: 'Skilled', variant: 'info' },
  professional: { label: 'Professional', variant: 'accent' },
  executive: { label: 'Executive', variant: 'warning' },
};

const skillNames: Record<SkillId, string> = {
  communication: 'Communication',
  management: 'Management',
  sales: 'Sales',
  tech: 'Tech',
  leadership: 'Leadership',
  investment: 'Investment',
  fitness: 'Fitness',
};

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isCurrentJob = false,
  canApply = false,
  onApply,
  onQuit,
  onWork,
}) => {
  const catInfo = categoryBadge[job.category];
  const reqSkills = Object.entries(job.requiredSkills) as [SkillId, number][];

  return (
    <div
      className={`bg-[var(--bg-card)] border rounded-xl p-4 transition-all ${
        isCurrentJob
          ? 'border-[var(--accent)] shadow-md'
          : 'border-[var(--border)] hover:shadow-md hover:border-[var(--border-hover)]'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-[var(--accent-bg)] flex-shrink-0">
            <Briefcase className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] truncate">
              {job.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={catInfo.variant} size="sm">{catInfo.label}</Badge>
              {isCurrentJob && <Badge variant="success" size="sm">Current Job</Badge>}
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-[var(--money)]">
            {formatMoney(job.salary)}
          </p>
          <p className="text-[10px] text-[var(--text-tertiary)]">per shift</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
        {job.description}
      </p>

      {/* Details row */}
      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-[var(--text-tertiary)]">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {job.hoursPerShift}h/shift
        </span>
        <span className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" />
          -{job.energyCost} energy
        </span>
        <span className="flex items-center gap-1">
          Stress:
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < job.stressLevel ? 'text-[var(--warning)] fill-[var(--warning)]' : 'text-[var(--border)]'}`}
            />
          ))}
        </span>
      </div>

      {/* Requirements */}
      {(reqSkills.length > 0 || job.requiredLevel > 1) && (
        <div className="mt-3 pt-3 border-t border-[var(--border)]">
          <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Requirements</p>
          <div className="flex flex-wrap gap-1.5">
            {job.requiredLevel > 1 && (
              <Badge variant="default" size="sm">Level {job.requiredLevel}</Badge>
            )}
            {reqSkills.map(([skill, level]) => (
              <Badge key={skill} variant="default" size="sm">
                {skillNames[skill]} Lv.{level}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4">
        {isCurrentJob ? (
          <>
            {onWork && (
              <button
                onClick={onWork}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
              >
                Work Shift
              </button>
            )}
            {onQuit && (
              <button
                onClick={onQuit}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger-bg)] transition-colors"
              >
                Quit
              </button>
            )}
          </>
        ) : canApply ? (
          <button
            onClick={onApply}
            className="w-full px-4 py-2 text-sm font-semibold rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
          >
            Apply
          </button>
        ) : (
          <button
            disabled
            className="w-full px-4 py-2 text-sm font-semibold rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] cursor-not-allowed"
          >
            Requirements Not Met
          </button>
        )}
      </div>
    </div>
  );
};
