import React, { useState } from 'react';
import { BarChart3, Users, FileText, TrendingUp, DollarSign } from 'lucide-react';
import '../../styles/pages/AdminReports.css';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const AdminReports: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');

  const stats: StatCard[] = [
    { title: 'Total Citizens', value: '1,234', icon: <Users size={32} />, color: '#4CAF50' },
    { title: 'Certificates Issued', value: '456', icon: <FileText size={32} />, color: '#2196F3' },
    { title: 'Tax Collected', value: '₹2,45,000', icon: <DollarSign size={32} />, color: '#FF9800' },
    { title: 'Grievances Resolved', value: '89%', icon: <TrendingUp size={32} />, color: '#9C27B0' },
  ];

  const recentActivities = [
    { id: 1, type: 'Certificate', description: 'Residence certificate issued to John Doe', time: '2 hours ago' },
    { id: 2, type: 'Tax', description: 'Payment received from Property ID: 456', time: '5 hours ago' },
    { id: 3, type: 'Grievance', description: 'Road repair grievance resolved', time: '1 day ago' },
    { id: 4, type: 'Scheme', description: 'New agricultural scheme registered', time: '2 days ago' },
  ];

  return (
    <div className="admin-reports">
      <div className="reports-header">
        <h1>
          <BarChart3 size={28} />
          Reports & Analytics
        </h1>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="date-range-select">
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <p className="stat-title">{stat.title}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="reports-section">
        <div className="section-header">
          <h2>Recent Activities</h2>
        </div>
        <div className="activities-list">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-type-badge">{activity.type}</div>
              <div className="activity-content">
                <p>{activity.description}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-box">
          <h3>Service Distribution</h3>
          <div className="chart-placeholder">
            <p>Certificates: 35%</p>
            <p>Taxes: 25%</p>
            <p>Grievances: 30%</p>
            <p>Schemes: 10%</p>
          </div>
        </div>

        <div className="report-box">
          <h3>Monthly Trends</h3>
          <div className="chart-placeholder">
            <p>January: 45 transactions</p>
            <p>February: 52 transactions</p>
            <p>March: 67 transactions</p>
          </div>
        </div>

        <div className="report-box">
          <h3>Top Categories</h3>
          <div className="chart-placeholder">
            <p>1. Road Maintenance</p>
            <p>2. Water Supply</p>
            <p>3. Education</p>
            <p>4. Health</p>
          </div>
        </div>

        <div className="report-box">
          <h3>System Health</h3>
          <div className="chart-placeholder">
            <p>Server Status: ✓ Online</p>
            <p>Database: ✓ Healthy</p>
            <p>Users Active: 45</p>
            <p>Uptime: 99.8%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
