/**
 * Financial and Authentication Validation Helpers for NOVABANK
 */

/**
 * Validates email according to standard format
 */
export function isValidEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).trim().toLowerCase());
}

/**
 * Validates international or domestic telephone number
 * Supports: +1 (555) 000-0000, 555-000-0000, +44 20 7946 0991, 10-15 digits
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  const digitsOnly = String(phone).replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

/**
 * Formats raw phone number to (XXX) XXX-XXXX for US inputs
 */
export function formatPhoneNumber(value) {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

/**
 * Analyzes password strength across 5 key criteria:
 * - Minimum 8 characters
 * - Uppercase letter (A-Z)
 * - Lowercase letter (a-z)
 * - Number (0-9)
 * - Special character (!@#$%^&*...)
 */
export function analyzePasswordStrength(password = '') {
  const criteria = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(criteria).filter(Boolean).length;

  let label = 'Very Weak';
  let color = 'bg-rose-500';
  let textColor = 'text-rose-500';

  if (score === 5) {
    label = 'Very Strong';
    color = 'bg-emerald-500';
    textColor = 'text-emerald-500';
  } else if (score >= 4) {
    label = 'Strong';
    color = 'bg-teal-500';
    textColor = 'text-teal-500';
  } else if (score >= 3) {
    label = 'Medium';
    color = 'bg-amber-500';
    textColor = 'text-amber-500';
  } else if (score >= 2) {
    label = 'Weak';
    color = 'bg-orange-500';
    textColor = 'text-orange-500';
  }

  return {
    score,
    maxScore: 5,
    percentage: (score / 5) * 100,
    label,
    color,
    textColor,
    criteria,
    isValid: score >= 3 && criteria.minLength,
  };
}

export function isValidRoutingNumber(routingNumber) {
  if (!routingNumber) return false;
  const clean = String(routingNumber).replace(/\D/g, '');
  return clean.length === 9;
}

export function isValidAccountNumber(accountNumber) {
  if (!accountNumber) return false;
  const clean = String(accountNumber).replace(/\D/g, '');
  return clean.length >= 8 && clean.length <= 17;
}

export function isValidAmount(amount, maxBalance = Infinity) {
  const num = Number(amount);
  if (isNaN(num) || num <= 0) {
    return { valid: false, error: 'Enter a valid positive transfer amount' };
  }
  if (num < 1.0) {
    return { valid: false, error: 'Minimum transfer amount is $1.00' };
  }
  if (num > maxBalance) {
    return { valid: false, error: 'Transfer amount exceeds available balance' };
  }
  if (num > 50000) {
    return { valid: false, error: 'Daily transfer limit is $50,000.00' };
  }
  return { valid: true, error: null };
}

export function validatePassword(password) {
  const analysis = analyzePasswordStrength(password);
  return {
    valid: analysis.isValid,
    message: analysis.isValid
      ? 'Password meets security requirements'
      : 'Password must be at least 8 characters and include uppercase, numbers, or symbols',
  };
}
