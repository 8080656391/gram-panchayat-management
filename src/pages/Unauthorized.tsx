import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import '../styles/pages/Unauthorized.css';

const Unauthorized: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <ShieldAlert size={64} className="unauthorized-icon" />
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p className="unauthorized-message">Please contact your administrator if you believe this is an error.</p>
        <div className="unauthorized-actions">
          <Link to="/" className="btn btn-primary">
            Back to Dashboard
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
