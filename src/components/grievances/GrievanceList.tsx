import React, { useState } from 'react';
import { Grievance } from '../../types';
import '../../styles/components/GrievanceList.css';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  UserCheck,
  ShieldCheck,
  XCircle,
  FileText,
  MessageSquare
} from 'lucide-react';

interface GrievanceListProps {
  grievances: Grievance[];
  onUpdateGrievance: (id: string, updates: Partial<Grievance>) => void;
  userRole: 'citizen' | 'staff' | 'admin' | null;
}

const GrievanceList: React.FC<GrievanceListProps> = ({ grievances, onUpdateGrievance, userRole }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState<Record<string, string>>({});
  const [staffRemarks, setStaffRemarks] = useState<Record<string, string>>({});
  const [adminRemarks, setAdminRemarks] = useState<Record<string, string>>({});

  // Get approval workflow status with symbols
  const getApprovalStatus = (grievance: Grievance) => {
    const staffStatus = (grievance as any).staffApproval || 'pending';
    const adminStatus = (grievance as any).adminApproval || 'pending';
    
    return { staffStatus, adminStatus };
  };

  // Get approval icon based on status
  const getApprovalIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} className="approval-icon approved" />;
      case 'rejected':
        return <XCircle size={20} className="approval-icon rejected" />;
      case 'pending':
      default:
        return <Clock size={20} className="approval-icon pending" />;
    }
  };

  // Get status icon with bilingual labels
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
    }
  };

  // Get status label with bilingual support
  const getStatusLabel = (status: Grievance['status']) => {
    switch (status) {
      case 'registered':
        return 'Registered / नोंद';
      case 'under-review':
        return 'Under Review / पुनरावलोकन';
      case 'in-progress':
        return 'In Progress / प्रगती';
      case 'resolved':
        return 'Resolved / निराकरण';
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

  // Handle staff approval
  const handleStaffApproval = (id: string, approved: boolean) => {
    onUpdateGrievance(id, {
      staffApproval: approved ? 'approved' : 'rejected',
      staffApprovalDate: new Date().toISOString(),
      staffRemarks: staffRemarks[id] || '',
      status: approved ? 'under-review' : 'registered',
    });
    setStaffRemarks((prev) => {
      const newText = { ...prev };
      delete newText[id];
      return newText;
    });
  };

  // Handle admin approval
  const handleAdminApproval = (id: string, approved: boolean) => {
    onUpdateGrievance(id, {
      adminApproval: approved ? 'approved' : 'rejected',
      adminApprovalDate: new Date().toISOString(),
      adminRemarks: adminRemarks[id] || '',
      status: approved ? 'resolved' : 'in-progress',
    });
    setAdminRemarks((prev) => {
      const newText = { ...prev };
      delete newText[id];
      return newText;
    });
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
        const { staffStatus, adminStatus } = getApprovalStatus(grievance);
        
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
                <span>{getStatusLabel(grievance.status)}</span>
              </div>
              {/* Approval workflow indicators */}
              <div className="approval-indicators">
                <div className="approval-step" title="Staff Approval">
                  {getApprovalIcon(staffStatus)}
                </div>
                <div className="approval-step" title="Admin Approval">
                  {getApprovalIcon(adminStatus)}
                </div>
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
              {/* Approval Workflow Timeline */}
              <div className="workflow-timeline">
                <h4>
                  <FileText size={18} /> Approval Workflow / मंजूरी प्रक्रिया
                </h4>
                <div className="timeline-steps">
                  <div className={`timeline-step ${staffStatus !== 'pending' ? 'completed' : ''} ${staffStatus === 'approved' ? 'approved' : ''} ${staffStatus === 'rejected' ? 'rejected' : ''}`}>
                    <div className="step-icon">
                      <UserCheck size={20} />
                    </div>
                    <div className="step-content">
                      <span className="step-title">Staff Approval / कर्मचारी मंजूरी</span>
                      <span className="step-status">
                        {staffStatus === 'approved' ? 'Approved ✓' : staffStatus === 'rejected' ? 'Rejected ✗' : 'Pending ⏳'}
                      </span>
                    </div>
                  </div>
                  <div className="timeline-arrow">→</div>
                  <div className={`timeline-step ${adminStatus !== 'pending' ? 'completed' : ''} ${adminStatus === 'approved' ? 'approved' : ''} ${adminStatus === 'rejected' ? 'rejected' : ''}`}>
                    <div className="step-icon">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="step-content">
                      <span className="step-title">Admin Approval / प्रशासक मंजूरी</span>
                      <span className="step-status">
                        {adminStatus === 'approved' ? 'Approved ✓' : adminStatus === 'rejected' ? 'Rejected ✗' : 'Pending ⏳'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

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

              {/* Staff Approval Section - Only visible to Staff and Admin */}
              {userRole === 'staff' && grievance.status !== 'resolved' && (
                <div className="approval-section staff-approval">
                  <h4>
                    <UserCheck size={18} /> Staff Approval / कर्मचारी मंजूरी
                  </h4>
                  <div className="approval-actions">
                    <div className="remarks-input">
                      <label htmlFor={`staff-remarks-${grievance.id}`}>
                        <MessageSquare size={16} /> Remarks / टिप्पणी
                      </label>
                      <textarea
                        id={`staff-remarks-${grievance.id}`}
                        value={staffRemarks[grievance.id] || ''}
                        onChange={(e) =>
                          setStaffRemarks((prev) => ({
                            ...prev,
                            [grievance.id]: e.target.value,
                          }))
                        }
                        placeholder="Add remarks for this grievance... / या तक्रारीसाठी टिप्पणी जोडा..."
                        rows={2}
                      />
                    </div>
                    <div className="approval-buttons">
                      <button
                        className="btn-approve"
                        onClick={() => handleStaffApproval(grievance.id, true)}
                      >
                        <CheckCircle size={18} /> Approve / मंजूर करा
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleStaffApproval(grievance.id, false)}
                      >
                        <XCircle size={18} /> Reject / नाकारा
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Approval Section - Only visible to Admin */}
              {userRole === 'admin' && grievance.status !== 'resolved' && (
                <div className="approval-section admin-approval">
                  <h4>
                    <ShieldCheck size={18} /> Admin Approval / प्रशासक मंजूरी
                  </h4>
                  <div className="approval-actions">
                    <div className="remarks-input">
                      <label htmlFor={`admin-remarks-${grievance.id}`}>
                        <MessageSquare size={16} /> Remarks / टिप्पणी
                      </label>
                      <textarea
                        id={`admin-remarks-${grievance.id}`}
                        value={adminRemarks[grievance.id] || ''}
                        onChange={(e) =>
                          setAdminRemarks((prev) => ({
                            ...prev,
                            [grievance.id]: e.target.value,
                          }))
                        }
                        placeholder="Add admin remarks... / प्रशासक टिप्पणी जोडा..."
                        rows={2}
                      />
                    </div>
                    <div className="approval-buttons">
                      <button
                        className="btn-approve"
                        onClick={() => handleAdminApproval(grievance.id, true)}
                      >
                        <CheckCircle size={18} /> Final Approval / अंतिम मंजूरी
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleAdminApproval(grievance.id, false)}
                      >
                        <XCircle size={18} /> Reject / नाकारा
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {grievance.resolution && (
                <div className="detail-section">
                  <h4>Resolution</h4>
                  <p>{grievance.resolution}</p>
                  {grievance.resolutionDate && (
                    <p className="resolution-date">Resolved on: {new Date(grievance.resolutionDate).toLocaleDateString()}</p>
                  )}
                </div>
              )}

              {(userRole === 'staff' || userRole === 'admin') && grievance.status !== 'resolved' && (
                <div className="action-section">
                  <div className="status-selector">
                    <label>Update Status / स्थिती अपडेट करा:</label>
                    <select
                      value={grievance.status}
                      onChange={(e) => handleStatusChange(grievance.id, e.target.value as Grievance['status'])}
                    >
                      <option value="registered">Registered / नोंद</option>
                      <option value="under-review">Under Review / पुनरावलोकन</option>
                      <option value="in-progress">In Progress / प्रगती</option>
                      <option value="resolved">Resolved / निराकरण</option>
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
