import React, { useState } from 'react';
import { DEMO_CREDENTIALS } from '../../context/AuthContext';
import { User, Shield, Briefcase, Key, Copy, Check, Info, ChevronDown } from 'lucide-react';
import { Badge } from '../common/Badge';

export function DemoCredentialsBanner({ onSelectCredentials, className = '' }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const roleIcons = {
    customer: User,
    employee: Briefcase,
    admin: Shield,
  };

  const roleBadgeVariants = {
    customer: 'royal',
    employee: 'teal',
    admin: 'error',
  };

  return (
    <div className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0d1f36]/70 p-4 transition-all ${className}`}>
      {/* Header with expand toggle */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-royal-500 dark:text-teal-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Documented Demo Access Accounts
          </span>
          <Badge variant="teal" size="sm">1-Click Auto-Fill</Badge>
        </div>

        <button
          type="button"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          aria-label="Toggle demo credentials"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3.5 space-y-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 animate-fadeIn">
          {/* Important Security Notice */}
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-[11px] text-amber-800 dark:text-amber-300">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-semibold">Frontend Demo Authentication Notice</p>
              <p className="text-amber-700/90 dark:text-amber-300/80 leading-relaxed mt-0.5">
                This is simulated frontend authentication for UI evaluation. No real passwords or sensitive credentials should ever be entered. Production banking authentication must always be executed by a hardened, backend API gateway.
              </p>
            </div>
          </div>

          {/* Cards for 3 Roles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {DEMO_CREDENTIALS.map((cred) => {
              const Icon = roleIcons[cred.role] || User;

              return (
                <div
                  key={cred.role}
                  className="p-3 rounded-xl bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col justify-between hover:border-royal-500/50 dark:hover:border-teal-500/50 transition-all text-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {cred.role === 'customer' ? 'Customer' : cred.role === 'employee' ? 'Bank Officer' : 'Super Admin'}
                        </span>
                      </div>
                      <Badge variant={roleBadgeVariants[cred.role]} size="sm">
                        {cred.role.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 truncate">
                      {cred.name}
                    </p>

                    <div className="space-y-1 font-mono text-[10px] bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60 mb-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">User:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium truncate ml-1">
                          {cred.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Pass:</span>
                        <span className="text-royal-600 dark:text-teal-400 font-semibold">
                          {cred.password}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onSelectCredentials && (
                      <button
                        type="button"
                        onClick={() => onSelectCredentials(cred)}
                        className="flex-1 py-1 px-2 rounded-lg bg-royal-600 hover:bg-royal-700 text-white font-semibold text-[11px] shadow-sm transition-all"
                      >
                        Auto-fill
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCopy(`${cred.email} / ${cred.password}`, cred.role)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                      title="Copy credentials"
                    >
                      {copiedKey === cred.role ? (
                        <Check className="w-3.5 h-3.5 text-teal-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default DemoCredentialsBanner;
