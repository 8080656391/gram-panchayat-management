import React, { useState } from 'react';
import { Grievance } from '../types';
import GrievanceList from '../components/grievances/GrievanceList';
import GrievanceForm from '../components/grievances/GrievanceForm';
import '../styles/pages/GrievanceSystem.css';
import { Plus, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GrievanceSystem: React.FC = () => {
  const { userRole, isAuthenticated } = useAuth();
  // treat null or undefined role as citizen by default
  const isStaffOrAdmin = userRole === 'staff' || userRole === 'admin';
  const canFile = !!isAuthenticated; // allow any authenticated user (including citizens) to file
  const [grievances, setGrievances] = useState<Grievance[]>([
    {
      id: '1',
      complainantName: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '9876543210',
      category: 'roads',
      description: 'Pothole on Main Road near School',
      location: 'Main Road, Near Government School',
      filedDate: '2024-02-01',
      status: 'resolved',
      priority: 'high',
      resolution: 'Pothole filled and road repaired',
      resolutionDate: '2024-02-10',
    },
    {
      id: '2',
      complainantName: 'Priya Singh',
      email: 'priya@example.com',
      phone: '9876543211',
      category: 'water',
      description: 'Water supply shortage in North Ward',
      location: 'North Ward',
      filedDate: '2024-02-02',
      status: 'in-progress',
      priority: 'high',
    },
    {
      id: '3',
      complainantName: 'Amit Patel',
      email: 'amit@example.com',
      phone: '9876543212',
      category: 'electricity',
      description: 'Streetlight not working',
      location: 'Market Street',
      filedDate: '2024-02-03',
      status: 'under-review',
      priority: 'medium',
    },
    {
      id: '4',
      complainantName: 'Kavya Sharma',
      email: 'kavya@example.com',
      phone: '9876543213',
      category: 'sanitation',
      description: 'Garbage not collected for 5 days',
      location: 'East Ward',
      filedDate: '2024-02-04',
      status: 'registered',
      priority: 'medium',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'registered' | 'under-review' | 'in-progress' | 'resolved' | 'closed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const handleAddGrievance = (grievance: Omit<Grievance, 'id'>) => {
    const newGrievance: Grievance = {
      ...grievance,
      id: Date.now().toString(),
    };
    setGrievances([...grievances, newGrievance]);
    setShowForm(false);
  };

  const handleUpdateGrievance = (id: string, updates: Partial<Grievance>) => {
    setGrievances(
      grievances.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      )
    );
  };

  const filteredGrievances = grievances.filter((g) => {
    const statusMatch = filterStatus === 'all' || g.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || g.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const highPriorityCount = grievances.filter((g) => g.priority === 'high' && g.status !== 'resolved' && g.status !== 'closed').length;

  return (
    <div className="grievance-system">
      <div className="page-header">
        <div>
          <h1>Grievance Management System</h1>
          <p>Register, track, and resolve citizen complaints</p>
        </div>
        {canFile && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={20} />
            <span>{showForm ? 'Cancel' : 'File Grievance'}</span>
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
