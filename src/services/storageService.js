/**
 * Safe LocalStorage abstraction for NOVABANK
 */

const STORAGE_PREFIX = 'novabank_';

export const storageService = {
  get: (key, fallback = null) => {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      console.warn(`[storageService] Error reading key "${key}":`, error);
      return fallback;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[storageService] Error writing key "${key}":`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
      return true;
    } catch (error) {
      console.warn(`[storageService] Error removing key "${key}":`, error);
      return false;
    }
  },

  clearAll: () => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.warn('[storageService] Error clearing storage:', error);
      return false;
    }
  },
};
