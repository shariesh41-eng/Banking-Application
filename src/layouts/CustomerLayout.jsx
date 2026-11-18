import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import QuickTransferModal from '../components/common/QuickTransferModal';

export function CustomerLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d17] text-slate-900 dark:text-slate-100 font-sans selection:bg-royal-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentRole="customer"
        onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentRole="customer"
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

export default CustomerLayout;
