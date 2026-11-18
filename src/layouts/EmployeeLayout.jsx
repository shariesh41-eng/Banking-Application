import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import { Briefcase, CheckCircle, Clock } from 'lucide-react';

export function EmployeeLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d17] text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* Officer Station Status Bar */}
      <div className="bg-gradient-to-r from-navy-950 via-teal-950 to-navy-950 text-white text-xs px-4 py-2 border-b border-teal-500/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-teal-400" />
          <span className="font-semibold text-teal-200">
            RELATIONSHIP OFFICER DESK
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline">
            David Chen (Senior Relationship Manager)
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <span className="flex items-center gap-1 text-teal-300">
            <Clock className="w-3.5 h-3.5" />
            3 Pending Credit Inquiries
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            KYC SLA: 100% On-Target
          </span>
        </div>
      </div>

      {/* Header */}
      <Header
        currentRole="employee"
        onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentRole="employee"
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Regulatory Footer */}
      <Footer />
    </div>
  );
}

export default EmployeeLayout;
