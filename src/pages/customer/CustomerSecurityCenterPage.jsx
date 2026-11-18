import React, { useState } from 'react';
import { useBanking } from '../../hooks/useBanking';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import {
  ShieldCheck,
  Key,
  Lock,
  Smartphone,
  Globe,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function CustomerSecurityCenterPage() {
  const { user } = useAuth();
  const { securityAlerts, cards, toggleCardFreeze } = useBanking();
  const { success, warning } = useNotification();

  const [twoFactorActive, setTwoFactorActive] = useState(true);

  const handleToggle2FA = () => {
    setTwoFactorActive(!twoFactorActive);
    if (!twoFactorActive) {
      success('FIDO2 WebAuthn & TOTP Hardware Key enforced.');
    } else {
      warning('Hardware 2FA set to optional SMS fallback.');
    }
  };

  const handleFreezeAll = () => {
    cards.forEach((c) => {
      if (!c.isFrozen) toggleCardFreeze(c.id);
    });
    warning('Emergency Lock: All active cards have been frozen.');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Security & Defense Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-factor authenticator controls, device sessions, and audit advisories.
          </p>
        </div>

        <Button
          variant="danger"
          size="sm"
          icon={Lock}
          onClick={handleFreezeAll}
        >
          Emergency Card Freeze
        </Button>
      </div>

      {/* Security Health Score Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-teal-500/30 text-white shadow-fintech-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center text-2xl font-mono font-extrabold shadow-teal-glow">
            98
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">Optimal Defense Rating</span>
              <Badge variant="teal" size="sm" dot>Grade AAA</Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Your account satisfies all Federal Reserve Board Level-3 Cybersecurity guidelines.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
            <span className="text-slate-400 block">FIDO2 WebAuthn</span>
            <span className="font-bold text-teal-300">Active</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
            <span className="text-slate-400 block">AML Sentinel Rule</span>
            <span className="font-bold text-teal-300">Enforced</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authenticators Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-royal-500" />
              <CardTitle className="text-base">Authentication & Credentials</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  Enforce Hardware Key (YubiKey 5C NFC)
                </p>
                <p className="text-[11px] text-slate-500">
                  Required for wires exceeding $10,000.
                </p>
              </div>
              <input
                type="checkbox"
                checked={twoFactorActive}
                onChange={handleToggle2FA}
                className="w-5 h-5 rounded text-royal-600 focus:ring-royal-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  Security Passkey
                </p>
                <p className="text-[11px] text-slate-500">
                  Last updated 6 days ago.
                </p>
              </div>
              <Link to="/auth/forgot-password">
                <Button variant="outline" size="xs">
                  Change Passkey
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Active Authorized Devices */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-teal-500" />
              <CardTitle className="text-base">Authorized Terminals & Sessions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4" />
                <div>
                  <p className="font-semibold">macOS Sequoia • Safari 18.1 (Current)</p>
                  <p className="text-[11px] text-slate-400">San Francisco, CA • IP: 172.56.21.9</p>
                </div>
              </div>
              <Badge variant="success" size="sm">This Device</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">iPhone 16 Pro • NOVABANK iOS App</p>
                  <p className="text-[11px] text-slate-400">Face ID Enrolled • Last active 2 hours ago</p>
                </div>
              </div>
              <Badge variant="neutral" size="sm">Authorized</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Advisories List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Advisories & Ledger Events</CardTitle>
          <CardDescription>Direct cryptographic activity log for your private portfolio</CardDescription>
        </CardHeader>
        <CardContent noPadding>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="p-4 sm:p-5 flex items-start gap-3.5 text-xs">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-bold text-sm text-slate-900 dark:text-white">
                      {alert.title}
                    </p>
                    <span className="font-mono text-[11px] text-slate-400">
                      {formatDate(alert.timestamp, 'full')}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CustomerSecurityCenterPage;
