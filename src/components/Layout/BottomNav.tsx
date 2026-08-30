import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, ReceiptText, Plus, Scale, ShieldAlert } from 'lucide-react';

export type ActiveTab = 'groups' | 'expenses' | 'settle' | 'settings';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenQuickAdd: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenQuickAdd,
}) => {
  const { t } = useApp();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pt-2 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto glass-pill rounded-[2rem] px-2 py-1.5 flex items-center justify-around">
        {/* Groups */}
        <button
          onClick={() => onChangeTab('groups')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-2xl transition-all ${
            activeTab === 'groups'
              ? 'text-emerald-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-600'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t('groups')}</span>
        </button>

        {/* Expenses */}
        <button
          onClick={() => onChangeTab('expenses')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-2xl transition-all ${
            activeTab === 'expenses'
              ? 'text-emerald-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-600'
          }`}
        >
          <ReceiptText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t('expenses')}</span>
        </button>

        {/* Central Floating Quick-Add Action Button */}
        <div className="relative -top-5">
          <button
            onClick={onOpenQuickAdd}
            className="w-14 h-14 rounded-full bg-gradient-to-tr bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 border-[3px] border-white"
            aria-label={t('quickAdd')}
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Settlement / Netting */}
        <button
          onClick={() => onChangeTab('settle')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-2xl transition-all ${
            activeTab === 'settle'
              ? 'text-emerald-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-600'
          }`}
        >
          <Scale className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t('settle')}</span>
        </button>

        {/* Exclusions & Settings */}
        <button
          onClick={() => onChangeTab('settings')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-2xl transition-all ${
            activeTab === 'settings'
              ? 'text-emerald-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-600'
          }`}
        >
          <ShieldAlert className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t('settings')}</span>
        </button>
      </div>
    </nav>
  );
};
