import React, { useState, useMemo } from 'react';
import { useBanking } from '../../hooks/useBanking';
import { useNotification } from '../../hooks/useNotification';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';

export function TransactionsPage() {
  const { transactions, accounts } = useBanking();
  const { success } = useNotification();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.reference.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === 'all' || tx.type === selectedType;

      const matchesAccount =
        selectedAccount === 'all' || tx.accountId === selectedAccount;

      return matchesSearch && matchesType && matchesAccount;
    });
  }, [transactions, searchTerm, selectedType, selectedAccount]);

  const handleExportCSV = () => {
    success(`Exporting ${filteredTransactions.length} transaction records to CSV...`);
  };

  const columns = [
    {
      header: 'Description & Beneficiary',
      key: 'description',
      render: (_, tx) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              tx.type === 'credit'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}
          >
            {tx.type === 'credit' ? (
              <ArrowDownRight className="w-5 h-5" />
            ) : (
              <ArrowUpRight className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              {tx.description}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {tx.merchant} • Ref: {tx.reference}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Date & Time',
      key: 'date',
      render: (v) => (
        <div className="text-xs">
          <p className="font-medium text-slate-800 dark:text-slate-200">
            {formatDate(v, 'medium')}
          </p>
          <p className="text-slate-400 font-mono">{formatDate(v, 'time')}</p>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (v) => (
        <Badge variant="neutral" size="sm">
          {v}
        </Badge>
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
        <Badge
          variant={v === 'completed' ? 'success' : 'warning'}
          size="sm"
          dot
        >
          {v.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Settlement Amount',
      key: 'amount',
      align: 'right',
      render: (_, tx) => (
        <span
          className={`font-semibold font-mono text-sm ${
            tx.type === 'credit'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {tx.type === 'credit' ? '+' : ''}
          {formatCurrency(tx.amount)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Transaction Activity & Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time feed of credits, debits, treasury disbursements, and wires.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={FileSpreadsheet}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="sm:col-span-2">
            <Input
              placeholder="Search by description, merchant, or reference ID..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-800 p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500/40"
            >
              <option value="all">All Flow Directions</option>
              <option value="credit">Credits (Deposits & Inflow)</option>
              <option value="debit">Debits (Payments & Outflow)</option>
            </select>
          </div>

          {/* Account Filter */}
          <div>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-800 p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500/40"
            >
              <option value="all">All Linked Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader
          action={
            <span className="text-xs text-slate-500">
              Showing {filteredTransactions.length} of {transactions.length} records
            </span>
          }
        >
          <CardTitle>Historical Ledger</CardTitle>
          <CardDescription>Click any row to inspect complete settlement audit metadata</CardDescription>
        </CardHeader>
        <CardContent noPadding>
          <Table
            columns={columns}
            data={filteredTransactions}
            onRowClick={(tx) => setSelectedTx(tx)}
            emptyMessage="No transactions match the selected criteria"
          />
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <Modal
          isOpen={Boolean(selectedTx)}
          onClose={() => setSelectedTx(null)}
          title="Transaction Settlement Record"
          description={`Reference ID: ${selectedTx.reference}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="text-center py-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs uppercase tracking-wider text-slate-500">
                Amount
              </span>
              <div
                className={`text-3xl font-extrabold font-mono mt-1 ${
                  selectedTx.type === 'credit'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {selectedTx.type === 'credit' ? '+' : ''}
                {formatCurrency(selectedTx.amount)}
              </div>
              <Badge
                variant={selectedTx.status === 'completed' ? 'success' : 'warning'}
                size="sm"
                className="mt-2"
                dot
              >
                {selectedTx.status.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Beneficiary / Merchant</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedTx.merchant || selectedTx.description}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Category</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedTx.category}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Settlement Account</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedTx.accountName}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Timestamp</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {formatDate(selectedTx.date, 'full')}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Clearing Network Fee</span>
                <span className="font-mono text-emerald-600 font-semibold">
                  {formatCurrency(selectedTx.fee || 0)} (Waived)
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                onClick={() => setSelectedTx(null)}
              >
                Close Record
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default TransactionsPage;
