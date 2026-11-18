import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

export function Dropdown({
  trigger,
  label = 'Select',
  items = [],
  align = 'right',
  className,
  menuClassName,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      {trigger ? (
        <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
          {typeof trigger === 'function' ? trigger({ isOpen }) : trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center justify-between gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span>{label}</span>
          <ChevronDown
            className={cn('w-4 h-4 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </button>
      )}

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 min-w-[200px] rounded-xl bg-white dark:bg-[#0d1f36] border border-slate-200 dark:border-slate-800 shadow-fintech-lg py-1.5 focus:outline-none animate-fadeIn',
            align === 'right' ? 'right-0' : 'left-0',
            menuClassName
          )}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={`div-${index}`} className="my-1 border-t border-slate-100 dark:border-slate-800" />;
            }

            const Icon = item.icon;

            return (
              <button
                key={item.id || index}
                type="button"
                disabled={item.disabled}
                onClick={(e) => {
                  if (item.disabled) return;
                  if (item.onClick) item.onClick(e);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-left transition-colors',
                  item.danger
                    ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                  item.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      'w-4 h-4 flex-shrink-0',
                      item.danger ? 'text-rose-500' : 'text-slate-400 dark:text-slate-400'
                    )}
                  />
                )}
                <span className="flex-1 font-medium">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
