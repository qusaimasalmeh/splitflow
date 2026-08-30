import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../Common/Modal';
import { InfoTooltip } from '../Help/InfoTooltip';
import { Check, DollarSign, Tag, UserCheck, Users, Sliders, Folder, Home, Plane, Pizza, PartyPopper, Umbrella, Snowflake, Car, Tent, Briefcase, Music } from 'lucide-react';
import { SplitMode, calculateSplitAmounts } from '../../core/splitUtils';

const ICONS_MAP: Record<string, React.FC<any>> = {
  Home, Plane, Pizza, PartyPopper, Umbrella, Snowflake, Car, Tent, Briefcase, Music
};

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const { state, t, addExpense, showToast } = useApp();

  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [payerId, setPayerId] = useState<string>('');
  const [amountStr, setAmountStr] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [splitMode, setSplitMode] = useState<SplitMode>('equal');
  const [customValues, setCustomValues] = useState<Record<string, number>>({});
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);

  const currentGroup = state.groups.find((g) => g.id === selectedGroupId) || state.groups[0];
  const groupMembers = state.users.filter((u) => currentGroup?.memberIds.includes(u.id));

  // Auto-initialize group and payer
  useEffect(() => {
    if (isOpen) {
      const initialGroup =
        state.groups.find((g) => g.id === state.activeGroupId) || state.groups[0];
      if (initialGroup) {
        setSelectedGroupId(initialGroup.id);
        if (initialGroup.memberIds.length > 0) {
          setPayerId(initialGroup.memberIds[0]);
        }
        setSelectedParticipantIds(initialGroup.memberIds);
      }
      setAmountStr('');
      setDescription('');
      setSplitMode('equal');
      setCustomValues({});
    }
  }, [isOpen, state.activeGroupId, state.groups]);

  const handleGroupChange = (newGroupId: string) => {
    setSelectedGroupId(newGroupId);
    const grp = state.groups.find((g) => g.id === newGroupId);
    if (grp) {
      if (!grp.memberIds.includes(payerId)) {
        setPayerId(grp.memberIds[0] || '');
      }
      setSelectedParticipantIds(grp.memberIds);
    }
  };

  const quickTags = [
    { label: 'Coffee', value: 'Coffee' },
    { label: 'Dinner', value: 'Dinner' },
    { label: 'Groceries', value: 'Groceries' },
    { label: 'Uber/Taxi', value: 'Taxi' },
    { label: 'Rent/Bills', value: 'Rent' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amountStr);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('Please enter a valid amount', 'warning');
      return;
    }

    if (!description.trim()) {
      showToast('Please provide a description', 'warning');
      return;
    }

    if (!payerId || !selectedGroupId) {
      showToast('Please select a payer and group', 'warning');
      return;
    }

    if (splitMode === 'equal' && selectedParticipantIds.length === 0) {
      showToast('Please select at least 1 participant', 'warning');
      return;
    }

    const participants =
      splitMode === 'equal'
        ? calculateSplitAmounts(parsedAmount, selectedParticipantIds, 'equal')
        : calculateSplitAmounts(
            parsedAmount,
            groupMembers.map((m) => m.id),
            splitMode,
            customValues
          );

    addExpense({
      groupId: selectedGroupId,
      description: description.trim(),
      amount: parsedAmount,
      payerId,
      participants,
    });

    showToast(`Added: ${description} (${state.currency}${parsedAmount})`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('quickAdd')}>
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-800">
        {/* 1. Group Selector */}
        {state.groups.length > 1 && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              {t('selectGroup')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {state.groups.map((g) => {
                const GroupIcon = g.emoji && ICONS_MAP[g.emoji] ? ICONS_MAP[g.emoji] : Folder;
                return (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => handleGroupChange(g.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-medium transition-all ${
                      selectedGroupId === g.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                        : 'bg-white/60 backdrop-blur-md border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <GroupIcon className="w-4 h-4 text-emerald-500" />
                    <span className="truncate">{g.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* 2. Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            {t('amount')}
          </label>
          <div className="relative">
            <span className="absolute start-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-emerald-500">
              {state.currency}
            </span>
            <input
              type="number"
              step="0.01"
              required
              autoFocus
              placeholder="0.00"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full ps-12 pe-4 py-3.5 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl text-2xl font-black text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20  transition-all shadow-sm"
            />
          </div>
        </div>

        {/* 3. Description & Quick Chips */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            {t('description')}
          </label>
          <input
            type="text"
            required
            placeholder={t('egDinner')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20  transition-all mb-2 shadow-sm"
          />

          {/* Quick Tag Suggestions */}
          <div className="flex flex-wrap gap-1.5">
            {quickTags.map((tag) => (
              <button
                type="button"
                key={tag.value}
                onClick={() => setDescription(tag.value)}
                className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-600 transition-all active:scale-95 shadow-sm"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Who Paid Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            {t('payer')}
          </label>
          <div className="flex flex-wrap gap-2">
            {groupMembers.map((member) => (
              <button
                type="button"
                key={member.id}
                onClick={() => setPayerId(member.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl border text-xs font-semibold transition-all ${
                  payerId === member.id
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-500 border-emerald-500 text-white shadow-md scale-105'
                    : 'bg-white/60 backdrop-blur-md border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
                  style={{ backgroundColor: member.color || '#14b8a6' }}
                >
                  {member.name.charAt(0)}
                </div>
                <span>{member.name}</span>
                {payerId === member.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Split Modes (Equal / Exact / % / Shares) */}
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('splitMode')}</span>
            <InfoTooltip 
              content={
                <ul className="space-y-1">
                  <li>{t('helpSplitEqual')}</li>
                  <li>{t('helpSplitExact')}</li>
                  <li>{t('helpSplitPct')}</li>
                  <li>{t('helpSplitParts')}</li>
                </ul>
              }
            />
          </label>

          <div className="grid grid-cols-4 gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setSplitMode('equal')}
              className={`py-1.5 rounded-xl font-bold transition-all text-center ${
                splitMode === 'equal'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-700'
              }`}
            >
              = Equal
            </button>
            <button
              type="button"
              onClick={() => setSplitMode('exact')}
              className={`py-1.5 rounded-xl font-bold transition-all text-center ${
                splitMode === 'exact'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-700'
              }`}
            >
              $ Exact
            </button>
            <button
              type="button"
              onClick={() => setSplitMode('percentage')}
              className={`py-1.5 rounded-xl font-bold transition-all text-center ${
                splitMode === 'percentage'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-700'
              }`}
            >
              % Pct
            </button>
            <button
              type="button"
              onClick={() => setSplitMode('shares')}
              className={`py-1.5 rounded-xl font-bold transition-all text-center ${
                splitMode === 'shares'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-700'
              }`}
            >
              Parts
            </button>
          </div>

          {/* Equal Split Participants Selection */}
          {splitMode === 'equal' && (
            <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">
                  {t('splitWithCount').replace('{count}', String(selectedParticipantIds.length))}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedParticipantIds.length === groupMembers.length) {
                      setSelectedParticipantIds(payerId ? [payerId] : (groupMembers[0] ? [groupMembers[0].id] : []));
                    } else {
                      setSelectedParticipantIds(groupMembers.map((m) => m.id));
                    }
                  }}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {selectedParticipantIds.length === groupMembers.length ? t('deselectAll') : t('selectAll')}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {groupMembers.map((member) => {
                  const isSelected = selectedParticipantIds.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          if (selectedParticipantIds.length > 1) {
                            setSelectedParticipantIds(selectedParticipantIds.filter((id) => id !== member.id));
                          } else {
                            showToast('Must have at least 1 participant', 'warning');
                          }
                        } else {
                          setSelectedParticipantIds([...selectedParticipantIds, member.id]);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 opacity-60'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white font-bold"
                        style={{ backgroundColor: member.color || '#14b8a6' }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <span>{member.name}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {amountStr && parseFloat(amountStr) > 0 && selectedParticipantIds.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-200 text-end text-[11px] text-emerald-600 font-bold">
                  {t('splitEquallyBetween')} {selectedParticipantIds.length}: {state.currency}
                  {(parseFloat(amountStr) / selectedParticipantIds.length).toFixed(2)} / person
                </div>
              )}
            </div>
          )}

          {/* Custom Split Inputs */}
          {splitMode !== 'equal' && (
            <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <p className="text-xs text-emerald-700 font-semibold">
                {splitMode === 'exact'
                  ? 'Enter exact dollar amount per person:'
                  : splitMode === 'percentage'
                  ? 'Enter percentage per person (e.g. 50, 30, 20):'
                  : 'Enter relative shares per person (e.g. 2 for couple, 1 for single):'}
              </p>

              {groupMembers.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-700 font-medium truncate">{m.name}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step={splitMode === 'exact' ? '0.01' : '1'}
                      placeholder={splitMode === 'shares' ? '1' : '0'}
                      value={customValues[m.id] ?? ''}
                      onChange={(e) =>
                        setCustomValues({
                          ...customValues,
                          [m.id]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-24 px-3 py-1.5 bg-white/60 backdrop-blur-md border border-slate-200 rounded-xl text-end font-bold text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm"
                    />
                    <span className="text-slate-600 text-xs font-bold w-4">
                      {splitMode === 'exact' ? state.currency : splitMode === 'percentage' ? '%' : 'x'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-400 text-white font-extrabold text-base shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>{t('addExpense')}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
