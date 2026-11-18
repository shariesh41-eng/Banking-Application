import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import { ShieldAlert, Server, Zap } from 'lucide-react';

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d17] text-slate-900 dark:text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      {/* Super Admin Security Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 text-white text-xs px-4 py-2 border-b border-rose-500/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span className="font-semibold text-rose-200">
            ADMINISTRATIVE CONSOLE
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline">
            Elevated platform access enabled. All modifications are permanently audited.
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-mono">
            <Server className="w-3.5 h-3.5" />
            Core Cluster: 100%
          </span>
          <span className="flex items-center gap-1 text-royal-400 font-mono">
            <Zap className="w-3.5 h-3.5" />
            18ms Latency
          </span>
        </div>
      </div>

      {/* Header */}
      <Header
        currentRole="admin"
        onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentRole="admin"
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

export default AdminLayout;
