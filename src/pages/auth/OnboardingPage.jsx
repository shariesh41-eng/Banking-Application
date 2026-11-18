import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  TrendingUp,
  Zap,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Globe,
  Landmark,
} from 'lucide-react';

const STEPS = [
  {
    id: 1,
    badge: 'Step 1 of 3 • Treasury Architecture',
    title: 'High-Yield Liquidity & Intelligent Reserves',
    description:
      'Maximize cash yield without locking capital. NOVABANK automatically sweeps operational deposits into short-term US Treasury obligations earning 5.15% APY with instantaneous liquidity.',
    icon: TrendingUp,
    iconColor: 'text-teal-400',
    iconBg: 'bg-teal-500/10 border-teal-500/20',
    features: [
      '5.15% APY on daily liquid reserve balance',
      'Automated inter-account liquidity sweep algorithms',
      'Full FDIC insurance up to $250,000 per charter',
      'Zero maintenance or minimum balance penalty fees',
    ],
  },
  {
    id: 2,
    badge: 'Step 2 of 3 • Global Clearing Network',
    title: 'Frictionless Real-Time Wires & ACH Transfers',
    description:
      'Execute domestic wire transfers and automated clearing house sweeps with zero network friction. Funds clear instantly across the Fedwire network with end-to-end cryptographic receipts.',
    icon: Zap,
    iconColor: 'text-royal-400',
    iconBg: 'bg-royal-500/10 border-royal-500/20',
    features: [
      'Zero wire transfer processing fees for private wealth clients',
      'Instant settlement on transfers under $50,000 threshold',
      'Direct Fedwire routing with automated beneficiary verification',
      'Multi-currency treasury support across USD, EUR, and GBP',
    ],
  },
  {
    id: 3,
    badge: 'Step 3 of 3 • Zero-Trust Compliance',
    title: 'Bank-Grade Cryptography & Dual-Officer Control',
    description:
      'Protected by military-grade TLS 1.3 cryptography, hardware FIDO2 WebAuthn keys, and role-based segregation of duties ensuring complete regulatory compliance under SOC 2 Type II audit standards.',
    icon: ShieldCheck,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    features: [
      'Hardware token and biometric 2FA authentication',
      'Dual-officer review workflows for high-value transactions',
      'Immutable cryptographic hash audit logging',
      'Continuous automated AML & KYC sentinel monitoring',
    ],
  },
];

export function OnboardingPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const navigate = useNavigate();

  const currentStep = STEPS[currentStepIndex];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      navigate('/auth/register');
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Progress Indicators */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          {STEPS.map((step, idx) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'w-10 bg-royal-600 dark:bg-teal-400'
                  : idx < currentStepIndex
                  ? 'w-4 bg-royal-300 dark:bg-teal-700'
                  : 'w-4 bg-slate-200 dark:bg-slate-800'
              }`}
              title={`Go to step ${step.id}`}
            />
          ))}
        </div>

        <Link
          to="/auth/register"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          Skip to Registration →
        </Link>
      </div>

      {/* Main Feature Showcase Card */}
      <Card className="p-6 sm:p-10 shadow-fintech-lg border border-slate-200 dark:border-slate-800/80">
        <CardContent noPadding className="space-y-6">
          <Badge variant="teal" size="sm">
            {currentStep.badge}
          </Badge>

          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-inner ${currentStep.iconBg}`}
            >
              <Icon className={`w-8 h-8 ${currentStep.iconColor}`} />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {currentStep.title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Feature Bullets */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentStep.features.map((feat, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{feat}</span>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="md"
              icon={ArrowLeft}
              disabled={currentStepIndex === 0}
              onClick={handlePrev}
            >
              Previous
            </Button>

            <Button
              variant={currentStepIndex === STEPS.length - 1 ? 'teal' : 'primary'}
              size="md"
              rightIcon={ArrowRight}
              onClick={handleNext}
            >
              {currentStepIndex === STEPS.length - 1
                ? 'Create My Account'
                : 'Next Overview'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trust Seal */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500 text-center">
        <Landmark className="w-4 h-4 text-royal-500" />
        <span>NOVABANK N.A. • Chartered Institutional Bank</span>
      </div>
    </div>
  );
}

export default OnboardingPage;
