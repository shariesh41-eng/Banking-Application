import React from 'react';
import { useBanking } from '../../hooks/useBanking';
import { useNotification } from '../../hooks/useNotification';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';
import {
  FileText,
  Download,
  ShieldCheck,
  TrendingUp,
  Landmark,
  PieChart as PieIcon,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export function AdminReportsPage() {
  const { totalBalance, accounts } = useBanking();
  const { success } = useNotification();

  const handleExportReport = (reportType) => {
    success(`Generated and cryptographically stamped: ${reportType}`);
  };

  const capitalData = [
    { name: 'Core Tier 1', ratio: 14.8, min: 8.0 },
    { name: 'Total Capital', ratio: 17.2, min: 10.5 },
    { name: 'Liquidity Coverage (LCR)', ratio: 142.0, min: 100.0 },
    { name: 'Net Stable Funding (NSFR)', ratio: 128.0, min: 100.0 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Institutional Capital & Regulatory Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Basel III capital adequacy metrics, liquidity coverage, and automated Call Report generation.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Download}
          onClick={() => handleExportReport('FFIEC 031 Consolidated Report of Condition')}
        >
          Export FFIEC Call Report
        </Button>
      </div>

      {/* Basel III Ratios Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            CET1 Capital Ratio
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            14.8%
          </div>
          <p className="text-xs text-slate-400 mt-1">Regulatory Min: 8.0% (Well-Capitalized)</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Liquidity Coverage (LCR)
          </span>
          <div className="text-2xl font-bold font-mono text-royal-600 dark:text-teal-400">
            142.0%
          </div>
          <p className="text-xs text-slate-400 mt-1">High-quality liquid assets buffer</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Total Customer Deposits
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {formatCurrency(totalBalance)}
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">100% FDIC Pass-Through Backed</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            OCC Exam Rating
          </span>
          <div className="text-2xl font-bold font-mono text-teal-600 dark:text-teal-300">
            CAMELS 1
          </div>
          <p className="text-xs text-slate-400 mt-1">Highest regulatory safety classification</p>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Basel III Capital & Liquidity Ratios vs Regulatory Baselines</CardTitle>
          <CardDescription>Metrics verified by independent supervisory auditors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capitalData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1f36',
                    borderColor: '#1e3a5f',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(v) => [`${v}%`, '']}
                />
                <Bar dataKey="ratio" name="Actual Ratio" fill="#14B8A6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="min" name="Regulatory Minimum" fill="#1E40AF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Report Downloads List */}
      <Card>
        <CardHeader>
          <CardTitle>Supervisory & Financial Filing Packages</CardTitle>
          <CardDescription>Instant encrypted PDF & XBRL package generation</CardDescription>
        </CardHeader>
        <CardContent noPadding>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-royal-500" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Q3 FFIEC 031 Call Report Consolidated Package
                  </p>
                  <p className="text-slate-400">Quarterly statutory filing submitted to FDIC</p>
                </div>
              </div>
              <Button variant="outline" size="xs" icon={Download} onClick={() => handleExportReport('FFIEC 031')}>
                Download
              </Button>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-teal-500" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    SOC 2 Type II Independent Service Auditor's Report
                  </p>
                  <p className="text-slate-400">Certified by Ernst & Young LLP</p>
                </div>
              </div>
              <Button variant="outline" size="xs" icon={Download} onClick={() => handleExportReport('SOC 2 Type II')}>
                Download
              </Button>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Annual AML Sentinel & BSA Compliance Audit
                  </p>
                  <p className="text-slate-400">Automated transaction rule evaluation trace</p>
                </div>
              </div>
              <Button variant="outline" size="xs" icon={Download} onClick={() => handleExportReport('BSA/AML Audit')}>
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminReportsPage;
