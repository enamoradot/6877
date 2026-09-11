import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { formatMoney, formatDate } from '../utils/format';
import { StatCard } from '../components/common/StatCard';

type FilterType = 'all' | 'income' | 'expense';

export function FinancePage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const { player, financeHistory, getDailyIncome, getDailyExpenses } = useGameStore();

  const dailyIncome = getDailyIncome();
  const dailyExpenses = getDailyExpenses();
  const netProfit = dailyIncome - dailyExpenses;

  const totalIncome = financeHistory.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const totalExpenses = financeHistory.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);

  const filtered = financeHistory
    .filter(r => filter === 'all' || r.type === filter)
    .slice()
    .reverse()
    .slice(0, 100);

  const incomeByCategory = new Map<string, number>();
  const expenseByCategory = new Map<string, number>();
  for (const r of financeHistory) {
    const map = r.type === 'income' ? incomeByCategory : expenseByCategory;
    map.set(r.category, (map.get(r.category) || 0) + r.amount);
  }

  const maxBar = Math.max(totalIncome, totalExpenses, 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Finance</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Track your income and expenses</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<Wallet size={18} />} label="Cash" value={formatMoney(player.cash)} color="var(--money)" />
        <StatCard icon={<TrendingUp size={18} />} label="Net Worth" value={formatMoney(player.netWorth)} color="var(--accent)" />
        <StatCard icon={<ArrowUpRight size={18} />} label="Daily Income" value={formatMoney(dailyIncome)} color="var(--success)" />
        <StatCard icon={<ArrowDownRight size={18} />} label="Daily Expenses" value={formatMoney(dailyExpenses)} color="var(--danger)" />
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Income vs Expenses</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[var(--text-secondary)]">Total Income</span>
              <span className="font-semibold text-[var(--success)]">{formatMoney(totalIncome)}</span>
            </div>
            <div className="h-6 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden">
              <div className="h-full rounded-lg bg-[var(--success)] transition-all duration-500" style={{ width: `${(totalIncome / maxBar) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[var(--text-secondary)]">Total Expenses</span>
              <span className="font-semibold text-[var(--danger)]">{formatMoney(totalExpenses)}</span>
            </div>
            <div className="h-6 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden">
              <div className="h-full rounded-lg bg-[var(--danger)] transition-all duration-500" style={{ width: `${(totalExpenses / maxBar) * 100}%` }} />
            </div>
          </div>
          <div className="pt-2 border-t border-[var(--border)]">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-[var(--text-primary)]">Net Profit</span>
              <span className={`font-bold ${netProfit >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                {formatMoney(netProfit)}/day
              </span>
            </div>
          </div>
        </div>
      </div>

      {(incomeByCategory.size > 0 || expenseByCategory.size > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {incomeByCategory.size > 0 && (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Income by Category</h2>
              <div className="space-y-2">
                {[...incomeByCategory.entries()].sort((a, b) => b[1] - a[1]).map(([cat, amount]) => (
                  <div key={cat} className="flex justify-between items-center text-xs">
                    <span className="capitalize text-[var(--text-secondary)]">{cat}</span>
                    <span className="font-semibold text-[var(--success)]">{formatMoney(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {expenseByCategory.size > 0 && (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Expenses by Category</h2>
              <div className="space-y-2">
                {[...expenseByCategory.entries()].sort((a, b) => b[1] - a[1]).map(([cat, amount]) => (
                  <div key={cat} className="flex justify-between items-center text-xs">
                    <span className="capitalize text-[var(--text-secondary)]">{cat}</span>
                    <span className="font-semibold text-[var(--danger)]">{formatMoney(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Transaction History</h2>
          <div className="flex gap-1">
            {(['all', 'income', 'expense'] as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  filter === f
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-[var(--text-tertiary)] text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {filtered.map((record, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    record.type === 'income' ? 'bg-[var(--success-bg)] text-[var(--success)]' : 'bg-[var(--danger-bg)] text-[var(--danger)]'
                  }`}>
                    {record.type === 'income' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--text-primary)]">{record.description}</p>
                    <p className="text-[10px] text-[var(--text-tertiary)]">
                      {record.category} &middot; Day {record.day}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-bold ${
                  record.type === 'income' ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                }`}>
                  {record.type === 'income' ? '+' : '-'}{formatMoney(record.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
