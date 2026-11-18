import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import {
  User,
  ShieldCheck,
  Bell,
  Check,
  ArrowRight,
  Lock,
  Sparkles,
} from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
];

export function ProfileSetupPage() {
  const { pendingRegistration, completeProfileSetup } = useAuth();
  const { success } = useNotification();
  const navigate = useNavigate();

  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [pin, setPin] = useState('4829');
  const [confirmPin, setConfirmPin] = useState('4829');
  const [notifyWires, setNotifyWires] = useState(true);
  const [notifyStatements, setNotifyStatements] = useState(true);
  const [notifyLogins, setNotifyLogins] = useState(true);
  const [pinError, setPinError] = useState('');
  const [loading, setLoading] = useState(false);

  const clientName = pendingRegistration
    ? `${pendingRegistration.firstName} ${pendingRegistration.lastName}`
    : 'Valued Client';

  const handleSubmit = (e) => {
    e.preventDefault();
    setPinError('');

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setPinError('Security PIN must be exactly 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      setPinError('Security PINs do not match');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      completeProfileSetup({
        avatar: selectedAvatar,
        pin,
        preferences: { notifyWires, notifyStatements, notifyLogins },
      });
      setLoading(false);
      success(`Welcome to NOVABANK Private Banking, ${clientName}!`);
      navigate('/customer/dashboard');
    }, 500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
      <div className="text-center">
        <Badge variant="teal" size="sm" pulse dot className="mb-2">
          Final Step • Profile Setup
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Personalize Your Banking Portal
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Set your 4-digit transfer authorization PIN and communication endpoints.
        </p>
      </div>

      <Card className="p-6 sm:p-8 shadow-fintech-lg border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2.5">
              Select Client Avatar
            </label>
            <div className="flex items-center gap-3">
              {AVATAR_OPTIONS.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedAvatar(img)}
                  className={`relative rounded-2xl p-0.5 transition-all ${
                    selectedAvatar === img
                      ? 'ring-4 ring-teal-500 shadow-md scale-105'
                      : 'opacity-70 hover:opacity-100 hover:scale-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Avatar option ${i + 1}`}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  {selectedAvatar === img && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 4-Digit Transaction Authorization PIN */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                4-Digit Transaction Security PIN
              </label>
              <span className="text-[11px] text-slate-400 font-mono">Used for wire confirmations</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="password"
                maxLength={4}
                placeholder="4 Digits"
                icon={Lock}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />

              <Input
                type="password"
                maxLength={4}
                placeholder="Confirm PIN"
                icon={Lock}
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </div>
            {pinError && (
              <p className="text-xs text-rose-500 font-semibold mt-1.5">{pinError}</p>
            )}
          </div>

          {/* Alert Preferences */}
          <div className="space-y-2.5 pt-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Real-Time Security Notifications
            </label>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 cursor-pointer text-xs">
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  Instant Wire Transfer Alerts (Push & SMS)
                </span>
                <input
                  type="checkbox"
                  checked={notifyWires}
                  onChange={(e) => setNotifyWires(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 cursor-pointer text-xs">
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  Monthly Interest Yield Statements
                </span>
                <input
                  type="checkbox"
                  checked={notifyStatements}
                  onChange={(e) => setNotifyStatements(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 cursor-pointer text-xs">
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  New Device Login Alerts
                </span>
                <input
                  type="checkbox"
                  checked={notifyLogins}
                  onChange={(e) => setNotifyLogins(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <Button
              type="submit"
              variant="teal"
              size="lg"
              fullWidth
              isLoading={loading}
              icon={Sparkles}
            >
              Complete Setup & Open Portal
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ProfileSetupPage;
