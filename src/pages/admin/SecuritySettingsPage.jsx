import React, { useState } from 'react';
import { useNotification } from '../../hooks/useNotification';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import {
  Lock,
  Key,
  Shield,
  ShieldAlert,
  Server,
  Save,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export function SecuritySettingsPage() {
  const { success } = useNotification();

  const [twoFactorEnforced, setTwoFactorEnforced] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('15');
  const [ipWhitelistActive, setIpWhitelistActive] = useState(true);
  const [amlThreshold, setAmlThreshold] = useState('50000');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');

  const handleSavePolicies = (e) => {
    e.preventDefault();
    success('Platform security configuration updated & dispatched to clusters.');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Platform Security & Authentication Policies
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure zero-trust policies, multi-factor mandates, and automated AML sentinel thresholds.
        </p>
      </div>

      <form onSubmit={handleSavePolicies} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity & Session Policies */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-royal-500/10 text-royal-600 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Identity & Access Management</CardTitle>
                  <CardDescription>Authentication rules and credential lifetimes</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Mandatory 2FA */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Enforce Hardware Key / TOTP 2FA
                  </p>
                  <p className="text-xs text-slate-500">
                    Mandatory for all employee and administrative identities.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnforced}
                  onChange={(e) => setTwoFactorEnforced(e.target.checked)}
                  className="w-5 h-5 rounded text-royal-600 focus:ring-royal-500 cursor-pointer"
                />
              </div>

              {/* Session Inactivity Timeout */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
                  Inactivity Auto-Logout Timeout
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-800 p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500/40"
                >
                  <option value="15">15 Minutes (Strict Banking Standard)</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                  <option value="480">8 Hours (Stationary Teller Mode)</option>
                </select>
              </div>

              {/* Max Failed Attempts */}
              <Input
                label="Max Consecutive Failed Login Attempts"
                type="number"
                value={maxLoginAttempts}
                onChange={(e) => setMaxLoginAttempts(e.target.value)}
                helperText="Account will be automatically placed in KYC lockout after limit"
              />
            </CardContent>
          </Card>

          {/* Compliance & AML Sentinel Policies */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Anti-Money Laundering (AML) Rules</CardTitle>
                  <CardDescription>Automated transaction holds and thresholds</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                label="Automated Wire Review Threshold (USD)"
                type="number"
                value={amlThreshold}
                onChange={(e) => setAmlThreshold(e.target.value)}
                helperText="Transfers exceeding this amount automatically queue for dual-officer authorization"
              />

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    CIDR IP Whitelisting for Admin Portal
                  </p>
                  <p className="text-xs text-slate-500">
                    Restrict admin access to dedicated corporate VPN blocks.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={ipWhitelistActive}
                  onChange={(e) => setIpWhitelistActive(e.target.checked)}
                  className="w-5 h-5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Modifying AML Sentinel thresholds generates an immediate alert to the Federal Reserve Board Supervisory Examiner.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="submit" variant="primary" icon={Save}>
            Apply Global Security Policies
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SecuritySettingsPage;
