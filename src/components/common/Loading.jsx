import React from 'react';
import { cn } from '../../utils/cn';
import { Landmark, Loader2 } from 'lucide-react';

export function Spinner({ size = 'md', className, variant = 'royal' }) {
  const sizes = {
    xs: 'w-3.5 h-3.5 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const variants = {
    royal: 'text-royal-600 dark:text-royal-400',
    teal: 'text-teal-600 dark:text-teal-400',
    white: 'text-white',
    slate: 'text-slate-400',
  };

  return (
    <Loader2
      className={cn('animate-spin', sizes[size] || sizes.md, variants[variant] || variants.royal, className)}
    />
  );
}

export function Skeleton({ className, rounded = 'rounded-xl' }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200/80 dark:bg-slate-800/60',
        rounded,
        className
      )}
    />
  );
}

export function PageLoader({ message = 'Loading NOVABANK secure session...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-[#070d17]/95 backdrop-blur-md">
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-navy-900 via-royal-700 to-teal-500 flex items-center justify-center shadow-fintech-glow animate-pulse">
          <Landmark className="w-8 h-8 text-white" />
        </div>
        <div className="absolute inset-0 rounded-2xl border border-teal-400/30 animate-ping opacity-25" />
      </div>

      <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-semibold text-sm">
        <Spinner size="sm" variant="teal" />
        <span>{message}</span>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-mono">
        256-BIT ENCRYPTED FINANCIAL GATEWAY
      </p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-fintech">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-28 h-4" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
      <Skeleton className="w-40 h-8 mb-2" />
      <Skeleton className="w-20 h-4" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-fintech">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="w-36 h-6" />
        <Skeleton className="w-24 h-8 rounded-xl" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 py-2 border-b border-slate-100 dark:border-slate-800/40">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PageLoader;
