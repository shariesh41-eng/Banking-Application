import React from 'react';
import { useBanking } from '../../hooks/useBanking';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Briefcase,
  Landmark,
  UserCheck,
  Headphones,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmployeeDashboard() {
  const { user } = useAuth();
  const { loans } = useBanking();

  const pendingLoans = loans.filter((l) => l.status === 'pending' || l.status === 'in_review');

  const queueColumns = [
    {
      header: 'Applicant Entity',
      key: 'applicantName',
      render: (_, item) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            {item.applicantName}
          </p>
          <p className="text-xs text-slate-500 font-mono">{item.applicantEmail}</p>
        </div>
      ),
    },
    {
      header: 'Facility Amount',
      key: 'amount',
      render: (v) => (
        <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
          {formatCurrency(v)}
        </span>
      ),
    },
    {
      header: 'Purpose',
      key: 'purpose',
      render: (v) => <span className="text-xs text-slate-600 dark:text-slate-400">{v}</span>,
    },
    {
      header: 'Credit Score',
      key: 'creditScore',
      align: 'center',
      render: (v) => (
        <span
          className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
            v >= 750
              ? 'bg-emerald-500/10 text-emerald-600'
              : v >= 680
              ? 'bg-amber-500/10 text-amber-600'
              : 'bg-rose-500/10 text-rose-600'
          }`}
        >
          {v}
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
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Relationship Manager Operations
            </h1>
            <Badge variant="teal" size="sm" dot>
              OFFICER DESK
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Welcome, {user?.name || 'David Chen'} • Credit underwriting, approvals, and onboarding queue.
          </p>
        </div>

        <Link to="/employee/loans">
          <Button variant="teal" icon={FileCheck}>
            Review Credit Queue ({pendingLoans.length})
          </Button>
        </Link>
      </div>

      {/* 4 Operations KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Credit Inquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-royal-500/10 text-royal-600 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mb-2">
            {pendingLoans.length} Facilities
          </div>
          <p className="text-xs text-royal-600 font-semibold">
            $825,000.00 total requested volume
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              KYC Verifications
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mb-2">
            5 Awaiting
          </div>
          <p className="text-xs text-teal-600 font-semibold">
            Average turnaround: 3.2 hours
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              High-Net-Worth Support
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mb-2">
            2 Tickets
          </div>
          <p className="text-xs text-emerald-600 font-semibold">
            VIP 10-minute SLA active
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today's Clearances
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mb-2">
            18 Approvals
          </div>
          <p className="text-xs text-indigo-600 font-semibold">
            100% compliance rate
          </p>
        </Card>
      </div>

      {/* Pending Credit Applications Table */}
      <Card>
        <CardHeader
          action={
            <Link
              to="/employee/loans"
              className="text-xs text-royal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1"
            >
              Full Underwriting Workbench <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <CardTitle>Active Commercial Credit Pipeline</CardTitle>
          <CardDescription>Applications awaiting relationship officer adjudication</CardDescription>
        </CardHeader>
        <CardContent noPadding>
          <Table columns={queueColumns} data={loans} />
        </CardContent>
      </Card>
    </div>
  );
}

export default EmployeeDashboard;
