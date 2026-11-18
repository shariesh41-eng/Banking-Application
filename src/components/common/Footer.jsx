import React from 'react';
import { ShieldCheck, Lock, Landmark } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-[#080f1a] border-t border-slate-200 dark:border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Regulatory */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-royal-600 flex items-center justify-center text-white">
              <Landmark className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-200">
              NOVABANK N.A.
            </span>
          </div>

          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Member FDIC. Equal Housing Lender <span className="font-mono">⌂</span>. NMLS ID #491024.
          </p>
        </div>

        {/* Security Seals & Meta */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit TLS Encryption</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SOC 2 Type II Certified</span>
          </div>

          <span className="font-mono text-slate-400 dark:text-slate-600">
            © {new Date().getFullYear()} NOVABANK Corp.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
