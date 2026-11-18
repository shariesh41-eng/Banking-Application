import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes cleanly with conflict resolution
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
