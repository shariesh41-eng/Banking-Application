import React from 'react';
import { cn } from '../../utils/cn';

export function Card({
  children,
  variant = 'default',
  hoverEffect = false,
  className,
  ...props
}) {
  const variantStyles = {
    default:
      'bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800/80 shadow-fintech',
    elevated:
      'bg-white dark:bg-[#0f1d33] border border-slate-200 dark:border-slate-800 shadow-fintech-md',
    glass:
      'glass-panel shadow-fintech-lg',
    navy:
      'bg-navy-900 border border-navy-700/60 text-white shadow-fintech-lg',
    gradient:
      'fintech-gradient-card text-white border border-teal-500/20 shadow-fintech-lg',
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-200 overflow-hidden',
        variantStyles[variant] || variantStyles.default,
        hoverEffect && 'hover:shadow-fintech-lg hover:-translate-y-0.5 hover:border-royal-500/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, action, ...props }) {
  return (
    <div
      className={cn(
        'p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-4',
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn(
        'text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p
      className={cn('text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className, noPadding = false, ...props }) {
  return (
    <div className={cn(!noPadding && 'p-5 sm:p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'px-5 py-4 sm:px-6 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
