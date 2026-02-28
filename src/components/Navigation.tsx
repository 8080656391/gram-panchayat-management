import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, FileText, DollarSign, AlertCircle, BookOpen, LogOut, BarChart3, Users, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, userRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const commonItems = [
      { path: '/', label: 'Dashboard', icon: Home, roles: ['citizen', 'staff', 'admin'] },
    ];

    const citizenItems = [
      { path: '/certificates', label: 'Certificates', icon: FileText, roles: ['citizen'] },
      { path: '/taxes', label: 'Tax Payment', icon: DollarSign, roles: ['citizen'] },
      { path: '/grievances', label: 'Grievances', icon: AlertCircle, roles: ['citizen'] },
      { path: '/schemes', label: 'Schemes', icon: BookOpen, roles: ['citizen'] },
    ];

    const staffItems = [
      { path: '/certificates', label: 'Certificates', icon: FileText, roles: ['staff', 'admin'] },
      { path: '/taxes', label: 'Tax Management', icon: DollarSign, roles: ['staff', 'admin'] },
      { path: '/grievances', label: 'Grievances', icon: AlertCircle, roles: ['staff', 'admin'] },
      { path: '/schemes', label: 'Schemes', icon: BookOpen, roles: ['staff', 'admin'] },
    ];

    const adminItems = [
      { path: '/admin/reports', label: 'Reports', icon: BarChart3, roles: ['admin'] },
      { path: '/admin/users', label: 'Users', icon: Users, roles: ['admin'] },
      { path: '/admin/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
    ];

    if (!userRole) return [];
    
    let items = [...commonItems];
    
    if (userRole === 'citizen') {
      items = [...items, ...citizenItems];
    } else if (userRole === 'staff' || userRole === 'admin') {
      items = [...items, ...staffItems];
      if (userRole === 'admin') {
        items = [...items, ...adminItems];
      }
    }

    return items.filter(item => item.roles.includes(userRole));
  };

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = getMenuItems();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏛️</span>
          <span>Gram Panchayat</span>
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path} className="nav-item">
                <Link to={item.path} className="nav-link" onClick={() => setIsOpen(false)}>
                  <IconComponent size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li className="nav-item nav-divider" />
          <li className="nav-item">
            <span className="nav-role-badge">{userRole?.toUpperCase()}</span>
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-link logout-btn">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
