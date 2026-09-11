export function formatMoney(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = abs >= 1000000
    ? `${(abs / 1000000).toFixed(2)}M`
    : abs.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return amount < 0 ? `-$${formatted}` : `$${formatted}`;
}

export function formatMoneyFull(amount: number): string {
  return amount < 0
    ? `-$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export function formatTime(hour: number): string {
  const h = hour % 24;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayHour}:00 ${period}`;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const monthNamesShort = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const dayNamesShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function formatDate(day: number, month: number, year: number): string {
  return `${monthNamesShort[month - 1]} ${day}, ${year}`;
}

export function formatPeriod(period: string): string {
  return period.charAt(0).toUpperCase() + period.slice(1);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function getTimePeriod(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function getDayName(dayOfWeek: number): string {
  return dayNames[dayOfWeek % 7];
}

export function getDayNameShort(dayOfWeek: number): string {
  return dayNamesShort[dayOfWeek % 7];
}

export function getMonthName(month: number): string {
  return monthNames[(month - 1) % 12];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function getTimeEmoji(period: string): string {
  switch (period) {
    case 'morning': return '☀️';
    case 'afternoon': return '🌤️';
    case 'evening': return '🌅';
    case 'night': return '🌙';
    default: return '☀️';
  }
}
