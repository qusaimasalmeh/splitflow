import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../Common/Modal';
import {
  Users,
  Plus,
  UserPlus,
  Bell,
  X,
  LogOut,
  Send,
  Check,
  Phone,
  Sparkles,
  Layers,
  Globe,
  Folder,
  Home, Plane, Pizza, PartyPopper, Umbrella, Snowflake, Car, Tent, Briefcase, Music
} from 'lucide-react';
import { calculateGroupBalances, calculateGlobalBalances } from '../../core/netting';

const ICONS_MAP: Record<string, React.FC<any>> = {
  Home, Plane, Pizza, PartyPopper, Umbrella, Snowflake, Car, Tent, Briefcase, Music
};

export const GroupsView: React.FC = () => {
  const {
    state,
    t,
    addGroup,
    addUser,
    activeGroupId,
    setActiveGroupId,
    setIsGlobalMode,
    showToast,
    acceptInvite,
    declineInvite,
    leaveGroup,
    inviteUserToGroup,
    addMemberToExistingGroup,
    inviteExistingUserToGroup
  } = useApp();

  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isInviteUserOpen, setIsInviteUserOpen] = useState(false);
  const [invitePhone, setInvitePhone] = useState('');

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupEmoji, setNewGroupEmoji] = useState('Home');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPayPal, setNewUserPayPal] = useState('');

  const iconOptions = Object.keys(ICONS_MAP);

  // Global & Active Group Balances
  const balances = useMemo(() => {
    if (!activeGroupId) {
      return calculateGlobalBalances(
        state.expenses,
        state.users.map((u) => u.id)
      );
    } else {
      const activeGroup = state.groups.find((g) => g.id === activeGroupId);
      if (!activeGroup) return {};
      return calculateGroupBalances(
        activeGroupId,
        state.expenses,
        activeGroup.memberIds
      );
    }
  }, [state.expenses, state.users, state.groups, activeGroupId]);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      showToast('Please enter a group name', 'warning');
      return;
    }
    if (selectedMemberIds.length === 0) {
      showToast('Please select at least one member', 'warning');
      return;
    }

    // Context handles making currentUser a member, and selected ones invited.
    addGroup(newGroupName.trim(), newGroupEmoji, selectedMemberIds);
    showToast(`Created group "${newGroupName}"`, 'success');
    setIsCreateGroupOpen(false);
    setNewGroupName('');
    setSelectedMemberIds([]);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) {
      showToast('Please enter a user name', 'warning');
      return;
    }

    const created = addUser(newUserName, newUserPhone, newUserPayPal);
    showToast(`Added ${created.name}`, 'success');
    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserPhone('');
    setNewUserPayPal('');
  };

  const toggleMemberSelection = (userId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="space-y-5 pb-24 text-slate-800">
      {/* 0. Pending Invites */}
      {state.currentUser && state.groups.filter(g => g.invitedUserIds?.includes(state.currentUser!.id)).length > 0 && (
        <div className="p-4 rounded-3xl bg-indigo-50 border border-indigo-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-500" />
            <span>{t('pendingInvites')}</span>
          </h3>
          <div className="space-y-2">
            {state.groups.filter(g => g.invitedUserIds?.includes(state.currentUser!.id)).map(group => (
              <div key={group.id} className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm border border-indigo-100">
                <span className="text-sm font-bold text-slate-800">{group.emoji} {group.name}</span>
                <div className="flex gap-2">
                  <button onClick={() => acceptInvite(group.id)} title={t('accept')} className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                  <button onClick={() => declineInvite(group.id)} title={t('decline')} className="p-1.5 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200">
                    <X className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1. Header with Actions */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900">{t('groups')}</h2>
          <p className="text-xs text-slate-600 font-medium">{t('manageGroupsSubtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/60 backdrop-blur-md hover:bg-white/80 border border-slate-200 text-xs font-bold text-emerald-600 active:scale-95 transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('addMember')}</span>
          </button>
          <button
            onClick={() => {
              setSelectedMemberIds(state.users.map((u) => u.id));
              setIsCreateGroupOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-500 text-white text-xs font-black shadow-glow-teal hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('createGroup')}</span>
          </button>
        </div>
      </div>

      {/* 2. Global View Card */}
      <div
        onClick={() => {
          setActiveGroupId(null);
          setIsGlobalMode(true);
        }}
        className={`p-5 rounded-3xl border transition-all cursor-pointer ${
          !activeGroupId
            ? 'bg-gradient-to-br from-emerald-50 to-white/90 border-emerald-200 shadow-sm scale-[1.01]'
            : 'bg-white/60 backdrop-blur-md border-slate-200 hover:border-emerald-200'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>{t('allGroups')}</span>
                {!activeGroupId && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase">
                    Active
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {state.groups.length} groups · {state.users.length} members · {state.expenses.length} expenses
              </p>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-emerald-500" />
        </div>
      </div>

      {/* 3. Groups Grid */}
      <div className="space-y-3">
        {state.groups.map((group) => {
          const groupExpenses = state.expenses.filter((e) => e.groupId === group.id);
          const totalGroupExpense = groupExpenses.reduce((sum, e) => sum + e.amount, 0);
          const members = state.users.filter((u) => group.memberIds.includes(u.id));
          const isActive = activeGroupId === group.id;
          
          const IconComp = group.emoji && ICONS_MAP[group.emoji] ? ICONS_MAP[group.emoji] : Folder;

          return (
            <div
              key={group.id}
              onClick={() => {
                setActiveGroupId(group.id);
                setIsGlobalMode(false);
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-emerald-50 to-white/90 border-emerald-200 shadow-sm scale-[1.01]'
                  : 'bg-white/60 backdrop-blur-md border-slate-200 shadow-sm hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-800 truncate flex items-center gap-2 flex-wrap">
                      <span className="truncate">{group.name}</span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase shrink-0">
                          Active
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {members.length} members · {groupExpenses.length} expenses
                    </p>
                  </div>
                </div>

                <div className="text-end shrink-0">
                  <p className="text-sm font-black text-emerald-600">
                    {state.currency}
                    {totalGroupExpense.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-600 uppercase font-semibold">{t('total')}</p>
                </div>
              </div>

              {/* Member Avatars Stack */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <div className="flex items-center -space-x-2 rtl:space-x-reverse overflow-hidden">
                  {members.map((m) => (
                    <div
                      key={m.id}
                      title={m.name}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: m.color || '#14b8a6' }}
                    >
                      {m.name.charAt(0)}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  {isActive ? (
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setIsInviteUserOpen(true); }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="font-bold">{t('addInviteMember')}</span>
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          leaveGroup(group.id); 
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="font-bold">{t('leaveGroup')}</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <Layers className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{t('tapToSwitch')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Member Balances Breakdown */}
      <div className="p-5 rounded-[2rem] glass-panel space-y-4 hover:shadow-xl transition-shadow">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-500" />
          <span>{activeGroupId ? t('activeGroup') : t('allGroups')} - {t('yourBalance')}</span>
        </h3>

        <div className="divide-y divide-slate-100">
          {state.users.map((user) => {
            const bal = balances[user.id] || 0;
            const isOwed = bal > 0.009;
            const owes = bal < -0.009;

            return (
              <div key={user.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: user.color || '#14b8a6' }}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                    {user.phoneNumber && (
                      <p className="text-[10px] text-slate-600 flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5" />
                        <span>{user.phoneNumber}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-end">
                  <span
                    className={`text-sm font-black ${
                      isOwed
                        ? 'text-emerald-600'
                        : owes
                        ? 'text-rose-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {isOwed ? '+' : ''}
                    {state.currency}
                    {bal.toFixed(2)}
                  </span>
                  <p className="text-[10px] font-semibold text-slate-600">
                    {isOwed ? t('youAreOwed') : owes ? t('youOwe') : t('netZero')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Create New Group */}
      <Modal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        title={t('createGroup')}
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              {t('groupName')}
            </label>
            <input
              type="text"
              required
              placeholder={t('egSummerVacation')}
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('groupIcon')}</label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((iconName) => {
                const IconComponent = ICONS_MAP[iconName];
                return (
                  <button
                    type="button"
                    key={iconName}
                    onClick={() => setNewGroupEmoji(iconName)}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${
                      newGroupEmoji === iconName
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-600 scale-110 shadow-sm'
                        : 'bg-white/60 backdrop-blur-md border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              {t('members')} ({t('selectAllThatApply')})
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {state.users.filter(u => u.id !== state.currentUser?.id).map((u) => {
                const isSelected = selectedMemberIds.includes(u.id);
                return (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => toggleMemberSelection(u.id)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                        : 'bg-white/60 backdrop-blur-md border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="truncate">{u.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-500 text-white font-extrabold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            {t('createGroup')}
          </button>
        </form>
      </Modal>

      {/* Modal: Add User */}
      <Modal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} title={t('addMember')}>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              {t('userName')}
            </label>
            <input
              type="text"
              required
              placeholder={t('egSarah')}
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              {t('phoneOptional')}
            </label>
            <input
              type="tel"
              placeholder="+1234567890"
              value={newUserPhone}
              onChange={(e) => setNewUserPhone(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              {t('payPalOptional')}
            </label>
            <input
              type="text"
              placeholder={t('egSarah123')}
              value={newUserPayPal}
              onChange={(e) => setNewUserPayPal(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-500 text-white font-extrabold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            {t('addMember')}
          </button>
        </form>
      </Modal>
      {/* Modal: Invite User */}
      <Modal isOpen={isInviteUserOpen} onClose={() => setIsInviteUserOpen(false)} title={t('addInviteMember')}>
        <div className="space-y-6">
          {/* Section 1: From Contacts */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">{t('fromYourContacts')}</label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
              {state.users
                .filter(u => u.id !== state.currentUser?.id)
                .filter(u => {
                  const group = state.groups.find(g => g.id === activeGroupId);
                  return group && !group.memberIds.includes(u.id) && !(group.invitedUserIds?.includes(u.id));
                })
                .map(u => {
                  const isGhost = !!u.createdBy;
                  return (
                    <button
                      type="button"
                      key={u.id}
                      onClick={() => {
                        if (!activeGroupId) return;
                        if (isGhost) {
                          addMemberToExistingGroup(activeGroupId, u.id);
                          showToast(`Added ${u.name} to group`, 'success');
                        } else {
                          inviteExistingUserToGroup(activeGroupId, u.id);
                          showToast(`Invite sent to ${u.name}`, 'success');
                        }
                        setIsInviteUserOpen(false);
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                          style={{ backgroundColor: u.color || '#14b8a6' }}
                        >
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{u.name}</div>
                          <div className="text-[10px] font-semibold text-slate-500">
                            {isGhost ? 'Offline Ghost (Instantly Add)' : 'Registered Account (Send Invite)'}
                          </div>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-emerald-200 flex items-center justify-center text-slate-500 group-hover:text-emerald-700 transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })
              }
              {state.users.filter(u => u.id !== state.currentUser?.id).filter(u => {
                  const group = state.groups.find(g => g.id === activeGroupId);
                  return group && !group.memberIds.includes(u.id) && !(group.invitedUserIds?.includes(u.id));
              }).length === 0 && (
                <p className="text-xs text-center text-slate-500 py-3 bg-slate-50 rounded-xl">{t('noContactsAvailable')}</p>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center"><span className="bg-white px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('or')}</span></div>
          </div>

          {/* Section 2: Invite by Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">{t('inviteNewUserPhone')}</label>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder={t('enterPhoneNumber')}
                value={invitePhone}
                onChange={(e) => setInvitePhone(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  if (!invitePhone || !activeGroupId) return;
                  const success = inviteUserToGroup(activeGroupId, invitePhone.trim());
                  if (success) {
                    showToast(t('inviteSent'), 'success');
                    setIsInviteUserOpen(false);
                    setInvitePhone('');
                  } else {
                    showToast(t('userNotFound'), 'warning');
                  }
                }}
                disabled={!invitePhone}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-900 disabled:opacity-50 transition-all shadow-sm"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
};
