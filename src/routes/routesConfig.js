/**
 * Centralized Route Paths & Configuration for NOVABANK
 * Complete 20-Module System Topology
 */

export const ROUTES = {
  HOME: '/',

  // Authentication Module (9 screens)
  AUTH: {
    WELCOME: '/auth/welcome',
    ONBOARDING: '/auth/onboarding',
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    OTP: '/auth/otp',
    PROFILE_SETUP: '/auth/profile-setup',
    LOGOUT: '/auth/logout',
  },

  LOGIN: '/login',
  PROFILE: '/profile',

  // Customer Module (8 routes)
  CUSTOMER: {
    DASHBOARD: '/customer/dashboard',
    ACCOUNTS: '/customer/accounts',
    TRANSFERS: '/customer/transfers',
    BUDGETS: '/customer/budgets',
    CARDS: '/customer/cards',
    TRANSACTIONS: '/customer/transactions',
    COMPLAINTS: '/customer/complaints',
    SECURITY: '/customer/security',
  },

  // Admin Module (6 routes)
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    FRAUD: '/admin/fraud',
    AUDIT: '/admin/audit',
    SECURITY: '/admin/security',
    REPORTS: '/admin/reports',
  },

  // Employee Module (5 routes)
  EMPLOYEE: {
    DASHBOARD: '/employee/dashboard',
    LOANS: '/employee/loans',
    APPROVALS: '/employee/approvals',
    COMPLAINTS: '/employee/complaints',
    SUPPORT: '/employee/support',
  },

  // Wildcard
  NOT_FOUND: '*',
};

export default ROUTES;
