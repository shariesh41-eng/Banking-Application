import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-royal-600 hover:bg-royal-700 text-white shadow-fintech hover:shadow-fintech-glow active:scale-[0.98] border border-royal-500/30',
  teal:
    'bg-teal-600 hover:bg-teal-500 text-white shadow-fintech hover:shadow-teal-glow active:scale-[0.98] border border-teal-400/30',
  secondary:
    'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 active:scale-[0.98]',
  outline:
    'bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 active:scale-[0.98]',
  ghost:
    'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98]',
  danger:
    'bg-rose-600 hover:bg-rose-700 text-white shadow-fintech active:scale-[0.98] border border-rose-500/30',
};

const SIZES = {
  xs: 'px-2.5 py-1 text-xs font-medium rounded-lg gap-1.5',
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm font-semibold rounded-xl gap-2',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-xl gap-2.5',
};

export const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      fullWidth = false,
      icon: Icon,
      rightIcon: RightIcon,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200 font-sans cursor-pointer focus:outline-none focus:ring-2 focus:ring-royal-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none',
          VARIANTS[variant] || VARIANTS.primary,
          SIZES[size] || SIZES.md,
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : Icon ? (
          <Icon className={cn('flex-shrink-0', size === 'xs' || size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
        ) : null}

        {children}

        {!isLoading && RightIcon ? (
          <RightIcon className={cn('flex-shrink-0', size === 'xs' || size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
        ) : null}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
