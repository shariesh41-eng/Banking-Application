import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useBanking } from '../../hooks/useBanking';
import { Dropdown } from './Dropdown';
import { Button } from './Button';
import { Badge } from './Badge';
import {
  Landmark,
  Sun,
  Moon,
  Bell,
  Menu,
  Shield,
  Briefcase,
  User,
  LogOut,
  Send,
  UserCheck,
  ChevronDown,
  Bot,
  Sparkles,
} from 'lucide-react';

export function Header({ onMobileMenuToggle, currentRole = 'customer' }) {
  const { user, userRole, switchRole, setIsLogoutModalOpen } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    setIsTransferModalOpen,
    setIsAiAssistantOpen,
    setIsNotificationDrawerOpen,
    unreadNotificationsCount,
  } = useBanking();
  const navigate = useNavigate();

  const roleConfigs = {
    customer: {
      label: 'Private Client',
      badgeVariant: 'royal',
      icon: User,
      dashboardPath: '/customer/dashboard',
    },
    admin: {
      label: 'Super Admin',
      badgeVariant: 'error',
      icon: Shield,
      dashboardPath: '/admin/dashboard',
    },
    employee: {
      label: 'Operations Officer',
      badgeVariant: 'teal',
      icon: Briefcase,
      dashboardPath: '/employee/dashboard',
    },
  };

  const currentConfig = roleConfigs[currentRole] || roleConfigs.customer;

  const handleRoleSwitch = (newRole) => {
    switchRole(newRole);
    if (newRole === 'customer') navigate('/customer/dashboard');
    if (newRole === 'admin') navigate('/admin/dashboard');
    if (newRole === 'employee') navigate('/employee/dashboard');
  };

  const profileMenuItems = [
    {
      label: 'Account Settings',
      icon: User,
      onClick: () => navigate('/profile'),
    },
    {
      label: 'Switch to Customer View',
      icon: User,
      badge: currentRole === 'customer' ? 'Active' : undefined,
      onClick: () => handleRoleSwitch('customer'),
    },
    {
      label: 'Switch to Admin View',
      icon: Shield,
      badge: currentRole === 'admin' ? 'Active' : undefined,
      onClick: () => handleRoleSwitch('admin'),
    },
    {
      label: 'Switch to Employee View',
      icon: Briefcase,
      badge: currentRole === 'employee' ? 'Active' : undefined,
      onClick: () => handleRoleSwitch('employee'),
    },
    { divider: true },
    {
      label: 'Sign Out',
      icon: LogOut,
      danger: true,
      onClick: () => {
        setIsLogoutModalOpen(true);
      },
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-[#0c1626]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            to={currentConfig.dashboardPath}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-navy-900 via-royal-600 to-teal-500 flex items-center justify-center text-white shadow-fintech transition-transform group-hover:scale-105">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  NOVA<span className="text-royal-500">BANK</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-royal-500/10 text-royal-600 dark:text-royal-400 border border-royal-500/20 hidden sm:inline-block">
                  Enterprise
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Active Workspace Role Switcher */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => handleRoleSwitch('customer')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              currentRole === 'customer'
                ? 'bg-white dark:bg-royal-600 text-royal-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Customer
          </button>
          <button
            onClick={() => handleRoleSwitch('admin')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              currentRole === 'admin'
                ? 'bg-white dark:bg-royal-600 text-royal-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </button>
          <button
            onClick={() => handleRoleSwitch('employee')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              currentRole === 'employee'
                ? 'bg-white dark:bg-royal-600 text-royal-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Employee
          </button>
        </div>

        {/* Right: NovaAI + Quick Action + Theme + Notifications + User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* NovaAI Copilot Trigger */}
          <button
            type="button"
            onClick={() => setIsAiAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-royal-600/10 to-teal-500/10 hover:from-royal-600/20 hover:to-teal-500/20 text-royal-700 dark:text-teal-300 border border-royal-500/20 dark:border-teal-500/30 text-xs font-bold transition-all shadow-sm"
            title="Open NovaAI Financial Assistant"
          >
            <Bot className="w-4 h-4 text-royal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">NovaAI</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </button>

          {currentRole === 'customer' && (
            <Button
              variant="teal"
              size="sm"
              icon={Send}
              onClick={() => setIsTransferModalOpen(true)}
              className="hidden lg:inline-flex"
            >
              Transfer
            </Button>
          )}

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

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            aria-label="Open notifications center"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-teal-500 text-white font-mono text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#0c1626]">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Profile Dropdown */}
          <Dropdown
            items={profileMenuItems}
            align="right"
            trigger={
              <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-royal-500/20"
                />
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {user?.name || 'Alex Morgan'}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {currentConfig.label}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </div>
            }
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
