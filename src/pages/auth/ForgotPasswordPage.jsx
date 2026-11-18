import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { isValidEmail, isValidPhone, formatPhoneNumber } from '../../utils/validators';
import {
  KeyRound,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Send,
  CheckCircle2,
} from 'lucide-react';

export function ForgotPasswordPage() {
  const { initiateForgotPassword } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const [method, setMethod] = useState('email'); // 'email' | 'phone'
  const [identifier, setIdentifier] = useState('customer@novabank.com');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!identifier.trim()) {
      setValidationError(`Please enter your ${method === 'email' ? 'email address' : 'mobile number'}`);
      return;
    }

    if (method === 'email' && !isValidEmail(identifier)) {
      setValidationError('Please enter a valid institutional or personal email address');
      return;
    }

    if (method === 'phone' && !isValidPhone(identifier)) {
      setValidationError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    initiateForgotPassword(identifier);

    setTimeout(() => {
      setLoading(false);
      success(`Password recovery verification code dispatched to ${identifier}`);
      navigate('/auth/otp', { state: { returnTo: '/auth/reset-password', destination: identifier } });
    }, 450);
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setIdentifier(formatted);
    if (validationError) setValidationError('');
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fadeIn">
      {/* Back button */}
      <div>
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>

      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-royal-500/10 text-royal-600 dark:text-royal-400 flex items-center justify-center mx-auto mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Recover Security Passkey
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          We will transmit a 6-digit cryptographic verification code to your verified channel.
        </p>
      </div>

      <Card className="p-6 sm:p-8 shadow-fintech-lg border border-slate-200 dark:border-slate-800">
        {/* Method Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setMethod('email');
              setIdentifier('customer@novabank.com');
              setValidationError('');
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              method === 'email'
                ? 'bg-white dark:bg-royal-600 text-royal-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Via Email
          </button>

          <button
            type="button"
            onClick={() => {
              setMethod('phone');
              setIdentifier('(555) 234-5678');
              setValidationError('');
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              method === 'phone'
                ? 'bg-white dark:bg-royal-600 text-royal-700 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            Via SMS OTP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {method === 'email' ? (
            <Input
              label="Registered Email Address"
              type="email"
              icon={Mail}
              placeholder="e.g. customer@novabank.com"
              required
              value={identifier}
              error={validationError}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (validationError) setValidationError('');
              }}
            />
          ) : (
            <Input
              label="Verified Mobile Number"
              type="tel"
              icon={Phone}
              placeholder="(555) 000-0000"
              required
              value={identifier}
              error={validationError}
              onChange={handlePhoneChange}
            />
          )}

          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
            <span>
              Codes expire after 10 minutes. For demonstration, code <strong className="font-mono">123456</strong> is always accepted.
            </span>
          </div>

          <Button
            type="submit"
            variant="teal"
            size="lg"
            fullWidth
            isLoading={loading}
            icon={Send}
          >
            Send Verification Code
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ForgotPasswordPage;
