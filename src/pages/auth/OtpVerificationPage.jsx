import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import OtpInput from '../../components/auth/OtpInput';
import {
  ShieldCheck,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export function OtpVerificationPage() {
  const { verifyOtp, pendingOtpTarget } = useAuth();
  const { success, error: toastError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.returnTo || '/auth/profile-setup';
  const targetDestination = location.state?.destination || pendingOtpTarget?.destination || 'your registered mobile endpoint';

  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(59);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (code.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code');
      return;
    }

    setLoading(true);

    try {
      await verifyOtp(code);
      setLoading(false);
      success('Cryptographic identity verification confirmed.');
      navigate(returnTo);
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || 'Invalid verification code. Please retry.');
      toastError(err.message || 'Verification failed.');
    }
  };

  const handleAutoFillDemoCode = () => {
    setCode('123456');
    setErrorMessage('');
    success('Demo master code (123456) filled!');
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setTimer(60);
      success(`Fresh verification code dispatched to ${targetDestination}`);
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fadeIn">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-3 border border-teal-500/20 shadow-sm">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <Badge variant="teal" size="sm" pulse dot className="mb-2">
          Step 2 • Multi-Factor Authentication
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Verify Security Code
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Enter the 6-digit one-time passcode sent to{' '}
          <strong className="text-slate-800 dark:text-slate-200">{targetDestination}</strong>.
        </p>
      </div>

      <Card className="p-6 sm:p-8 shadow-fintech-lg border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleVerify} className="space-y-6">
          {/* OTP Input Boxes */}
          <div className="py-2">
            <OtpInput
              length={6}
              value={code}
              onChange={(val) => {
                setCode(val);
                if (errorMessage) setErrorMessage('');
              }}
              error={Boolean(errorMessage)}
              disabled={loading}
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Demo Pre-fill Pill */}
          <div className="p-3 rounded-xl bg-royal-50 dark:bg-royal-950/30 border border-royal-200 dark:border-royal-800/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-royal-700 dark:text-royal-300">
              <Sparkles className="w-4 h-4 text-royal-500" />
              <span>Demo Master Code: <strong className="font-mono">123456</strong></span>
            </div>
            <button
              type="button"
              onClick={handleAutoFillDemoCode}
              className="text-royal-600 dark:text-teal-400 font-bold hover:underline"
            >
              Auto-fill
            </button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="teal"
            size="lg"
            fullWidth
            isLoading={loading}
            icon={CheckCircle2}
            disabled={code.length !== 6}
          >
            Confirm & Authenticate
          </Button>

          {/* Resend & Countdown */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {timer > 0 ? `Code expires in 0:${timer < 10 ? `0${timer}` : timer}` : 'Code expired'}
              </span>
            </div>

            <button
              type="button"
              disabled={timer > 0 || isResending}
              onClick={handleResend}
              className={`font-semibold transition-colors flex items-center gap-1 ${
                timer > 0
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'text-royal-600 dark:text-teal-400 hover:underline cursor-pointer'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              Resend Code
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default OtpVerificationPage;
