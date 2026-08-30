import LZString from 'lz-string';
import { AppState, Settlement, User, Group, Expense, PaymentConstraint } from '../types';
import { Translations } from '../i18n';

/**
 * Public Summary Data structure for ultra-compact summary links and payment hub.
 */
export interface PublicSummaryData {
  t: string; // group title
  c: string; // currency
  tot: number; // total group expense
  s: Array<{
    f: string; // debtor name (from)
    t: string; // creditor name (to)
    a: number; // amount
    p?: string; // creditor phone number (for Bit / PayBox)
    pp?: string; // creditor paypal username
    cg?: boolean; // is cross-group
  }>;
  e?: Array<{
    d: string; // description
    a: number; // amount
    p: string; // payer name
    sc?: number; // split count
  }>;
}

/**
 * Compact schema representation for full state sharing.
 */
interface CompactState {
  u: Array<{ i: string; n: string; c?: string; p?: string; pp?: string }>;
  g: Array<{ i: string; n: string; e?: string; m: string[] }>;
  e: Array<{
    i: string;
    g: string;
    d: string;
    a: number;
    p: string;
    t?: number;
    c?: string;
    pt: Array<{ u: string; a: number }>;
  }>;
  k?: Array<{ i: string; f: string; t: string; r?: string }>;
  cur?: string;
}

/**
 * Encodes summary data into an ultra-short URI-safe string using tuple packing.
 */
export function encodeSummaryToUrlParam(data: PublicSummaryData): string {
  try {
    const tuplePacked = [
      data.t,
      data.c,
      data.tot,
      data.s.map((s) => [
        s.f,
        s.t,
        s.a,
        s.p || '',
        s.pp || '',
        s.cg ? 1 : 0,
      ]),
      data.e && data.e.length > 0
        ? data.e.map((e) => [e.d, e.a, e.p, e.sc || 0])
        : [],
    ];
    const jsonStr = JSON.stringify(tuplePacked);
    return LZString.compressToEncodedURIComponent(jsonStr);
  } catch (err) {
    console.error('Failed to encode summary data:', err);
    return '';
  }
}

/**
 * Decompresses and parses a URI-safe string into PublicSummaryData.
 * Supports both tuple-packed array format and key-value object format.
 */
export function decodeSummaryFromUrlParam(param: string): PublicSummaryData | null {
  try {
    if (!param) return null;
    const decompressed = LZString.decompressFromEncodedURIComponent(param);
    if (!decompressed) return null;
    const parsed = JSON.parse(decompressed);

    // 1. Check if Tuple-packed array format [title, currency, total, settlements, expenses]
    if (Array.isArray(parsed) && typeof parsed[0] === 'string' && typeof parsed[1] === 'string') {
      const [title, currency, total, settlementsRaw, expensesRaw] = parsed;
      const settlements = Array.isArray(settlementsRaw)
        ? settlementsRaw.map((s: any[]) => ({
            f: s[0],
            t: s[1],
            a: Number(s[2]),
            p: s[3] ? String(s[3]) : undefined,
            pp: s[4] ? String(s[4]) : undefined,
            cg: Boolean(s[5]),
          }))
        : [];

      const expenses = Array.isArray(expensesRaw)
        ? expensesRaw.map((e: any[]) => ({
            d: String(e[0]),
            a: Number(e[1]),
            p: String(e[2]),
            sc: e[3] ? Number(e[3]) : undefined,
          }))
        : [];

      return {
        t: title,
        c: currency,
        tot: Number(total) || 0,
        s: settlements,
        e: expenses.length > 0 ? expenses : undefined,
      };
    }

    // 2. Check if Object format { t, c, tot, s, e }
    if (parsed && typeof parsed.t === 'string' && Array.isArray(parsed.s)) {
      return parsed as PublicSummaryData;
    }

    return null;
  } catch (err) {
    console.error('Failed to decode summary param:', err);
    return null;
  }
}


/**
 * Builds PublicSummaryData object from the current AppState & Settlements.
 */
export function createPublicSummary(
  state: AppState,
  settlements: Settlement[],
  activeGroupId?: string | null
): PublicSummaryData {
  const userMap = new Map<string, User>();
  state.users.forEach((u) => userMap.set(u.id, u));

  const group = activeGroupId ? state.groups.find((g) => g.id === activeGroupId) : null;
  const title = group ? group.name : state.groups[0]?.name || 'SplitFlow';

  const relevantExpenses = activeGroupId
    ? state.expenses.filter((e) => e.groupId === activeGroupId)
    : state.expenses;

  const total = relevantExpenses.reduce((sum, e) => sum + e.amount, 0);

  const formattedSettlements = settlements.map((s) => {
    const debtor = userMap.get(s.from);
    const creditor = userMap.get(s.to);
    return {
      f: debtor?.name || 'Someone',
      t: creditor?.name || 'Someone',
      a: s.amount,
      p: creditor?.phoneNumber,
      pp: creditor?.payPalUsername,
      cg: s.isCrossGroup,
    };
  });

  const formattedExpenses = relevantExpenses.slice(0, 10).map((e) => {
    const payer = userMap.get(e.payerId);
    return {
      d: e.description,
      a: e.amount,
      p: payer?.name || 'User',
      sc: e.participants.length,
    };
  });

  return {
    t: title,
    c: state.currency || '$',
    tot: total,
    s: formattedSettlements,
    e: formattedExpenses,
  };
}

/**
 * Compresses full AppState object into an ultra-compact URI-safe string.
 */
export function encodeStateToUrlParam(state: AppState): string {
  try {
    const compact: CompactState = {
      u: state.users.map((u) => ({
        i: u.id,
        n: u.name,
        c: u.color,
        p: u.phoneNumber,
        pp: u.payPalUsername,
      })),
      g: state.groups.map((g) => ({
        i: g.id,
        n: g.name,
        e: g.emoji,
        m: g.memberIds,
      })),
      e: state.expenses.map((e) => ({
        i: e.id,
        g: e.groupId,
        d: e.description,
        a: e.amount,
        p: e.payerId,
        t: e.date,
        c: e.category,
        pt: e.participants.map((p) => ({ u: p.userId, a: p.amount })),
      })),
      k: state.constraints.map((c) => ({
        i: c.id,
        f: c.fromUserId,
        t: c.toUserId,
        r: c.reason,
      })),
      cur: state.currency,
    };

    const jsonStr = JSON.stringify(compact);
    return LZString.compressToEncodedURIComponent(jsonStr);
  } catch (err) {
    console.error('Failed to encode state to URL param:', err);
    return '';
  }
}

/**
 * Decompresses and parses a URI-safe string back into AppState.
 */
export function decodeStateFromUrlParam(param: string): AppState | null {
  try {
    if (!param) return null;
    const decompressed = LZString.decompressFromEncodedURIComponent(param);
    if (!decompressed) return null;
    const parsed = JSON.parse(decompressed);

    // 1. Check if Compact format (u, g, e)
    if (Array.isArray(parsed.u) && Array.isArray(parsed.g) && Array.isArray(parsed.e)) {
      const compact = parsed as CompactState;
      const users: User[] = compact.u.map((u) => ({
        id: u.i,
        name: u.n,
        color: u.c,
        phoneNumber: u.p,
        payPalUsername: u.pp,
      }));

      const groups: Group[] = compact.g.map((g) => ({
        id: g.i,
        name: g.n,
        emoji: g.e,
        memberIds: g.m,
        createdAt: Date.now(),
      }));

      const expenses: Expense[] = compact.e.map((e) => ({
        id: e.i,
        groupId: e.g,
        description: e.d,
        amount: e.a,
        payerId: e.p,
        date: e.t || Date.now(),
        category: e.c,
        participants: e.pt.map((p) => ({ userId: p.u, amount: p.a })),
      }));

      const constraints: PaymentConstraint[] = (compact.k || []).map((k) => ({
        id: k.i,
        type: 'blacklist',
        fromUserId: k.f,
        toUserId: k.t,
        reason: k.r,
      }));

      return {
        users,
        groups,
        expenses,
        constraints,
        settlements: [],
        auditLogs: [],
        currency: compact.cur || '$',
        language: 'en',
        activeGroupId: groups[0]?.id || null,
        uiScale: 'normal',
        authStatus: 'local',
        currentUser: null,
      };
    }

    // 2. Fallback to legacy verbose format
    if (
      Array.isArray(parsed.users) &&
      Array.isArray(parsed.groups) &&
      Array.isArray(parsed.expenses)
    ) {
      return parsed as AppState;
    }

    return null;
  } catch (err) {
    console.error('Failed to decode state from URL param:', err);
    return null;
  }
}

/**
 * Returns the accurate full base URL of the app on GitHub Pages.
 */
export function getAppBaseUrl(): string {
  if (typeof window === 'undefined') return 'https://qusaimasalmeh.github.io/splitflow/';
  const hrefWithoutQuery = window.location.href.split('?')[0].split('#')[0];
  return hrefWithoutQuery.endsWith('/') ? hrefWithoutQuery : `${hrefWithoutQuery}/`;
}

/**
 * Generates an informative, formatted text summary for sharing via WhatsApp or copy-pasting.
 * Uses 100% our own domain with ultra-compact summary data.
 */
export function generateShareSummary(
  state: AppState,
  settlements: Settlement[],
  t: (key: keyof Translations) => string,
  baseUrlOrFullUrl?: string
): string {
  const currency = state.currency || '$';
  let shareableUrl: string;

  if (baseUrlOrFullUrl && (baseUrlOrFullUrl.includes('?s=') || baseUrlOrFullUrl.includes('?data='))) {
    shareableUrl = baseUrlOrFullUrl;
  } else {
    const base = baseUrlOrFullUrl || getAppBaseUrl();
    const summaryData = createPublicSummary(state, settlements, state.activeGroupId);
    const encodedSummary = encodeSummaryToUrlParam(summaryData);
    const separator = base.includes('?') ? '&' : '?';
    shareableUrl = `${base}${separator}s=${encodedSummary}`;
  }

  const userMap = new Map<string, string>();
  state.users.forEach((u) => userMap.set(u.id, u.name));

  const isRtl = state.language === 'he' || state.language === 'ar';
  const RLM = isRtl ? '\u200F' : '';
  const LRM = isRtl ? '\u200E' : '';

  let text = `${RLM}${t('summaryTitle')}${RLM}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (settlements.length === 0) {
    text += `${RLM}${t('summaryAllSettled')}${RLM}\n\n`;
  } else {
    text += `${RLM}${t('summaryWhoOwesWhom')}${RLM}\n`;
    settlements.forEach((s) => {
      const fromName = userMap.get(s.from) || t('summarySomeone');
      const toName = userMap.get(s.to) || t('summarySomeone');
      const badge = s.isCrossGroup ? ` ${t('summaryCrossGroup')}` : '';
      text += `${RLM}• *${fromName}*${RLM} ${t('owes')} *${toName}*${RLM}: ${LRM}${currency}${s.amount.toFixed(2)}${RLM}${badge}\n`;
    });
    text += `\n`;
  }

  text += `${RLM}${t('summaryGroupsInvolved')}${RLM}\n`;
  state.groups.forEach((g) => {
    const expenseTotal = state.expenses
      .filter((e) => e.groupId === g.id)
      .reduce((sum, e) => sum + e.amount, 0);
    text += `${RLM}• ${g.name}${RLM}: ${LRM}${currency}${expenseTotal.toFixed(2)}${RLM}\n`;
  });

  text += `\n${RLM}${t('summaryShareLink')}${RLM}\n${shareableUrl}\n`;
  return text;
}

export async function generateShareSummaryAsync(
  state: AppState,
  settlements: Settlement[],
  t: (key: keyof Translations) => string
): Promise<string> {
  return generateShareSummary(state, settlements, t);
}
