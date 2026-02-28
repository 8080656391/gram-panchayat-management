import React, { useState } from 'react';
import { Grievance } from '../../types';
import '../../styles/components/GrievanceList.css';
import { AlertCircle, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface GrievanceListProps {
  grievances: Grievance[];
  onUpdateGrievance: (id: string, updates: Partial<Grievance>) => void;
  userRole: 'citizen' | 'staff' | 'admin' | null;
}

const GrievanceList: React.FC<GrievanceListProps> = ({ grievances, onUpdateGrievance, userRole }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState<Record<string, string>>({});

  const getStatusIcon = (status: Grievance['status']) => {
    switch (status) {
      case 'registered':
        return <Clock size={18} className="status-icon registered" />;
      case 'under-review':
        return <Clock size={18} className="status-icon under-review" />;
      case 'in-progress':
        return <AlertCircle size={18} className="status-icon in-progress" />;
      case 'resolved':
        return <CheckCircle size={18} className="status-icon resolved" />;
      case 'closed':
        return <CheckCircle size={18} className="status-icon closed" />;
    }
  };

  const getPriorityColor = (priority: Grievance['priority']) => {
    switch (priority) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
    }
  };

  const handleResolve = (id: string) => {
    const isCitizen = userRole !== 'staff' && userRole !== 'admin';
    if (isCitizen) return; // citizens cannot resolve
    onUpdateGrievance(id, {
      status: 'resolved',
      resolution: resolutionText[id] || 'Issue has been resolved',
      resolutionDate: new Date().toISOString().split('T')[0],
    });
    setResolutionText((prev) => {
      const newText = { ...prev };
      delete newText[id];
      return newText;
    });
    setExpandedId(null);
  };

  const handleStatusChange = (id: string, newStatus: Grievance['status']) => {
    const isCitizen = userRole !== 'staff' && userRole !== 'admin';
    if (isCitizen) return;
    onUpdateGrievance(id, { status: newStatus });
  };

  if (grievances.length === 0) {
    return (
      <div className="empty-state">
        <p>No grievances found</p>
      </div>
    );
  }

  return (
    <div className="grievance-list">
      {grievances.map((grievance) => {
        const isCitizen = userRole !== 'staff' && userRole !== 'admin';
        const isExpanded = expandedId === grievance.id;
        return (
          <div key={grievance.id} className={`grievance-card status-${grievance.status}`}>
            <div
              className="card-header"
              onClick={() => {
                if (!isCitizen) {
                  setExpandedId(isExpanded ? null : grievance.id);
                }
              }}
            >
            <div className="header-left">
              <div className="priority-badge" style={{ backgroundColor: getPriorityColor(grievance.priority) }}>
                {grievance.priority.toUpperCase()}
              </div>
              <div className="header-content">
                <h3>{grievance.complainantName}</h3>
                <p className="grievance-category">{grievance.category.toUpperCase()}</p>
              </div>
            </div>
            <div className="header-right">
              <div className="status-badge">
                {getStatusIcon(grievance.status)}
                <span>{grievance.status.replace('-', ' ').toUpperCase()}</span>
              </div>
              {!isCitizen && (
                <button className="expand-btn">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              )}
            </div>
          </div>

          {(!isCitizen && isExpanded) && (
            <div className="card-body">
              <div className="detail-section">
                <h4>Grievance Details</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Description</label>
                    <p>{grievance.description}</p>
                  </div>
                  <div className="detail-item">
                    <label>Location</label>
                    <p>{grievance.location}</p>
                  </div>
                  <div className="detail-item">
                    <label>Filed Date</label>
                    <p>{new Date(grievance.filedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="detail-item">
                    <label>Contact</label>
                    <p>{grievance.email} | {grievance.phone}</p>
                  </div>
                  {grievance.attachments && grievance.attachments.length > 0 && (
                    <div className="detail-item attachments">
                      <label>Attachments</label>
                      <div className="attachment-grid">
                        {grievance.attachments.map((url, idx) => (
                          <img key={idx} src={url} alt={`attachment-${idx}`} className="attachment-img" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {grievance.resolution && (
                <div className="detail-section">
                  <h4>Resolution</h4>
                  <p>{grievance.resolution}</p>
                  {grievance.resolutionDate && (
                    <p className="resolution-date">Resolved on: {new Date(grievance.resolutionDate).toLocaleDateString()}</p>
                  )}
                </div>
              )}

              {(userRole === 'staff' || userRole === 'admin') && grievance.status !== 'resolved' && grievance.status !== 'closed' && (
                <div className="action-section">
                  <div className="status-selector">
                    <label>Update Status:</label>
                    <select
                      value={grievance.status}
                      onChange={(e) => handleStatusChange(grievance.id, e.target.value as Grievance['status'])}
                    >
                      <option value="registered">Registered</option>
                      <option value="under-review">Under Review</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  {(grievance.status === 'registered' || grievance.status === 'under-review' || grievance.status === 'in-progress') && (
                    <div className="resolution-input">
                      <label htmlFor={`resolution-${grievance.id}`}>Mark as Resolved</label>
                      <textarea
                        id={`resolution-${grievance.id}`}
                        value={resolutionText[grievance.id] || ''}
                        onChange={(e) =>
                          setResolutionText((prev) => ({
                            ...prev,
                            [grievance.id]: e.target.value,
                          }))
                        }
                        placeholder="Enter resolution details..."
                        rows={3}
                      />
                      <button
                        className="btn-resolve"
                        onClick={() => handleResolve(grievance.id)}
                        disabled={!resolutionText[grievance.id]}
                      >
                        Mark as Resolved
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        );
      })}
    </div>
  );
};

export default GrievanceList;
