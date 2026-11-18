import React, { useState } from 'react';
import { useNotification } from '../../hooks/useNotification';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import {
  UserCheck,
  Check,
  X,
  FileText,
  ShieldCheck,
  AlertCircle,
  Eye,
} from 'lucide-react';

export function AccountApprovalsPage() {
  const { success, info } = useNotification();

  const [queue, setQueue] = useState([
    {
      id: 'kyc_101',
      applicantName: 'Sebastian Vance',
      email: 's.vance@vancetech.io',
      accountType: 'Private Wealth Checking',
      docsSubmitted: 'US Passport, Utility Bill',
      identityScore: 98,
      riskLevel: 'low',
      status: 'pending',
    },
    {
      id: 'kyc_102',
      applicantName: 'Kestrel Global Holdings',
      email: 'legal@kestrelglobal.com',
      accountType: 'Commercial Treasury',
      docsSubmitted: 'Articles of Incorporation, FinCEN BOI',
      identityScore: 92,
      riskLevel: 'low',
      status: 'pending',
    },
    {
      id: 'kyc_103',
      applicantName: 'Elena Markova',
      email: 'elena.m@markova-design.ch',
      accountType: 'High-Yield Liquid Reserve',
      docsSubmitted: 'Swiss ID, Proof of Funds',
      identityScore: 84,
      riskLevel: 'medium',
      status: 'pending',
    },
  ]);

  const handleApprove = (id, name) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
    success(`KYC verification completed for ${name}. Digital account provisioned.`);
  };

  const handleRequestDocs = (id, name) => {
    info(`Request for supplementary certified documentation sent to ${name}.`);
  };

  const columns = [
    {
      header: 'Applicant Identity',
      key: 'applicantName',
      render: (_, item) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            {item.applicantName}
          </p>
          <p className="text-xs text-slate-500 font-mono">{item.email}</p>
        </div>
      ),
    },
    {
      header: 'Account Class',
      key: 'accountType',
      render: (v) => <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{v}</span>,
    },
    {
      header: 'Identity Score',
      key: 'identityScore',
      align: 'center',
      render: (v) => (
        <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
          {v}% Match
        </span>
      ),
    },
    {
      header: 'Risk Level',
      key: 'riskLevel',
      align: 'center',
      render: (v) => (
        <Badge variant={v === 'low' ? 'success' : 'warning'} size="sm">
          {v.toUpperCase()} RISK
        </Badge>
      ),
    },
    {
      header: 'KYC Status',
      key: 'status',
      align: 'center',
      render: (v) => (
        <Badge variant={v === 'approved' ? 'success' : 'royal'} size="sm" dot>
          {v.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      key: 'id',
      align: 'right',
      render: (_, item) => (
        <div className="flex items-center justify-end gap-1.5">
          {item.status !== 'approved' ? (
            <>
              <Button
                variant="teal"
                size="xs"
                icon={Check}
                onClick={() => handleApprove(item.id, item.applicantName)}
              >
                Approve
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => handleRequestDocs(item.id, item.applicantName)}
              >
                Request Docs
              </Button>
            </>
          ) : (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Enrolled
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Client Onboarding & KYC Clearance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review identity document verification results and approve new client account charters.
        </p>
      </div>

      <Card>
        <CardHeader
          action={
            <Badge variant="teal" size="sm">
              Fedwire CIP Verified
            </Badge>
          }
        >
          <CardTitle>Customer Identification Program (CIP) Queue</CardTitle>
          <CardDescription>Biometric match and government database checks</CardDescription>
        </CardHeader>
        <CardContent noPadding>
          <Table columns={columns} data={queue} />
        </CardContent>
      </Card>
    </div>
  );
}

export default AccountApprovalsPage;
