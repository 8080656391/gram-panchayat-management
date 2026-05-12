import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Dashboard.css';
import { FileText, DollarSign, AlertCircle, BookOpen, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface DashboardStats {
  certificates: { applied: number; pending: number; approved: number; rejected: number };
  taxes: { paid: number; pending: number; total: number };
  grievances: { filed: number; pending: number; resolved: number };
  schemes: { available: number };
}

const Dashboard: React.FC = () => {
  const { user, userRole } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch dashboard stats from database
  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/dashboard/stats', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setStats(data.data);
            }
          }
        } catch (err) {
          console.error('Error fetching dashboard stats:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, [user]);

  const features = [
    {
      icon: <FileText size={32} />,
      title: t('certificate.title'),
      description: 'Issue and manage various certificates for citizens',
      link: '/certificates',
      color: '#667eea',
    },
    {
      icon: <DollarSign size={32} />,
      title: t('tax.title'),
      description: 'Track and manage tax collection efficiently',
      link: '/taxes',
      color: '#764ba2',
    },
    {
      icon: <AlertCircle size={32} />,
      title: t('grievance.title'),
      description: 'Register and resolve citizen complaints',
      link: '/grievances',
      color: '#f59e0b',
    },
    {
      icon: <BookOpen size={32} />,
      title: t('scheme.title'),
      description: 'Explore available welfare and development schemes',
      link: '/schemes',
      color: '#10b981',
    },
  ];

  const statCards = [
    { label: 'Total Citizens', value: '5', icon: '👥' },
    { label: 'Active Schemes', value: '4', icon: '📋' },
    { label: 'Revenue Collected', value: '15,500 K', icon: '💰' },
    { label: 'Grievances Resolved', value: '40%', icon: '✓' },
  ];

  return (
    <div className="dashboard">
      {user ? (
        // User Dashboard
        <div className="user-dashboard">
          <div className="welcome-section">
            <div className="welcome-content">
              <h1>{t('dashboard.welcome')} back, {user.name}!</h1>
              <p>Here's an overview of your gram panchayat services</p>
            </div>
            <div className="user-badge">
              <span className="role-badge">{userRole?.toUpperCase()}</span>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Quick Stats */}
            <div className="dashboard-stats">
              <h2>Your Overview</h2>
              {loading ? (
                <div className="loading-container">
                  <Loader size={24} className="spinner" />
                  <p>Loading stats...</p>
                </div>
              ) : (
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon-blue">
                      <FileText size={24} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-value">{stats?.certificates.applied || 0}</span>
                      <span className="stat-label">Certificates Applied</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-purple">
                      <DollarSign size={24} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-value">₹{stats?.taxes.paid?.toLocaleString() || 0}</span>
                      <span className="stat-label">Tax Paid</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-orange">
                      <AlertCircle size={24} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-value">{stats?.grievances.filed || 0}</span>
                      <span className="stat-label">Grievances Filed</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-green">
                      <BookOpen size={24} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-value">{stats?.schemes.available || 0}</span>
                      <span className="stat-label">Schemes Available</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="dashboard-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                {userRole === 'citizen' && (
                  <Link to="/certificates" className="action-btn">
                    <FileText size={24} />
                    <span>{t('certificate.apply')}</span>
                  </Link>
                )}
                {userRole === 'citizen' && (
                  <Link to="/taxes" className="action-btn">
                    <DollarSign size={24} />
                    <span>{t('nav.taxPayment')}</span>
                  </Link>
                )}
                <Link to="/grievances" className="action-btn">
                  <AlertCircle size={24} />
                  <span>{t('grievance.submit')}</span>
                </Link>
                <Link to="/schemes" className="action-btn">
                  <BookOpen size={24} />
                  <span>{t('nav.schemes')}</span>
                </Link>
              </div>
            </div>

            {/* Services Status */}
            <div className="dashboard-services">
              <h2>Service Status</h2>
              <div className="services-list">
                <div className="service-item">
                  <div className="service-info">
                    <FileText size={20} />
                    <span>Certificate Management</span>
                  </div>
                  <div className="service-counts">
                    <span className="count-badge pending">{stats?.certificates.pending || 0} Pending</span>
                    <span className="count-badge approved">{stats?.certificates.approved || 0} Approved</span>
                  </div>
                </div>
                <div className="service-item">
                  <div className="service-info">
                    <DollarSign size={20} />
                    <span>Tax Collection</span>
                  </div>
                  <div className="service-counts">
                    <span className="count-badge pending">₹{stats?.taxes.pending?.toLocaleString() || 0}</span>
                    <span className="count-badge paid">₹{stats?.taxes.paid?.toLocaleString() || 0} Paid</span>
                  </div>
                </div>
                <div className="service-item">
                  <div className="service-info">
                    <AlertCircle size={20} />
                    <span>Grievance System</span>
                  </div>
                  <div className="service-counts">
                    <span className="count-badge pending">{stats?.grievances.pending || 0} Pending</span>
                    <span className="count-badge resolved">{stats?.grievances.resolved || 0} Resolved</span>
                  </div>
                </div>
                <div className="service-item">
                  <div className="service-info">
                    <BookOpen size={20} />
                    <span>Government Schemes</span>
                  </div>
                  <div className="service-counts">
                    <span className="count-badge schemes">{stats?.schemes.available || 0} Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Info Card */}
            <div className="dashboard-profile">
              <h2>Your Profile</h2>
              <div className="profile-card">
                <div className="profile-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-details">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  {user.village && <p className="village-info">📍 {user.village}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Public Dashboard
        <>
          <div className="hero-section">
            <h1>{t('login.title')}</h1>
            <p>A comprehensive digital platform for efficient governance and citizen services</p>
          </div>

          <div className="quick-stats">
            {statCards.map((stat, idx) => (
              <div key={idx} className="stat-box">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-number">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="features-section">
            <h2>Key Features</h2>
            <div className="features-grid">
              {features.map((feature, idx) => (
                <Link to={feature.link} key={idx} className="feature-card">
                  <div className="feature-icon-wrapper" style={{ backgroundColor: `${feature.color}20` }}>
                    <div style={{ color: feature.color }}>{feature.icon}</div>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="feature-link">
                    <span>Explore</span>
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="info-section">
            <div className="info-card">
              <h3>📊 About This System</h3>
              <p>
                This Gram Panchayat Management System is designed to streamline administrative processes and improve service delivery to citizens. It provides tools for managing certificates, tax collection, grievances, and government scheme information in one unified platform.
              </p>
            </div>
            <div className="info-card">
              <h3>🎯 Our Mission</h3>
              <p>
                To empower gram panchayats with modern digital tools that enhance transparency, improve citizen engagement, and ensure efficient delivery of government services at the grassroots level.
              </p>
            </div>
            <div className="info-card">
              <h3>📱 Easy Access</h3>
              <p>
                Access all services from anywhere, anytime. The system is designed to be user-friendly and accessible to both administrators and citizens, with support for mobile devices.
              </p>
            </div>
          </div>

          <div className="cta-section">
            <h2>Get Started Today</h2>
            <p>Choose a module below to begin managing gram panchayat services</p>
            <div className="cta-buttons">
              <Link to="/certificates" className="cta-btn primary">
                {t('certificate.title')}
              </Link>
              <Link to="/taxes" className="cta-btn secondary">
                {t('tax.title')}
              </Link>
              <Link to="/grievances" className="cta-btn secondary">
                {t('grievance.title')}
              </Link>
              <Link to="/schemes" className="cta-btn secondary">
                {t('scheme.title')}
              </Link>
            </div>
          </div>

          <footer className="dashboard-footer">
            <p>&copy; 2024 Gram Panchayat Management System. All rights reserved.</p>
            <div className="footer-links">
              <a href="#about">About</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#contact">Contact Us</a>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default Dashboard;
