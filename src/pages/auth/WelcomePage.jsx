import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import DemoCredentialsBanner from '../../components/auth/DemoCredentialsBanner';
import {
  Landmark,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  Compass,
  Lock,
  Zap,
  TrendingUp,
  CreditCard,
} from 'lucide-react';

export function WelcomePage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleQuickCredentialSelect = async (cred) => {
    await login(cred.role);
    navigate(cred.defaultRoute);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto">
        <Badge variant="teal" size="sm" pulse dot className="mb-3">
          Next-Generation Digital Banking
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Institutional Security. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-600 via-royal-400 to-teal-400">
            Frictionless Private Banking.
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Welcome to the NOVABANK digital banking gateway. Access high-yield treasury reserves, execute real-time domestic wires, and manage multi-currency accounts.
        </p>
      </div>

      {/* Main 3 Action Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Login */}
        <Card hoverEffect className="flex flex-col justify-between p-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-royal-500/10 text-royal-600 dark:text-royal-400 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              Access Account
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Sign in with your email, password, or security passkey to access your personal or corporate portal.
            </p>
          </div>

          <Link to="/auth/login">
            <Button variant="primary" icon={ArrowRight} fullWidth>
              Sign In to Banking
            </Button>
          </Link>
        </Card>

        {/* Card 2: Open Account (Register) */}
        <Card hoverEffect className="flex flex-col justify-between p-6 border-teal-500/30">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              Open An Account
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Apply for a premier checking or high-yield liquid reserve account in under 3 minutes with demo KYC.
            </p>
          </div>

          <Link to="/auth/register">
            <Button variant="teal" icon={ArrowRight} fullWidth>
              Start Registration
            </Button>
          </Link>
        </Card>

        {/* Card 3: Guided Tour (Onboarding) */}
        <Card hoverEffect className="flex flex-col justify-between p-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              Platform Journey
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Take an interactive 3-step walkthrough discovering liquid yields, automated underwriting, and controls.
            </p>
          </div>

          <Link to="/auth/onboarding">
            <Button variant="outline" icon={ArrowRight} fullWidth>
              Explore Tour
            </Button>
          </Link>
        </Card>
      </div>

      {/* Demo Credentials Picker */}
      <DemoCredentialsBanner
        onSelectCredentials={handleQuickCredentialSelect}
        className="mt-6"
      />

      {/* Institutional Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800">
          <ShieldCheck className="w-5 h-5 text-teal-500 mx-auto mb-1.5" />
          <p className="font-bold text-slate-800 dark:text-slate-200">FDIC Insured</p>
          <p className="text-[11px] text-slate-400">Up to $250,000</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800">
          <Zap className="w-5 h-5 text-royal-500 mx-auto mb-1.5" />
          <p className="font-bold text-slate-800 dark:text-slate-200">Real-Time Wires</p>
          <p className="text-[11px] text-slate-400">Instant ACH & Fedwire</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800">
          <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
          <p className="font-bold text-slate-800 dark:text-slate-200">5.15% APY</p>
          <p className="text-[11px] text-slate-400">Liquid Treasury Reserve</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-slate-800">
          <CreditCard className="w-5 h-5 text-indigo-500 mx-auto mb-1.5" />
          <p className="font-bold text-slate-800 dark:text-slate-200">Titanium Cards</p>
          <p className="text-[11px] text-slate-400">Instant Virtual Tokens</p>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
