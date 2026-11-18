import React from 'react';
import { useBanking } from '../../hooks/useBanking';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { formatDate } from '../../utils/formatters';
import {
  ShieldCheck,
  Server,
  Zap,
  Users,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const { auditLogs, resetData } = useBanking();

  const telemetryData = [
    { time: '10:00', requests: 12400, latency: 17 },
    { time: '10:30', requests: 14200, latency: 18 },
    { time: '11:00', requests: 18900, latency: 21 },
    { time: '11:30', requests: 16400, latency: 19 },
    { time: '12:00', requests: 21000, latency: 22 },
    { time: '12:30', requests: 19800, latency: 18 },
    { time: '13:00', requests: 24500, latency: 19 },
  ];

  const recentLogs = auditLogs.slice(0, 5);

  const logColumns = [
    {
      header: 'Event / Action',
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
      header: 'Actor',
      key: 'actor',
      render: (v) => <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{v}</span>,
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
      header: 'IP Address',
      key: 'ipAddress',
      render: (v) => <span className="font-mono text-xs text-slate-400">{v}</span>,
    },
    {
      header: 'Timestamp',
      key: 'timestamp',
      align: 'right',
      render: (v) => (
        <span className="font-mono text-xs text-slate-400">
          {formatDate(v, 'time')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Enterprise Platform Architecture
            </h1>
            <Badge variant="error" size="sm" pulse dot>
              ROOT ADMIN
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time system health, telemetry diagnostics, and immutable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={RotateCcw}
            onClick={resetData}
            title="Reset simulated data to factory settings"
          >
            Reset Demo Data
          </Button>
          <Link to="/admin/security">
            <Button variant="primary" icon={Lock}>
              Security Policies
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Health KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Core API SLA
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mb-2">
            99.998%
          </div>
          <p className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
            Zero downtime in last 90 days
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Sessions
            </span>
            <div className="w-8 h-8 rounded-lg bg-royal-500/10 text-royal-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mb-2">
            14,290
          </div>
          <p className="text-xs text-slate-500">
            Across iOS, Android, and Web
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Mean Core Latency
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mb-2">
            18.4 ms
          </div>
          <p className="text-xs text-teal-600 font-semibold">
            Postgres primary replication lag &lt; 20ms
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Blocked Threats (24h)
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mb-2">
            3,412
          </div>
          <p className="text-xs text-rose-500 font-semibold">
            WAF rate-limited bot sweeps
          </p>
        </Card>
      </div>

      {/* Telemetry Chart */}
      <Card>
        <CardHeader
          action={
            <Badge variant="royal" size="sm">
              Live Core Gateway Feed
            </Badge>
          }
        >
          <CardTitle>Core Banking Gateway Ingress & Latency</CardTitle>
          <CardDescription>
            Real-time transaction authorization throughput (req/min)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={telemetryData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <XAxis
                  dataKey="time"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1f36',
                    borderColor: '#1e3a5f',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="requests"
                  name="Ingress Req/min"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2563EB' }}
                />
                <Line
                  type="monotone"
                  dataKey="latency"
                  name="Latency (ms)"
                  stroke="#14B8A6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#14B8A6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Audit Feed */}
      <Card>
        <CardHeader
          action={
            <Link
              to="/admin/audit"
              className="text-xs text-royal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              View Full Audit Ledger →
            </Link>
          }
        >
          <CardTitle>Security & Operational Audit Feed</CardTitle>
          <CardDescription>SOC 2 compliant immutable access log</CardDescription>
        </CardHeader>
        <CardContent noPadding>
          <Table columns={logColumns} data={recentLogs} />
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
