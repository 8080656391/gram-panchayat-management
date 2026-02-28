import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Dashboard.css';
import { FileText, DollarSign, AlertCircle, BookOpen, ArrowRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const features = [
    {
      icon: <FileText size={32} />,
      title: 'Certificate Management',
      description: 'Issue and manage various certificates for citizens',
      link: '/certificates',
      color: '#667eea',
    },
    {
      icon: <DollarSign size={32} />,
      title: 'Tax Collection',
      description: 'Track and manage tax collection efficiently',
      link: '/taxes',
      color: '#764ba2',
    },
    {
      icon: <AlertCircle size={32} />,
      title: 'Grievance System',
      description: 'Register and resolve citizen complaints',
      link: '/grievances',
      color: '#f59e0b',
    },
    {
      icon: <BookOpen size={32} />,
      title: 'Government Schemes',
      description: 'Explore available welfare and development schemes',
      link: '/schemes',
      color: '#10b981',
    },
  ];

  const stats = [
    { label: 'Total Citizens', value: '5,240', icon: '👥' },
    { label: 'Active Schemes', value: '12', icon: '📋' },
    { label: 'Revenue Collected', value: '₹2.5L', icon: '💰' },
    { label: 'Grievances Resolved', value: '87%', icon: '✓' },
  ];

  return (
    <div className="dashboard">
      <div className="hero-section">
        <h1>Welcome to Gram Panchayat Management System</h1>
        <p>A comprehensive digital platform for efficient governance and citizen services</p>
      </div>

      <div className="quick-stats">
        {stats.map((stat, idx) => (
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
            Certificate Management
          </Link>
          <Link to="/taxes" className="cta-btn secondary">
            Tax Collection
          </Link>
          <Link to="/grievances" className="cta-btn secondary">
            Grievance System
          </Link>
          <Link to="/schemes" className="cta-btn secondary">
            Government Schemes
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
    </div>
  );
};

export default Dashboard;
