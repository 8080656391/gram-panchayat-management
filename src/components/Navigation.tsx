import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, FileText, DollarSign, AlertCircle, BookOpen, LogOut, BarChart3, Users, Settings, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Navigation.css';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, userRole, isAuthenticated } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'mr' : 'en');
  };

  const getMenuItems = () => {
    const commonItems = [
      { path: '/', labelKey: 'nav.dashboard', icon: Home, roles: ['citizen', 'staff', 'admin'] },
    ];

    const citizenItems = [
      { path: '/certificates', labelKey: 'nav.certificates', icon: FileText, roles: ['citizen'] },
      { path: '/taxes', labelKey: 'nav.taxPayment', icon: DollarSign, roles: ['citizen'] },
      { path: '/grievances', labelKey: 'nav.grievances', icon: AlertCircle, roles: ['citizen'] },
      { path: '/schemes', labelKey: 'nav.schemes', icon: BookOpen, roles: ['citizen'] },
    ];

    const staffItems = [
      { path: '/certificates', labelKey: 'nav.certificates', icon: FileText, roles: ['staff', 'admin'] },
      { path: '/taxes', labelKey: 'nav.taxManagement', icon: DollarSign, roles: ['staff', 'admin'] },
      { path: '/grievances', labelKey: 'nav.grievances', icon: AlertCircle, roles: ['staff', 'admin'] },
      { path: '/schemes', labelKey: 'nav.schemes', icon: BookOpen, roles: ['staff', 'admin'] },
    ];

    const adminItems = [
      { path: '/admin/reports', labelKey: 'nav.reports', icon: BarChart3, roles: ['admin'] },
      { path: '/admin/users', labelKey: 'nav.users', icon: Users, roles: ['admin'] },
      { path: '/admin/settings', labelKey: 'nav.settings', icon: Settings, roles: ['admin'] },
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
          <span>{t('nav.gramPanchayat')}</span>
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
                  <span>{t(item.labelKey)}</span>
                </Link>
              </li>
            );
          })}
          <li className="nav-item nav-divider" />
          <li className="nav-item">
            <span className="nav-role-badge">{userRole?.toUpperCase()}</span>
          </li>
          <li className="nav-item">
            <button onClick={toggleLanguage} className="nav-link language-btn">
              <Globe size={18} />
              <span>{language === 'en' ? 'EN' : 'MR'}</span>
            </button>
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-link logout-btn">
              <LogOut size={18} />
              <span>{t('nav.logout')}</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
