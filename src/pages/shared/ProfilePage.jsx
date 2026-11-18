import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Lock,
  Key,
  Bell,
  Save,
} from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();
  const { success } = useNotification();

  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [address, setAddress] = useState(
    user?.address || '742 Evergreen Terrace, San Francisco, CA 94107'
  );

  const handleSave = (e) => {
    e.preventDefault();
    success('Profile security preferences updated.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Client Identity & Security Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review KYC charter credentials, biometric authenticators, and contact endpoints.
        </p>
      </div>

      {/* Identity Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
              alt={user?.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-royal-500/20 shadow-fintech"
            />

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {user?.name || 'Alexandra Morgan'}
                </h2>
                <Badge variant="teal" size="sm" dot>
                  KYC VERIFIED
                </Badge>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {user?.title || 'Private Wealth Client'} • {user?.email}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4 text-xs">
                <span className="px-3 py-1 rounded-lg bg-royal-500/10 text-royal-600 dark:text-royal-400 font-semibold">
                  Tier: {user?.membershipTier || 'Platinum Elite'}
                </span>
                <span className="text-slate-400">
                  Last Authenticated: {formatDate(user?.lastLogin || Date.now(), 'full')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details & Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>Contact & Communication Preferences</CardTitle>
          <CardDescription>Primary dispatch endpoints for transaction receipts and wires</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Institutional Email"
                value={user?.email || ''}
                disabled
                icon={Mail}
                helperText="Email changes require dual biometric authorization"
              />

              <Input
                label="Mobile Phone for SMS Otp"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={Phone}
                required
              />
            </div>

            <Input
              label="Physical Legal Residence"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              icon={MapPin}
              required
            />

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-500" />
                <span>Multi-Factor Hardware Authenticators</span>
              </h4>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    FIDO2 WebAuthn YubiKey 5C NFC
                  </p>
                  <p className="text-slate-500">Registered on Nov 12, 2026</p>
                </div>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" icon={Save}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfilePage;
