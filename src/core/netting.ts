import { Expense, Group, PaymentConstraint, Settlement } from '../types';

export interface UserBalance {
  [userId: string]: number;
}

/**
 * Calculates net balance for each user within a specific group.
 * Positive balance = user is owed money (creditor)
 * Negative balance = user owes money (debtor)
 */
export function calculateGroupBalances(
  groupId: string,
  expenses: Expense[],
  memberIds: string[]
): UserBalance {
  const balances: UserBalance = {};
  memberIds.forEach((id) => {
    balances[id] = 0;
  });

  const groupExpenses = expenses.filter((e) => e.groupId === groupId);

  groupExpenses.forEach((exp) => {
    // Payer is credited the full amount paid
    if (balances[exp.payerId] !== undefined) {
      balances[exp.payerId] += exp.amount;
    } else {
      balances[exp.payerId] = exp.amount;
    }

    // Each participant owes their portion
    exp.participants.forEach((part) => {
      if (balances[part.userId] !== undefined) {
        balances[part.userId] -= part.amount;
      } else {
        balances[part.userId] = -part.amount;
      }
    });
  });

  return balances;
}

/**
 * Calculates isolated settlements within a single group using greedy minimization.
 */
export function calculateIsolatedSettlements(
  groupId: string,
  expenses: Expense[],
  memberIds: string[]
): Settlement[] {
  const balances = calculateGroupBalances(groupId, expenses, memberIds);

  const debtors: { userId: string; amount: number }[] = [];
  const creditors: { userId: string; amount: number }[] = [];

  Object.entries(balances).forEach(([userId, balance]) => {
    const rounded = Math.round(balance * 100) / 100;
    if (rounded < -0.009) {
      debtors.push({ userId, amount: Math.abs(rounded) });
    } else if (rounded > 0.009) {
      creditors.push({ userId, amount: rounded });
    }
  });

  // Sort descending by amount for greedy matching
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const settleAmount = Math.round(Math.min(debtor.amount, creditor.amount) * 100) / 100;

    if (settleAmount > 0.009) {
      settlements.push({
        id: `stl_${groupId}_${debtor.userId}_${creditor.userId}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        from: debtor.userId,
        to: creditor.userId,
        amount: settleAmount,
        groupId,
        isCrossGroup: false,
        resolvedInGroups: [groupId],
        isPaid: false,
      });

      debtor.amount -= settleAmount;
      creditor.amount -= settleAmount;
    }

    if (debtor.amount <= 0.009) dIdx++;
    if (creditor.amount <= 0.009) cIdx++;
  }

  return settlements;
}

/**
 * Calculates global net balances aggregated across all groups.
 */
export function calculateGlobalBalances(
  expenses: Expense[],
  userIds: string[]
): UserBalance {
  const balances: UserBalance = {};
  userIds.forEach((id) => {
    balances[id] = 0;
  });

  expenses.forEach((exp) => {
    if (balances[exp.payerId] !== undefined) {
      balances[exp.payerId] += exp.amount;
    } else {
      balances[exp.payerId] = exp.amount;
    }

    exp.participants.forEach((part) => {
      if (balances[part.userId] !== undefined) {
        balances[part.userId] -= part.amount;
      } else {
        balances[part.userId] = -part.amount;
      }
    });
  });

  return balances;
}

/**
 * Helper to determine which groups two users share.
 */
export function getSharedGroups(u1: string, u2: string, groups: Group[]): string[] {
  return groups
    .filter((g) => g.memberIds.includes(u1) && g.memberIds.includes(u2))
    .map((g) => g.id);
}

/**
 * Helper to determine all groups involved in expenses for a pair of users.
 */
export function getInvolvedGroupsForPair(
  u1: string,
  u2: string,
  expenses: Expense[],
  groups: Group[]
): string[] {
  const groupSet = new Set<string>();

  // Add shared groups
  getSharedGroups(u1, u2, groups).forEach((gId) => groupSet.add(gId));

  // Add groups where either user had an expense or participation
  expenses.forEach((exp) => {
    const isU1Involved = exp.payerId === u1 || exp.participants.some((p) => p.userId === u1);
    const isU2Involved = exp.payerId === u2 || exp.participants.some((p) => p.userId === u2);
    if (isU1Involved || isU2Involved) {
      groupSet.add(exp.groupId);
    }
  });

  return Array.from(groupSet);
}

/**
 * Checks whether a direct transfer from u1 to u2 is allowed by:
 * 1. Social graph connectivity (share at least 1 group)
 * 2. Blacklist constraints (u1 has not blacklisted u2, nor u2 blacklisted u1 from direct transfer)
 */
export function isDirectTransferAllowed(
  fromUserId: string,
  toUserId: string,
  groups: Group[],
  constraints: PaymentConstraint[]
): boolean {
  if (fromUserId === toUserId) return false;

  const shared = getSharedGroups(fromUserId, toUserId, groups);
  if (shared.length === 0) return false; // Strangers cannot pay directly

  // Check blacklist
  const isBlacklisted = constraints.some(
    (c) =>
      c.type === 'blacklist' &&
      ((c.fromUserId === fromUserId && c.toUserId === toUserId) ||
       (c.fromUserId === toUserId && c.toUserId === fromUserId))
  );

  return !isBlacklisted;
}

/**
 * Core Social-Constrained Graph Netting Algorithm.
 * Minimizes cross-group payments subject to:
 * - Social Graph Connectivity
 * - User Blacklist Constraints
 * - Safe Multi-Hop Rerouting through Mutual Connections
 */
export function calculateSocialConstrainedGlobalSettlements(
  expenses: Expense[],
  groups: Group[],
  allUserIds: string[],
  constraints: PaymentConstraint[]
): Settlement[] {
  const globalBalances = calculateGlobalBalances(expenses, allUserIds);

  const debtors: { userId: string; amount: number }[] = [];
  const creditors: { userId: string; amount: number }[] = [];

  Object.entries(globalBalances).forEach(([userId, bal]) => {
    const rounded = Math.round(bal * 100) / 100;
    if (rounded < -0.009) {
      debtors.push({ userId, amount: Math.abs(rounded) });
    } else if (rounded > 0.009) {
      creditors.push({ userId, amount: rounded });
    }
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];

  // Phase 1: Match directly allowed debtor -> creditor pairs
  for (const debtor of debtors) {
    if (debtor.amount <= 0.009) continue;

    for (const creditor of creditors) {
      if (creditor.amount <= 0.009) continue;

      if (isDirectTransferAllowed(debtor.userId, creditor.userId, groups, constraints)) {
        const settleAmount = Math.round(Math.min(debtor.amount, creditor.amount) * 100) / 100;
        if (settleAmount > 0.009) {
          const involved = getInvolvedGroupsForPair(debtor.userId, creditor.userId, expenses, groups);
          settlements.push({
            id: `global_${debtor.userId}_${creditor.userId}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            from: debtor.userId,
            to: creditor.userId,
            amount: settleAmount,
            isCrossGroup: involved.length > 1 || groups.length > 1,
            resolvedInGroups: involved,
            isPaid: false,
          });

          debtor.amount -= settleAmount;
          creditor.amount -= settleAmount;
        }
      }
    }
  }

  // Phase 2: For any remaining un-settled pairs where direct payment was blocked,
  // attempt to route through a mutual intermediary M
  for (const debtor of debtors) {
    if (debtor.amount <= 0.009) continue;

    for (const creditor of creditors) {
      if (creditor.amount <= 0.009) continue;

      // Find an intermediary M who can receive from debtor AND pay creditor
      const potentialIntermediaries = allUserIds.filter(
        (mId) =>
          mId !== debtor.userId &&
          mId !== creditor.userId &&
          isDirectTransferAllowed(debtor.userId, mId, groups, constraints) &&
          isDirectTransferAllowed(mId, creditor.userId, groups, constraints)
      );

      if (potentialIntermediaries.length > 0) {
        const intermediary = potentialIntermediaries[0];
        const settleAmount = Math.round(Math.min(debtor.amount, creditor.amount) * 100) / 100;

        if (settleAmount > 0.009) {
          // Debtor -> Intermediary
          const involved1 = getInvolvedGroupsForPair(debtor.userId, intermediary, expenses, groups);
          settlements.push({
            id: `route_${debtor.userId}_${intermediary}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            from: debtor.userId,
            to: intermediary,
            amount: settleAmount,
            isCrossGroup: true,
            resolvedInGroups: involved1,
            isPaid: false,
          });

          // Intermediary -> Creditor
          const involved2 = getInvolvedGroupsForPair(intermediary, creditor.userId, expenses, groups);
          settlements.push({
            id: `route_${intermediary}_${creditor.userId}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            from: intermediary,
            to: creditor.userId,
            amount: settleAmount,
            isCrossGroup: true,
            resolvedInGroups: involved2,
            isPaid: false,
          });

          debtor.amount -= settleAmount;
          creditor.amount -= settleAmount;
        }
      }
    }
  }

  return settlements;
}
