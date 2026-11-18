import React, { useState } from 'react';
import { useBanking } from '../../hooks/useBanking';
import { useNotification } from '../../hooks/useNotification';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';
import {
  Wallet,
  Copy,
  Download,
  Plus,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export function AccountsPage() {
  const { accounts, totalBalance } = useBanking();
  const { success } = useNotification();
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState('savings');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    success(`${label} copied to clipboard: ${text}`);
  };

  const handleDownloadStatement = (accountName) => {
    success(`Official monthly statement PDF generated for ${accountName}`);
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    success(`Application for new ${newAccountName || 'Reserve Account'} submitted for underwriting approval.`);
    setIsNewAccountModalOpen(false);
    setNewAccountName('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Accounts & Treasury
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            FDIC-insured deposit accounts, liquid yields, and commercial treasury holdings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsNewAccountModalOpen(true)}
          >
            Open New Account
          </Button>
        </div>
      </div>

      {/* Aggregate Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 via-royal-900 to-navy-950 text-white shadow-fintech-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-teal-300 font-bold">
            Total Combined Portfolio
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono mt-1 text-white">
            {formatCurrency(totalBalance)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>4 Operating Accounts Active • All accounts in good standing</span>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/10 p-3.5 rounded-xl backdrop-blur-sm">
          <div className="text-right">
            <p className="text-xs text-slate-300">Weighted Average Yield</p>
            <p className="text-xl font-bold font-mono text-teal-300">4.32% APY</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-300">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Individual Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc) => (
          <Card key={acc.id} hoverEffect className="flex flex-col justify-between">
            <CardHeader
              action={
                <Badge
                  variant={acc.status === 'active' ? 'success' : 'neutral'}
                  size="sm"
                  dot
                >
                  {acc.status.toUpperCase()}
                </Badge>
              }
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-royal-500/10 text-royal-600 dark:text-royal-400 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{acc.name}</CardTitle>
                  <CardDescription className="text-xs capitalize">
                    {acc.type} Account {acc.isPrimary && '• Primary Checking'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Current Ledger Balance
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
                  {formatCurrency(acc.balance)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Available to trade or wire: <strong className="text-slate-700 dark:text-slate-300 font-mono">{formatCurrency(acc.availableBalance)}</strong>
                </div>
              </div>

              {/* Wire & Routing Details Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Account Number:</span>
                  <div className="flex items-center gap-1.5 font-mono font-medium">
                    <span>{maskAccountNumber(acc.accountNumber)}</span>
                    <button
                      onClick={() => copyToClipboard(acc.accountNumber, 'Account Number')}
                      className="text-royal-600 hover:text-royal-700 dark:text-royal-400 p-0.5"
                      title="Copy account number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Routing (ABA / Fedwire):</span>
                  <div className="flex items-center gap-1.5 font-mono font-medium">
                    <span>{acc.routingNumber}</span>
                    <button
                      onClick={() => copyToClipboard(acc.routingNumber, 'Routing Number')}
                      className="text-royal-600 hover:text-royal-700 dark:text-royal-400 p-0.5"
                      title="Copy routing number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Interest Yield:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {acc.interestRate} APY
                  </span>
                </div>
              </div>

              {/* Quick actions per account */}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Download}
                  onClick={() => handleDownloadStatement(acc.name)}
                  fullWidth
                >
                  Download eStatement
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Account Modal */}
      <Modal
        isOpen={isNewAccountModalOpen}
        onClose={() => setIsNewAccountModalOpen(false)}
        title="Open New Digital Banking Account"
        description="Expand your corporate or personal banking structure with instant account generation."
        size="md"
      >
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <Input
            label="Account Descriptor / Label"
            placeholder="e.g. Q4 Tax Reserve or Operations Checking"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
              Account Type
            </label>
            <select
              value={newAccountType}
              onChange={(e) => setNewAccountType(e.target.value)}
              className="w-full bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-800 p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500/40"
            >
              <option value="savings">High-Yield Reserve (5.15% APY)</option>
              <option value="checking">Premier Checking (Unlimited Free Wires)</option>
              <option value="investment">Equities & Treasuries Custody</option>
              <option value="business">Commercial Operating Treasury</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-700 dark:text-teal-300">
            Backed by standard NOVABANK institutional charter with zero minimum balance fees.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsNewAccountModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm & Create Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AccountsPage;
