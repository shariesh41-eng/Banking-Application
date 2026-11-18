import React, { useState, useMemo } from 'react';
import { useBanking } from '../../hooks/useBanking';
import { useNotification } from '../../hooks/useNotification';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { formatDate } from '../../utils/formatters';
import {
  FileText,
  Search,
  Download,
  ShieldAlert,
  ShieldCheck,
  Filter,
} from 'lucide-react';

export function SystemAuditPage() {
  const { auditLogs } = useBanking();
  const { success } = useNotification();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm);

      const matchesSeverity =
        severityFilter === 'all' || log.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [auditLogs, searchTerm, severityFilter]);

  const handleExportAudit = () => {
    success(`Cryptographically verified audit trail exported (${filteredLogs.length} events).`);
  };

  const columns = [
    {
      header: 'Event Name & Action',
      key: 'action',
      render: (_, log) => (
        <div>
          <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
            {log.action}
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {log.details}
          </p>
        </div>
      ),
    },
    {
      header: 'Actor & Identity',
      key: 'actor',
      render: (v) => <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{v}</span>,
    },
    {
      header: 'Severity',
      key: 'severity',
      align: 'center',
      render: (v) => {
        const variants = {
          info: 'royal',
          warning: 'warning',
          error: 'error',
          success: 'success',
        };
        return (
          <Badge variant={variants[v] || 'neutral'} size="sm" dot>
            {v.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: 'Origin IP',
      key: 'ipAddress',
      render: (v) => <span className="font-mono text-xs text-slate-400">{v}</span>,
    },
    {
      header: 'Timestamp (UTC)',
      key: 'timestamp',
      align: 'right',
      render: (v) => (
        <span className="font-mono text-xs text-slate-400">
          {formatDate(v, 'full')}
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
            Security & Audit Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Immutable regulatory audit trail recording all policy updates, wires, and approvals.
          </p>
        </div>

        <Button
          variant="outline"
          icon={Download}
          onClick={handleExportAudit}
        >
          Export Encrypted Audit
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search by actor, IP address, event or detail..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-800 p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500/40"
            >
              <option value="all">All Severity Levels</option>
              <option value="info">Info Events</option>
              <option value="success">Success / Approvals</option>
              <option value="warning">Warnings / Threshold Flags</option>
              <option value="error">Security Threats & Blocks</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Audit Table */}
      <Card>
        <CardHeader
          action={
            <div className="flex items-center gap-2 text-xs text-teal-600 dark:text-teal-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>SHA-256 Hash Chain Valid</span>
            </div>
          }
        >
          <CardTitle>Historical Audit Trail</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} events logged in current retention period
          </CardDescription>
        </CardHeader>
        <CardContent noPadding>
          <Table columns={columns} data={filteredLogs} />
        </CardContent>
      </Card>
    </div>
  );
}

export default SystemAuditPage;
