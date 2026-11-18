import React, { useState } from 'react';
import { useBanking } from '../../hooks/useBanking';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { formatCurrency } from '../../utils/formatters';
import {
  PieChart as PieIcon,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Sliders,
  DollarSign,
  CheckCircle,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export function CustomerBudgetsPage() {
  const { budgets, updateBudgetLimit } = useBanking();

  const [selectedBudget, setSelectedBudget] = useState(null);
  const [newLimit, setNewLimit] = useState('');

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = ((totalSpent / totalAllocated) * 100).toFixed(1);

  const handleOpenEdit = (budget) => {
    setSelectedBudget(budget);
    setNewLimit(budget.allocated.toString());
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    if (selectedBudget) {
      updateBudgetLimit(selectedBudget.id, Number(newLimit));
      setSelectedBudget(null);
    }
  };

  const chartData = budgets.map((b) => ({
    name: b.category,
    Allocated: b.allocated,
    Spent: b.spent,
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Budgets & Expense Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time calculations connecting operational outflows to category budgets.
          </p>
        </div>
      </div>

      {/* Aggregate Overview Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 via-royal-900 to-navy-950 text-white shadow-fintech-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-teal-300 font-bold">
            Total Monthly Outflow Budget
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono mt-1 text-white">
            {formatCurrency(totalSpent)} <span className="text-lg text-slate-300">/ {formatCurrency(totalAllocated)}</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
            <span>{overallPercentage}% utilized of monthly allocation</span>
          </div>
        </div>

        <div className="w-full md:w-64 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex justify-between text-xs mb-1.5">
            <span>Budget Progress</span>
            <span className="font-bold">{overallPercentage}%</span>
          </div>
          <div className="w-full bg-black/30 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                Number(overallPercentage) > 90 ? 'bg-rose-500' : 'bg-teal-400'
              }`}
              style={{ width: `${Math.min(Number(overallPercentage), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chart: Allocated vs Spent */}
      <Card>
        <CardHeader>
          <CardTitle>Category Allocation vs Real-Time Debits</CardTitle>
          <CardDescription>Directly synchronized with cleared transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1f36',
                    borderColor: '#1e3a5f',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val) => [formatCurrency(val), '']}
                />
                <Bar dataKey="Allocated" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Spent" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Individual Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((bgt) => {
          const ratio = bgt.spent / bgt.allocated;
          const isWarning = ratio >= bgt.warningThreshold;

          return (
            <Card key={bgt.id} className="flex flex-col justify-between">
              <CardHeader
                action={
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Sliders}
                    onClick={() => handleOpenEdit(bgt)}
                  >
                    Adjust
                  </Button>
                }
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: bgt.color }}
                  />
                  <CardTitle className="text-base">{bgt.category}</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                      {formatCurrency(bgt.spent)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      of {formatCurrency(bgt.allocated)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isWarning ? 'bg-amber-500' : 'bg-royal-600 dark:bg-teal-500'
                      }`}
                      style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Utilization</span>
                  <span
                    className={`font-mono font-bold ${
                      isWarning ? 'text-amber-500' : 'text-emerald-500'
                    }`}
                  >
                    {(ratio * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Budget Modal */}
      {selectedBudget && (
        <Modal
          isOpen={Boolean(selectedBudget)}
          onClose={() => setSelectedBudget(null)}
          title={`Adjust Monthly Allocation • ${selectedBudget.category}`}
          description="Updates real-time expense thresholds for corporate debits and wires."
          size="sm"
        >
          <form onSubmit={handleSaveBudget} className="space-y-4">
            <Input
              label="Monthly Limit (USD)"
              type="number"
              step="500"
              required
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              helperText={`Current allocated amount: ${formatCurrency(selectedBudget.allocated)}`}
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setSelectedBudget(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Update Budget
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default CustomerBudgetsPage;
