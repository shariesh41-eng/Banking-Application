import React from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle } from 'lucide-react';

export const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      rightElement,
      id,
      className,
      containerClassName,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1"
          >
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {Icon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm font-normal rounded-xl border border-slate-300 dark:border-slate-800 transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 py-2.5 px-3.5 shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-royal-500/40 focus:border-royal-500 dark:focus:border-royal-500',
              'disabled:opacity-60 disabled:bg-slate-100 dark:disabled:bg-slate-900/50 disabled:cursor-not-allowed',
              Icon && 'pl-10',
              rightElement && 'pr-10',
              error && 'border-rose-500 dark:border-rose-500/80 focus:ring-rose-500/30 focus:border-rose-500',
              className
            )}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>

        {error ? (
          <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
