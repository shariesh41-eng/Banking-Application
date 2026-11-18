import React from 'react';
import { analyzePasswordStrength } from '../../utils/validators';
import { Check, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export function PasswordStrengthMeter({ password = '', showCriteria = true, className }) {
  const analysis = analyzePasswordStrength(password);

  if (!password) {
    return null;
  }

  const criteriaItems = [
    { key: 'minLength', label: 'At least 8 characters', met: analysis.criteria.minLength },
    { key: 'hasUppercase', label: 'One uppercase letter (A-Z)', met: analysis.criteria.hasUppercase },
    { key: 'hasLowercase', label: 'One lowercase letter (a-z)', met: analysis.criteria.hasLowercase },
    { key: 'hasNumber', label: 'One number (0-9)', met: analysis.criteria.hasNumber },
    { key: 'hasSpecial', label: 'One special symbol (!@#$%...)', met: analysis.criteria.hasSpecial },
  ];

  return (
    <div className={cn('space-y-2 mt-1.5 animate-fadeIn', className)}>
      {/* Progress Bars */}
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          Security Level:
        </span>
        <span className={cn('font-bold uppercase tracking-wider text-[11px]', analysis.textColor)}>
          {analysis.label}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-full rounded-full transition-all duration-300',
              index < analysis.score
                ? analysis.color
                : 'bg-slate-200 dark:bg-slate-800'
            )}
          />
        ))}
      </div>

      {/* Criteria Breakdown */}
      {showCriteria && (
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
          {criteriaItems.map((item) => (
            <div
              key={item.key}
              className={cn(
                'flex items-center gap-1.5 transition-colors',
                item.met
                  ? 'text-teal-600 dark:text-teal-400 font-medium'
                  : 'text-slate-400 dark:text-slate-500'
              )}
            >
              {item.met ? (
                <Check className="w-3.5 h-3.5 flex-shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PasswordStrengthMeter;
