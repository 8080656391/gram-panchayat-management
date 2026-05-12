import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, Users, FileText, TrendingUp, DollarSign, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/pages/AdminReports.css';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  time: string;
  timestamp: number;
}

interface DashboardStats {
  certificates: { applied: number; pending: number; approved: number; rejected: number };
  taxes: { paid: number; pending: number; total: number; totalAmount?: number };
  grievances: { filed: number; pending: number; resolved: number };
  users: { citizens: number; staff: number; admins: number };
  schemes: { available: number };
}

const AdminReports: React.FC = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('month');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshMessage, setRefreshMessage] = useState<string>('');

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'staff')) {
      fetchData();

      // Set up auto-refresh every 60 seconds for reports (less frequent than tax collection)
      const interval = setInterval(fetchData, 60000);

      return () => clearInterval(interval);
    } else {
      setError('Access denied. Admin or staff privileges required.');
      setLoading(false);
    }
  }, [user]);

  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError('');

      // Check if user is authenticated and has admin/staff role
      if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
        throw new Error('Access denied. Admin or staff privileges required.');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated. Please log in again.');
      }

      // First check if backend is accessible
      try {
        const healthCheck = await fetch('http://localhost:5000/api/dashboard/stats', {
          method: 'HEAD',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!healthCheck.ok && healthCheck.status !== 401) {
          throw new Error('Backend server is not accessible. Please ensure the server is running.');
        }
      } catch (networkError) {
        throw new Error('Cannot connect to backend server. Please check if the server is running on port 5000.');
      }

      // Fetch dashboard stats
      const statsResponse = await fetch('http://localhost:5000/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!statsResponse.ok) {
        const errorData = await statsResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch stats (${statsResponse.status})`);
      }

      const statsData = await statsResponse.json();
      if (!statsData.success) {
        throw new Error(statsData.message || 'Failed to load stats data');
      }

      setStats(statsData.data);
      setLastUpdated(new Date());

      // Show success message for manual refreshes
      if (showLoading) {
        setRefreshMessage('Data refreshed successfully!');
        setTimeout(() => setRefreshMessage(''), 3000);
      }

      // Try to fetch recent activities, but don't fail if they don't work
      try {
        const activitiesData: Activity[] = [];

        // Fetch recent certificates (limit to 5)
        const certificatesResponse = await fetch('http://localhost:5000/api/certificates?limit=5&sort=-createdAt', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (certificatesResponse.ok) {
          const certs = await certificatesResponse.json();
          if (certs.success && certs.data?.certificates) {
            certs.data.certificates
              .filter((cert: any) => cert && cert._id)
              .forEach((cert: any) => {
                activitiesData.push({
                  id: `cert_${cert._id}`,
                  type: 'Certificate',
                  description: `${cert.certificateType?.charAt(0).toUpperCase() + cert.certificateType?.slice(1)} certificate ${cert.status || 'pending'}`,
                  time: cert.createdAt ? new Date(cert.createdAt).toLocaleDateString() : 'Recent',
                  timestamp: cert.createdAt ? new Date(cert.createdAt).getTime() : Date.now()
                });
              });
          }
        }

        // Fetch recent grievances (limit to 5)
        const grievancesResponse = await fetch('http://localhost:5000/api/grievances?limit=5&sort=-filedDate', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (grievancesResponse.ok) {
          const grievances = await grievancesResponse.json();
          if (grievances.success && grievances.data?.grievances) {
            grievances.data.grievances
              .filter((grievance: any) => grievance && grievance._id)
              .forEach((grievance: any) => {
                activitiesData.push({
                  id: `grievance_${grievance._id}`,
                  type: 'Grievance',
                  description: `${grievance.category || 'General'} - ${grievance.status || 'pending'}`,
                  time: grievance.filedDate ? new Date(grievance.filedDate).toLocaleDateString() : 'Recent',
                  timestamp: grievance.filedDate ? new Date(grievance.filedDate).getTime() : Date.now()
                });
              });
          }
        }

        // Fetch all tax payments for admin/staff (no limit)
        const taxesResponse = await fetch('http://localhost:5000/api/taxes?limit=all&sort=-paymentDate', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (taxesResponse.ok) {
          const taxes = await taxesResponse.json();
          if (taxes.success && taxes.data?.taxRecords) {
            taxes.data.taxRecords
              .filter((tax: any) => tax && tax._id && tax.paymentDate) // Only show valid records with payments
              .forEach((tax: any) => {
                activitiesData.push({
                  id: `tax_${tax._id}`,
                  type: 'Tax Payment',
                  description: `₹${tax.amountPaid} paid by ${tax.taxpayerName}`,
                  time: tax.paymentDate ? new Date(tax.paymentDate).toLocaleDateString() : 'Recent',
                  timestamp: tax.paymentDate ? new Date(tax.paymentDate).getTime() : Date.now()
                });
              });
          }
        }

        // Sort by timestamp and get latest 10
        const sorted = activitiesData.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
        setRecentActivities(sorted);

      } catch (activityError) {
        console.warn('Could not fetch recent activities:', activityError);
        // Don't set error for activities, just leave empty
        setRecentActivities([]);
      }

    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load reports data');

      // Set default empty data so UI doesn't break
      setStats({
        certificates: { applied: 0, pending: 0, approved: 0, rejected: 0 },
        taxes: { paid: 0, pending: 0, total: 0, totalAmount: 0 },
        grievances: { filed: 0, pending: 0, resolved: 0 },
        users: { citizens: 0, staff: 0, admins: 0 },
        schemes: { available: 0 }
      });
      setRecentActivities([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [user]);

  const getStatCards = (): StatCard[] => {
    if (!stats) return [];
    return [
      { title: 'Total Citizens', value: stats.users.citizens || 0, icon: <Users size={32} />, color: '#4CAF50' },
      { title: 'Administrators', value: stats.users.admins || 0, icon: <Shield size={32} />, color: '#FF9800' },
      { title: 'Certificates Issued', value: stats.certificates.approved || 0, icon: <FileText size={32} />, color: '#2196F3' },
      { title: 'Tax Collected', value: `₹${(stats.taxes.paid || 0).toLocaleString()}`, icon: <DollarSign size={32} />, color: '#FF9800' },
      { title: 'Grievances Resolved', value: `${stats.grievances.resolved || 0}`, icon: <TrendingUp size={32} />, color: '#9C27B0' },
    ];
  };

  return (
    <div className="admin-reports">
      {error && <div className="error-message">{error}</div>}
      {refreshMessage && (
        <div style={{
          backgroundColor: '#e8f5e8',
          color: '#2e7d32',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #c8e6c9'
        }}>
          {refreshMessage}
        </div>
      )}
      
      <div className="reports-header">
        <div>
          <h1>
            <BarChart3 size={28} />
            Reports & Analytics
          </h1>
          {lastUpdated && (
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: loading ? '#ff9800' : '#4caf50',
                display: 'inline-block'
              }}></span>
              Last updated: {lastUpdated.toLocaleString()}
              {loading && <span style={{ fontStyle: 'italic' }}>(refreshing...)</span>}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="date-range-select">
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={() => fetchData(true)}
            className="refresh-btn"
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: loading ? 0.6 : 1
            }}
          >
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px' }}>Loading reports...</div>
      ) : (
        <>
          <div className="stats-grid">
            {getStatCards().map((stat, index) => (
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
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-type-badge">{activity.type}</div>
                    <div className="activity-content">
                      <p>{activity.description}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No recent activities</p>
              )}
            </div>
          </div>

          <div className="reports-grid">
            <div className="report-box">
              <h3>Certificate Statistics</h3>
              <div className="chart-placeholder">
                <p>Applied: {stats?.certificates.applied || 0}</p>
                <p>Pending: {stats?.certificates.pending || 0}</p>
                <p>Under Review: {stats?.certificates.underReview || 0}</p>
                <p>Approved: {stats?.certificates.approved || 0}</p>
                <p>Rejected: {stats?.certificates.rejected || 0}</p>
              </div>
            </div>

            <div className="report-box">
              <h3>Tax Collection</h3>
              <div className="chart-placeholder">
                <p>Total Records: {stats?.taxes.total || 0}</p>
                <p>Total Tax Amount: ₹{(stats?.taxes.totalAmount || 0).toLocaleString()}</p>
                <p>Collected: ₹{(stats?.taxes.paid || 0).toLocaleString()}</p>
                <p>Pending: {stats?.taxes.pending || 0}</p>
                <p>Collection Rate: {stats?.taxes.total > 0 ? Math.round(((stats?.taxes.total - stats?.taxes.pending) / stats?.taxes.total) * 100) : 0}%</p>
              </div>
            </div>

            <div className="report-box">
              <h3>Scheme Availability</h3>
              <div className="chart-placeholder">
                <p>Active Schemes: {stats?.schemes.available || 0}</p>
                <p>Available for Citizens</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReports;
