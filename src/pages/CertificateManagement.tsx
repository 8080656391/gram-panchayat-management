import React, { useState } from 'react';
import { Certificate } from '../types';
import { useAuth } from '../context/AuthContext';
import CertificateList from '../components/certificates/CertificateList';
import CertificateForm from '../components/certificates/CertificateForm';
import StaffReview from '../components/certificates/StaffReview';
import '../styles/pages/CertificateManagement.css';
import { Plus, X } from 'lucide-react';

const CertificateManagement: React.FC = () => {
  const { user, userRole } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: '1',
      applicantId: 'citizen_1',
      applicantName: 'Rajesh Kumar',
      applicantEmail: 'rajesh@example.com',
      applicantPhone: '+91-1234567890',
      applicantAge: 45,
      certificateType: 'residence',
      applicationDate: '2024-01-15',
      issuanceDate: '2024-02-01',
      status: 'approved',
      certificateNumber: 'RES-2024-001',
      documents: [
        {
          type: 'residence',
          fileName: 'residence_proof.pdf',
          uploadDate: '2024-01-15',
        },
        {
          type: 'photo',
          fileName: 'applicant_photo.jpg',
          uploadDate: '2024-01-15',
        },
      ],
      reviewedBy: 'Staff User',
      reviewDate: '2024-01-20',
      approvedBy: 'Staff User',
      approvalDate: '2024-02-01',
    },
    {
      id: '2',
      applicantId: 'citizen_2',
      applicantName: 'Priya Singh',
      applicantEmail: 'priya@example.com',
      applicantPhone: '+91-9876543210',
      applicantAge: 32,
      certificateType: 'birth',
      applicationDate: '2024-01-20',
      issuanceDate: '',
      status: 'under-review',
      certificateNumber: 'BIR-2024-001',
      documents: [
        {
          type: 'birth',
          fileName: 'birth_certificate.pdf',
          uploadDate: '2024-01-20',
        },
        {
          type: 'photo',
          fileName: 'priya_photo.png',
          uploadDate: '2024-01-20',
        },
      ],
      reviewedBy: 'Staff User',
      reviewDate: '2024-02-24',
    },
    {
      id: '3',
      applicantId: 'citizen_3',
      applicantName: 'Amit Patel',
      applicantEmail: 'amit@example.com',
      applicantPhone: '+91-5555555555',
      applicantAge: 28,
      certificateType: 'marriage',
      applicationDate: '2024-01-10',
      issuanceDate: '2024-01-25',
      status: 'rejected',
      certificateNumber: 'MAR-2024-001',
      documents: [
        {
          type: 'marriage',
          fileName: 'marriage_cert.pdf',
          uploadDate: '2024-01-10',
        },
      ],
      reviewedBy: 'Staff User',
      reviewDate: '2024-01-22',
      rejectionReason: 'Missing required documents. Please upload valid marriage certificate.',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'under-review' | 'approved' | 'rejected'>('all');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showReview, setShowReview] = useState(false);

  const handleAddCertificate = (certificate: Omit<Certificate, 'id'>) => {
    const newCertificate: Certificate = {
      ...certificate,
      id: Date.now().toString(),
      status: 'pending',
    };
    setCertificates([...certificates, newCertificate]);
    setShowForm(false);
  };

  const handleDeleteCertificate = (id: string) => {
    setCertificates(certificates.filter((cert) => cert.id !== id));
  };

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    if (userRole === 'staff' || userRole === 'admin') {
      setShowReview(true);
    }
  };

  const handleApproveCertificate = (id: string, remarks: string) => {
    setCertificates(
      certificates.map((cert) =>
        cert.id === id
          ? {
              ...cert,
              status: 'approved',
              approvedBy: user?.name || 'Staff',
              approvalDate: new Date().toISOString(),
              reviewedBy: user?.name || 'Staff',
              reviewDate: new Date().toISOString(),
              remarks: remarks || cert.remarks,
              issuanceDate: new Date().toISOString().split('T')[0],
              downloadUrl: `/${cert.certificateNumber}.pdf`,
            }
          : cert
      )
    );
    setShowReview(false);
    setSelectedCertificate(null);
    alert('Certificate approved successfully!');
  };

  const handleRejectCertificate = (id: string, reason: string) => {
    setCertificates(
      certificates.map((cert) =>
        cert.id === id
          ? {
              ...cert,
              status: 'rejected',
              rejectionReason: reason,
              reviewedBy: user?.name || 'Staff',
              reviewDate: new Date().toISOString(),
            }
          : cert
      )
    );
    setShowReview(false);
    setSelectedCertificate(null);
    alert('Certificate rejected. Applicant will be notified.');
  };

  const handleDownloadCertificate = (certificate: Certificate) => {
    alert(`Download initiated for ${certificate.certificateNumber}`);
    // In a real application, this would generate and download the PDF
  };

  const handleReapplyCertificate = (certificate: Certificate) => {
    // remove the rejected application and show the form again
    setCertificates(certificates.filter((c) => c.id !== certificate.id));
    setShowForm(true);
  };

  const filteredCertificates =
    filterStatus === 'all' ? certificates : certificates.filter((cert) => cert.status === filterStatus);

  const getCountByStatus = (status: string) => {
    if (status === 'all') return certificates.length;
    return certificates.filter((c) => c.status === status).length;
  };

  return (
    <div className="certificate-management">
      <div className="page-header">
        <div>
          <h1>Certificate Management</h1>
          <p>
            {userRole === 'citizen'
              ? 'Apply for and track your certificates'
              : 'Review and manage certificate applications'}
          </p>
        </div>
        {userRole === 'citizen' && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={20} />
            <span>{showForm ? 'Cancel' : 'New Application'}</span>
          </button>
        )}
      </div>

      {showForm && userRole === 'citizen' && (
        <div className="form-section">
          <div className="form-header">
            <h3>Certificate Application Form</h3>
            <button className="close-btn" onClick={() => setShowForm(false)}>
              <X size={20} />
            </button>
          </div>
          <CertificateForm onSubmit={handleAddCertificate} />
        </div>
      )}

      {showReview && selectedCertificate && (userRole === 'staff' || userRole === 'admin') && (
        <div className="review-modal-overlay">
          <StaffReview
            certificate={selectedCertificate}
            onApprove={handleApproveCertificate}
            onReject={handleRejectCertificate}
            onClose={() => {
              setShowReview(false);
              setSelectedCertificate(null);
            }}
          />
        </div>
      )}

      <div className="filter-section">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({getCountByStatus('all')})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({getCountByStatus('pending')})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'under-review' ? 'active' : ''}`}
            onClick={() => setFilterStatus('under-review')}
          >
            Under Review ({getCountByStatus('under-review')})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
            onClick={() => setFilterStatus('approved')}
          >
            Approved ({getCountByStatus('approved')})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilterStatus('rejected')}
          >
            Rejected ({getCountByStatus('rejected')})
          </button>
        </div>
      </div>

      <CertificateList
        certificates={filteredCertificates}
        userRole={userRole ?? undefined}
        onDelete={handleDeleteCertificate}
        onView={handleViewCertificate}
        onDownload={handleDownloadCertificate}
        onReapply={handleReapplyCertificate}
      />
    </div>
  );
};

export default CertificateManagement;
