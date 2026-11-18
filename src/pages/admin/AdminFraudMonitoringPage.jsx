import React, { useState } from 'react';
import { useBanking } from '../../hooks/useBanking';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Table } from '../../components/common/Table';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Lock,
  Globe,
  Eye,
  RefreshCw,
  Search,
  Check,
} from 'lucide-react';

export function AdminFraudMonitoringPage() {
  const { user } = useAuth();
  const { fraudAlerts, updateFraudAlertStatus } = useBanking();

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlerts = fraudAlerts.filter(
    (a) =>
      a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStatus = (alertId, newStatus) => {
    updateFraudAlertStatus(alertId, newStatus, user?.name || 'Elena Rostova (Admin)');
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert(null);
    }
  };

  const columns = [
    {
      header: 'Incident Reference',
      key: 'reference',
      render: (_, a) => (
        <div>
          <span className="font-mono font-bold text-xs text-rose-600 dark:text-rose-400">
            {a.reference}
          </span>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
            {a.customerName}
          </p>
          <p className="text-xs text-slate-400 font-mono">
            {a.location} • IP: {a.ipAddress}
          </p>
        </div>
      ),
    },
    {
      header: 'Threat Pattern',
      key: 'type',
      render: (v) => <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{v}</span>,
    },
    {
      header: 'Velocity Amount',
      key: 'amount',
      render: (v) => (
        <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
          {v > 0 ? formatCurrency(v) : 'Access Threat'}
        </span>
      ),
    },
    {
      header: 'Risk Score',
      key: 'riskScore',
      align: 'center',
      render: (v) => (
        <span
          className={`font-mono font-bold text-xs px-2.5 py-1 rounded-full ${
            v >= 80
              ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
              : v >= 50
              ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
          }`}
        >
          {v}/100 Risk
        </span>
      ),
    },
    {
      header: 'Sentinel Status',
      key: 'status',
      align: 'center',
      render: (v) => {
        const variants = {
          investigating: 'warning',
          blocked: 'error',
          cleared: 'success',
        };
        return (
          <Badge variant={variants[v] || 'neutral'} size="sm" dot>
            {v.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: 'Action',
      key: 'id',
      align: 'right',
      render: (_, a) => (
        <div className="flex items-center justify-end gap-1.5">
          {a.status !== 'cleared' && (
            <Button
              variant="teal"
              size="xs"
              icon={Check}
              onClick={() => handleUpdateStatus(a.id, 'cleared')}
            >
              Clear
            </Button>
          )}

          {a.status !== 'blocked' && (
            <Button
              variant="danger"
              size="xs"
              icon={Lock}
              onClick={() => handleUpdateStatus(a.id, 'blocked')}
            >
              Block
            </Button>
          )}

          <Button
            variant="outline"
            size="xs"
            onClick={() => setSelectedAlert(a)}
          >
            Inspect
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Fraud Sentinel & Transaction Surveillance
          </h1>
          <Badge variant="error" size="sm" dot>LIVE SENTINEL</Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Automated heuristic pattern detection, AML threshold surveillance, and rogue IP containment.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Active Investigations</p>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {fraudAlerts.filter((a) => a.status === 'investigating').length}
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Threats Neutralized</p>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">3,412</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-royal-500/10 text-royal-600 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">WAF Sentinel Defense</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">AS14061 Tor Blacklist Active</p>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader
          action={
            <span className="text-xs text-slate-500">
              {filteredAlerts.length} Active Threat Records
            </span>
          }
        >
          <CardTitle>Suspicious Activity Report (SAR) Queue</CardTitle>
          <CardDescription>All investigative status changes are logged with immutable cryptographic hashes</CardDescription>
        </CardHeader>
        <CardContent noPadding>
          <Table columns={columns} data={filteredAlerts} />
        </CardContent>
      </Card>

      {/* Inspect Modal */}
      {selectedAlert && (
        <Modal
          isOpen={Boolean(selectedAlert)}
          onClose={() => setSelectedAlert(null)}
          title={`Investigate Incident: ${selectedAlert.reference}`}
          description={selectedAlert.type}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Identity:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedAlert.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Origin IP:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{selectedAlert.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Geolocation:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedAlert.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Detected Timestamp:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{formatDate(selectedAlert.detectedAt, 'full')}</span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Heuristic Anomaly Findings:
              </span>
              <p className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                {selectedAlert.details}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setSelectedAlert(null)}>
                Dismiss
              </Button>
              {selectedAlert.status !== 'cleared' && (
                <Button
                  variant="teal"
                  icon={Check}
                  onClick={() => handleUpdateStatus(selectedAlert.id, 'cleared')}
                >
                  Clear as False Positive
                </Button>
              )}
              {selectedAlert.status !== 'blocked' && (
                <Button
                  variant="danger"
                  icon={Lock}
                  onClick={() => handleUpdateStatus(selectedAlert.id, 'blocked')}
                >
                  Enforce Security Block
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AdminFraudMonitoringPage;
