import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  LogOut,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Home,
  Lock,
} from 'lucide-react';

export function LogoutPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically finalize logout when arriving at this page
    logout();
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-6 text-center animate-fadeIn">
      <Card className="p-8 sm:p-10 shadow-fintech-lg border border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-royal-500/10 text-royal-600 dark:text-royal-400 flex items-center justify-center mx-auto mb-5 border border-royal-500/20 shadow-sm">
          <LogOut className="w-8 h-8" />
        </div>

        <Badge variant="success" size="sm" dot className="mb-2">
          Session Terminated Cleanly
        </Badge>

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          You Have Signed Out
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          Your cryptographic authentication tokens and local credentials have been cleared from this browser session.
        </p>

        {/* Security Checklist */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2 mb-6">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <span>FIDO2 WebAuthn keys detached</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <span>Encrypted localStorage tokens wiped</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <span>Audit log recorded: Graceful logout</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link to="/auth/login">
            <Button variant="primary" icon={ArrowRight} fullWidth size="lg">
              Sign In Again
            </Button>
          </Link>

          <Link to="/auth/welcome">
            <Button variant="ghost" icon={Home} fullWidth>
              Return to Welcome Gateway
            </Button>
          </Link>
        </div>
      </Card>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        For optimal security, close all browser windows when accessing banking services on shared hardware.
      </p>
    </div>
  );
}

export default LogoutPage;
