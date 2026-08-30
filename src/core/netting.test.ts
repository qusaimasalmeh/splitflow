import { describe, it, expect } from 'vitest';
import {
  calculateGroupBalances,
  calculateIsolatedSettlements,
  calculateGlobalBalances,
  calculateSocialConstrainedGlobalSettlements,
} from './netting';
import { User, Group, Expense, PaymentConstraint } from '../types';

describe('Social-Constrained Graph Netting Engine', () => {
  const users: User[] = [
    { id: 'u1', name: 'Alice' },
    { id: 'u2', name: 'Bob' },
    { id: 'u3', name: 'Charlie' },
    { id: 'u4', name: 'David' },
    { id: 'u5', name: 'Stranger Steve' },
  ];

  const group1: Group = {
    id: 'g1',
    name: 'Apartment',
    memberIds: ['u1', 'u2', 'u3'],
    createdAt: Date.now(),
  };

  const group2: Group = {
    id: 'g2',
    name: 'Trip to Tokyo',
    memberIds: ['u2', 'u3', 'u4'],
    createdAt: Date.now(),
  };

  const group3: Group = {
    id: 'g3',
    name: 'Secret Club',
    memberIds: ['u5'], // isolated user
    createdAt: Date.now(),
  };

  describe('Single-Group Isolated Netting', () => {
    it('accurately calculates individual balances in a single group', () => {
      // Alice paid $60 for groceries, split equally among Alice, Bob, Charlie ($20 each)
      const expenses: Expense[] = [
        {
          id: 'e1',
          groupId: 'g1',
          description: 'Groceries',
          amount: 60,
          payerId: 'u1',
          participants: [
            { userId: 'u1', amount: 20 },
            { userId: 'u2', amount: 20 },
            { userId: 'u3', amount: 20 },
          ],
          date: Date.now(),
        },
      ];

      const balances = calculateGroupBalances('g1', expenses, ['u1', 'u2', 'u3']);
      expect(balances['u1']).toBeCloseTo(40);
      expect(balances['u2']).toBeCloseTo(-20);
      expect(balances['u3']).toBeCloseTo(-20);
    });

    it('generates optimal single-group settlements', () => {
      const expenses: Expense[] = [
        {
          id: 'e1',
          groupId: 'g1',
          description: 'Groceries',
          amount: 60,
          payerId: 'u1',
          participants: [
            { userId: 'u1', amount: 20 },
            { userId: 'u2', amount: 20 },
            { userId: 'u3', amount: 20 },
          ],
          date: Date.now(),
        },
      ];

      const settlements = calculateIsolatedSettlements('g1', expenses, ['u1', 'u2', 'u3']);
      expect(settlements).toHaveLength(2);
      expect(settlements).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ from: 'u2', to: 'u1', amount: 20, groupId: 'g1' }),
          expect.objectContaining({ from: 'u3', to: 'u1', amount: 20, groupId: 'g1' }),
        ])
      );
    });
  });

  describe('Global Multi-Group Balances', () => {
    it('aggregates net balances across multiple groups correctly', () => {
      const expenses: Expense[] = [
        // In G1: Alice paid $60, Bob owes $20, Charlie owes $20 (Alice +40, Bob -20, Charlie -20)
        {
          id: 'e1',
          groupId: 'g1',
          description: 'Rent',
          amount: 60,
          payerId: 'u1',
          participants: [
            { userId: 'u1', amount: 20 },
            { userId: 'u2', amount: 20 },
            { userId: 'u3', amount: 20 },
          ],
          date: Date.now(),
        },
        // In G2: Bob paid $90, Charlie owes $30, David owes $30 (Bob +60, Charlie -30, David -30)
        {
          id: 'e2',
          groupId: 'g2',
          description: 'Hotel',
          amount: 90,
          payerId: 'u2',
          participants: [
            { userId: 'u2', amount: 30 },
            { userId: 'u3', amount: 30 },
            { userId: 'u4', amount: 30 },
          ],
          date: Date.now(),
        },
      ];

      const globalBalances = calculateGlobalBalances(expenses, ['u1', 'u2', 'u3', 'u4']);
      // Alice: +40
      // Bob: -20 + 60 = +40
      // Charlie: -20 - 30 = -50
      // David: -30
      expect(globalBalances['u1']).toBeCloseTo(40);
      expect(globalBalances['u2']).toBeCloseTo(40);
      expect(globalBalances['u3']).toBeCloseTo(-50);
      expect(globalBalances['u4']).toBeCloseTo(-30);
    });
  });

  describe('Constraint 1: Social Graph Connectedness', () => {
    it('prevents direct settlement between strangers who do not share any group', () => {
      // Suppose Stranger Steve (u5) owes money in G3, but shares NO group with Alice (u1).
      // Even if Steve has -50 and Alice has +50, Steve cannot pay Alice directly!
      const expenses: Expense[] = [
        {
          id: 'e1',
          groupId: 'g1',
          description: 'Item 1',
          amount: 50,
          payerId: 'u1',
          participants: [
            { userId: 'u1', amount: 0 },
            { userId: 'u2', amount: 50 },
          ],
          date: Date.now(),
        },
        {
          id: 'e2',
          groupId: 'g3',
          description: 'Item 2',
          amount: 50,
          payerId: 'u2', // Wait, Steve is in g3 alone with someone else
          participants: [{ userId: 'u5', amount: 50 }],
          date: Date.now(),
        },
      ];

      const groups = [group1, group2, group3];
      const settlements = calculateSocialConstrainedGlobalSettlements(
        expenses,
        groups,
        users.map((u) => u.id),
        []
      );

      // Verify no settlement has from: 'u5' and to: 'u1' because they share 0 groups!
      const invalidStrangerPayment = settlements.find(
        (s) => (s.from === 'u5' && s.to === 'u1') || (s.from === 'u1' && s.to === 'u5')
      );
      expect(invalidStrangerPayment).toBeUndefined();
    });
  });

  describe('Constraint 2: Blacklist Exclusions', () => {
    it('routes debt through mutual friend when direct path is blacklisted', () => {
      // Suppose Charlie owes Bob $30, and Bob owes Alice $30.
      // Net: Charlie owes Alice $30.
      // BUT Charlie has blacklisted Alice (or Alice blacklisted Charlie).
      // The algorithm must route Charlie -> Bob ($30) and Bob -> Alice ($30) instead of direct Charlie -> Alice!
      const expenses: Expense[] = [
        // G1: Alice paid $30 for Bob
        {
          id: 'e1',
          groupId: 'g1',
          description: 'Dinner',
          amount: 30,
          payerId: 'u1',
          participants: [{ userId: 'u2', amount: 30 }],
          date: Date.now(),
        },
        // G1: Bob paid $30 for Charlie
        {
          id: 'e2',
          groupId: 'g1',
          description: 'Drinks',
          amount: 30,
          payerId: 'u2',
          participants: [{ userId: 'u3', amount: 30 }],
          date: Date.now(),
        },
      ];

      // Charlie cannot pay Alice directly
      const constraints: PaymentConstraint[] = [
        {
          id: 'c1',
          type: 'blacklist',
          fromUserId: 'u3',
          toUserId: 'u1',
          reason: 'Do not transfer directly',
        },
      ];

      const settlements = calculateSocialConstrainedGlobalSettlements(
        expenses,
        [group1],
        ['u1', 'u2', 'u3'],
        constraints
      );

      // Confirm no direct Charlie -> Alice settlement
      const directBlocked = settlements.find((s) => s.from === 'u3' && s.to === 'u1');
      expect(directBlocked).toBeUndefined();

      // Confirm routed through Bob: Charlie -> Bob ($30), Bob -> Alice ($30)
      const charlieToBob = settlements.find((s) => s.from === 'u3' && s.to === 'u2');
      const bobToAlice = settlements.find((s) => s.from === 'u2' && s.to === 'u1');
      expect(charlieToBob).toBeDefined();
      expect(charlieToBob?.amount).toBeCloseTo(30);
      expect(bobToAlice).toBeDefined();
      expect(bobToAlice?.amount).toBeCloseTo(30);
    });

    it('leaves debt isolated/unresolved if blacklist prevents all possible routes', () => {
      // Only two people in group: Alice and Bob.
      // Bob owes Alice $50. But Bob blacklisted paying Alice.
      // With no third person, debt cannot be settled globally.
      const expenses: Expense[] = [
        {
          id: 'e1',
          groupId: 'g1',
          description: 'Gift',
          amount: 50,
          payerId: 'u1',
          participants: [{ userId: 'u2', amount: 50 }],
          date: Date.now(),
        },
      ];

      const constraints: PaymentConstraint[] = [
        {
          id: 'c1',
          type: 'blacklist',
          fromUserId: 'u2',
          toUserId: 'u1',
        },
      ];

      const settlements = calculateSocialConstrainedGlobalSettlements(
        expenses,
        [group1],
        ['u1', 'u2'],
        constraints
      );

      // Since direct transfer is blacklisted and no intermediary exists, Bob -> Alice must NOT be created
      const illegalTransfer = settlements.find((s) => s.from === 'u2' && s.to === 'u1');
      expect(illegalTransfer).toBeUndefined();
    });
  });

  describe('Cross-Group Reconciliation Metadata', () => {
    it('attaches affected group IDs for multi-group reconciliation audits', () => {
      const expenses: Expense[] = [
        // G1: Alice paid for Bob $40
        {
          id: 'e1',
          groupId: 'g1',
          description: 'Rent Part',
          amount: 40,
          payerId: 'u1',
          participants: [{ userId: 'u2', amount: 40 }],
          date: Date.now(),
        },
        // G2: Bob paid for Alice $10
        {
          id: 'e2',
          groupId: 'g2',
          description: 'Snacks',
          amount: 10,
          payerId: 'u2',
          participants: [{ userId: 'u1', amount: 10 }],
          date: Date.now(),
        },
      ];

      const settlements = calculateSocialConstrainedGlobalSettlements(
        expenses,
        [group1, group2],
        ['u1', 'u2'],
        []
      );

      expect(settlements).toHaveLength(1);
      const s = settlements[0];
      expect(s.from).toBe('u2');
      expect(s.to).toBe('u1');
      expect(s.amount).toBeCloseTo(30);
      expect(s.isCrossGroup).toBe(true);
      expect(s.resolvedInGroups).toEqual(expect.arrayContaining(['g1', 'g2']));
    });
  });
});
