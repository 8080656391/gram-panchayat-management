import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Dashboard from './pages/Dashboard';
import CertificateManagement from './pages/CertificateManagement';
import TaxCollection from './pages/TaxCollection';
import TaxPayment from './pages/TaxPayment';
import GrievanceSystem from './pages/GrievanceSystem';
import GovernmentSchemes from './pages/GovernmentSchemes';
import AdminReports from './pages/admin/AdminReports';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

import './styles/App.css';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {isAuthenticated && <Navigation />}
      <main className={isAuthenticated ? 'main-content' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Dashboard - All authenticated users */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Management Modules - Accessible to Citizen, Staff, and Admin */}
          <Route
            path="/certificates"
            element={
              <ProtectedRoute requiredRole={['citizen', 'staff', 'admin']}>
                <CertificateManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/taxes"
            element={
              <ProtectedRoute requiredRole={['citizen', 'staff', 'admin']}>
                <TaxCollection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/taxes/pay/:id"
            element={
              <ProtectedRoute requiredRole={['citizen', 'staff', 'admin']}>
                <TaxPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grievances"
            element={
              <ProtectedRoute requiredRole={['citizen', 'staff', 'admin']}>
                <GrievanceSystem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schemes"
            element={
              <ProtectedRoute requiredRole={['citizen', 'staff', 'admin']}>
                <GovernmentSchemes />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute requiredRole={['admin']}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute requiredRole={['admin']}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

