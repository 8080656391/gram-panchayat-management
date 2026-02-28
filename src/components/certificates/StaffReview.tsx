import React, { useState } from 'react';
import { Certificate } from '../../types';
import '../../styles/components/CertificateForm.css';
import { CheckCircle, XCircle, File } from 'lucide-react';

interface StaffReviewProps {
  certificate: Certificate;
  onApprove: (id: string, remarks: string) => void;
  onReject: (id: string, reason: string) => void;
  onClose: () => void;
}

const StaffReview: React.FC<StaffReviewProps> = ({ certificate, onApprove, onReject, onClose }) => {
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmCheckbox = document.getElementById('approveConfirm') as HTMLInputElement;
    if (!confirmCheckbox?.checked) {
      alert('Please confirm your decision');
      return;
    }
    setIsSubmitting(true);
    try {
      onApprove(certificate.id, remarks);
      setRemarks('');
      setDecision(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    const rejectCheckbox = document.getElementById('rejectConfirm') as HTMLInputElement;
    if (!rejectCheckbox?.checked) {
      alert('Please confirm your decision');
      return;
    }
    setIsSubmitting(true);
    try {
      onReject(certificate.id, remarks);
      setRemarks('');
      setDecision(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="staff-review-modal">
      <div className="review-container">
        <div className="review-header">
          <h2>Certificate Review</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="review-content">
          {/* Applicant Information */}
          <div className="review-section">
            <h3>Applicant Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Name:</label>
                <p>{certificate.applicantName}</p>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <p>{certificate.applicantEmail}</p>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <p>{certificate.applicantPhone}</p>
              </div>
              <div className="info-item">
                <label>Age:</label>
                <p>{certificate.applicantAge}</p>
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="review-section">
            <h3>Certificate Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Certificate Number:</label>
                <p>{certificate.certificateNumber}</p>
              </div>
              <div className="info-item">
                <label>Type:</label>
                <p>{certificate.certificateType}</p>
              </div>
              <div className="info-item">
                <label>Application Date:</label>
                <p>{new Date(certificate.applicationDate).toLocaleDateString()}</p>
              </div>
              <div className="info-item">
                <label>Current Status:</label>
                <p className={`status-badge ${certificate.status}`}>{certificate.status}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="review-section">
            <h3>Uploaded Documents</h3>
            {certificate.documents && certificate.documents.length > 0 ? (
              <div className="documents-list">
                {certificate.documents.map((doc, idx) => (
                  <div key={idx} className="document-item">
                    <File size={20} />
                    <div className="doc-details">
                      <div className="doc-name">{doc.type.toUpperCase()}: {doc.fileName}</div>
                      <div className="doc-meta">{new Date(doc.uploadDate).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-documents">No documents uploaded</p>
            )}
          </div>

          {/* Applicant Remarks */}
          {certificate.remarks && (
            <div className="review-section">
              <h3>Applicant Remarks</h3>
              <div className="remarks-box">
                {certificate.remarks}
              </div>
            </div>
          )}

          {/* Decision Form */}
          <div className="review-section decision-section">
            <h3>Your Decision</h3>
            
            {certificate.status === 'pending' || certificate.status === 'under-review' ? (
              <>
                <div className="decision-options">
                  <button
                    type="button"
                    className={`decision-btn approve ${decision === 'approve' ? 'active' : ''}`}
                    onClick={() => setDecision('approve')}
                  >
                    <CheckCircle size={20} />
                    Approve
                  </button>
                  <button
                    type="button"
                    className={`decision-btn reject ${decision === 'reject' ? 'active' : ''}`}
                    onClick={() => setDecision('reject')}
                  >
                    <XCircle size={20} />
                    Reject
                  </button>
                </div>

                {decision && (
                  <form className="decision-form" onSubmit={decision === 'approve' ? handleApprove : handleReject}>
                    {decision === 'approve' ? (
                      <>
                        <div className="form-group">
                          <label htmlFor="approveRemarks">Additional Remarks (Optional)</label>
                          <textarea
                            id="approveRemarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Add any remarks for the applicant"
                            rows={3}
                          />
                        </div>
                        <div className="checkbox-group">
                          <input
                            type="checkbox"
                            id="approveConfirm"
                            required
                          />
                          <label htmlFor="approveConfirm">
                            I confirm approval of this certificate application
                          </label>
                        </div>
                        <button type="submit" className="btn-approve" disabled={isSubmitting}>
                          {isSubmitting ? 'Processing...' : 'Confirm & Approve'}
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="form-group">
                          <label htmlFor="rejectionReason">Reason for Rejection *</label>
                          <textarea
                            id="rejectionReason"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Please provide a detailed reason for rejection. This will be communicated to the applicant."
                            rows={4}
                            required
                          />
                        </div>
                        <div className="checkbox-group">
                          <input
                            type="checkbox"
                            id="rejectConfirm"
                            required
                          />
                          <label htmlFor="rejectConfirm">
                            I confirm rejection of this application with the above reason
                          </label>
                        </div>
                        <button type="submit" className="btn-reject" disabled={isSubmitting}>
                          {isSubmitting ? 'Processing...' : 'Confirm & Reject'}
                        </button>
                      </>
                    )}
                  </form>
                )}
              </>
            ) : (
              <div className="status-info">
                <p>This certificate has already been {certificate.status.replace('-', ' ')}.</p>
                {certificate.status === 'approved' && (
                  <p className="approved-info">Approved on {certificate.approvalDate && new Date(certificate.approvalDate).toLocaleDateString()} by {certificate.approvedBy}</p>
                )}
                {certificate.status === 'rejected' && (
                  <>
                    <p className="rejected-info">Rejected on {certificate.reviewDate && new Date(certificate.reviewDate).toLocaleDateString()}</p>
                    <p><strong>Reason:</strong> {certificate.rejectionReason}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="review-footer">
          <button className="btn-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default StaffReview;
