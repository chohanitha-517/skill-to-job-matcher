import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Trash2, 
  CreditCard, 
  Calendar,
  Tag,
  TrendingDown
} from 'lucide-react';
import { Expense } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface MoneyExpensesViewProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
}

const CATEGORIES: Expense['category'][] = [
  'Food & Groceries',
  'Rent & Utilities',
  'Transit',
  'Books & Academic',
  'Entertainment & Social',
  'Tech & Supplies'
];

export const MoneyExpensesView: React.FC<MoneyExpensesViewProps> = ({
  expenses,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<Expense['category']>('Food & Groceries');
  const [newMethod, setNewMethod] = useState<Expense['paymentMethod']>('Apple Pay');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState('');

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newAmount);
    if (!newTitle.trim() || isNaN(amountNum) || amountNum <= 0) return;

    onAddExpense({
      title: newTitle.trim(),
      amount: amountNum,
      category: newCategory,
      paymentMethod: newMethod,
      date: newDate,
      notes: newNotes.trim()
    });

    setNewTitle('');
    setNewAmount('');
    setNewNotes('');
    setIsQuickAddOpen(false);
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || (item.notes && item.notes.toLowerCase().includes(q));
    }
    return true;
  });

  // Math metrics
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const spentToday = expenses
    .filter(i => i.date === todayStr)
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Student Expenses Ledger</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track daily groceries, coffee, transit, textbooks, and campus spending.
          </p>
        </div>

        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Log Expense</span>
        </button>
      </div>

      {/* Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-xs text-zinc-400">Total Logged (Month)</div>
          <div className="text-2xl font-bold font-mono text-zinc-100 mt-1 tabular-nums">
            {formatCurrency(totalSpent)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            {expenses.length} total transactions
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-xs text-zinc-400">Spent Today ({todayStr})</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {formatCurrency(spentToday)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Safe daily target: $26.50
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-xs text-zinc-400">Average Transaction</div>
          <div className="text-2xl font-bold font-mono text-zinc-100 mt-1 tabular-nums">
            {formatCurrency(expenses.length > 0 ? totalSpent / expenses.length : 0)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Controlled micro-expenses
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-lg placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500 w-full sm:w-48"
          />
        </div>
      </div>

      {/* Transactions List (High-density table/rows) */}
      <div className="space-y-2">
        {filteredExpenses.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-zinc-900/30 border border-zinc-800">
            <DollarSign className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">No transactions match your search.</p>
          </div>
        ) : (
          filteredExpenses.map((exp) => (
            <div
              key={exp.id}
              className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-emerald-400 shrink-0 border border-zinc-800">
                  <DollarSign className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-xs font-semibold text-zinc-100 truncate">
                    {exp.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
                    <span>{exp.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{formatDate(exp.date)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{exp.paymentMethod}</span>
                  </div>
                  {exp.notes && (
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1 italic">
                      "{exp.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-bold font-mono text-zinc-100 tabular-nums">
                  -{formatCurrency(exp.amount)}
                </span>

                <button
                  onClick={() => onDeleteExpense(exp.id)}
                  className="p-1 text-zinc-500 hover:text-rose-400 transition-colors rounded"
                  title="Delete transaction"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Log Modal */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Log New Expense</span>
              </h2>
              <button
                onClick={() => setIsQuickAddOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Item / Merchant Name *
                </label>
                <input
                  required
                  placeholder="e.g. Trader Joe's, Campus Bookstore, Metro Pass"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Amount ($) *
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Student Card">Student Card</option>
                    <option value="Apple Pay">Apple Pay</option>
                    <option value="Venmo">Venmo</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Optional Note
                </label>
                <input
                  placeholder="e.g. Split with room 302; textbook for CS240"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
