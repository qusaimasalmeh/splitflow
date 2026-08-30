import { Expense, Settlement } from '../types';

export type SplitMode = 'equal' | 'exact' | 'percentage' | 'shares';

/**
 * Calculates participant split amounts given total amount and splitting mode.
 */
export function calculateSplitAmounts(
  totalAmount: number,
  memberIds: string[],
  mode: SplitMode = 'equal',
  customValues: Record<string, number> = {}
): { userId: string; amount: number }[] {
  if (memberIds.length === 0 || totalAmount <= 0) {
    return [];
  }

  if (mode === 'equal') {
    const baseShare = Math.floor((totalAmount / memberIds.length) * 100) / 100;
    let remainderCents = Math.round((totalAmount - baseShare * memberIds.length) * 100);

    return memberIds.map((id) => {
      let portion = baseShare;
      if (remainderCents > 0) {
        portion = Math.round((portion + 0.01) * 100) / 100;
        remainderCents--;
      }
      return { userId: id, amount: portion };
    });
  }

  if (mode === 'percentage') {
    return memberIds.map((id) => {
      const pct = customValues[id] || 0;
      const portion = Math.round(((totalAmount * pct) / 100) * 100) / 100;
      return { userId: id, amount: portion };
    });
  }

  if (mode === 'shares') {
    const totalShares = memberIds.reduce((sum, id) => sum + (customValues[id] || 1), 0);
    if (totalShares <= 0) return calculateSplitAmounts(totalAmount, memberIds, 'equal');

    return memberIds.map((id) => {
      const shares = customValues[id] || 1;
      const portion = Math.round(((totalAmount * shares) / totalShares) * 100) / 100;
      return { userId: id, amount: portion };
    });
  }

  // Exact amounts mode
  return memberIds.map((id) => ({
    userId: id,
    amount: Math.round((customValues[id] || 0) * 100) / 100,
  }));
}

/**
 * Exports expenses to formatted CSV string.
 */
export function exportExpensesToCsv(
  expenses: Expense[],
  userMap: Map<string, string>,
  groupMap: Map<string, string>
): string {
  const headers = ['Date', 'Group', 'Description', 'Payer', 'Amount', 'Participants'];
  const rows = expenses.map((e) => {
    const dateStr = new Date(e.date).toISOString().split('T')[0];
    const groupName = groupMap.get(e.groupId) || 'Group';
    const payerName = userMap.get(e.payerId) || 'User';
    const participantCount = e.participants.length;
    return [
      dateStr,
      `"${groupName}"`,
      `"${e.description.replace(/"/g, '""')}"`,
      `"${payerName}"`,
      e.amount.toFixed(2),
      participantCount,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Exports settlements to formatted CSV string.
 */
export function exportSettlementsToCsv(
  settlements: Settlement[],
  userMap: Map<string, string>
): string {
  const headers = ['From', 'To', 'Amount', 'Type'];
  const rows = settlements.map((s) => {
    const fromName = userMap.get(s.from) || 'User';
    const toName = userMap.get(s.to) || 'User';
    const type = s.isCrossGroup ? 'Cross-Group' : 'Isolated';
    return [`"${fromName}"`, `"${toName}"`, s.amount.toFixed(2), type].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
