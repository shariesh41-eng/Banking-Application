import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PageLoader from '../components/common/Loading';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader message="Verifying security credentials..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If specific roles are required and current user does not have access
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to the appropriate home for their role
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === 'employee') {
      return <Navigate to="/employee/dashboard" replace />;
    } else {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
