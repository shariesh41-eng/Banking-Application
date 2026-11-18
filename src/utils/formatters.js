/**
 * Financial and Date formatting utilities for NOVABANK
 */

/**
 * Format numeric value as currency
 * @param {number} amount
 * @param {string} currency - 'USD' | 'EUR' | 'GBP'
 * @param {boolean} showCents - whether to show fractional cents
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'USD', showCents = true) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$0.00';
  }

  const fractionDigits = showCents ? 2 : 0;

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  } catch {
    return `$${Number(amount).toFixed(fractionDigits)}`;
  }
}

/**
 * Format timestamp or ISO string to standard date
 * @param {string|Date|number} dateInput
 * @param {string} formatType - 'short' | 'medium' | 'full' | 'time'
 * @returns {string}
 */
export function formatDate(dateInput, formatType = 'medium') {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '—';

  switch (formatType) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    case 'time':
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'full':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'medium':
    default:
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  }
}

/**
 * Mask an account or card number
 * @param {string} numberStr
 * @param {number} visibleDigits
 * @returns {string}
 */
export function maskAccountNumber(numberStr, visibleDigits = 4) {
  if (!numberStr) return '••••';
  const clean = String(numberStr).replace(/\s+/g, '');
  if (clean.length <= visibleDigits) return clean;
  const maskedLength = clean.length - visibleDigits;
  const visiblePart = clean.slice(-visibleDigits);
  return `${'•'.repeat(Math.min(maskedLength, 8))} ${visiblePart}`;
}

/**
 * Format raw card number with 4-digit spacing
 * @param {string} numberStr
 * @returns {string}
 */
export function formatCardNumber(numberStr) {
  if (!numberStr) return '';
  const clean = String(numberStr).replace(/\D+/g, '').slice(0, 16);
  return clean.replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * Format percentage with positive/negative signs
 * @param {number} value
 * @returns {string}
 */
export function formatPercentage(value) {
  if (value === undefined || value === null || isNaN(value)) return '0.00%';
  const num = Number(value);
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

/**
 * Format transfer reference ID
 * @param {string} prefix
 * @returns {string}
 */
export function generateReferenceId(prefix = 'TXN') {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
