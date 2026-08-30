import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Trash2, Calendar, UserCheck, Plus, Receipt, Folder, Home, Plane, Pizza, PartyPopper, Umbrella, Snowflake, Car, Tent, Briefcase, Music } from 'lucide-react';

const ICONS_MAP: Record<string, React.FC<any>> = {
  Home, Plane, Pizza, PartyPopper, Umbrella, Snowflake, Car, Tent, Briefcase, Music
};

interface ExpensesViewProps {
  onOpenQuickAdd: () => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({ onOpenQuickAdd }) => {
  const { state, t, deleteExpense, isGlobalMode, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const relevantExpenses = useMemo(() => {
    let list = state.expenses;
    if (!isGlobalMode && state.activeGroupId) {
      list = list.filter((e) => e.groupId === state.activeGroupId);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.amount.toString().includes(q) ||
          (e.category && e.category.toLowerCase().includes(q))
      );
    }
    return list;
  }, [state.expenses, state.activeGroupId, isGlobalMode, searchTerm]);

  const userMap = useMemo(() => {
    const map = new Map<string, (typeof state.users)[0]>();
    state.users.forEach((u) => map.set(u.id, u));
    return map;
  }, [state.users]);

  const groupMap = useMemo(() => {
    const map = new Map<string, (typeof state.groups)[0]>();
    state.groups.forEach((g) => map.set(g.id, g));
    return map;
  }, [state.groups]);

  const handleDelete = (id: string, desc: string) => {
    deleteExpense(id);
    showToast(`Deleted "${desc}"`, 'info');
  };

  return (
    <div className="space-y-5 pb-24 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900">{t('expenses')}</h2>
          <p className="text-xs text-slate-600 font-medium">
            {relevantExpenses.length} total entries
          </p>
        </div>

        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-500 text-white text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('addExpense')}</span>
        </button>
      </div>

      {/* Search Input */}
      {state.expenses.length > 0 && (
        <div>
          <input
            type="text"
            placeholder={t('searchExpenses')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500  transition-all shadow-sm"
          />
        </div>
      )}

      {/* Expenses List */}
      {relevantExpenses.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white/60 backdrop-blur-md border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">{t('noExpensesYet')}</h3>
          <p className="text-xs text-slate-600 max-w-xs mx-auto">{t('noExpensesSub')}</p>
          <button
            onClick={onOpenQuickAdd}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-500 text-white text-xs font-black shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('quickAdd')}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {relevantExpenses.map((expense) => {
            const payer = userMap.get(expense.payerId);
            const group = groupMap.get(expense.groupId);
            const dateStr = new Date(expense.date).toLocaleDateString(
              state.language === 'ar' ? 'ar-EG' : state.language === 'he' ? 'he-IL' : 'en-US',
              { month: 'short', day: 'numeric' }
            );

            const GroupIcon = group?.emoji && ICONS_MAP[group.emoji] ? ICONS_MAP[group.emoji] : Folder;

            return (
              <div
                key={expense.id}
                className="p-3.5 sm:p-4 rounded-3xl bg-white/60 backdrop-blur-md border border-slate-200 shadow-sm hover:border-emerald-300 transition-all flex items-center justify-between gap-2.5 sm:gap-3"
              >
                {/* Left icon / Payer */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-xs sm:text-sm font-black text-white shadow-sm shrink-0"
                    style={{ backgroundColor: payer?.color || '#14b8a6' }}
                  >
                    {payer?.name.charAt(0) || 'U'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                      {expense.description}
                    </h4>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] text-slate-600 mt-0.5 font-medium">
                      <span className="flex items-center gap-1 text-emerald-600 truncate max-w-[80px] sm:max-w-none">
                        <UserCheck className="w-3 h-3 shrink-0" />
                        <span className="truncate">{payer?.name}</span>
                      </span>

                      {group && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                          <GroupIcon className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate max-w-[65px] sm:max-w-[100px]">{group.name}</span>
                        </span>
                      )}

                      <span className="flex items-center gap-1 text-slate-500 shrink-0">
                        <Calendar className="w-3 h-3" />
                        <span>{dateStr}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Amount & Delete */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="text-end">
                    <span className="text-sm sm:text-base font-black text-emerald-600 whitespace-nowrap">
                      {state.currency}
                      {expense.amount.toFixed(2)}
                    </span>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      {expense.participants.length} split
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(expense.id, expense.description)}
                    className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    aria-label={t('deleteExpense')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
