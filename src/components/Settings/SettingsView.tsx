import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../Common/Modal';
import {
  ShieldAlert,
  Plus,
  Trash2,
  Globe,
  DollarSign,
  History,
  RotateCcw,
  AlertTriangle,
  Info,
  Download,
  Upload,
  FileSpreadsheet,
  User as UserIcon,
  Save,
  Monitor,
} from 'lucide-react';
import { Language } from '../../i18n';
import { exportExpensesToCsv, exportSettlementsToCsv } from '../../core/splitUtils';
import {
  calculateSocialConstrainedGlobalSettlements,
} from '../../core/netting';

export const SettingsView: React.FC = () => {
  const {
    state,
    t,
    addConstraint,
    removeConstraint,
    setLanguage,
    setCurrency,
    setUiScale,
    resetAllData,
    showToast,
    updateCurrentUser,
  } = useApp();

  const [isAddExclusionOpen, setIsAddExclusionOpen] = useState(false);
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(state.currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(state.currentUser?.phoneNumber || '');
  const [editPayPal, setEditPayPal] = useState(state.currentUser?.payPalUsername || '');

  // Update effect if currentUser changes
  React.useEffect(() => {
    if (state.currentUser && !isEditingProfile) {
      setEditName(state.currentUser.name);
      setEditPhone(state.currentUser.phoneNumber || '');
      setEditPayPal(state.currentUser.payPalUsername || '');
    }
  }, [state.currentUser, isEditingProfile]);

  // Exclusion Form State
  const [fromUser, setFromUser] = useState(state.users[0]?.id || '');
  const [toUser, setToUser] = useState(state.users[1]?.id || '');
  const [reason, setReason] = useState('');

  const currencies = [
    { symbol: '$', label: 'USD ($)' },
    { symbol: '€', label: 'EUR (€)' },
    { symbol: '₪', label: 'ILS (₪)' },
    { symbol: 'SAR', label: 'SAR (ر.س)' },
    { symbol: 'AED', label: 'AED (د.إ)' },
    { symbol: 'EGP', label: 'EGP (ج.م)' },
    { symbol: 'JOD', label: 'JOD (د.أ)' },
    { symbol: '£', label: 'GBP (£)' },
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ar', label: 'العربية (Arabic)', flag: '🇸🇦' },
    { code: 'he', label: 'עברית (Hebrew)', flag: '🇮🇱' },
  ];

  const userMap = new Map<string, string>();
  state.users.forEach((u) => userMap.set(u.id, u.name));

  const groupMap = new Map<string, string>();
  state.groups.forEach((g) => groupMap.set(g.id, g.name));

  const handleAddConstraint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromUser || !toUser) {
      showToast('Please select both users', 'warning');
      return;
    }
    if (fromUser === toUser) {
      showToast('Users must be different', 'warning');
      return;
    }

    addConstraint(fromUser, toUser, reason.trim() || undefined);
    showToast('Payment exclusion added', 'success');
    setIsAddExclusionOpen(false);
    setReason('');
  };

  const handleExportExpensesCsv = () => {
    const csvContent = exportExpensesToCsv(state.expenses, userMap, groupMap);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `splitflow_expenses_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Expenses CSV downloaded', 'success');
  };

  const handleExportSettlementsCsv = () => {
    const settlements = calculateSocialConstrainedGlobalSettlements(
      state.expenses,
      state.groups,
      state.users.map((u) => u.id),
      state.constraints
    );
    const csvContent = exportSettlementsToCsv(settlements, userMap);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `splitflow_settlements_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Settlements CSV downloaded', 'success');
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `splitflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('State backup downloaded', 'success');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed.users) && Array.isArray(parsed.groups)) {
            localStorage.setItem('splitflow_state_v1', JSON.stringify(parsed));
            window.location.reload();
          } else {
            showToast('Invalid JSON backup file', 'warning');
          }
        } catch {
          showToast('Failed to parse file', 'warning');
        }
      };
    }
  };

  return (
    <div className="space-y-5 pb-24 text-slate-800">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight text-slate-900">{t('settings')}</h2>
        <p className="text-xs text-slate-600 font-medium">Preferences, exports & profile</p>
      </div>

      {/* 0. {t('myProfile')} (if logged in) */}
      {state.currentUser && (
        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 shadow-glass-lg space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900">{t('myProfile')}</h3>
            </div>
            {!isEditingProfile ? (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-bold active:scale-95 transition-all"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={() => {
                  updateCurrentUser(editName, editPhone, editPayPal);
                  setIsEditingProfile(false);
                  showToast('Profile updated successfully');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 border border-indigo-600 text-white text-xs font-bold active:scale-95 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t('save')}</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">{t('nameLabel')}</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/60 backdrop-blur-md border border-slate-200 rounded-xl text-xs font-semibold focus:border-indigo-400 focus:outline-none"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-800">{state.currentUser.name}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">{t('phoneNumberLabel')}</label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    placeholder="+123..."
                    className="w-full px-3 py-2 bg-white/60 backdrop-blur-md border border-slate-200 rounded-xl text-xs font-semibold focus:border-indigo-400 focus:outline-none"
                  />
                ) : (
                  <p className="text-xs font-medium text-slate-600">{state.currentUser.phoneNumber || 'Not set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">{t('paypalUsernameLabel')}</label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    value={editPayPal}
                    onChange={e => setEditPayPal(e.target.value)}
                    placeholder={t('usernamePlaceholder')}
                    className="w-full px-3 py-2 bg-white/60 backdrop-blur-md border border-slate-200 rounded-xl text-xs font-semibold focus:border-indigo-400 focus:outline-none"
                  />
                ) : (
                  <p className="text-xs font-medium text-slate-600">{state.currentUser.payPalUsername || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. Payment Exclusions (Blacklists) Manager */}
      <div className="p-5 rounded-[2rem] glass-panel space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-slate-900">{t('blacklistManager')}</h3>
          </div>
          <button
            onClick={() => setIsAddExclusionOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addExclusion')}</span>
          </button>
        </div>

        <p className="text-xs text-slate-600/80 leading-relaxed flex items-start gap-1.5">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{t('blacklistDescription')}</span>
        </p>

        {/* Active Constraints List */}
        {state.constraints.length === 0 ? (
          <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200 text-center text-xs text-slate-600">
            {t('noExclusions')}
          </div>
        ) : (
          <div className="space-y-2">
            {state.constraints.map((c) => {
              const fromName = userMap.get(c.fromUserId) || 'User';
              const toName = userMap.get(c.toUserId) || 'User';

              return (
                <div
                  key={c.id}
                  className="p-3 rounded-2xl bg-rose-50 border border-rose-500/30 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-slate-900">{fromName}</span>
                    <span className="text-rose-400 font-bold px-1.5 py-0.5 rounded-md bg-rose-500/10">
                      ⊘
                    </span>
                    <span className="font-bold text-slate-900">{toName}</span>
                    {c.reason && (
                      <span className="text-[10px] text-slate-600 italic truncate">
                        ({c.reason})
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      removeConstraint(c.id);
                      showToast('Exclusion removed', 'info');
                    }}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 transition-colors"
                    aria-label={t('removeExclusion')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Language & Currency Settings */}
      <div className="p-5 rounded-[2rem] glass-panel space-y-4">
        {/* Language */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-400" />
            {t('language')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  state.language === lang.code
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-700 shadow-glow-teal'
                    : 'bg-white/60 backdrop-blur-md border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* UI Scale */}
        <div className="pt-2 border-t border-slate-200">
          <label className="block text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-emerald-400" />
            {t('uiScaleLabel')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['normal', 'large', 'xlarge'] as const).map((scale) => (
              <button
                key={scale}
                onClick={() => setUiScale(scale)}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  state.uiScale === scale
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-700 shadow-glow-teal'
                    : 'bg-white/60 backdrop-blur-md border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <span>
                  {scale === 'normal'
                    ? t('uiScaleNormal')
                    : scale === 'large'
                    ? t('uiScaleLarge')
                    : t('uiScaleXLarge')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Currency */}
        <div className="pt-2 border-t border-slate-200">
          <label className="block text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            {t('currency')}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {currencies.map((curr) => (
              <button
                key={curr.symbol}
                onClick={() => setCurrency(curr.symbol)}
                className={`py-2 px-2 rounded-2xl border text-xs font-bold transition-all ${
                  state.currency === curr.symbol
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-700 shadow-glow-teal'
                    : 'bg-white/60 backdrop-blur-md border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                {curr.symbol}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Export & Backup Center */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200  shadow-glass-lg space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" />
          <span>{t('dataExportBackup')}</span>
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {/* Expenses CSV */}
          <button
            onClick={handleExportExpensesCsv}
            className="p-3 rounded-2xl bg-white/60 backdrop-blur-md hover:bg-white/80 border border-slate-200 text-start space-y-1 transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <p className="text-xs font-bold text-slate-900">{t('expensesCSV')}</p>
            <p className="text-[10px] text-slate-600">{t('downloadExpenses')}</p>
          </button>

          {/* Settlements CSV */}
          <button
            onClick={handleExportSettlementsCsv}
            className="p-3 rounded-2xl bg-white/60 backdrop-blur-md hover:bg-white/80 border border-slate-200 text-start space-y-1 transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <p className="text-xs font-bold text-slate-900">{t('settlementsCSV')}</p>
            <p className="text-[10px] text-slate-600">{t('downloadSettlements')}</p>
          </button>

          {/* Backup JSON */}
          <button
            onClick={handleExportJson}
            className="p-3 rounded-2xl bg-white/60 backdrop-blur-md hover:bg-white/80 border border-slate-200 text-start space-y-1 transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <p className="text-xs font-bold text-slate-900">{t('exportBackup')}</p>
            <p className="text-[10px] text-slate-600">{t('saveFullState')}</p>
          </button>

          {/* Restore JSON */}
          <label className="p-3 rounded-2xl bg-white/60 backdrop-blur-md hover:bg-white/80 border border-slate-200 text-start space-y-1 transition-all active:scale-95 cursor-pointer block">
            <Upload className="w-4 h-4 text-purple-400" />
            <p className="text-xs font-bold text-slate-900">{t('importBackup')}</p>
            <p className="text-[10px] text-slate-600">{t('restoreFromJson')}</p>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
        </div>
      </div>

      {/* 4. Audit Trail */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200  shadow-glass-lg space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          <span>{t('auditTrail')}</span>
        </h3>

        {state.auditLogs.length === 0 ? (
          <p className="text-xs text-slate-600 text-center py-3">{t('emptyAudit')}</p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {state.auditLogs.slice(0, 15).map((log) => {
              const timeStr = new Date(log.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              const desc =
                log.description[state.language] || log.description.en || 'Audit record';

              return (
                <div
                  key={log.id}
                  className="p-2.5 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200 text-[11px] flex items-start justify-between gap-2"
                >
                  <span className="text-slate-600 font-medium leading-snug">{desc}</span>
                  <span className="text-[10px] text-slate-600 shrink-0 font-mono">{timeStr}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Reset Data Section */}
      <div className="pt-2">
        <button
          onClick={() => setIsConfirmResetOpen(true)}
          className="w-full py-3.5 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('clearAllData')}</span>
        </button>
      </div>

      {/* Modal: Add Exclusion */}
      <Modal
        isOpen={isAddExclusionOpen}
        onClose={() => setIsAddExclusionOpen(false)}
        title={t('addExclusion')}
      >
        <form onSubmit={handleAddConstraint} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              From User (Debtor)
            </label>
            <select
              value={fromUser}
              onChange={(e) => setFromUser(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-rose-400"
            >
              {state.users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center py-1 text-rose-400 text-xs font-bold gap-2">
            <span>⊘ {t('userCannotPay')}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              To User (Creditor)
            </label>
            <select
              value={toUser}
              onChange={(e) => setToUser(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-rose-400"
            >
              {state.users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              {t('reasonOptional')}
            </label>
            <input
              type="text"
              placeholder={t('mutualPreferenceExample')}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-rose-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-xs shadow-lg hover:brightness-110 active:scale-98 transition-all"
          >
            {t('save')}
          </button>
        </form>
      </Modal>

      {/* Modal: Confirm Reset */}
      <Modal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        title={t('clearAllData')}
      >
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{t('confirmClear')}</p>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => setIsConfirmResetOpen(false)}
              className="py-3 rounded-2xl bg-white text-slate-600 font-bold text-xs"
            >
              {t('cancel')}
            </button>
            <button
              onClick={() => {
                resetAllData();
                setIsConfirmResetOpen(false);
              }}
              className="py-3 rounded-2xl bg-rose-500 text-white font-bold text-xs"
            >
              {t('clearAllData')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
