import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  calculateIsolatedSettlements,
  calculateSocialConstrainedGlobalSettlements,
} from '../../core/netting';
import { generateShareSummary } from '../../utils/urlEncoder';
import { GraphVisualizer } from './GraphVisualizer';
import {
  Sparkles,
  ArrowRight,
  Share2,
  CheckCircle,
  Copy,
  ExternalLink,
  Phone,
  Layers,
  Info,
  Check,
  Globe,
  Folder,
  PartyPopper,
  CreditCard,
  CircleDollarSign,
  Wallet
} from 'lucide-react';

export const SettlementView: React.FC = () => {
  const {
    state,
    t,
    isGlobalMode,
    setIsGlobalMode,
    toggleSettlementPaid,
    showToast,
  } = useApp();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Compute settlements dynamically based on current mode
  const calculatedSettlements = useMemo(() => {
    if (isGlobalMode || !state.activeGroupId) {
      return calculateSocialConstrainedGlobalSettlements(
        state.expenses,
        state.groups,
        state.users.map((u) => u.id),
        state.constraints
      );
    } else {
      const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);
      if (!activeGroup) return [];
      return calculateIsolatedSettlements(
        state.activeGroupId,
        state.expenses,
        activeGroup.memberIds
      );
    }
  }, [state.expenses, state.groups, state.users, state.constraints, state.activeGroupId, isGlobalMode]);

  const userMap = useMemo(() => {
    const map = new Map<string, (typeof state.users)[0]>();
    state.users.forEach((u) => map.set(u.id, u));
    return map;
  }, [state.users]);

  const totalExpenseAmount = useMemo(() => {
    const relevantExpenses =
      isGlobalMode || !state.activeGroupId
        ? state.expenses
        : state.expenses.filter((e) => e.groupId === state.activeGroupId);
    return relevantExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [state.expenses, state.activeGroupId, isGlobalMode]);

  const handleCopyBit = (recipientPhone?: string) => {
    if (!recipientPhone) {
      showToast('Recipient has no phone number configured', 'warning');
      return;
    }
    navigator.clipboard.writeText(recipientPhone);
    showToast(t('phoneNumberCopied'), 'success');
  };

  const handleShareWhatsApp = () => {
    const summary = generateShareSummary(state, calculatedSettlements, t);
    const encoded = encodeURIComponent(summary);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleCopySummary = () => {
    const summary = generateShareSummary(state, calculatedSettlements, t);
    navigator.clipboard.writeText(summary);
    setCopiedId('summary');
    showToast(t('copiedToClipboard'), 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-5 pb-24 text-slate-800">
      {/* 1. Mode Switcher & Explanation Banner */}
      <div className="p-4 rounded-3xl bg-white/60 backdrop-blur-md border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <h2 className="text-base font-bold text-slate-900">{t('settle')}</h2>
          </div>

          {/* Mode Pill Toggle */}
          <div className="grid grid-cols-2 bg-white p-1 rounded-2xl border border-slate-200 text-xs w-full sm:w-auto">
            <button
              onClick={() => setIsGlobalMode(true)}
              className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-all text-center truncate ${
                isGlobalMode
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{t('globalNetting')}</span>
            </button>
            <button
              onClick={() => setIsGlobalMode(false)}
              className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-all text-center truncate ${
                !isGlobalMode
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-700'
              }`}
            >
              <Folder className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{t('isolatedNetting')}</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{t('nettingExplanation')}</span>
        </p>
      </div>

      {/* 2. Stats Bar */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-white/60 backdrop-blur-md border border-slate-200 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
            {t('totalExpenses')}
          </p>
          <p className="text-2xl font-black text-emerald-600">
            {state.currency}
            {totalExpenseAmount.toFixed(2)}
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white/60 backdrop-blur-md border border-slate-200 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
            {t('whoOwesWhom')}
          </p>
          <p className="text-2xl font-black text-emerald-600">
            {calculatedSettlements.length}{' '}
            <span className="text-xs font-medium text-slate-600">{t('transfersLabel')}</span>
          </p>
        </div>
      </div>

      {/* Social Graph Visualizer */}
      {calculatedSettlements.length > 0 && (
        <GraphVisualizer
          users={state.users}
          settlements={calculatedSettlements}
          constraints={state.constraints}
          currency={state.currency}
        />
      )}

      {/* 3. Settlement Cards List */}
      {calculatedSettlements.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white/60 backdrop-blur-md border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <PartyPopper className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{t('allSettledUp')}</h3>
          <p className="text-xs text-slate-600 max-w-xs mx-auto">{t('noExpensesSub')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {calculatedSettlements.map((s) => {
            const debtor = userMap.get(s.from);
            const creditor = userMap.get(s.to);
            const isPaid = s.isPaid;

            return (
              <div
                key={s.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all duration-300 ${
                  isPaid
                    ? 'bg-slate-50 border-emerald-200 opacity-80'
                    : 'bg-white/60 backdrop-blur-md border-slate-200 shadow-sm hover:border-emerald-300'
                }`}
              >
                {/* Header: Debtor -> Creditor */}
                <div className="flex items-center justify-between gap-1.5 sm:gap-3 mb-3.5">
                  {/* Debtor */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-xs sm:text-sm font-bold text-white shadow-sm shrink-0"
                      style={{ backgroundColor: debtor?.color || '#8b5cf6' }}
                    >
                      {debtor?.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{debtor?.name}</p>
                      <p className="text-[10px] text-rose-500 font-semibold">{t('youOwe')}</p>
                    </div>
                  </div>

                  {/* Transfer Arrow & Amount */}
                  <div className="flex flex-col items-center px-1 shrink-0">
                    <span className="text-base sm:text-lg font-black text-emerald-600 whitespace-nowrap">
                      {state.currency}
                      {s.amount.toFixed(2)}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 rtl:rotate-180 transition-transform" />
                  </div>

                  {/* Creditor */}
                  <div className="flex items-center justify-end gap-2 min-w-0 flex-1 text-end">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{creditor?.name}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">{t('youAreOwed')}</p>
                    </div>
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-xs sm:text-sm font-bold text-white shadow-sm shrink-0"
                      style={{ backgroundColor: creditor?.color || '#14b8a6' }}
                    >
                      {creditor?.name.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Badges (Cross-group / Route info) */}
                {s.isCrossGroup && (
                  <div className="mb-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-700">
                    <Layers className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t('crossGroupNettingBadge')}</span>
                  </div>
                )}

                {/* Action Buttons (Payment Handoffs) */}
                <div className="pt-2.5 border-t border-slate-200 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {/* PayPal */}
                  {creditor?.payPalUsername && (
                    <a
                      href={`https://paypal.me/${creditor.payPalUsername}/${s.amount.toFixed(2)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold transition-all active:scale-95"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{t('payWithPayPal')}</span>
                      <ExternalLink className="w-3 h-3 text-blue-500" />
                    </a>
                  )}

                  {/* Bit (Copy phone number) */}
                  <button
                    onClick={() => handleCopyBit(creditor?.phoneNumber)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-700 text-xs font-semibold transition-all active:scale-95"
                  >
                    <CircleDollarSign className="w-3.5 h-3.5" />
                    <span>{t('payWithBit')}</span>
                    <Phone className="w-3 h-3 text-cyan-500" />
                  </button>

                  {/* PayBox (Copy phone number) */}
                  <button
                    onClick={() => handleCopyBit(creditor?.phoneNumber)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold transition-all active:scale-95"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>{t('payWithPayBox')}</span>
                    <Phone className="w-3 h-3 text-purple-500" />
                  </button>

                  {/* Mark as Paid */}
                  <button
                    onClick={() => toggleSettlementPaid(s)}
                    className="w-full sm:w-auto sm:ms-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('markAsPaid')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. WhatsApp Sharing & Summary Action Bar */}
      <div className="p-4 rounded-3xl bg-white/60 backdrop-blur-md border border-slate-200  shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-800 tracking-wide">{t('shareWhatsApp')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Share on WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-500 text-white font-extrabold text-xs shadow-md hover:brightness-110 active:scale-98 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('shareWhatsApp')}</span>
          </button>

          {/* Copy Summary Text */}
          <button
            onClick={handleCopySummary}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs active:scale-98 transition-all shadow-sm"
          >
            {copiedId === 'summary' ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">{t('copiedToClipboard')}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>{t('copySummary')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
