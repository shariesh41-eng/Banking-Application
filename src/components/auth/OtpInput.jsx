import React, { useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export function OtpInput({ length = 6, value = '', onChange, disabled = false, error = false }) {
  const inputRefs = useRef([]);

  // Ensure digits array matches length
  const digits = Array.from({ length }).map((_, i) => value[i] || '');

  useEffect(() => {
    // Focus first input on mount if not filled
    if (inputRefs.current[0] && !disabled && !value) {
      inputRefs.current[0].focus();
    }
  }, [disabled, value]);

  const handleChange = (e, index) => {
    const rawVal = e.target.value;
    const char = rawVal.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = char;
    const combined = newDigits.join('');
    onChange(combined);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted);
      const focusIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digits[index]}
          disabled={disabled}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={cn(
            'w-11 h-13 sm:w-13 sm:h-16 text-center font-mono font-bold text-xl sm:text-2xl rounded-xl sm:rounded-2xl border transition-all duration-200 outline-none select-none',
            'bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 shadow-sm',
            'border-slate-200 dark:border-slate-800',
            'focus:border-royal-500 focus:ring-4 focus:ring-royal-500/20 dark:focus:border-teal-400 dark:focus:ring-teal-400/20',
            digits[index] && 'border-royal-400 dark:border-teal-500/80 bg-royal-50/30 dark:bg-teal-950/20',
            error && 'border-rose-500 dark:border-rose-500/80 focus:ring-rose-500/20 text-rose-500',
            disabled && 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900'
          )}
        />
      ))}
    </div>
  );
}

export default OtpInput;
