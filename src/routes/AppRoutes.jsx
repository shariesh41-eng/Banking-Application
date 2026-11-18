import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from './routesConfig';

// Layouts
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';
import AuthLayout from '../layouts/AuthLayout';

// Guard
import ProtectedRoute from './ProtectedRoute';

// Auth Module Pages (9 Screens)
import WelcomePage from '../pages/auth/WelcomePage';
import OnboardingPage from '../pages/auth/OnboardingPage';
import RegisterPage from '../pages/auth/RegisterPage';
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import OtpVerificationPage from '../pages/auth/OtpVerificationPage';
import ProfileSetupPage from '../pages/auth/ProfileSetupPage';
import LogoutPage from '../pages/auth/LogoutPage';

// Customer Pages (8 Modules)
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import AccountsPage from '../pages/customer/AccountsPage';
import TransfersPage from '../pages/customer/TransfersPage';
import CustomerBudgetsPage from '../pages/customer/CustomerBudgetsPage';
import CardsPage from '../pages/customer/CardsPage';
import TransactionsPage from '../pages/customer/TransactionsPage';
import CustomerComplaintsPage from '../pages/customer/CustomerComplaintsPage';
import CustomerSecurityCenterPage from '../pages/customer/CustomerSecurityCenterPage';

// Admin Pages (6 Modules)
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagementPage from '../pages/admin/UserManagementPage';
import AdminFraudMonitoringPage from '../pages/admin/AdminFraudMonitoringPage';
import SystemAuditPage from '../pages/admin/SystemAuditPage';
import SecuritySettingsPage from '../pages/admin/SecuritySettingsPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';

// Employee Pages (5 Modules)
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import LoanApplicationsPage from '../pages/employee/LoanApplicationsPage';
import AccountApprovalsPage from '../pages/employee/AccountApprovalsPage';
import EmployeeComplaintsPage from '../pages/employee/EmployeeComplaintsPage';
import CustomerSupportPage from '../pages/employee/CustomerSupportPage';

// Shared Pages
import ProfilePage from '../pages/shared/ProfilePage';
import NotFoundPage from '../pages/shared/NotFoundPage';

// Root redirector based on authenticated user's role
function RootRedirect() {
  const { userRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.WELCOME} replace />;
  }

  if (userRole === 'admin') {
    return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
  }
  if (userRole === 'employee') {
    return <Navigate to={ROUTES.EMPLOYEE.DASHBOARD} replace />;
  }
  return <Navigate to={ROUTES.CUSTOMER.DASHBOARD} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Complete Authentication Flow Routes (9 screens) */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="/auth/welcome" replace />} />
        <Route path="welcome" element={<WelcomePage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="otp" element={<OtpVerificationPage />} />
        <Route path="profile-setup" element={<ProfileSetupPage />} />
        <Route path="logout" element={<LogoutPage />} />
      </Route>

      {/* Shortcut Route for /login */}
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />

      {/* Customer Routes (Protected - 8 modules) */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin', 'employee']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="transfers" element={<TransfersPage />} />
        <Route path="budgets" element={<CustomerBudgetsPage />} />
        <Route path="cards" element={<CardsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="complaints" element={<CustomerComplaintsPage />} />
        <Route path="security" element={<CustomerSecurityCenterPage />} />
      </Route>

      {/* Admin Routes (Protected - 6 modules) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="fraud" element={<AdminFraudMonitoringPage />} />
        <Route path="audit" element={<SystemAuditPage />} />
        <Route path="security" element={<SecuritySettingsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
      </Route>

      {/* Employee Routes (Protected - 5 modules) */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={['employee', 'admin']}>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="loans" element={<LoanApplicationsPage />} />
        <Route path="approvals" element={<AccountApprovalsPage />} />
        <Route path="complaints" element={<EmployeeComplaintsPage />} />
        <Route path="support" element={<CustomerSupportPage />} />
      </Route>

      {/* Profile Page (Protected) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProfilePage />} />
      </Route>

      {/* 404 Wildcard */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
