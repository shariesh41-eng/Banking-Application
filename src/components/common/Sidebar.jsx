import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import {
  CUSTOMER_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  EMPLOYEE_NAV_ITEMS,
} from '../../data/navigationConfig';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  Receipt,
  ShieldCheck,
  Users,
  FileText,
  Lock,
  Briefcase,
  Landmark,
  UserCheck,
  Headphones,
  Shield,
  HelpCircle,
  X,
  PieChart,
  MessageSquare,
  ShieldAlert,
  FileBarChart,
} from 'lucide-react';

const ICON_MAP = {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  Receipt,
  ShieldCheck,
  Users,
  FileText,
  Lock,
  Briefcase,
  Landmark,
  UserCheck,
  Headphones,
  PieChart,
  MessageSquare,
  ShieldAlert,
  FileBarChart,
};

export function Sidebar({
  currentRole = 'customer',
  mobileOpen = false,
  onMobileClose,
}) {
  let navItems = CUSTOMER_NAV_ITEMS;
  if (currentRole === 'admin') navItems = ADMIN_NAV_ITEMS;
  if (currentRole === 'employee') navItems = EMPLOYEE_NAV_ITEMS;

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between bg-white dark:bg-[#0a1220] border-r border-slate-200 dark:border-slate-800/80 p-4 select-none">
      <div className="flex flex-col gap-6">
        {/* Mobile Header Close */}
        <div className="lg:hidden flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            NAVIGATION
          </span>
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section title */}
        <div className="px-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {currentRole === 'customer'
              ? 'Private Banking'
              : currentRole === 'admin'
              ? 'Administration'
              : 'Bank Operations'}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-royal-600 text-white shadow-fintech shadow-royal-500/20 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <IconComponent
                        className={cn(
                          'w-4 h-4 transition-colors',
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-royal-500 dark:group-hover:text-teal-400'
                        )}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full',
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Banking Trust Widget */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0d1f36]/70 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <Shield className="w-4 h-4 text-teal-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              FDIC Insured
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Accounts backed by US government full faith up to $250,000.
          </p>
        </div>

        <div className="flex items-center justify-between px-2 text-[11px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Core Banking Online
          </span>
          <span className="font-mono">v1.0.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-[calc(100vh-4rem)] sticky top-16 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-10 animate-slide-up">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
