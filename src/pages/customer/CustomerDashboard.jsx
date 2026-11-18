import React from 'react';
import { useBanking } from '../../hooks/useBanking';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { formatCurrency, formatDate, maskAccountNumber } from '../../utils/formatters';
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Send,
  Download,
  PlusCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Link } from 'react-router-dom';

export function CustomerDashboard() {
  const { user } = useAuth();
  const {
    accounts,
    transactions,
    cards,
    totalBalance,
    setIsTransferModalOpen,
  } = useBanking();

  // Metrics calculations
  const recentTransactions = transactions.slice(0, 5);
  const primaryAccount = accounts.find((a) => a.isPrimary) || accounts[0];

  const monthlyInflow = transactions
    .filter((tx) => tx.type === 'credit')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlyOutflow = Math.abs(
    transactions
      .filter((tx) => tx.type === 'debit')
      .reduce((sum, tx) => sum + tx.amount, 0)
  );

  const chartData = [
    { name: 'Jun', deposits: 48000, withdrawals: 31000 },
    { name: 'Jul', deposits: 54000, withdrawals: 36000 },
    { name: 'Aug', deposits: 61000, withdrawals: 41000 },
    { name: 'Sep', deposits: 59000, withdrawals: 38000 },
    { name: 'Oct', deposits: 72000, withdrawals: 45000 },
    { name: 'Nov', deposits: 84000, withdrawals: 49000 },
  ];

  const categoryData = [
    { name: 'Investments', value: 38, color: '#2563EB' },
    { name: 'Cloud & Tech', value: 24, color: '#14B8A6' },
    { name: 'Mobility', value: 18, color: '#6366F1' },
    { name: 'Operations', value: 20, color: '#F59E0B' },
  ];

  const columns = [
    {
      header: 'Transaction',
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
              {tx.reference} • {formatDate(tx.date, 'short')}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (val) => (
        <Badge variant="neutral" size="sm">
          {val}
        </Badge>
      ),
    },
    {
      header: 'Account',
      key: 'accountName',
      render: (val) => <span className="text-xs text-slate-500">{val}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      align: 'center',
      render: (val) => (
        <Badge
          variant={val === 'completed' ? 'success' : 'warning'}
          size="sm"
          dot
        >
          {val.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Amount',
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
      {/* Welcome & Fast Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Alexandra'}
            </h1>
            <Badge variant="royal" size="sm" pulse dot>
              {user?.membershipTier || 'Platinum Elite'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time liquidity and enterprise portfolio overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="teal"
            icon={Send}
            onClick={() => setIsTransferModalOpen(true)}
          >
            Transfer Funds
          </Button>
          <Link to="/customer/accounts">
            <Button variant="outline" icon={PlusCircle}>
              Manage Accounts
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Liquidity */}
        <Card variant="gradient" className="relative p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-teal-200 uppercase tracking-wider">
              Total Liquidity
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-teal-200">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight mb-2">
            {formatCurrency(totalBalance)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-teal-200">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.4% vs last calendar month</span>
          </div>
        </Card>

        {/* Primary Checking */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Primary Checking
            </span>
            <div className="w-8 h-8 rounded-lg bg-royal-500/10 text-royal-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mb-2">
            {formatCurrency(primaryAccount?.balance || 0)}
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>{maskAccountNumber(primaryAccount?.accountNumber)}</span>
            <span className="text-emerald-500 font-semibold">1.25% APY</span>
          </div>
        </Card>

        {/* Monthly Inflow */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monthly Inflow
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mb-2">
            {formatCurrency(monthlyInflow)}
          </div>
          <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cleared via Fedwire & ACH</span>
          </div>
        </Card>

        {/* Monthly Outflow */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monthly Outflow
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mb-2">
            {formatCurrency(monthlyOutflow)}
          </div>
          <div className="text-xs text-slate-500">
            <span>Corporate cards & wires</span>
          </div>
        </Card>
      </div>

      {/* Charts Section: Cashflow AreaChart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cashflow Growth Trend (2 columns) */}
        <Card className="lg:col-span-2">
          <CardHeader
            action={
              <Badge variant="teal" size="sm">
                Live 6-Month Velocity
              </Badge>
            }
          >
            <CardTitle>Cash Flow Velocity & Reserve Trend</CardTitle>
            <CardDescription>
              Inflow deposits vs outbound expenditures (USD in thousands)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
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
                    tickFormatter={(val) => `$${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d1f36',
                      borderColor: '#1e3a5f',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [formatCurrency(value), '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="deposits"
                    name="Inflow"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorDeposits)"
                  />
                  <Area
                    type="monotone"
                    dataKey="withdrawals"
                    name="Outflow"
                    stroke="#14B8A6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorWithdrawals)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Spending Allocation (1 column) */}
        <Card>
          <CardHeader>
            <CardTitle>Spending Allocation</CardTitle>
            <CardDescription>Major expenditure classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d1f36',
                      borderColor: '#1e3a5f',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [`${value}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 dark:text-slate-400 truncate">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Cards Carousel & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Cards Widget (1 column) */}
        <Card className="flex flex-col justify-between">
          <CardHeader
            action={
              <Link
                to="/customer/cards"
                className="text-xs text-royal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-0.5"
              >
                All Cards <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <CardTitle>Active Corporate Cards</CardTitle>
            <CardDescription>Instant freeze & limit controls</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {cards.slice(0, 2).map((card) => (
              <div
                key={card.id}
                className={`p-4 rounded-2xl bg-gradient-to-tr ${card.gradient} text-white shadow-fintech border border-white/10 relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold tracking-wider text-slate-300">
                    {card.cardType}
                  </span>
                  {card.isFrozen ? (
                    <Badge variant="error" size="sm">
                      FROZEN
                    </Badge>
                  ) : (
                    <Badge variant="teal" size="sm">
                      ACTIVE
                    </Badge>
                  )}
                </div>

                <div className="font-mono text-base tracking-widest mb-3">
                  •••• •••• •••• {card.cardNumber.slice(-4)}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{card.cardholderName}</span>
                  <span className="font-mono">{card.expiry}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions Table (2 columns) */}
        <Card className="lg:col-span-2">
          <CardHeader
            action={
              <Link
                to="/customer/transactions"
                className="text-xs text-royal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-0.5"
              >
                Full History <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <CardTitle>Recent Clearing Activity</CardTitle>
            <CardDescription>Settled transactions in last 72 hours</CardDescription>
          </CardHeader>
          <CardContent noPadding>
            <Table
              columns={columns}
              data={recentTransactions}
              className="border-0 rounded-none"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CustomerDashboard;
