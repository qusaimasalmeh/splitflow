import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, BookOpen, Calculator, Route } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose }) => {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'basics' | 'splitting' | 'netting'>('basics');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-600" />
            </div>
            {t('helpModalTitle')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-2 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('basics')}
            className={`flex-1 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'basics'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('helpTabBasics')}
          </button>
          <button
            onClick={() => setActiveTab('splitting')}
            className={`flex-1 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'splitting'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('helpTabSplitting')}
          </button>
          <button
            onClick={() => setActiveTab('netting')}
            className={`flex-1 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'netting'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('helpTabNetting')}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 h-[280px] overflow-y-auto custom-scrollbar">
          {activeTab === 'basics' && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 text-emerald-600 mb-2">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800">{t('helpBasicsTitle')}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('helpBasicsDesc1')}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('helpBasicsDesc2')}
              </p>
            </div>
          )}

          {activeTab === 'splitting' && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 text-emerald-600 mb-2">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800">{t('helpSplitTitle')}</h3>
              </div>
              <ul className="space-y-3">
                <li className="text-sm text-slate-600 leading-relaxed">
                  {t('helpSplitEqual')}
                </li>
                <li className="text-sm text-slate-600 leading-relaxed">
                  {t('helpSplitExact')}
                </li>
                <li className="text-sm text-slate-600 leading-relaxed">
                  {t('helpSplitPct')}
                </li>
                <li className="text-sm text-slate-600 leading-relaxed">
                  {t('helpSplitParts')}
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'netting' && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 text-emerald-600 mb-2">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <Route className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800">{t('helpNettingTitle')}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('helpNettingDesc1')}
              </p>
              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {t('helpNettingDesc2')}
                </p>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('helpNettingDesc3')}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-sm shadow-emerald-500/20"
          >
            {t('gotIt')}
          </button>
        </div>
      </div>
    </div>
  );
};
