import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Landmark, Compass, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  const { userRole } = useAuth();

  let destination = '/customer/dashboard';
  if (userRole === 'admin') destination = '/admin/dashboard';
  if (userRole === 'employee') destination = '/employee/dashboard';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070d17] flex items-center justify-center p-4 font-sans text-center">
      <div className="max-w-md w-full bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-fintech-lg">
        <div className="w-16 h-16 rounded-2xl bg-royal-500/10 text-royal-600 dark:text-royal-400 flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8" />
        </div>

        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono mb-2">
          404
        </h1>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
          Resource Not Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          The requested banking route does not exist or has been relocated to another ledger.
        </p>

        <Link to={destination}>
          <Button variant="primary" icon={ArrowLeft} fullWidth>
            Return to Authorized Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
