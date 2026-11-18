/**
 * Centralized Navigation Configuration for Customer, Admin, and Employee Roles
 * Integrates all 20 NOVABANK modules.
 */

export const CUSTOMER_NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: '/customer/dashboard',
    icon: 'LayoutDashboard',
    badge: null,
  },
  {
    name: 'Accounts & Treasury',
    path: '/customer/accounts',
    icon: 'Wallet',
    badge: '4 Active',
  },
  {
    name: 'Transfers & Pay',
    path: '/customer/transfers',
    icon: 'ArrowLeftRight',
    badge: null,
  },
  {
    name: 'Budgets & Expenses',
    path: '/customer/budgets',
    icon: 'PieChart',
    badge: null,
  },
  {
    name: 'Corporate Cards',
    path: '/customer/cards',
    icon: 'CreditCard',
    badge: null,
  },
  {
    name: 'Ledger & Activity',
    path: '/customer/transactions',
    icon: 'Receipt',
    badge: null,
  },
  {
    name: 'Inquiries & Disputes',
    path: '/customer/complaints',
    icon: 'MessageSquare',
    badge: null,
  },
  {
    name: 'Security Center',
    path: '/customer/security',
    icon: 'ShieldCheck',
    badge: 'Protected',
  },
];

export const ADMIN_NAV_ITEMS = [
  {
    name: 'System Overview',
    path: '/admin/dashboard',
    icon: 'ShieldCheck',
    badge: 'Live',
  },
  {
    name: 'User Management',
    path: '/admin/users',
    icon: 'Users',
    badge: '14.2k',
  },
  {
    name: 'Fraud & Sentinel',
    path: '/admin/fraud',
    icon: 'ShieldAlert',
    badge: '3 Active',
  },
  {
    name: 'Audit Trail',
    path: '/admin/audit',
    icon: 'FileText',
    badge: 'SOC 2',
  },
  {
    name: 'Security Policies',
    path: '/admin/security',
    icon: 'Lock',
    badge: null,
  },
  {
    name: 'Regulatory Reports',
    path: '/admin/reports',
    icon: 'FileBarChart',
    badge: null,
  },
];

export const EMPLOYEE_NAV_ITEMS = [
  {
    name: 'Desk Overview',
    path: '/employee/dashboard',
    icon: 'Briefcase',
    badge: null,
  },
  {
    name: 'Credit Queue',
    path: '/employee/loans',
    icon: 'Landmark',
    badge: '3 Pending',
  },
  {
    name: 'Account Approvals',
    path: '/employee/approvals',
    icon: 'UserCheck',
    badge: '5 Awaiting',
  },
  {
    name: 'Client Disputes',
    path: '/employee/complaints',
    icon: 'MessageSquare',
    badge: 'Active Queue',
  },
  {
    name: 'Priority Support',
    path: '/employee/support',
    icon: 'Headphones',
    badge: null,
  },
];
