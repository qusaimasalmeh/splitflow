import { describe, it, expect } from 'vitest';
import {
  calculateSplitAmounts,
  exportExpensesToCsv,
  exportSettlementsToCsv,
} from './splitUtils';
import {
  calculateSocialConstrainedGlobalSettlements,
} from './netting';
import { User, Group, Expense } from '../types';

describe('Advanced Splitting & Export Engine', () => {
  describe('Split Calculation Modes', () => {
    it('calculates equal splits with proper cent distribution', () => {
      // $10 split among 3 people should be 3.34, 3.33, 3.33 (sum equals exactly 10.00)
      const memberIds = ['u1', 'u2', 'u3'];
      const splits = calculateSplitAmounts(10, memberIds, 'equal');

      expect(splits).toHaveLength(3);
      const total = splits.reduce((sum, s) => sum + s.amount, 0);
      expect(total).toBeCloseTo(10.0, 2);
    });

    it('calculates percentage splits accurately', () => {
      const memberIds = ['u1', 'u2', 'u3'];
      const percentages = { u1: 50, u2: 30, u3: 20 };
      const splits = calculateSplitAmounts(200, memberIds, 'percentage', percentages);

      expect(splits.find((s) => s.userId === 'u1')?.amount).toBeCloseTo(100);
      expect(splits.find((s) => s.userId === 'u2')?.amount).toBeCloseTo(60);
      expect(splits.find((s) => s.userId === 'u3')?.amount).toBeCloseTo(40);
    });

    it('calculates shares/weights splits accurately', () => {
      // e.g. Couple (2 shares) + Single friend (1 share) on $90 meal = $60 and $30
      const memberIds = ['u1', 'u2'];
      const shares = { u1: 2, u2: 1 };
      const splits = calculateSplitAmounts(90, memberIds, 'shares', shares);

      expect(splits.find((s) => s.userId === 'u1')?.amount).toBeCloseTo(60);
      expect(splits.find((s) => s.userId === 'u2')?.amount).toBeCloseTo(30);
    });
  });

  describe('Complex Cyclic Debt Elimination', () => {
    it('completely eliminates cyclic debts across multi-group cycles', () => {
      // Group 1: Alice paid $30 for Bob (Bob owes Alice $30)
      // Group 2: Bob paid $30 for Charlie (Charlie owes Bob $30)
      // Group 3: Charlie paid $30 for Alice (Alice owes Charlie $30)
      // Net global balance for all 3 is ZERO! Netting should generate 0 transfers!
      const users: User[] = [
        { id: 'u1', name: 'Alice' },
        { id: 'u2', name: 'Bob' },
        { id: 'u3', name: 'Charlie' },
      ];

      const groups: Group[] = [
        { id: 'g1', name: 'G1', memberIds: ['u1', 'u2'], createdAt: 1 },
        { id: 'g2', name: 'G2', memberIds: ['u2', 'u3'], createdAt: 1 },
        { id: 'g3', name: 'G3', memberIds: ['u3', 'u1'], createdAt: 1 },
      ];

      const expenses: Expense[] = [
        {
          id: 'e1',
          groupId: 'g1',
          description: 'A for B',
          amount: 30,
          payerId: 'u1',
          participants: [{ userId: 'u2', amount: 30 }],
          date: 1,
        },
        {
          id: 'e2',
          groupId: 'g2',
          description: 'B for C',
          amount: 30,
          payerId: 'u2',
          participants: [{ userId: 'u3', amount: 30 }],
          date: 1,
        },
        {
          id: 'e3',
          groupId: 'g3',
          description: 'C for A',
          amount: 30,
          payerId: 'u3',
          participants: [{ userId: 'u1', amount: 30 }],
          date: 1,
        },
      ];

      const settlements = calculateSocialConstrainedGlobalSettlements(
        expenses,
        groups,
        users.map((u) => u.id),
        []
      );

      // Entire cycle is netted out to 0 transactions!
      expect(settlements).toHaveLength(0);
    });
  });

  describe('CSV Export Generation', () => {
    it('generates properly formatted CSV string for expenses', () => {
      const expenses: Expense[] = [
        {
          id: 'e1',
          groupId: 'g1',
          description: 'Hotel & Spa',
          amount: 250.5,
          payerId: 'u1',
          participants: [
            { userId: 'u1', amount: 125.25 },
            { userId: 'u2', amount: 125.25 },
          ],
          date: 1700000000000,
        },
      ];

      const userMap = new Map([
        ['u1', 'Alice'],
        ['u2', 'Bob'],
      ]);
      const groupMap = new Map([['g1', 'Trip']]);

      const csv = exportExpensesToCsv(expenses, userMap, groupMap);
      expect(csv).toContain('Date,Group,Description,Payer,Amount,Participants');
      expect(csv).toContain('"Hotel & Spa"');
      expect(csv).toContain('Alice');
      expect(csv).toContain('250.50');
    });

    it('generates properly formatted CSV string for settlements', () => {
      const settlements = [{ id: 's1', from: 'u2', to: 'u1', amount: 125.25, isCrossGroup: true }];
      const userMap = new Map([
        ['u1', 'Alice'],
        ['u2', 'Bob'],
      ]);

      const csv = exportSettlementsToCsv(settlements, userMap);
      expect(csv).toContain('From,To,Amount,Type');
      expect(csv).toContain('"Bob","Alice",125.25,Cross-Group');
    });
  });
});
