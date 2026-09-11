import React from 'react';
import {
  Home,
  Briefcase,
  Building2,
  MapPin,
  Car,
  Brain,
  Activity,
  DollarSign,
  Trophy,
  User,
  Sun,
  Moon,
  Pause,
  Play,
  FastForward,
  Zap,
  Heart,
  Smile,
  UtensilsCrossed,
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useTheme } from '../../hooks/useTheme';
import { formatMoney, formatTime, getTimeEmoji } from '../../utils/format';
import type { GameSpeed, TimePeriod } from '../../types';

type PageId =
  | 'home'
  | 'jobs'
  | 'business'
  | 'properties'
  | 'cars'
  | 'skills'
  | 'activities'
  | 'finance'
  | 'achievements'
  | 'profile';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: PageId) => void;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { id: 'jobs', label: 'Jobs', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'business', label: 'Business', icon: <Building2 className="w-5 h-5" /> },
  { id: 'properties', label: 'Properties', icon: <MapPin className="w-5 h-5" /> },
  { id: 'cars', label: 'Cars', icon: <Car className="w-5 h-5" /> },
  { id: 'skills', label: 'Skills', icon: <Brain className="w-5 h-5" /> },
  { id: 'activities', label: 'Activities', icon: <Activity className="w-5 h-5" /> },
  { id: 'finance', label: 'Finance', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-5 h-5" /> },
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
];

interface MiniStatBarProps {
  icon: React.ReactNode;
  value: number;
  max: number;
  color: string;
  invert?: boolean;
}

const MiniStatBar: React.FC<MiniStatBarProps> = ({ icon, value, max, color, invert }) => {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  // For hunger: high value is bad, so we show bar as danger-colored when high
  const barColor = invert && percent > 60 ? 'var(--danger)' : color;

  return (
    <div className="flex items-center gap-1 min-w-0">
      <span className="flex-shrink-0" style={{ color }}>{icon}</span>
      <div className="w-12 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden flex-shrink-0">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const player = useGameStore((s) => s.player);
  const time = useGameStore((s) => s.time);
  const setSpeed = useGameStore((s) => s.setSpeed);
  const togglePause = useGameStore((s) => s.togglePause);
  const { theme, toggleTheme } = useTheme();

  const initials = player.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg-card)] border-b border-[var(--border)] shadow-sm md:ml-56">
        <div className="flex items-center justify-between px-3 py-2 gap-2">
          {/* Left: player info */}
          <div className="flex items-center gap-2 min-w-0">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            {/* Name + level */}
            <div className="min-w-0 hidden sm:block">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate leading-tight">
                {player.name}
              </p>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[var(--accent-bg)] text-[var(--accent)]">
                Lv.{player.level}
              </span>
            </div>
          </div>

          {/* Center: stats + money */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Cash */}
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-[var(--money)]" />
              <span className="text-sm font-bold text-[var(--money)]">
                {formatMoney(player.cash)}
              </span>
            </div>

            {/* Mini stat bars */}
            <div className="hidden sm:flex items-center gap-2">
              <MiniStatBar
                icon={<Zap className="w-3 h-3" />}
                value={player.energy}
                max={100}
                color="var(--warning)"
              />
              <MiniStatBar
                icon={<Heart className="w-3 h-3" />}
                value={player.health}
                max={100}
                color="var(--danger)"
              />
              <MiniStatBar
                icon={<Smile className="w-3 h-3" />}
                value={player.mood}
                max={100}
                color="var(--info)"
              />
              <MiniStatBar
                icon={<UtensilsCrossed className="w-3 h-3" />}
                value={player.hunger}
                max={100}
                color="#f97316"
                invert
              />
            </div>
          </div>

          {/* Right: time + controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Time display */}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-[var(--text-primary)] leading-tight">
                {getTimeEmoji(time.period)} {formatTime(time.hour)}
              </p>
              <p className="text-[10px] text-[var(--text-tertiary)]">
                Day {time.day}
              </p>
            </div>

            {/* Speed controls */}
            <div className="flex items-center gap-0.5 bg-[var(--bg-tertiary)] rounded-lg p-0.5">
              {([1, 2, 5] as GameSpeed[]).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeed(spd)}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md transition-colors ${
                    time.speed === spd
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Pause */}
            <button
              onClick={togglePause}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              {time.isPaused ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile-only stat bars row */}
        <div className="flex items-center justify-center gap-3 px-3 pb-1.5 sm:hidden">
          <MiniStatBar
            icon={<Zap className="w-3 h-3" />}
            value={player.energy}
            max={100}
            color="var(--warning)"
          />
          <MiniStatBar
            icon={<Heart className="w-3 h-3" />}
            value={player.health}
            max={100}
            color="var(--danger)"
          />
          <MiniStatBar
            icon={<Smile className="w-3 h-3" />}
            value={player.mood}
            max={100}
            color="var(--info)"
          />
          <MiniStatBar
            icon={<UtensilsCrossed className="w-3 h-3" />}
            value={player.hunger}
            max={100}
            color="#f97316"
            invert
          />
          <span className="text-[10px] text-[var(--text-tertiary)]">
            {getTimeEmoji(time.period)} Day {time.day}
          </span>
        </div>
      </header>

      {/* ===== DESKTOP SIDEBAR (md+) ===== */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-56 bg-[var(--bg-card)] border-r border-[var(--border)] flex-col z-50">
        {/* Logo / brand area */}
        <div className="px-4 py-4 border-b border-[var(--border)]">
          <h1 className="text-lg font-bold text-[var(--text-primary)]">Life Sim</h1>
          <p className="text-xs text-[var(--text-tertiary)]">Build your empire</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                  isActive
                    ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="pt-[72px] sm:pt-14 pb-20 md:pb-4 md:ml-56 min-h-screen">
        <div className="px-4 py-4 max-w-5xl mx-auto">{children}</div>
      </main>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-card)] border-t border-[var(--border)] shadow-lg">
        <div className="flex items-center justify-around px-1 py-1.5 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg min-w-0 transition-colors ${
                  isActive
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {item.icon}
                <span className="text-[9px] font-medium leading-tight truncate">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
