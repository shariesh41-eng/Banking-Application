import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import DemoCredentialsBanner from '../../components/auth/DemoCredentialsBanner';
import { isValidEmail } from '../../utils/validators';
import {
  Lock,
  Mail,
  Key,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Landmark,
  User,
  Shield,
  Briefcase,
  AlertCircle,
} from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const { success, error: toastError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('customer@novabank.com');
  const [password, setPassword] = useState('Customer@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Handle auto-fill from demo credentials banner
  const handleAutoFill = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setFormError('');
    success(`Demo credentials loaded for ${cred.name} (${cred.role.toUpperCase()})`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim()) {
      setFormError('Institutional or account email is required');
      return;
    }

    if (!isValidEmail(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setFormError('Security passkey is required');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password, rememberMe);
      setLoading(false);
      success(`Authenticated successfully as ${result.user.name}`);

      // Redirect to return path or role's default dashboard
      const from = location.state?.from?.pathname || result.defaultRoute;
      navigate(from, { replace: true });
    } catch (err) {
      setLoading(false);
      setFormError(err.message || 'Authentication failed. Please verify credentials.');
      toastError(err.message || 'Invalid credentials.');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="text-center">
        <Badge variant="royal" size="sm" pulse dot className="mb-2">
          Encrypted Authentication Portal
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Sign In to NOVABANK
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Enter your authorized credentials or use 1-click demo access below.
        </p>
      </div>

      <Card className="p-6 sm:p-8 shadow-fintech-lg border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Email */}
          <Input
            label="Institutional Email"
            type="email"
            placeholder="e.g. customer@novabank.com"
            icon={Mail}
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (formError) setFormError('');
            }}
          />

          {/* Password with Eye Toggle */}
          <Input
            label="Security Passkey"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your security passkey"
            icon={Lock}
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (formError) setFormError('');
            }}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* Options Row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-royal-600 focus:ring-royal-500"
              />
              <span>Remember this terminal</span>
            </label>

            <Link
              to="/auth/forgot-password"
              className="text-royal-600 dark:text-teal-400 hover:underline font-semibold"
            >
              Forgot passkey?
            </Link>
          </div>

          {/* Sign In Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loading}
              icon={Lock}
            >
              Authenticate & Launch Portal
            </Button>
          </div>
        </form>

        {/* Sign up prompt */}
        <div className="text-center pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          New to NOVABANK?{' '}
          <Link
            to="/auth/register"
            className="text-royal-600 dark:text-teal-400 font-bold hover:underline"
          >
            Open an account in minutes →
          </Link>
        </div>
      </Card>

      {/* Demo Credentials Helper */}
      <DemoCredentialsBanner onSelectCredentials={handleAutoFill} />
    </div>
  );
}

export default LoginPage;
