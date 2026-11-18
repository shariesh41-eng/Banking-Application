import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import {
  Landmark,
  ShieldCheck,
  Lock,
  Mail,
  Key,
  ArrowRight,
  User,
  Shield,
  Briefcase,
  Zap,
} from 'lucide-react';

export function LoginPage() {
  const { login, switchRole } = useAuth();
  const { success } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('alex.morgan@novabank.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login('customer');
    setLoading(false);
    success('Authenticated successfully. Welcome to NOVABANK.');
    navigate('/customer/dashboard');
  };

  const handleQuickLogin = async (role) => {
    setLoading(true);
    await login(role);
    setLoading(false);
    if (role === 'admin') {
      success('Logged in as Super Admin Elena Rostova');
      navigate('/admin/dashboard');
    } else if (role === 'employee') {
      success('Logged in as Relationship Officer David Chen');
      navigate('/employee/dashboard');
    } else {
      success('Logged in as Private Wealth Client Alexandra Morgan');
      navigate('/customer/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070d17] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-royal-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Emblem */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-navy-900 via-royal-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-fintech-glow mb-4">
          <Landmark className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          NOVA<span className="text-royal-500">BANK</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Next-Generation Digital Banking & Institutional Treasury Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-[#0c1626] py-8 px-6 sm:px-10 shadow-fintech-lg rounded-3xl border border-slate-200 dark:border-slate-800">
          {/* Quick Demo Access Roles */}
          <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-3 text-center">
              1-Click Demo Profile Access
            </span>
            <div className="grid grid-cols-3 gap-2">
              {/* Customer */}
              <button
                type="button"
                onClick={() => handleQuickLogin('customer')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-center transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-royal-500/10 text-royal-600 dark:text-royal-400 flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition-transform">
                  <User className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Customer</p>
                <p className="text-[10px] text-slate-400">Alex M.</p>
              </button>

              {/* Admin */}
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-center transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition-transform">
                  <Shield className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Admin</p>
                <p className="text-[10px] text-slate-400">Elena R.</p>
              </button>

              {/* Employee */}
              <button
                type="button"
                onClick={() => handleQuickLogin('employee')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-center transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Officer</p>
                <p className="text-[10px] text-slate-400">David C.</p>
              </button>
            </div>
          </div>

          {/* Direct Credentials Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Secure Passkey"
              type="password"
              icon={Key}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-royal-600 focus:ring-royal-500"
                />
                Remember terminal
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  success('Password reset link dispatched to authorized corporate address.');
                }}
                className="text-royal-600 dark:text-teal-400 hover:underline font-semibold"
              >
                Forgot passkey?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={loading}
              icon={Lock}
            >
              Sign In to Core Banking
            </Button>
          </form>

          {/* Security Assurance Badge */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-500" />
            <span>FIDO2 WebAuthn & TLS 1.3 Protected</span>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-400 dark:text-slate-500">
          NOVABANK Member FDIC • NMLS #491024 • Equal Housing Lender
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
