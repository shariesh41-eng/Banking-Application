import React, { useState } from 'react';
import { useBanking } from '../../hooks/useBanking';
import { useNotification } from '../../hooks/useNotification';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { formatCurrency, formatDate, maskAccountNumber } from '../../utils/formatters';
import { isValidAmount } from '../../utils/validators';
import {
  ArrowLeftRight,
  Send,
  ShieldCheck,
  Zap,
  Building,
  User,
  DollarSign,
  Clock,
  CheckCircle,
} from 'lucide-react';

export function TransfersPage() {
  const { accounts, transactions, transferFunds } = useBanking();
  const { info } = useNotification();

  const [transferType, setTransferType] = useState('ach'); // 'ach' | 'internal' | 'wire'
  const [sourceAccountId, setSourceAccountId] = useState(accounts[0]?.id || '');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [category, setCategory] = useState('Transfer');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const selectedAccount =
    accounts.find((a) => a.id === sourceAccountId) || accounts[0];

  const quickRecipients = [
    { name: 'Apex Technologies LLC', account: '4092-****-1982', routing: '021000021' },
    { name: 'Vertex Capital Partners', account: '8910-****-9921', routing: '121000358' },
    { name: 'Stripe Corporate Reserve', account: '7729-****-4820', routing: '026009593' },
  ];

  const handleSelectQuickRecipient = (rec) => {
    setRecipientName(rec.name);
    setRecipientAccount(rec.account);
    setRoutingNumber(rec.routing);
    info(`Recipient set to ${rec.name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!recipientName.trim()) {
      setFormError('Recipient name is required');
      return;
    }

    const validation = isValidAmount(
      amount,
      selectedAccount?.availableBalance || 0
    );
    if (!validation.valid) {
      setFormError(validation.error);
      return;
    }

    setLoading(true);
    const result = await transferFunds({
      sourceAccountId: selectedAccount.id,
      recipientName: recipientName.trim(),
      recipientAccount: recipientAccount.trim() || 'Internal Account',
      amount: Number(amount),
      memo: memo.trim() || `${transferType.toUpperCase()} transfer to ${recipientName}`,
      category,
    });

    setLoading(false);
    if (result.success) {
      setAmount('');
      setMemo('');
      setRecipientName('');
      setRecipientAccount('');
      setRoutingNumber('');
    }
  };

  const transferHistory = transactions.filter((t) =>
    t.category.toLowerCase().includes('transfer') || t.type === 'debit'
  );

  const historyColumns = [
    {
      header: 'Recipient / Description',
      key: 'description',
      render: (_, tx) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            {tx.merchant || tx.description}
          </p>
          <p className="text-xs text-slate-400 font-mono">
            {tx.reference} • {formatDate(tx.date, 'short')}
          </p>
        </div>
      ),
    },
    {
      header: 'Account',
      key: 'accountName',
      render: (v) => <span className="text-xs text-slate-500">{v}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      align: 'center',
      render: (v) => (
        <Badge variant={v === 'completed' ? 'success' : 'warning'} size="sm" dot>
          {v.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Amount',
      key: 'amount',
      align: 'right',
      render: (v) => (
        <span className="font-mono font-semibold text-sm text-slate-900 dark:text-slate-100">
          {formatCurrency(Math.abs(v))}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Transfers & Payments Gateway
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Initiate zero-fee domestic wires, ACH sweeps, and inter-account liquidity rebalancing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Transfer Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Initiate Transfer</CardTitle>
                <CardDescription>Direct clearing with instantaneous settlement</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Transfer Type Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setTransferType('ach')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  transferType === 'ach'
                    ? 'bg-white dark:bg-royal-600 text-royal-700 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Instant ACH
              </button>
              <button
                type="button"
                onClick={() => setTransferType('wire')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  transferType === 'wire'
                    ? 'bg-white dark:bg-royal-600 text-royal-700 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                Fedwire
              </button>
              <button
                type="button"
                onClick={() => setTransferType('internal')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  transferType === 'internal'
                    ? 'bg-white dark:bg-royal-600 text-royal-700 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Account Sweep
              </button>
            </div>

            {/* Quick Beneficiary Chips */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Recent Verified Beneficiaries
              </p>
              <div className="flex flex-wrap gap-2">
                {quickRecipients.map((rec) => (
                  <button
                    key={rec.name}
                    type="button"
                    onClick={() => handleSelectQuickRecipient(rec)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 font-medium transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                  >
                    <User className="w-3 h-3 text-royal-500" />
                    <span>{rec.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* From Account */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
                  Source Account
                </label>
                <select
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  className="w-full bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-800 p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500/40"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} — {formatCurrency(acc.availableBalance)} available
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Recipient Full Name / Entity"
                  placeholder="e.g. Acme Corp"
                  icon={User}
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                />
                <Input
                  label="Destination Account Number"
                  placeholder="e.g. 4092849102"
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Routing (ABA / Fedwire ID)"
                  placeholder="9 digits, e.g. 021000021"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                />
                <Input
                  label="Amount (USD)"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  icon={DollarSign}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  helperText={`Available limit: ${formatCurrency(selectedAccount?.availableBalance || 0)}`}
                />
              </div>

              <Input
                label="Transfer Memo & Reference"
                placeholder="e.g. Q4 vendor settlement invoice #1042"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  {formError}
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center gap-3 text-xs text-teal-800 dark:text-teal-300">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-teal-600 dark:text-teal-400" />
                <div>
                  <p className="font-semibold">Security Clearance Active</p>
                  <p className="text-[11px] text-teal-700/80 dark:text-teal-300/80">
                    Wires are cleared instantly under the $50,000 threshold. Daily limits apply.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="submit"
                  variant="teal"
                  icon={Send}
                  isLoading={loading}
                  className="w-full sm:w-auto"
                >
                  Execute Transfer Now
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right 1 Column: Wire Limits & Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daily Transfer Capacities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-500">Instant ACH Capacity</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">$50,000.00 Daily</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-royal-600 h-full w-2/5" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  $30,000.00 remaining for today
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-500">Fedwire Same-Day</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">$250,000.00 Daily</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full w-1/5" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Cutoff time: 4:30 PM EST
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Zero Transfer Fees</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Included complimentary with your NOVABANK Platinum Elite relationship charter.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Outbound Transfers Audit Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Outbound Transfers</CardTitle>
          <CardDescription>Verified settlement logs</CardDescription>
        </CardHeader>
        <CardContent noPadding>
          <Table columns={historyColumns} data={transferHistory} />
        </CardContent>
      </Card>
    </div>
  );
}

export default TransfersPage;
