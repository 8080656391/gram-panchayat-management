import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: ('citizen' | 'staff' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = ['citizen', 'staff', 'admin'] }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return <div className="page-loading">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole.length > 0 && userRole && !requiredRole.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
