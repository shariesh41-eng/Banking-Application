import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import {
  Landmark,
  ShieldCheck,
  Lock,
  Sun,
  Moon,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export function AuthLayout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d17] text-slate-900 dark:text-slate-100 font-sans selection:bg-royal-500 selection:text-white transition-colors duration-200">
      {/* Top Security & Navigation Bar */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0a1220]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/auth/welcome" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-navy-900 via-royal-600 to-teal-500 flex items-center justify-center text-white shadow-fintech transition-transform group-hover:scale-105">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  NOVA<span className="text-royal-500">BANK</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-royal-500/10 text-royal-600 dark:text-royal-400 border border-royal-500/20">
                  Auth Gateway
                </span>
              </div>
            </div>
          </Link>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-medium bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TLS 1.3 256-Bit Cryptography</span>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-royal-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Regulatory & Institutional Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-[#0a1220]/50 py-6 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">NOVABANK N.A.</span>
            <span>•</span>
            <span>Member FDIC</span>
            <span>•</span>
            <span>Equal Housing Lender ⌂</span>
            <span>•</span>
            <span>NMLS #491024</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
            <span>SOC 2 Type II Certified</span>
            <span>•</span>
            <span>Frontend Prototype Mode</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AuthLayout;
