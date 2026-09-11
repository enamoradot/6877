import React, { useState } from 'react';
import { Briefcase, Search, Filter } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { jobs } from '../data/jobs';
import { formatMoney } from '../utils/format';
import { Badge } from '../components/common/Badge';
import type { JobCategory, SkillId } from '../types';

const categories: { value: JobCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'entry', label: 'Entry Level' },
  { value: 'skilled', label: 'Skilled' },
  { value: 'professional', label: 'Professional' },
  { value: 'executive', label: 'Executive' },
];

const categoryBadgeVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent'> = {
  entry: 'default',
  skilled: 'info',
  professional: 'accent',
  executive: 'success',
};

export const JobsPage: React.FC = () => {
  const { player, currentJobId, setJob, quitJob, work } = useGameStore();
  const [filter, setFilter] = useState<JobCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const currentJob = currentJobId ? jobs.find((j) => j.id === currentJobId) : null;

  const meetsRequirements = (job: typeof jobs[0]) => {
    if (player.level < job.requiredLevel) return false;
    for (const [skillId, level] of Object.entries(job.requiredSkills)) {
      if ((player.skills[skillId as SkillId]?.level ?? 0) < (level ?? 0)) return false;
    }
    return true;
  };

  const filteredJobs = jobs
    .filter((j) => j.id !== currentJobId)
    .filter((j) => filter === 'all' || j.category === filter)
    .filter((j) => j.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aQual = meetsRequirements(a);
      const bQual = meetsRequirements(b);
      if (aQual && !bQual) return -1;
      if (!aQual && bQual) return 1;
      return 0;
    });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <Briefcase className="w-6 h-6" /> Jobs
      </h1>

      {/* Current job */}
      {currentJob && (
        <div className="bg-[var(--bg-card)] border-2 border-[var(--accent)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wide">
              Current Job
            </h2>
            <Badge variant={categoryBadgeVariant[currentJob.category] || 'default'}>
              {currentJob.category}
            </Badge>
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)]">{currentJob.name}</p>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">{currentJob.description}</p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[var(--text-secondary)]">
            <span>{formatMoney(currentJob.salary)} / shift</span>
            <span>{currentJob.hoursPerShift}h shifts</span>
            <span>Stress: {currentJob.stressLevel}/5</span>
            <span>Energy: -{currentJob.energyCost}</span>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => work()}
              disabled={player.energy < currentJob.energyCost}
              className="px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Work Shift ({formatMoney(currentJob.salary)})
            </button>
            <button
              onClick={() => quitJob()}
              className="px-4 py-2 rounded-lg font-semibold text-sm text-[var(--danger)] bg-[var(--bg-secondary)] border border-[var(--border)] transition-all hover:border-[var(--danger)]"
            >
              Quit Job
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filter === cat.value
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Available jobs */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
          Available Jobs ({filteredJobs.length})
        </h2>
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredJobs.map((job) => {
              const qualified = meetsRequirements(job);
              return (
                <div
                  key={job.id}
                  className={`bg-[var(--bg-card)] border rounded-xl p-4 transition-all ${
                    qualified
                      ? 'border-[var(--border)] hover:border-[var(--accent)] hover:shadow-sm'
                      : 'border-[var(--border)] opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">{job.name}</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{job.description}</p>
                    </div>
                    <Badge variant={categoryBadgeVariant[job.category] || 'default'} size="sm">
                      {job.category}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--money)]">{formatMoney(job.salary)}/shift</span>
                    <span>{job.hoursPerShift}h</span>
                    <span>Stress {job.stressLevel}/5</span>
                    <span>-{job.energyCost} energy</span>
                  </div>
                  {/* Requirements */}
                  {(job.requiredLevel > 1 || Object.keys(job.requiredSkills).length > 0) && (
                    <div className="mt-2 text-xs text-[var(--text-tertiary)]">
                      <span className="font-medium">Requires: </span>
                      {job.requiredLevel > 1 && (
                        <span
                          className={
                            player.level >= job.requiredLevel
                              ? 'text-[var(--success)]'
                              : 'text-[var(--danger)]'
                          }
                        >
                          Lv.{job.requiredLevel}{' '}
                        </span>
                      )}
                      {Object.entries(job.requiredSkills).map(([skill, lvl]) => (
                        <span
                          key={skill}
                          className={
                            (player.skills[skill as SkillId]?.level ?? 0) >= (lvl ?? 0)
                              ? 'text-[var(--success)]'
                              : 'text-[var(--danger)]'
                          }
                        >
                          {skill} Lv.{lvl}{' '}
                        </span>
                      ))}
                    </div>
                  )}
                  {qualified && (
                    <button
                      onClick={() => setJob(job.id)}
                      className="mt-3 w-full py-2 rounded-lg font-semibold text-sm text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      Apply
                    </button>
                  )}
                  {!qualified && (
                    <p className="mt-3 text-center text-xs text-[var(--danger)] font-medium py-2">
                      Requirements not met
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-[var(--text-tertiary)]">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No jobs match your search</p>
          </div>
        )}
      </div>
    </div>
  );
};
