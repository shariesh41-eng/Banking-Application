import React, { useState } from 'react';
import { useBanking } from '../../hooks/useBanking';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Landmark,
  Check,
  X,
  Eye,
  FileCheck,
  Building,
  User,
  Percent,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export function LoanApplicationsPage() {
  const { user } = useAuth();
  const { loans, updateLoanStatus } = useBanking();

  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLoan, setSelectedLoan] = useState(null);

  const filteredLoans = loans.filter((l) => {
    return statusFilter === 'all' || l.status === statusFilter;
  });

  const handleApprove = (loanId) => {
    updateLoanStatus(loanId, 'approved', user?.name || 'David Chen');
    if (selectedLoan && selectedLoan.id === loanId) {
      setSelectedLoan(null);
    }
  };

  const handleReject = (loanId) => {
    updateLoanStatus(loanId, 'rejected', user?.name || 'David Chen');
    if (selectedLoan && selectedLoan.id === loanId) {
      setSelectedLoan(null);
    }
  };

  const columns = [
    {
      header: 'Applicant Entity',
      key: 'applicantName',
      render: (_, loan) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            {loan.applicantName}
          </p>
          <p className="text-xs text-slate-500 font-mono">{loan.applicantEmail}</p>
        </div>
      ),
    },
    {
      header: 'Requested Amount',
      key: 'amount',
      render: (v) => (
        <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
          {formatCurrency(v)}
        </span>
      ),
    },
    {
      header: 'Purpose & Facility',
      key: 'purpose',
      render: (v, loan) => (
        <div className="text-xs">
          <p className="font-medium text-slate-800 dark:text-slate-200">{v}</p>
          <p className="text-slate-400">
            {loan.termMonths} Months • {loan.interestRate}% Interest
          </p>
        </div>
      ),
    },
    {
      header: 'Credit Score',
      key: 'creditScore',
      align: 'center',
      render: (v) => (
        <span
          className={`font-mono font-bold text-xs px-2.5 py-1 rounded-full ${
            v >= 750
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : v >= 680
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }`}
        >
          {v} (FICO)
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      align: 'center',
      render: (v) => {
        const variants = {
          approved: 'success',
          in_review: 'warning',
          pending: 'royal',
          rejected: 'error',
        };
        return (
          <Badge variant={variants[v] || 'neutral'} size="sm" dot>
            {v.replace('_', ' ').toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: 'Adjudication',
      key: 'id',
      align: 'right',
      render: (_, loan) => (
        <div className="flex items-center justify-end gap-1.5">
          {loan.status !== 'approved' && (
            <Button
              variant="teal"
              size="xs"
              icon={Check}
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(loan.id);
              }}
            >
              Approve
            </Button>
          )}

          {loan.status !== 'rejected' && (
            <Button
              variant="danger"
              size="xs"
              icon={X}
              onClick={(e) => {
                e.stopPropagation();
                handleReject(loan.id);
              }}
            >
              Reject
            </Button>
          )}

          <Button
            variant="outline"
            size="xs"
            icon={Eye}
            onClick={() => setSelectedLoan(loan)}
          >
            Review
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Commercial & SME Credit Underwriting
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review applicant risk profiles, debt service coverage, and execute facility decisions.
          </p>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-800 p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500/40"
          >
            <option value="all">All Applications ({loans.length})</option>
            <option value="pending">Pending Queue</option>
            <option value="in_review">In Review</option>
            <option value="approved">Approved Facilities</option>
            <option value="rejected">Rejected Facilities</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader
          action={
            <span className="text-xs text-slate-500 font-mono">
              {filteredLoans.length} Applications Displayed
            </span>
          }
        >
          <CardTitle>Credit Underwriting Workbench</CardTitle>
          <CardDescription>Instant decisions update customer credit lines and generate regulatory audit records</CardDescription>
        </CardHeader>
        <CardContent noPadding>
          <Table columns={columns} data={filteredLoans} />
        </CardContent>
      </Card>

      {/* Detailed Loan Review Modal */}
      {selectedLoan && (
        <Modal
          isOpen={Boolean(selectedLoan)}
          onClose={() => setSelectedLoan(null)}
          title={`Credit Review: ${selectedLoan.applicantName}`}
          description={`Facility #${selectedLoan.id} • Submitted ${formatDate(selectedLoan.submittedAt, 'medium')}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Requested Capital
              </span>
              <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-1">
                {formatCurrency(selectedLoan.amount)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {selectedLoan.termMonths} Months @ {selectedLoan.interestRate}% Interest
              </p>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Applicant Entity</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedLoan.applicantName}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Contact Email</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {selectedLoan.applicantEmail}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Intended Purpose</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedLoan.purpose}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Credit Score</span>
                <span className="font-mono font-bold text-emerald-600">
                  {selectedLoan.creditScore} (Grade A)
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Current Status</span>
                <Badge variant={selectedLoan.status === 'approved' ? 'success' : 'warning'} size="sm">
                  {selectedLoan.status.toUpperCase()}
                </Badge>
              </div>
              {selectedLoan.reviewedBy && (
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Adjudicated By</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedLoan.reviewedBy}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                onClick={() => setSelectedLoan(null)}
              >
                Close
              </Button>
              {selectedLoan.status !== 'rejected' && (
                <Button
                  variant="danger"
                  icon={X}
                  onClick={() => handleReject(selectedLoan.id)}
                >
                  Reject Application
                </Button>
              )}
              {selectedLoan.status !== 'approved' && (
                <Button
                  variant="teal"
                  icon={Check}
                  onClick={() => handleApprove(selectedLoan.id)}
                >
                  Approve Facility
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default LoanApplicationsPage;
