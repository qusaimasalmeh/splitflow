import LZString from 'lz-string';
import { AppState, Settlement } from '../types';
import { Translations } from '../i18n';

/**
 * Compresses an AppState object into a URI-safe compressed string.
 */
export function encodeStateToUrlParam(state: AppState): string {
  try {
    const jsonStr = JSON.stringify(state);
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
    const parsed = JSON.parse(decompressed) as AppState;

    // Validate minimal schema shape
    if (
      Array.isArray(parsed.users) &&
      Array.isArray(parsed.groups) &&
      Array.isArray(parsed.expenses)
    ) {
      return parsed;
    }
    return null;
  } catch (err) {
    console.error('Failed to decode state from URL param:', err);
    return null;
  }
}

/**
 * Generates an informative, formatted text summary for sharing via WhatsApp or copy-pasting.
 */
export function generateShareSummary(
  state: AppState,
  settlements: Settlement[],
  t: (key: keyof Translations) => string,
  baseUrl: string = window.location.origin
): string {
  const currency = state.currency || '$';
  const encodedState = encodeStateToUrlParam(state);
  const shareableUrl = `${baseUrl}?data=${encodedState}`;

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
