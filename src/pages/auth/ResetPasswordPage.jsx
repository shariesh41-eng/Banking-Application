import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';
import { analyzePasswordStrength } from '../../utils/validators';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

export function ResetPasswordPage() {
  const { completePasswordReset } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    const strength = analyzePasswordStrength(password);
    if (!password) {
      errs.password = 'New security passkey is required';
    } else if (!strength.isValid) {
      errs.password = 'Password must meet at least Medium strength standards (8+ chars)';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setLoading(true);
    await completePasswordReset(password);
    setLoading(false);
    setIsSuccess(true);
    success('Security passkey updated successfully.');
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto space-y-6 text-center animate-fadeIn">
        <Card className="p-8 sm:p-10 shadow-fintech-lg border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Passkey Successfully Reset
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Your NOVABANK security credentials have been updated and synced across all banking clusters.
          </p>

          <Link to="/auth/login">
            <Button variant="primary" icon={ArrowRight} fullWidth size="lg">
              Sign In with New Passkey
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fadeIn">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-3">
          <RotateCcw className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create New Security Passkey
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Your identity code was verified. Set a hardened passkey to secure your account.
        </p>
      </div>

      <Card className="p-6 sm:p-8 shadow-fintech-lg border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="New Security Passkey"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              placeholder="Enter new passkey"
              required
              value={password}
              error={formErrors.password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formErrors.password) setFormErrors({ ...formErrors, password: null });
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
            <PasswordStrengthMeter password={password} />
          </div>

          <Input
            label="Confirm New Passkey"
            type={showConfirmPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="Re-enter new passkey"
            required
            value={confirmPassword}
            error={formErrors.confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (formErrors.confirmPassword) setFormErrors({ ...formErrors, confirmPassword: null });
            }}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="teal"
              size="lg"
              fullWidth
              isLoading={loading}
              icon={ShieldCheck}
            >
              Update Security Passkey
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ResetPasswordPage;
