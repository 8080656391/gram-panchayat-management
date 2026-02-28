import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, User, LogIn, UserPlus } from 'lucide-react';
import CitizenRegister from '../components/certificates/CitizenRegister';
import { CitizenRegistration } from '../types';
import '../styles/pages/Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (role: 'citizen' | 'staff' | 'admin') => {
    login(role);
    // navigation will occur via effect when isAuthenticated updates
  };

  const handleCitizenRegister = (registration: CitizenRegistration) => {
    // Save registration to localStorage
    const registrations = JSON.parse(localStorage.getItem('citizenRegistrations') || '[]');
    registrations.push(registration);
    localStorage.setItem('citizenRegistrations', JSON.stringify(registrations));
    
    // Automatically login after registration
    login('citizen');
    navigate('/');
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (showRegister) {
    return (
      <CitizenRegister
        onRegister={handleCitizenRegister}
        onCancel={() => setShowRegister(false)}
      />
    );
  }

  const roles = [
    {
      id: 'citizen',
      name: 'Citizen',
      icon: User,
      description: 'Access services like certificates, schemes, tax payment, and grievance filing',
      color: '#4CAF50',
    },
    {
      id: 'staff',
      name: 'Staff',
      icon: Users,
      description: 'Manage applications, process requests, and monitor operations',
      color: '#2196F3',
    },
    {
      id: 'admin',
      name: 'Administrator',
      icon: Shield,
      description: 'Full system access, user management, reports, and configuration',
      color: '#FF9800',
    },
  ];

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Gram Panchayat Management System</h1>
        <p>Select your role to access the system</p>
      </div>

      <div className="login-content">
        <div className="roles-grid">
          {roles.map((role) => {
            const IconComponent = role.icon;
            
            return (
              <div
                key={role.id}
                className="role-card"
                style={{
                  borderColor: '#ddd',
                  backgroundColor: '#fff',
                }}
              >
                <div className="role-icon-container" style={{ color: role.color }}>
                  <IconComponent size={48} />
                </div>
                <h2>{role.name}</h2>
                <p className="role-description">{role.description}</p>
                <button
                  onClick={() => handleLogin(role.id as 'citizen' | 'staff' | 'admin')}
                  className="role-button"
                  style={{ backgroundColor: role.color }}
                >
                  <LogIn size={18} />
                  Login as {role.name}
                </button>
              </div>
            );
          })}
        </div>

        <div className="citizen-register-section">
          <p>New to the system?</p>
          <button className="btn-register-citizen" onClick={() => setShowRegister(true)}>
            <UserPlus size={18} />
            Register as Citizen
          </button>
        </div>
      </div>

      <div className="login-footer">
        <p>🏛️ Serving the village community</p>
      </div>
    </div>
  );
};

export default Login;
