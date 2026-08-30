import { describe, it, expect } from 'vitest';
import { encodeStateToUrlParam, decodeStateFromUrlParam, generateShareSummary } from './urlEncoder';
import { AppState } from '../types';

describe('URL State Serialization & WhatsApp Share Generator', () => {
  const sampleState: AppState = {
    users: [
      { id: 'u1', name: 'Alice', phoneNumber: '+123456789' },
      { id: 'u2', name: 'Bob', payPalUsername: 'bob123' },
    ],
    groups: [
      {
        id: 'g1',
        name: 'Roadtrip',
        memberIds: ['u1', 'u2'],
        createdAt: 1700000000000,
      },
    ],
    expenses: [
      {
        id: 'e1',
        groupId: 'g1',
        description: 'Fuel',
        amount: 50,
        payerId: 'u1',
        participants: [
          { userId: 'u1', amount: 25 },
          { userId: 'u2', amount: 25 },
        ],
        date: 1700000000000,
      },
    ],
    constraints: [],
    settlements: [],
    auditLogs: [],
    activeGroupId: 'g1',
    currency: '$',
    language: 'en',
    authStatus: 'landing',
    currentUser: null,
  };

  it('compresses and decompresses AppState losslessly to/from URL param', () => {
    const encoded = encodeStateToUrlParam(sampleState);
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);

    const decoded = decodeStateFromUrlParam(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded?.users).toHaveLength(2);
    expect(decoded?.groups[0].name).toBe('Roadtrip');
    expect(decoded?.expenses[0].amount).toBe(50);
  });

  it('returns null safely for invalid or corrupted string', () => {
    const decoded = decodeStateFromUrlParam('invalid-corrupted-data!!!');
    expect(decoded).toBeNull();
  });

  it('generates a clean WhatsApp share text with state URL link', () => {
    const mockT = (key: any) => key;
    const shareText = generateShareSummary(
      sampleState,
      [{ id: 's1', from: 'u2', to: 'u1', amount: 25, isCrossGroup: false }],
      mockT as any,
      'https://splitflow.app'
    );

    expect(shareText).toContain('SplitFlow');
    expect(shareText).toContain('Bob');
    expect(shareText).toContain('Alice');
    expect(shareText).toContain('25');
    expect(shareText).toContain('https://splitflow.app?data=');
  });
});
