import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, User, Group, Expense, PaymentConstraint, Settlement, AuditLog } from '../types';
import { decodeStateFromUrlParam } from '../utils/urlEncoder';
import { translations, Language } from '../i18n';
import confetti from 'canvas-confetti';

const SESSION_KEY = 'splitflow_session_v3';
const LOCAL_DATA_KEY = 'splitflow_data_local_v3';
const GLOBAL_DATA_KEY = 'splitflow_data_global_v3';
const DEMO_DATA_KEY = 'splitflow_data_demo_v3';

export const dummyUsers: User[] = [
  { id: 'u_qusai', name: 'Qusai', color: '#14b8a6', phoneNumber: '+1234567890', payPalUsername: 'qusai_spl' },
  { id: 'u_aviv', name: 'Aviv', color: '#8b5cf6', phoneNumber: '+1987654321', payPalUsername: 'aviv_spl' },
  { id: 'u_tuvia', name: 'Tuvia', color: '#f59e0b', phoneNumber: '+1555444333' },
];

const defaultInitialState: AppState = {
  users: dummyUsers, // Start with dummy users available
  groups: [],
  expenses: [],
  constraints: [],
  settlements: [],
  auditLogs: [],
  activeGroupId: null,
  currency: 'ILS',
  language: 'en',
  uiScale: 'large',
  authStatus: 'landing',
  currentUser: null,
};

interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'warning';
}

interface AppContextType {
  state: AppState;
  t: (key: keyof typeof translations['en']) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
  setUiScale: (scale: 'normal' | 'large' | 'xlarge') => void;
  currency: string;
  setCurrency: (curr: string) => void;
  activeGroupId: string | null;
  setActiveGroupId: (id: string | null) => void;
  addUser: (name: string, phoneNumber?: string, payPalUsername?: string) => User;
  addGroup: (name: string, emoji: string, memberIds: string[]) => Group;
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  deleteExpense: (expenseId: string) => void;
  addConstraint: (fromUserId: string, toUserId: string, reason?: string) => void;
  removeConstraint: (constraintId: string) => void;
  toggleSettlementPaid: (settlement: Settlement | string) => void;
  resetAllData: () => void;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  isGlobalMode: boolean;
  setIsGlobalMode: (val: boolean) => void;
  setHasSeenOnboarding: (val: boolean) => void;
  fireCelebration: () => void;
  
  // Auth & Profile
  login: (user: User) => void;
  runLocal: () => void;
  runDemo: () => void;
  signOut: () => void;
  updateCurrentUser: (name: string, phoneNumber?: string, payPalUsername?: string) => void;

  // Invites
  inviteUserToGroup: (groupId: string, phoneNumber: string) => boolean;
  addMemberToExistingGroup: (groupId: string, userId: string) => void;
  inviteExistingUserToGroup: (groupId: string, userId: string) => void;
  acceptInvite: (groupId: string) => void;
  declineInvite: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawState, setRawState] = useState<AppState>(() => {
    if (typeof window === 'undefined') return defaultInitialState;

    // 1. Check URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    if (dataParam) {
      const decoded = decodeStateFromUrlParam(dataParam);
      if (decoded) return decoded;
    }

    // 2. Read Session
    try {
      const sessionStr = localStorage.getItem(SESSION_KEY);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        
        // 3. Load corresponding data
        let dataStr = null;
        if (session.authStatus === 'logged_in') {
          dataStr = localStorage.getItem(GLOBAL_DATA_KEY);
        } else if (session.authStatus === 'local') {
          dataStr = localStorage.getItem(LOCAL_DATA_KEY);
        } else if (session.authStatus === 'demo') {
          dataStr = localStorage.getItem(DEMO_DATA_KEY);
        }

        if (dataStr) {
          const data = JSON.parse(dataStr);
          return {
            ...defaultInitialState,
            ...data,
            authStatus: session.authStatus,
            currentUser: session.currentUser,
          };
        }
      }
    } catch (err) {
      console.error('Failed to parse state from localStorage', err);
    }
    
    return defaultInitialState;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isGlobalMode, setIsGlobalMode] = useState<boolean>(true);

  // Sync direction and UI scale
  useEffect(() => {
    const isRtl = rawState.language === 'ar' || rawState.language === 'he';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = rawState.language;
    document.documentElement.setAttribute('data-ui-scale', rawState.uiScale || 'large');
  }, [rawState.language, rawState.uiScale]);

  // Persist rawState to localStorage on every change
  useEffect(() => {
    try {
      const sessionData = {
        authStatus: rawState.authStatus,
        currentUser: rawState.currentUser,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

      if (rawState.authStatus === 'logged_in') {
        localStorage.setItem(GLOBAL_DATA_KEY, JSON.stringify(rawState));
      } else if (rawState.authStatus === 'local') {
        localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(rawState));
      } else if (rawState.authStatus === 'demo') {
        localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(rawState));
      }
    } catch (err) {
      console.error('Failed to save state to localStorage', err);
    }
  }, [rawState]);

  // LOGICAL ISOLATION: Compute the state visible to the current user
  const computedState = useMemo(() => {
    if (rawState.authStatus === 'logged_in' && rawState.currentUser) {
      const cid = rawState.currentUser.id;
      // User only sees groups they are members of, or invited to
      const visibleGroups = rawState.groups.filter(g => 
        g.memberIds.includes(cid) || (g.invitedUserIds && g.invitedUserIds.includes(cid))
      );
      
      const visibleGroupIds = new Set(visibleGroups.map(g => g.id));
      
      // User only sees expenses in visible groups
      const visibleExpenses = rawState.expenses.filter(e => visibleGroupIds.has(e.groupId));

      // User only sees themselves, members of visible groups, and users they created (ghosts)
      const visibleUsers = rawState.users.filter(u => 
        u.id === cid || 
        u.createdBy === cid || 
        visibleGroups.some(g => g.memberIds.includes(u.id) || g.invitedUserIds?.includes(u.id))
      );

      // Make sure activeGroupId is valid
      let activeGroupId = rawState.activeGroupId;
      if (activeGroupId && !visibleGroupIds.has(activeGroupId)) {
        activeGroupId = null;
      }

      return {
        ...rawState,
        groups: visibleGroups,
        expenses: visibleExpenses,
        users: visibleUsers,
        activeGroupId,
      };
    }
    return rawState;
  }, [rawState]);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fireCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  const t = useCallback(
    (key: keyof typeof translations['en']): string => {
      const currentDict = translations[computedState.language] || translations.en;
      return currentDict[key] || translations.en[key] || String(key);
    },
    [computedState.language]
  );

  const setLanguage = useCallback((lang: Language) => {
    setRawState((prev) => ({ ...prev, language: lang }));
  }, []);

  const setUiScale = useCallback((scale: 'normal' | 'large' | 'xlarge') => {
    setRawState((prev) => ({ ...prev, uiScale: scale }));
  }, []);

  const setCurrency = useCallback((currency: string) => {
    setRawState((prev) => ({ ...prev, currency }));
  }, []);

  const setActiveGroupId = useCallback((activeGroupId: string | null) => {
    setRawState((prev) => ({ ...prev, activeGroupId }));
  }, []);

  const setHasSeenOnboarding = useCallback((val: boolean) => {
    setRawState(prev => ({ ...prev, hasSeenOnboarding: val }));
  }, []);

  const login = useCallback((user: User) => {
    let dataStr = null;
    try {
      dataStr = localStorage.getItem(GLOBAL_DATA_KEY);
    } catch (e) {}

    if (dataStr) {
      const data = JSON.parse(dataStr);
      // Ensure dummy users exist if it's an old save
      const mergedUsers = [...data.users];
      dummyUsers.forEach(du => {
        if (!mergedUsers.find(u => u.id === du.id)) {
          mergedUsers.push(du);
        }
      });
      setRawState({
        ...data,
        users: mergedUsers,
        authStatus: 'logged_in',
        currentUser: user,
      });
    } else {
      setRawState({
        ...defaultInitialState,
        users: dummyUsers,
        authStatus: 'logged_in',
        currentUser: user,
      });
    }
  }, []);

  const runLocal = useCallback(() => {
    let dataStr = null;
    try {
      dataStr = localStorage.getItem(LOCAL_DATA_KEY);
    } catch (e) {}

    if (dataStr) {
      const data = JSON.parse(dataStr);
      setRawState({
        ...data,
        authStatus: 'local',
        currentUser: null,
      });
    } else {
      setRawState({
        ...defaultInitialState,
        authStatus: 'local',
        currentUser: null,
      });
    }
  }, []);

  const runDemo = useCallback(() => {
    let dataStr = null;
    try {
      dataStr = localStorage.getItem(DEMO_DATA_KEY);
    } catch (e) {}

    if (dataStr) {
      const data = JSON.parse(dataStr);
      setRawState({
        ...data,
        authStatus: 'demo',
        currentUser: null,
      });
    } else {
      const demoMe = { id: 'u_demo_me', name: 'Demo User', color: '#10b981', phoneNumber: '+1000000000', createdBy: 'u_demo_me' };
      const demoAlice = { id: 'u_demo_alice', name: 'Alice', color: '#3b82f6', phoneNumber: '+1000000001', createdBy: 'u_demo_me' };
      const demoBob = { id: 'u_demo_bob', name: 'Bob', color: '#f59e0b', phoneNumber: '+1000000002', createdBy: 'u_demo_me' };
      const demoCharlie = { id: 'u_demo_charlie', name: 'Charlie', color: '#8b5cf6', phoneNumber: '+1000000003', createdBy: 'u_demo_me' };
      const demoDiana = { id: 'u_demo_diana', name: 'Diana', color: '#ec4899', phoneNumber: '+1000000004', createdBy: 'u_demo_me' };
      const demoEthan = { id: 'u_demo_ethan', name: 'Ethan', color: '#14b8a6', phoneNumber: '+1000000005', createdBy: 'u_demo_me' };
      
      const users = [demoMe, demoAlice, demoBob, demoCharlie, demoDiana, demoEthan];
      
      const group1 = {
        id: 'g_trip', name: 'Paris Trip', emoji: '✈️',
        memberIds: ['u_demo_me', 'u_demo_alice', 'u_demo_bob', 'u_demo_charlie'],
        createdAt: Date.now() - 86400000 * 5,
      };
      const group2 = {
        id: 'g_apt', name: 'Apartment', emoji: '🏠',
        memberIds: ['u_demo_me', 'u_demo_charlie', 'u_demo_diana'],
        createdAt: Date.now() - 86400000 * 30,
      };
      const group3 = {
        id: 'g_lunch', name: 'Work Lunch', emoji: '🍱',
        memberIds: ['u_demo_me', 'u_demo_alice', 'u_demo_ethan'],
        createdAt: Date.now() - 86400000 * 1,
      };
      
      const expenses = [
        {
          id: 'e_1', groupId: 'g_trip', description: 'Flights', amount: 2000, payerId: 'u_demo_alice',
          date: Date.now() - 86400000 * 4, category: 'travel',
          participants: [
            { userId: 'u_demo_me', amount: 500 }, { userId: 'u_demo_alice', amount: 500 },
            { userId: 'u_demo_bob', amount: 500 }, { userId: 'u_demo_charlie', amount: 500 }
          ],
        },
        {
          id: 'e_2', groupId: 'g_trip', description: 'Airbnb', amount: 1600, payerId: 'u_demo_me',
          date: Date.now() - 86400000 * 3, category: 'housing',
          participants: [
            { userId: 'u_demo_me', amount: 400 }, { userId: 'u_demo_alice', amount: 400 },
            { userId: 'u_demo_bob', amount: 400 }, { userId: 'u_demo_charlie', amount: 400 }
          ],
        },
        {
          id: 'e_3', groupId: 'g_apt', description: 'Internet', amount: 150, payerId: 'u_demo_charlie',
          date: Date.now() - 86400000 * 2, category: 'utilities',
          participants: [
            { userId: 'u_demo_me', amount: 50 }, { userId: 'u_demo_charlie', amount: 50 }, { userId: 'u_demo_diana', amount: 50 }
          ],
        },
        {
          id: 'e_4', groupId: 'g_apt', description: 'Groceries', amount: 300, payerId: 'u_demo_diana',
          date: Date.now() - 86400000 * 1, category: 'food',
          participants: [
            { userId: 'u_demo_me', amount: 100 }, { userId: 'u_demo_charlie', amount: 100 }, { userId: 'u_demo_diana', amount: 100 }
          ],
        },
        {
          id: 'e_5', groupId: 'g_lunch', description: 'Sushi', amount: 120, payerId: 'u_demo_ethan',
          date: Date.now() - 3600000 * 5, category: 'food',
          participants: [
            { userId: 'u_demo_me', amount: 40 }, { userId: 'u_demo_alice', amount: 40 }, { userId: 'u_demo_ethan', amount: 40 }
          ],
        },
        {
          id: 'e_6', groupId: 'g_lunch', description: 'Coffee', amount: 30, payerId: 'u_demo_alice',
          date: Date.now() - 3600000 * 1, category: 'food',
          participants: [
            { userId: 'u_demo_me', amount: 10 }, { userId: 'u_demo_alice', amount: 10 }, { userId: 'u_demo_ethan', amount: 10 }
          ],
        }
      ];

      const constraints: PaymentConstraint[] = [];

      setRawState({
        ...defaultInitialState,
        users,
        groups: [group1, group2, group3],
        expenses,
        constraints,
        authStatus: 'demo',
        currentUser: null,
      });
    }
  }, []);

  const signOut = useCallback(() => {
    setRawState((prev) => ({
      ...prev,
      authStatus: 'landing',
      currentUser: null,
    }));
  }, []);

  const updateCurrentUser = useCallback((name: string, phoneNumber?: string, payPalUsername?: string) => {
    setRawState((prev) => {
      if (!prev.currentUser) return prev;
      const updatedUser = {
        ...prev.currentUser,
        name: name.trim(),
        phoneNumber: phoneNumber?.trim(),
        payPalUsername: payPalUsername?.trim(),
      };

      const updatedUsersList = prev.users.map(u => u.id === updatedUser.id ? updatedUser : u);

      return {
        ...prev,
        currentUser: updatedUser,
        users: updatedUsersList,
      };
    });
  }, []);

  const addUser = useCallback((name: string, phoneNumber?: string, payPalUsername?: string): User => {
    const colors = ['#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#14b8a6', '#f43f5e'];
    const cid = rawState.currentUser?.id;
    const newUser: User = {
      id: `u_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      phoneNumber: phoneNumber?.trim(),
      payPalUsername: payPalUsername?.trim(),
      color: colors[Math.floor(Math.random() * colors.length)],
      createdBy: cid,
    };

    setRawState((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
    }));

    return newUser;
  }, []);

  const addGroup = useCallback((name: string, emoji: string = '📁', memberIds: string[]): Group => {
    const newGroup: Group = {
      id: `g_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      emoji: emoji || '📁',
      memberIds,
      invitedUserIds: [],
      createdAt: Date.now(),
    };

    setRawState((prev) => ({
      ...prev,
      groups: [...prev.groups, newGroup],
      activeGroupId: newGroup.id,
    }));

    return newGroup;
  }, []);

  const addExpense = useCallback((expenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `e_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      date: Date.now(),
    };

    setRawState((prev) => {
      const payer = prev.users.find((u) => u.id === newExpense.payerId)?.name || 'Someone';
      const groupName = prev.groups.find((g) => g.id === newExpense.groupId)?.name || 'Group';

      const log: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp: Date.now(),
        type: 'expense_created',
        description: {
          en: `${payer} added "${newExpense.description}" (${prev.currency}${newExpense.amount}) in ${groupName}`,
          ar: `أضاف ${payer} مصروف "${newExpense.description}" (${prev.currency}${newExpense.amount}) في ${groupName}`,
          he: `${payer} הוסיף/ה את "${newExpense.description}" (${prev.currency}${newExpense.amount}) בקבוצה ${groupName}`,
        },
        relatedGroupIds: [newExpense.groupId],
      };

      return {
        ...prev,
        expenses: [newExpense, ...prev.expenses],
        auditLogs: [log, ...prev.auditLogs],
      };
    });
  }, []);

  const deleteExpense = useCallback((expenseId: string) => {
    setRawState((prev) => {
      const exp = prev.expenses.find((e) => e.id === expenseId);
      const groupName = exp ? prev.groups.find((g) => g.id === exp.groupId)?.name || 'Group' : 'Group';

      const log: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp: Date.now(),
        type: 'expense_deleted',
        description: {
          en: `Expense "${exp?.description || ''}" deleted from ${groupName}`,
          ar: `تم حذف مصروف "${exp?.description || ''}" من ${groupName}`,
          he: `נמחקה ההוצאה "${exp?.description || ''}" מקבוצה ${groupName}`,
        },
        relatedGroupIds: exp ? [exp.groupId] : [],
      };

      return {
        ...prev,
        expenses: prev.expenses.filter((e) => e.id !== expenseId),
        auditLogs: [log, ...prev.auditLogs],
      };
    });
  }, []);

  const addConstraint = useCallback((fromUserId: string, toUserId: string, reason?: string) => {
    const newConstraint: PaymentConstraint = {
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: 'blacklist',
      fromUserId,
      toUserId,
      reason,
    };

    setRawState((prev) => ({
      ...prev,
      constraints: [...prev.constraints, newConstraint],
    }));
  }, []);

  const removeConstraint = useCallback((constraintId: string) => {
    setRawState((prev) => ({
      ...prev,
      constraints: prev.constraints.filter((c) => c.id !== constraintId),
    }));
  }, []);

  const toggleSettlementPaid = useCallback((settlementInput: Settlement | string) => {
    setRawState((prev) => {
      let settlement: Settlement | undefined;
      if (typeof settlementInput === 'string') {
        settlement = prev.settlements.find((s) => s.id === settlementInput);
      } else {
        settlement = settlementInput;
      }

      if (!settlement) return prev;

      const debtor = prev.users.find((u) => u.id === settlement!.from);
      const creditor = prev.users.find((u) => u.id === settlement!.to);
      const debtorName = debtor?.name || 'Someone';
      const creditorName = creditor?.name || 'Someone';

      let targetGroupId = settlement.groupId;
      if (!targetGroupId) {
        const activeGroupObj = prev.groups.find((g) => g.id === prev.activeGroupId);
        if (activeGroupObj && activeGroupObj.memberIds.includes(settlement!.from) && activeGroupObj.memberIds.includes(settlement!.to)) {
          targetGroupId = prev.activeGroupId!;
        } else {
          const sharedGroup = prev.groups.find(
            (g) => g.memberIds.includes(settlement!.from) && g.memberIds.includes(settlement!.to)
          );
          targetGroupId = sharedGroup ? sharedGroup.id : (prev.activeGroupId || prev.groups[0]?.id || 'g_settle');
        }
      }

      const settlementExpense: Expense = {
        id: `e_settle_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        groupId: targetGroupId,
        description: `Settlement: ${debtorName} ➔ ${creditorName}`,
        amount: settlement.amount,
        payerId: settlement.from,
        participants: [{ userId: settlement.to, amount: settlement.amount }],
        date: Date.now(),
        category: 'settlement',
      };

      const log: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp: Date.now(),
        type: 'direct_settlement',
        description: {
          en: `${debtorName} settled ${prev.currency}${settlement.amount.toFixed(2)} with ${creditorName}`,
          ar: `قام ${debtorName} بتسوية ${prev.currency}${settlement.amount.toFixed(2)} مع ${creditorName}`,
          he: `${debtorName} סילק/ה חוב של ${prev.currency}${settlement.amount.toFixed(2)} מול ${creditorName}`,
        },
        relatedGroupIds: targetGroupId ? [targetGroupId] : [],
      };

      fireCelebration();

      return {
        ...prev,
        expenses: [settlementExpense, ...prev.expenses],
        auditLogs: [log, ...prev.auditLogs],
      };
    });
    showToast(t('settlementRecorded'), 'success');
  }, [fireCelebration, showToast, t]);

  const resetAllData = useCallback(() => {
    setRawState((prev) => ({
      ...defaultInitialState,
      authStatus: prev.authStatus,
      currentUser: prev.currentUser,
    }));
    
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', window.location.pathname);
    }
    showToast('Data cleared successfully', 'info');
  }, [showToast]);

  // --- Invite System ---
  const inviteUserToGroup = useCallback((groupId: string, phoneNumber: string) => {
    let success = false;
    setRawState((prev) => {
      const targetUser = prev.users.find(u => u.phoneNumber === phoneNumber && !u.createdBy); // must be registered user, not local ghost
      if (!targetUser) return prev; // User not found
      
      const updatedGroups = prev.groups.map(g => {
        if (g.id === groupId) {
          const invited = g.invitedUserIds || [];
          if (!g.memberIds.includes(targetUser.id) && !invited.includes(targetUser.id)) {
            success = true;
            return { ...g, invitedUserIds: [...invited, targetUser.id] };
          }
        }
        return g;
      });
      return { ...prev, groups: updatedGroups };
    });
    return success;
  }, []);


  const addMemberToExistingGroup = useCallback((groupId: string, userId: string) => {
    setRawState(prev => {
      const updatedGroups = prev.groups.map(g => {
        if (g.id === groupId && !g.memberIds.includes(userId)) {
          return { ...g, memberIds: [...g.memberIds, userId] };
        }
        return g;
      });
      return { ...prev, groups: updatedGroups };
    });
  }, []);

  const inviteExistingUserToGroup = useCallback((groupId: string, userId: string) => {
    setRawState(prev => {
      const updatedGroups = prev.groups.map(g => {
        if (g.id === groupId) {
          const invited = g.invitedUserIds || [];
          if (!g.memberIds.includes(userId) && !invited.includes(userId)) {
            return { ...g, invitedUserIds: [...invited, userId] };
          }
        }
        return g;
      });
      return { ...prev, groups: updatedGroups };
    });
  }, []);

  const acceptInvite = useCallback((groupId: string) => {
    setRawState((prev) => {
      if (!prev.currentUser) return prev;
      const cid = prev.currentUser.id;
      const updatedGroups = prev.groups.map(g => {
        if (g.id === groupId) {
          const invited = g.invitedUserIds || [];
          if (invited.includes(cid)) {
            return {
              ...g,
              invitedUserIds: invited.filter(id => id !== cid),
              memberIds: [...g.memberIds, cid],
            };
          }
        }
        return g;
      });
      return { ...prev, groups: updatedGroups };
    });
  }, []);

  const declineInvite = useCallback((groupId: string) => {
    setRawState((prev) => {
      if (!prev.currentUser) return prev;
      const cid = prev.currentUser.id;
      const updatedGroups = prev.groups.map(g => {
        if (g.id === groupId) {
          const invited = g.invitedUserIds || [];
          return {
            ...g,
            invitedUserIds: invited.filter(id => id !== cid),
          };
        }
        return g;
      });
      return { ...prev, groups: updatedGroups };
    });
  }, []);

  const leaveGroup = useCallback((groupId: string) => {
    setRawState((prev) => {
      if (!prev.currentUser) return prev;
      const cid = prev.currentUser.id;
      const updatedGroups = prev.groups.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            memberIds: g.memberIds.filter(id => id !== cid),
          };
        }
        return g;
      });
      
      let newActiveGroupId = prev.activeGroupId;
      if (newActiveGroupId === groupId) {
        newActiveGroupId = null;
      }
      
      return { ...prev, groups: updatedGroups, activeGroupId: newActiveGroupId };
    });
  }, []);

  const value = useMemo(
    () => ({
      state: computedState,
      t,
      language: computedState.language,
      setLanguage,
      setUiScale,
      currency: computedState.currency,
      setCurrency,
      activeGroupId: computedState.activeGroupId,
      setActiveGroupId,
      addUser,
      addGroup,
      addExpense,
      deleteExpense,
      addConstraint,
      removeConstraint,
      toggleSettlementPaid,
      resetAllData,
      showToast,
      toasts,
      isGlobalMode,
      setIsGlobalMode,
      setHasSeenOnboarding,
      fireCelebration,
      login,
      runLocal,
      runDemo,
      signOut,
      updateCurrentUser,
      removeToast,
      inviteUserToGroup,
    addMemberToExistingGroup,
    inviteExistingUserToGroup,
      acceptInvite,
      declineInvite,
      leaveGroup,
    }),
    [
      computedState,
      t,
      setLanguage,
      setCurrency,
      setActiveGroupId,
      addUser,
      addGroup,
      addExpense,
      deleteExpense,
      addConstraint,
      removeConstraint,
      toggleSettlementPaid,
      resetAllData,
      showToast,
      toasts,
      removeToast,
      isGlobalMode,
      fireCelebration,
      login,
      runLocal,
      runDemo,
      signOut,
      updateCurrentUser,
      inviteUserToGroup,
      acceptInvite,
      declineInvite,
      leaveGroup,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
