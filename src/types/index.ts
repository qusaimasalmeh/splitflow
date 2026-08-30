export interface User {
  id: string;
  name: string;
  avatar?: string;
  color?: string;
  phoneNumber?: string;
  payPalUsername?: string;
  createdBy?: string;
}

export interface Group {
  id: string;
  name: string;
  emoji?: string;
  memberIds: string[];
  invitedUserIds?: string[];
  createdAt: number;
}

export interface ExpenseParticipant {
  userId: string;
  amount: number;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  payerId: string;
  participants: ExpenseParticipant[];
  date: number;
  category?: string;
}

export interface PaymentConstraint {
  id: string;
  type: 'blacklist';
  fromUserId: string;
  toUserId: string;
  reason?: string;
}

export interface Settlement {
  id: string;
  from: string; // userId who owes
  to: string;   // userId who is owed
  amount: number;
  groupId?: string; // If single-group isolated settlement
  isCrossGroup?: boolean;
  resolvedInGroups?: string[];
  isPaid?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  type: 'expense_created' | 'expense_deleted' | 'direct_settlement' | 'cross_netting_reconciliation';
  description: {
    en: string;
    ar: string;
    he: string;
  };
  relatedGroupIds: string[];
}

export interface AppState {
  users: User[];
  groups: Group[];
  expenses: Expense[];
  constraints: PaymentConstraint[];
  settlements: Settlement[];
  auditLogs: AuditLog[];
  activeGroupId: string | null;
  currency: string;
  hasSeenOnboarding?: boolean;
  uiScale?: 'normal' | 'large' | 'xlarge';
  language: 'en' | 'ar' | 'he';
  authStatus: 'landing' | 'local' | 'demo' | 'logged_in';
  currentUser: User | null;
}
