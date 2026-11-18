import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';
import { isValidEmail, isValidPhone, formatPhoneNumber, analyzePasswordStrength } from '../../utils/validators';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  Building,
  Wallet,
  Landmark,
} from 'lucide-react';

export function RegisterPage() {
  const { startRegistration } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    accountType: 'checking',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const accountTypes = [
    {
      id: 'checking',
      title: 'Premier Checking',
      desc: 'Zero wire fees & debit card',
      icon: Wallet,
    },
    {
      id: 'savings',
      title: 'High-Yield Reserve',
      desc: '5.15% APY liquid treasury',
      icon: Landmark,
    },
    {
      id: 'business',
      title: 'Commercial Treasury',
      desc: 'Multi-officer corporate access',
      icon: Building,
    },
  ];

  const validateForm = () => {
    const errs = {};

    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!isValidEmail(formData.email)) {
      errs.email = 'Please provide a valid institutional or personal email';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Mobile phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    const strength = analyzePasswordStrength(formData.password);
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (!strength.isValid) {
      errs.password = 'Password must meet at least Medium strength standards (8+ chars)';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      errs.acceptTerms = 'You must accept the Electronic Communications & FDIC Disclosures';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      error('Please correct highlighted validation errors to proceed.');
      return;
    }

    setLoading(true);

    // Save pending registration in AuthContext and proceed to OTP demo step
    startRegistration(formData);

    setTimeout(() => {
      setLoading(false);
      success(`Verification code dispatched to ${formData.phone || formData.email}`);
      navigate('/auth/otp', { state: { returnTo: '/auth/profile-setup' } });
    }, 400);
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="text-center">
        <Badge variant="teal" size="sm" pulse dot className="mb-2">
          New Client Onboarding
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Open Your NOVABANK Digital Account
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Already have an authorized profile?{' '}
          <Link to="/auth/login" className="text-royal-600 dark:text-teal-400 font-semibold hover:underline">
            Sign in here →
          </Link>
        </p>
      </div>

      <Card className="p-6 sm:p-8 shadow-fintech-lg border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Account Class Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
              Select Primary Banking Facility
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {accountTypes.map((acc) => {
                const Icon = acc.icon;
                const isSelected = formData.accountType === acc.id;

                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, accountType: acc.id }))}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-royal-600 dark:border-teal-400 bg-royal-50/50 dark:bg-teal-950/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#0c1626]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 mb-1.5 ${
                        isSelected ? 'text-royal-600 dark:text-teal-400' : 'text-slate-400'
                      }`}
                    />
                    <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{acc.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{acc.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legal Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Legal First Name"
              placeholder="e.g. Jordan"
              icon={User}
              required
              value={formData.firstName}
              error={errors.firstName}
              onChange={(e) => {
                setFormData({ ...formData, firstName: e.target.value });
                if (errors.firstName) setErrors({ ...errors, firstName: null });
              }}
            />

            <Input
              label="Legal Last Name"
              placeholder="e.g. Vance"
              icon={User}
              required
              value={formData.lastName}
              error={errors.lastName}
              onChange={(e) => {
                setFormData({ ...formData, lastName: e.target.value });
                if (errors.lastName) setErrors({ ...errors, lastName: null });
              }}
            />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary Email Address"
              type="email"
              placeholder="j.vance@example.com"
              icon={Mail}
              required
              value={formData.email}
              error={errors.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: null });
              }}
            />

            <Input
              label="Mobile Number (For 2FA SMS)"
              type="tel"
              placeholder="(555) 000-0000"
              icon={Phone}
              required
              value={formData.phone}
              error={errors.phone}
              onChange={handlePhoneChange}
              helperText="Standard US 10-digit mobile number"
            />
          </div>

          {/* Password with Visibility Toggle */}
          <div>
            <Input
              label="Create Security Passkey"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              placeholder="Choose a strong passkey"
              required
              value={formData.password}
              error={errors.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: null });
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

            {/* Live Password Strength Meter */}
            <PasswordStrengthMeter password={formData.password} />
          </div>

          {/* Confirm Password */}
          <Input
            label="Confirm Passkey"
            type={showConfirmPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="Re-enter security passkey"
            required
            value={formData.confirmPassword}
            error={errors.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
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

          {/* Terms Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => {
                  setFormData({ ...formData, acceptTerms: e.target.checked });
                  if (errors.acceptTerms) setErrors({ ...errors, acceptTerms: null });
                }}
                className="mt-0.5 rounded text-royal-600 focus:ring-royal-500"
              />
              <span>
                I agree to the{' '}
                <span className="text-royal-600 dark:text-teal-400 font-semibold underline">
                  Electronic Account Disclosures
                </span>
                , FDIC Insurance Pass-Through terms, and certify that all details provided are accurate under penalties of perjury.
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.acceptTerms}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="teal"
              size="lg"
              fullWidth
              isLoading={loading}
              icon={UserPlus}
            >
              Continue to Identity Verification
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default RegisterPage;
