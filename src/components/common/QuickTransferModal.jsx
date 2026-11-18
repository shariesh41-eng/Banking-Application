import React, { useState } from 'react';
import { useBanking } from '../../hooks/useBanking';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { isValidAmount } from '../../utils/validators';
import { formatCurrency } from '../../utils/formatters';
import { Send, ArrowRight, DollarSign, User, ShieldCheck } from 'lucide-react';

export function QuickTransferModal() {
  const {
    isTransferModalOpen,
    setIsTransferModalOpen,
    accounts,
    transferFunds,
  } = useBanking();

  const [sourceAccountId, setSourceAccountId] = useState(
    accounts[0]?.id || ''
  );
  const [recipientName, setRecipientName] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedAccount =
    accounts.find((a) => a.id === sourceAccountId) || accounts[0];

  const handleClose = () => {
    setIsTransferModalOpen(false);
    setErrorMsg('');
    setAmount('');
    setRecipientName('');
    setRecipientAccount('');
    setMemo('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!recipientName.trim()) {
      setErrorMsg('Please specify the recipient legal entity or account name');
      return;
    }

    const validation = isValidAmount(
      amount,
      selectedAccount?.availableBalance || 0
    );
    if (!validation.valid) {
      setErrorMsg(validation.error);
      return;
    }

    setLoading(true);
    const result = await transferFunds({
      sourceAccountId: selectedAccount.id,
      recipientName: recipientName.trim(),
      recipientAccount: recipientAccount.trim() || '4092-****-8821',
      amount: Number(amount),
      memo: memo.trim() || `Express transfer to ${recipientName}`,
    });

    setLoading(false);
    if (result.success) {
      handleClose();
    }
  };

  return (
    <Modal
      isOpen={isTransferModalOpen}
      onClose={handleClose}
      title="Instant Funds Transfer"
      description="Send domestic or wire transfer with real-time settlement."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Source Account Selector */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
            Transfer From
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

        {/* Recipient Name */}
        <Input
          label="Recipient Name / Business"
          placeholder="e.g. Acme Corporation or Jane Doe"
          icon={User}
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          required
        />

        {/* Recipient Account / Routing */}
        <Input
          label="Account or Routing Number"
          placeholder="e.g. 021000021 / 89102456"
          value={recipientAccount}
          onChange={(e) => setRecipientAccount(e.target.value)}
        />

        {/* Transfer Amount */}
        <Input
          label="Amount (USD)"
          type="number"
          step="0.01"
          placeholder="0.00"
          icon={DollarSign}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          helperText={
            selectedAccount
              ? `Available: ${formatCurrency(selectedAccount.availableBalance)}`
              : ''
          }
        />

        {/* Memo */}
        <Input
          label="Transfer Memo / Reference (Optional)"
          placeholder="e.g. Invoice #9024 payment"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <div className="flex items-center gap-2 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 text-xs">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>Real-time ACH verification applied. Zero network processing fee.</span>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="teal"
            icon={Send}
            isLoading={loading}
          >
            Confirm & Send
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default QuickTransferModal;
