import LZString from 'lz-string';
import { AppState, Settlement, User, Group, Expense, PaymentConstraint } from '../types';
import { Translations } from '../i18n';

/**
 * Compact schema representation for lightweight URL sharing.
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
 * Compresses an AppState object into an ultra-compact URI-safe string.
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
 * Supports both modern compact format and legacy verbose format.
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
 * Returns the accurate full base URL of the app (respecting GitHub Pages base path).
 */
export function getAppBaseUrl(): string {
  if (typeof window === 'undefined') return 'https://qusaimasalmeh.github.io/splitflow/';
  const hrefWithoutQuery = window.location.href.split('?')[0].split('#')[0];
  return hrefWithoutQuery.endsWith('/') ? hrefWithoutQuery : `${hrefWithoutQuery}/`;
}

/**
 * Attempts to shorten a URL using public free shortener APIs with quick fallback.
 */
export async function shortenUrl(longUrl: string): Promise<string> {
  // 1. Try TinyURL API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().startsWith('http')) {
        return text.trim();
      }
    }
  } catch (e) {
    // Continue to fallback
  }

  // 2. Try is.gd API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(longUrl)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().startsWith('http')) {
        return text.trim();
      }
    }
  } catch (e) {
    // Continue to fallback
  }

  return longUrl;
}

/**
 * Generates an informative, formatted text summary for sharing via WhatsApp or copy-pasting.
 */
export function generateShareSummary(
  state: AppState,
  settlements: Settlement[],
  t: (key: keyof Translations) => string,
  baseUrlOrFullUrl?: string
): string {
  const currency = state.currency || '$';
  let shareableUrl: string;

  if (baseUrlOrFullUrl && baseUrlOrFullUrl.includes('?data=')) {
    shareableUrl = baseUrlOrFullUrl;
  } else {
    const base = baseUrlOrFullUrl || getAppBaseUrl();
    const encodedState = encodeStateToUrlParam(state);
    const separator = base.includes('?') ? '&' : '?';
    shareableUrl = `${base}${separator}data=${encodedState}`;
  }

  const userMap = new Map<string, string>();
  state.users.forEach((u) => userMap.set(u.id, u.name));

  let text = `${t('summaryTitle')}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (settlements.length === 0) {
    text += `${t('summaryAllSettled')}\n\n`;
  } else {
    text += `${t('summaryWhoOwesWhom')}\n`;
    settlements.forEach((s) => {
      const fromName = userMap.get(s.from) || t('summarySomeone');
      const toName = userMap.get(s.to) || t('summarySomeone');
      const badge = s.isCrossGroup ? ` ${t('summaryCrossGroup')}` : '';
      text += `• *${fromName}* ${t('owes')} *${toName}*: ${currency}${s.amount.toFixed(2)}${badge}\n`;
    });
    text += `\n`;
  }

  text += `${t('summaryGroupsInvolved')}\n`;
  state.groups.forEach((g) => {
    const expenseTotal = state.expenses
      .filter((e) => e.groupId === g.id)
      .reduce((sum, e) => sum + e.amount, 0);
    text += `• ${g.name} (${currency}${expenseTotal.toFixed(2)})\n`;
  });

  text += `\n${t('summaryOpenEdit')} \n${shareableUrl}\n`;
  return text;
}

/**
 * Generates the share summary with an automatic tiny short URL.
 */
export async function generateShareSummaryAsync(
  state: AppState,
  settlements: Settlement[],
  t: (key: keyof Translations) => string
): Promise<string> {
  const base = getAppBaseUrl();
  const encodedState = encodeStateToUrlParam(state);
  const separator = base.includes('?') ? '&' : '?';
  const longUrl = `${base}${separator}data=${encodedState}`;

  const shortLink = await shortenUrl(longUrl);
  return generateShareSummary(state, settlements, t, shortLink);
}
