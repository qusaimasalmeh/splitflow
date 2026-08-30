import React, { useState } from 'react';
import { PublicSummaryData } from '../../utils/urlEncoder';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  Phone,
  Layers,
  ChevronDown,
  ChevronUp,
  Receipt,
  Wallet,
  Copy,
  ExternalLink,
  Check
} from 'lucide-react';

interface SummaryViewProps {
  summary: PublicSummaryData;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ summary }) => {
  const { t, state, setLanguage, showToast } = useApp();
  const [showExpenses, setShowExpenses] = useState<boolean>(false);
  const [copiedPhoneIndex, setCopiedPhoneIndex] = useState<number | null>(null);

  const handleCopyPhone = (phone: string, index: number) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhoneIndex(index);
    showToast(t('phoneNumberCopied'), 'success');
    setTimeout(() => setCopiedPhoneIndex(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-glow-teal shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-slate-900 leading-tight">
                {t('appName')}
              </h1>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                {t('settlementSummary')}
              </p>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg transition-all ${
                state.language === 'en' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('he')}
              className={`px-2 py-1 rounded-lg transition-all ${
                state.language === 'he' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              עב
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-2 py-1 rounded-lg transition-all ${
                state.language === 'ar' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              عر
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-5 space-y-4">
        {/* Group Hero Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider text-emerald-50">
              {summary.t}
            </span>
            <span className="text-xs font-bold text-emerald-100">
              {summary.s.length} {summary.s.length === 1 ? 'transfer' : 'transfers'}
            </span>
          </div>

          <div className="pt-2 flex items-baseline justify-between">
            <div>
              <p className="text-xs text-emerald-100 font-medium">{t('totalExpenses')}</p>
              <p className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {summary.c}{summary.tot.toFixed(2)}
              </p>
            </div>
            <div className="text-end">
              <p className="text-xs text-emerald-100 font-medium">{t('whoOwesWhom')}</p>
              <p className="text-sm font-black text-emerald-200">
                {summary.s.length === 0 ? t('allSettledUp') : `${summary.s.length} ${t('transfersLabel') || 'Transfers'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-600" />
            {t('whoOwesWhom')}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {t('payDirectly')}
          </span>
        </div>

        {/* Settlement Cards */}
        <div className="space-y-3">
          {summary.s.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <Sparkles className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">{t('allSettledUp')}</h3>
            </div>
          ) : (
            summary.s.map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-3xl border bg-white border-slate-200 shadow-sm hover:border-emerald-400 transition-all space-y-3"
              >
                {/* Debtor -> Creditor Transfer Row */}
                <div className="flex items-center justify-between gap-2">
                  {/* Debtor (Who pays) */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      {s.f.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-black text-slate-900 truncate">{s.f}</p>
                      <p className="text-[10px] text-rose-500 font-semibold">{t('youOwe') || 'Owes'}</p>
                    </div>
                  </div>

                  {/* Transfer Arrow & Amount */}
                  <div className="flex flex-col items-center px-1.5 shrink-0">
                    <span className="text-base sm:text-lg font-black text-emerald-600 whitespace-nowrap">
                      {summary.c}{s.a.toFixed(2)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 rtl:rotate-180 transition-transform" />
                  </div>

                  {/* Creditor (Who receives) */}
                  <div className="flex items-center justify-end gap-2.5 min-w-0 flex-1 text-end">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-black text-slate-900 truncate">{s.t}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">{t('youAreOwed') || 'Receives'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      {s.t.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Cross Group Badge */}
                {s.cg && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                    <Layers className="w-3 h-3" />
                    <span>{t('crossGroupNettingBadge')}</span>
                  </div>
                )}

                {/* Direct 1-Click Payment Links */}
                {(s.pp || s.p) && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500">
                      {t('payTo')} {s.t}:
                    </span>

                    <div className="flex flex-wrap items-center gap-2 ms-auto">
                      {/* PayPal Button */}
                      {s.pp && (
                        <a
                          href={`https://paypal.me/${s.pp}/${s.a}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition-all active:scale-95 shadow-2xs"
                        >
                          <span>PayPal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {/* Phone for Bit / PayBox */}
                      {s.p && (
                        <button
                          type="button"
                          onClick={() => handleCopyPhone(s.p!, idx)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold transition-all active:scale-95 shadow-2xs"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Bit / PayBox</span>
                          {copiedPhoneIndex === idx ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-teal-500" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Expenses Breakdown Accordion */}
        {summary.e && summary.e.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setShowExpenses(!showExpenses)}
              className="w-full flex items-center justify-between p-4 rounded-3xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>{t('expensesList')} ({summary.e.length})</span>
              </div>
              {showExpenses ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showExpenses && (
              <div className="mt-2 space-y-2 animate-in fade-in duration-200">
                {summary.e.map((exp, eIdx) => (
                  <div
                    key={eIdx}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{exp.d}</p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Paid by {exp.p} {exp.sc ? `• split with ${exp.sc}` : ''}
                      </p>
                    </div>
                    <span className="font-black text-emerald-600 shrink-0">
                      {summary.c}{exp.a.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Clean Footer Link */}
        <div className="pt-6 pb-10 text-center space-y-2 text-xs text-slate-500">
          <p className="font-semibold">{t('appName')} • {t('smartExpenseSplitting')}</p>
          <a
            href={window.location.origin + window.location.pathname.replace(/\/$/, '') + '/'}
            className="inline-block text-emerald-600 hover:text-emerald-700 font-bold underline"
          >
            {t('createNewGroup')} →
          </a>
        </div>
      </main>
    </div>
  );
};
