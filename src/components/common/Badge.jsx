import React from 'react';
import { cn } from '../../utils/cn';

const BADGE_VARIANTS = {
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  error: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  royal: 'bg-royal-500/10 text-royal-600 dark:text-royal-400 border-royal-500/20',
  teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  neutral: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
};

const DOT_COLORS = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-rose-500',
  info: 'bg-sky-500',
  royal: 'bg-royal-500',
  teal: 'bg-teal-500',
  neutral: 'bg-slate-400',
};

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  pulse = false,
  className,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5',
        BADGE_VARIANTS[variant] || BADGE_VARIANTS.neutral,
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            DOT_COLORS[variant] || DOT_COLORS.neutral,
            pulse && 'status-dot-pulse'
          )}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
