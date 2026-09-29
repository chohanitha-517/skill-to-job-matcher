import React, { useState } from 'react';
import { 
  PieChart, 
  Settings, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Calendar,
  TrendingDown,
  ShieldAlert
} from 'lucide-react';
import { BudgetConfig, Expense } from '../../types';
import { formatCurrency, getDaysLeftInCurrentMonth } from '../../utils/helpers';

interface MoneyBudgetViewProps {
  budget: BudgetConfig;
  expenses: Expense[];
  onUpdateBudget: (newBudget: BudgetConfig) => void;
}

export const MoneyBudgetView: React.FC<MoneyBudgetViewProps> = ({
  budget,
  expenses,
  onUpdateBudget,
}) => {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [tempMonthlyLimit, setTempMonthlyLimit] = useState(budget.monthlyLimit);
  const [tempCategories, setTempCategories] = useState(budget.categories);

  // Total calculations
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = Math.max(0, budget.monthlyLimit - totalSpent);
  const overallSpentPercent = Math.min(100, Math.round((totalSpent / budget.monthlyLimit) * 100));

  const daysLeftInMonth = getDaysLeftInCurrentMonth();
  const safeDailySpend = remainingBudget / daysLeftInMonth;

  // Category breakdown
  const categorySpending = budget.categories.map((cat) => {
    const spent = expenses
      .filter((e) => e.category === cat.category)
      .reduce((sum, e) => sum + e.amount, 0);
    const percent = Math.round((spent / (cat.limit || 1)) * 100);
    const isOverLimit = spent > cat.limit;
    const isNearLimit = percent >= 85 && !isOverLimit;

    return {
      ...cat,
      spent,
      remaining: Math.max(0, cat.limit - spent),
      percent,
      isOverLimit,
      isNearLimit
    };
  });

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBudget({
      monthlyLimit: Number(tempMonthlyLimit) || 1000,
      categories: tempCategories
    });
    setIsConfigModalOpen(false);
  };

  const handleUpdateCatLimit = (categoryName: string, limit: number) => {
    setTempCategories(prev =>
      prev.map(c => c.category === categoryName ? { ...c, limit } : c)
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-400" />
            <span>Monthly Budget & Financial Guardrails</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Maintain strict monthly limits, monitor burn rates, and keep your daily allowance balanced.
          </p>
        </div>

        <button
          onClick={() => {
            setTempMonthlyLimit(budget.monthlyLimit);
            setTempCategories(budget.categories);
            setIsConfigModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-800"
        >
          <Settings className="w-4 h-4 text-zinc-400" />
          <span>Adjust Budget Caps</span>
        </button>
      </div>

      {/* Burn Rate Master Card */}
      <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-zinc-400 font-medium">Monthly Spending Status</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100 tabular-nums">
                {formatCurrency(totalSpent)}
              </span>
              <span className="text-sm font-mono text-zinc-400">
                of {formatCurrency(budget.monthlyLimit)}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 sm:text-right">
            <div className="text-[11px] text-zinc-400">Safe Daily Allowance</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
              {formatCurrency(safeDailySpend)} / day
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
              {daysLeftInMonth} days left in current month
            </div>
          </div>
        </div>

        {/* Master Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>{overallSpentPercent}% Utilized</span>
            <span>{formatCurrency(remainingBudget)} Remaining</span>
          </div>

          <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
            <div
              className={`h-full transition-all duration-500 ${
                overallSpentPercent >= 90
                  ? 'bg-rose-500'
                  : overallSpentPercent >= 75
                  ? 'bg-amber-400'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${overallSpentPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="space-y-3">
        <div className="text-sm font-semibold text-zinc-100">
          Category Spending Breakdown
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categorySpending.map((cat) => (
            <div
              key={cat.category}
              className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-xs font-semibold text-zinc-100">
                    {cat.category}
                  </h2>
                  <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                    {formatCurrency(cat.spent)} / {formatCurrency(cat.limit)}
                  </div>
                </div>

                {cat.isOverLimit ? (
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/50 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    Over by {formatCurrency(cat.spent - cat.limit)}
                  </span>
                ) : cat.isNearLimit ? (
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/50 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {cat.percent}%
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                    {cat.percent}%
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-850">
                <div
                  className={`h-full transition-all duration-300 ${
                    cat.isOverLimit
                      ? 'bg-rose-500'
                      : cat.isNearLimit
                      ? 'bg-amber-400'
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${Math.min(100, cat.percent)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>Remaining cushion</span>
                <span className="font-mono text-zinc-300 font-medium">
                  {formatCurrency(cat.remaining)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adjust Budget Caps Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                <span>Adjust Monthly Budget Caps</span>
              </h2>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Overall Monthly Allowance ($)
                </label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={tempMonthlyLimit}
                  onChange={(e) => setTempMonthlyLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Individual Category Targets ($)
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {tempCategories.map((cat) => (
                    <div key={cat.category} className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-zinc-300 truncate">{cat.category}</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={cat.limit}
                        onChange={(e) => handleUpdateCatLimit(cat.category, Number(e.target.value))}
                        className="w-28 px-2 py-1 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded font-mono text-right"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  Save Budget Caps
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
