import React, { useState, useEffect } from 'react';
import { Grievance } from '../types';
import GrievanceList from '../components/grievances/GrievanceList';
import GrievanceForm from '../components/grievances/GrievanceForm';
import '../styles/pages/GrievanceSystem.css';
import { Plus, AlertTriangle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const GrievanceSystem: React.FC = () => {
  const { userRole, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  // treat null or undefined role as citizen by default
  const isStaffOrAdmin = userRole === 'staff' || userRole === 'admin';
  const canFile = !!isAuthenticated; // allow any authenticated user (including citizens) to file
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch grievances from MongoDB
  useEffect(() => {
    const fetchGrievances = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      // Citizens use /my-grievances, Staff/Admin use /grievances
      const endpoint = isStaffOrAdmin ? '/api/grievances' : '/api/grievances/my-grievances';
      
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.grievances) {
            const formattedGrievances = data.data.grievances.map((g: any) => ({
              id: g._id,
              complainantName: g.complainantName,
              email: g.email,
              phone: g.phone,
              category: g.category,
              description: g.description,
              location: g.location,
              filedDate: g.filedDate ? new Date(g.filedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              status: g.status,
              priority: g.priority,
              resolution: g.resolution,
              resolutionDate: g.resolutionDate ? new Date(g.resolutionDate).toISOString().split('T')[0] : undefined,
            }));
            setGrievances(formattedGrievances);
          }
        } else {
          setError('Failed to fetch grievances');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error('Error fetching grievances:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, [isAuthenticated]);

  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'registered' | 'under-review' | 'in-progress' | 'resolved'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const handleAddGrievance = async (formData: FormData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/grievances', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.grievance) {
          const savedGrievance = {
            id: data.data.grievance._id,
            complainantName: data.data.grievance.complainantName,
            email: data.data.grievance.email,
            phone: data.data.grievance.phone,
            category: data.data.grievance.category,
            description: data.data.grievance.description,
            location: data.data.grievance.location,
            filedDate: new Date(data.data.grievance.filedDate).toISOString().split('T')[0],
            status: data.data.grievance.status,
            priority: data.data.grievance.priority,
            attachments: data.data.grievance.attachments || [],
          };
          setGrievances([...grievances, savedGrievance]);
        }
      } else {
        setError('Failed to submit grievance. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting grievance:', err);
      setError('Failed to submit grievance. Please try again.');
    }
    setShowForm(false);
  };

  const handleUpdateGrievance = async (id: string, updates: Partial<Grievance>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/grievances/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setGrievances(
          grievances.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          )
        );
      } else {
        setError(data.message || 'Failed to update grievance. Please try again.');
      }
    } catch (err) {
      console.error('Error updating grievance:', err);
      setError('Failed to update grievance. Please try again.');
    }
  };

  const filteredGrievances = grievances.filter((g) => {
    const statusMatch = filterStatus === 'all' || g.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || g.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const highPriorityCount = grievances.filter((g) => g.priority === 'high' && g.status !== 'resolved').length;

  // Show loading state
  if (loading) {
    return (
      <div className="grievance-system">
        <div className="loading-container">
          <Loader size={40} className="spinner" />
          <p>Loading grievances...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="grievance-system">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="grievance-system">
      <div className="page-header">
        <div>
          <h1>{t('grievance.title')}</h1>
          <p>Register, track, and resolve citizen complaints</p>
        </div>
        {canFile && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={20} />
            <span>{showForm ? t('common.cancel') : t('grievance.submit')}</span>
          </button>
        )}
      </div>

      {highPriorityCount > 0 && (
        <div className="alert-banner high-priority">
          <AlertTriangle size={20} />
          <span>You have {highPriorityCount} high priority grievance(s) pending attention</span>
        </div>
      )}

      <div className="statistics">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Total Grievances</h3>
            <p className="stat-value">{grievances.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-value">
              {grievances.filter((g) => g.status === 'registered' || g.status === 'under-review').length}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-value">
              {grievances.filter((g) => g.status === 'in-progress').length}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>Resolved</h3>
            <p className="stat-value">
              {grievances.filter((g) => g.status === 'resolved').length}
            </p>
          </div>
        </div>
      </div>

      {canFile && showForm && (
        <div className="form-section">
          <GrievanceForm onSubmit={handleAddGrievance} />
        </div>
      )}

      <div className="filter-section">
        <div className="filter-group">
          <label>Status:</label>
          <div className="filter-buttons">
            <button className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
              All
            </button>
            <button className={`filter-btn ${filterStatus === 'registered' ? 'active' : ''}`} onClick={() => setFilterStatus('registered')}>
              Registered
            </button>
            <button className={`filter-btn ${filterStatus === 'under-review' ? 'active' : ''}`} onClick={() => setFilterStatus('under-review')}>
              Under Review
            </button>
            <button className={`filter-btn ${filterStatus === 'in-progress' ? 'active' : ''}`} onClick={() => setFilterStatus('in-progress')}>
              In Progress
            </button>
            <button className={`filter-btn ${filterStatus === 'resolved' ? 'active' : ''}`} onClick={() => setFilterStatus('resolved')}>
              Resolved
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label>Priority:</label>
          <div className="filter-buttons">
            <button className={`filter-btn ${filterPriority === 'all' ? 'active' : ''}`} onClick={() => setFilterPriority('all')}>
              All
            </button>
            <button className={`filter-btn ${filterPriority === 'low' ? 'active' : ''}`} onClick={() => setFilterPriority('low')}>
              Low
            </button>
            <button className={`filter-btn ${filterPriority === 'medium' ? 'active' : ''}`} onClick={() => setFilterPriority('medium')}>
              Medium
            </button>
            <button className={`filter-btn ${filterPriority === 'high' ? 'active' : ''}`} onClick={() => setFilterPriority('high')}>
              High
            </button>
          </div>
        </div>
      </div>

      <GrievanceList
        grievances={filteredGrievances}
        onUpdateGrievance={handleUpdateGrievance}
        userRole={isStaffOrAdmin ? (userRole as 'staff' | 'admin') : 'citizen'}
      />
    </div>
  );
};

export default GrievanceSystem;
