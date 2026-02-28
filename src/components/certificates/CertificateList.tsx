import React, { useState } from 'react';
import { Certificate } from '../../types';
import '../../styles/components/CertificateList.css';
import { Trash2, CheckCircle, Clock, XCircle, Download, Eye, MoreVertical } from 'lucide-react';

interface CertificateListProps {
  certificates: Certificate[];
  userRole?: 'citizen' | 'staff' | 'admin';
  onDelete: (id: string) => void;
  onView?: (certificate: Certificate) => void;
  onDownload?: (certificate: Certificate) => void;
  onReapply?: (certificate: Certificate) => void;
}

const CertificateList: React.FC<CertificateListProps> = ({ certificates, userRole, onDelete, onView, onDownload, onReapply }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const getStatusIcon = (status: Certificate['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} className="status-icon approved" />;
      case 'pending':
        return <Clock size={20} className="status-icon pending" />;
      case 'under-review':
        return <Clock size={20} className="status-icon under-review" />;
      case 'rejected':
        return <XCircle size={20} className="status-icon rejected" />;
    }
  };

  const getCertificateTypeLabel = (type: Certificate['certificateType']) => {
    const labels: Record<Certificate['certificateType'], string> = {
      residence: 'Residence Certificate',
      birth: 'Birth Certificate',
      death: 'Death Certificate',
      marriage: 'Marriage Certificate',
    };
    return labels[type];
  };

  const handleDownload = (cert: Certificate) => {
    if (onDownload) {
      onDownload(cert);
    } else {
      // Simulate download
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`${cert.certificateNumber}-${cert.applicantName}`));
      element.setAttribute('download', `${cert.certificateNumber}.pdf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  if (certificates.length === 0) {
    return (
      <div className="empty-state">
        <p>No certificates found</p>
      </div>
    );
  }

  return (
    <div className="certificate-list">
      <div className="table-responsive">
        <table className="certificates-table">
          <thead>
            <tr>
              <th>Certificate #</th>
              <th>Applicant</th>
              <th>Type</th>
              <th>Applied On</th>
              <th>Status</th>
              <th>Reviewed By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <React.Fragment key={cert.id}>
                <tr className={`status-${cert.status}`}>
                  <td className="cert-number">{cert.certificateNumber}</td>
                  <td>
                    <div className="applicant-info">
                      <div className="applicant-name">{cert.applicantName}</div>
                      <div className="applicant-email">{cert.applicantEmail}</div>
                    </div>
                  </td>
                  <td>{getCertificateTypeLabel(cert.certificateType)}</td>
                  <td>{new Date(cert.applicationDate).toLocaleDateString()}</td>
                  <td>
                    <div className="status-cell">
                      {getStatusIcon(cert.status)}
                      <span className={`status-label ${cert.status}`}>{cert.status.replace('-', ' ').toUpperCase()}</span>
                    </div>
                    {userRole === 'citizen' && cert.status === 'rejected' && cert.rejectionReason && (
                      <div className="rejection-inline">
                        <small>Reason: {cert.rejectionReason}</small>
                      </div>
                    )}
                  </td>
                  <td className="reviewed-by">
                    {cert.reviewedBy ? (
                      <span title={`Reviewed on ${cert.reviewDate}`}>{cert.reviewedBy}</span>
                    ) : (
                      <span className="text-muted">Pending</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {userRole !== 'citizen' && onView && (
                        <button
                          className="btn-icon"
                          onClick={() => onView(cert)}
                          title="View details"
                        >
                          <Eye size={18} />
                        </button>
                      )}

                      {cert.status === 'approved' && (
                        <button
                          className="btn-icon download"
                          onClick={() => handleDownload(cert)}
                          title="Download certificate"
                        >
                          <Download size={18} />
                        </button>
                      )}

                      {userRole === 'citizen' && cert.status === 'rejected' && onReapply && (
                        <button
                          className="btn-icon reapply"
                          onClick={() => onReapply(cert)}
                          title="Reapply"
                        >
                          ↻
                        </button>
                      )}

                      {userRole !== 'citizen' && (
                        <button
                          className="btn-icon"
                          onClick={() => setExpandedRow(expandedRow === cert.id ? null : cert.id)}
                          title="More options"
                        >
                          <MoreVertical size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedRow === cert.id && (
                  <tr className="expanded-row">
                    <td colSpan={7}>
                      <div className="expanded-content">
                        <div className="cert-details">
                          <div className="detail-group">
                            <h4>Applicant Details</h4>
                            <p><strong>Phone:</strong> {cert.applicantPhone}</p>
                            <p><strong>Age:</strong> {cert.applicantAge}</p>
                          </div>
                          
                          {cert.documents && cert.documents.length > 0 && (
                            <div className="detail-group">
                              <h4>Uploaded Documents</h4>
                              <ul className="document-list">
                                {cert.documents.map((doc, idx) => (
                                  <li key={idx} className="document-item">
                                    <span className="doc-type">{doc.type.toUpperCase()}</span>
                                    <span className="doc-name">{doc.fileName}</span>
                                    <span className="doc-date">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {cert.status === 'rejected' && cert.rejectionReason && (
                            <div className="detail-group rejection-reason">
                              <h4>Rejection Reason</h4>
                              <p>{cert.rejectionReason}</p>
                            </div>
                          )}

                          {cert.remarks && (
                            <div className="detail-group">
                              <h4>Remarks</h4>
                              <p>{cert.remarks}</p>
                            </div>
                          )}

                          {cert.reviewDate && (
                            <div className="detail-group">
                              <h4>Review Information</h4>
                              <p><strong>Reviewed By:</strong> {cert.reviewedBy}</p>
                              <p><strong>Review Date:</strong> {new Date(cert.reviewDate).toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                        
                        {userRole !== 'citizen' && (
                          <button
                            className="btn-delete"
                            onClick={() => onDelete(cert.id)}
                            title="Delete certificate"
                          >
                            <Trash2 size={18} /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CertificateList;
