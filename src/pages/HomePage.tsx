import React from 'react';
import {
  DollarSign,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  Briefcase,
  Bed,
  UtensilsCrossed,
  Dumbbell,
  Zap,
  Smile,
  Apple,
  HeartPulse,
  Building2,
  Bell,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { jobs } from '../data/jobs';
import { formatMoney, getTimeEmoji, getDayName, formatDate } from '../utils/format';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';

export const HomePage: React.FC = () => {
  const {
    player,
    time,
    currentJobId,
    ownedBusinesses,
    notifications,
    financeHistory,
    work,
    modifyEnergy,
    modifyMood,
    modifyHunger,
    modifyHealth,
    spendCash,
    advanceTime,
    addSkillXp,
  } = useGameStore();

  const currentJob = currentJobId ? jobs.find((j) => j.id === currentJobId) : null;

  // Calculate daily income/expenses from recent finance history
  const todayRecords = financeHistory.filter(
    (r) => r.day === time.day && r.month === time.month && r.year === time.year
  );
  const dailyIncome = todayRecords
    .filter((r) => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);
  const dailyExpenses = todayRecords
    .filter((r) => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const recentNotifications = [...notifications].reverse().slice(0, 5);

  const greeting =
    time.period === 'morning'
      ? 'Good Morning'
      : time.period === 'afternoon'
      ? 'Good Afternoon'
      : time.period === 'evening'
      ? 'Good Evening'
      : 'Good Night';

  const handleWork = () => {
    if (currentJob) work();
  };

  const handleRest = () => {
    modifyEnergy(30);
    advanceTime(4);
    modifyMood(5);
  };

  const handleEat = () => {
    spendCash(20, 'food', 'Quick meal');
    modifyHunger(-30);
    advanceTime(1);
  };

  const handleExercise = () => {
    modifyEnergy(-15);
    modifyHealth(10);
    advanceTime(2);
    addSkillXp('fitness', 10);
  };

  const statusBars = [
    { label: 'Energy', value: player.energy, icon: <Zap className="w-4 h-4" />, color: 'var(--warning)' },
    { label: 'Mood', value: player.mood, icon: <Smile className="w-4 h-4" />, color: 'var(--accent)' },
    { label: 'Hunger', value: player.hunger, icon: <Apple className="w-4 h-4" />, color: 'var(--success)' },
    { label: 'Health', value: player.health, icon: <HeartPulse className="w-4 h-4" />, color: 'var(--danger)' },
  ];

  const quickActions = [
    {
      label: 'Work',
      icon: <Briefcase className="w-5 h-5" />,
      onClick: handleWork,
      disabled: !currentJob || player.energy < (currentJob?.energyCost ?? 0),
      color: 'var(--accent)',
    },
    {
      label: 'Rest',
      icon: <Bed className="w-5 h-5" />,
      onClick: handleRest,
      disabled: false,
      color: 'var(--info)',
    },
    {
      label: 'Eat',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      onClick: handleEat,
      disabled: player.cash < 20,
      color: 'var(--success)',
    },
    {
      label: 'Exercise',
      icon: <Dumbbell className="w-5 h-5" />,
      onClick: handleExercise,
      disabled: player.energy < 15,
      color: 'var(--warning)',
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          {getTimeEmoji(time.period)} {greeting}, {player.name}!
        </h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          {getDayName(time.dayOfWeek)} &middot; {formatDate(time.day, time.month, time.year)} &middot; Level {player.level}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Cash"
          value={formatMoney(player.cash)}
          color="var(--money)"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Net Worth"
          value={formatMoney(player.netWorth)}
          color="var(--success)"
        />
        <StatCard
          icon={<ArrowUpCircle className="w-5 h-5" />}
          label="Today's Income"
          value={formatMoney(dailyIncome)}
          trend="up"
          color="var(--success)"
        />
        <StatCard
          icon={<ArrowDownCircle className="w-5 h-5" />}
          label="Today's Expenses"
          value={formatMoney(dailyExpenses)}
          trend="down"
          color="var(--danger)"
        />
      </div>

      {/* Status bars + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
            Player Status
          </h2>
          <div className="space-y-3">
            {statusBars.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span style={{ color: s.color }}>{s.icon}</span>
                <div className="flex-1">
                  <ProgressBar
                    value={s.value}
                    max={100}
                    color={s.color}
                    size="sm"
                    label={s.label}
                    showLabel
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current job */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
            Current Job
          </h2>
          {currentJob ? (
            <div>
              <p className="text-lg font-bold text-[var(--text-primary)]">{currentJob.name}</p>
              <p className="text-sm text-[var(--text-tertiary)] mt-1">{currentJob.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-[var(--text-secondary)]">
                <span>{formatMoney(currentJob.salary)} / shift</span>
                <span>{currentJob.hoursPerShift}h shifts</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Briefcase className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-tertiary)]">No job yet - find one!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              disabled={action.disabled}
              className="flex flex-col items-center gap-2 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl transition-all hover:border-[var(--border-hover)] hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              <span style={{ color: action.disabled ? 'var(--text-tertiary)' : action.color }}>
                {action.icon}
              </span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom row: Notifications + Businesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent events */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4" /> Recent Events
          </h2>
          {recentNotifications.length > 0 ? (
            <div className="space-y-2">
              {recentNotifications.map((n) => (
                <div
                  key={n.id}
                  className="text-sm text-[var(--text-secondary)] py-1.5 border-b border-[var(--border)] last:border-0"
                >
                  {n.message}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-tertiary)] py-4 text-center">No recent events</p>
          )}
        </div>

        {/* Active businesses */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Active Businesses
          </h2>
          {ownedBusinesses.length > 0 ? (
            <div className="space-y-2">
              {ownedBusinesses.map((b) => {
                const bData = require('../data/businesses').businesses.find(
                  (bd: any) => bd.id === b.businessId
                );
                return (
                  <div
                    key={b.businessId}
                    className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0"
                  >
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {bData?.name || b.businessId}
                    </span>
                    <span className="text-sm text-[var(--success)]">
                      {formatMoney(b.revenue - b.expenses)}/mo
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <Building2 className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-tertiary)]">No businesses yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
