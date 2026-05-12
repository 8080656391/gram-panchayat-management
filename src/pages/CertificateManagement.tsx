import React, { useState, useEffect } from 'react';
import { Certificate } from '../types';
import { useAuth } from '../context/AuthContext';
import CertificateList from '../components/certificates/CertificateList';
import CertificateForm from '../components/certificates/CertificateForm';
import StaffReview from '../components/certificates/StaffReview';
import '../styles/pages/CertificateManagement.css';
import { Plus, X } from 'lucide-react';

const CertificateManagement: React.FC = () => {
  const { userRole } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch certificates based on user role
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem('token');
        let url = 'http://localhost:5000/api/certificates';

        if (userRole === 'citizen') {
          url = 'http://localhost:5000/api/certificates/my-certificates';
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          const certs = userRole === 'citizen' ? data.data.certificates : data.data.certificates;
          const formattedCertificates = certs.map((cert: any) => ({
            id: cert._id,
            applicantId: cert.applicantId._id || cert.applicantId,
            applicantName: cert.applicantName,
            applicantEmail: cert.applicantEmail,
            applicantPhone: cert.applicantPhone,
            applicantAge: cert.applicantAge,
            certificateType: cert.certificateType,
            applicationDate: new Date(cert.applicationDate).toISOString().split('T')[0],
            issuanceDate: cert.issuanceDate ? new Date(cert.issuanceDate).toISOString().split('T')[0] : '',
            status: cert.status,
            certificateNumber: cert.certificateNumber || '',
            documents: cert.documents || [],
            reviewedBy: cert.reviewedBy?.name || cert.reviewedBy,
            reviewDate: cert.reviewDate ? new Date(cert.reviewDate).toISOString().split('T')[0] : undefined,
            approvedBy: cert.approvedBy?.name || cert.approvedBy,
            approvalDate: cert.approvalDate ? new Date(cert.approvalDate).toISOString().split('T')[0] : undefined,
            rejectionReason: cert.rejectionReason,
            downloadUrl: cert.downloadUrl,
            remarks: cert.remarks,
            partialApproved: cert.partialApproved,
            staffRemarks: cert.staffRemarks,
            adminRemarks: cert.adminRemarks
          }));
          setCertificates(formattedCertificates);
        } else {
          console.error('Failed to fetch certificates:', data.message);
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [userRole]);

  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'under-review' | 'admin-review' | 'approved' | 'rejected'>('all');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const handleAddCertificate = async (certificate: Omit<Certificate, 'id'>) => {
    setFormErrors([]);

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append('certificateType', certificate.certificateType);
      formData.append('applicantName', certificate.applicantName);
      formData.append('applicantEmail', certificate.applicantEmail);
      formData.append('applicantPhone', certificate.applicantPhone);
      formData.append('applicantAge', certificate.applicantAge.toString());
      // Append all certificate-specific fields if present
      if (certificate.dateOfBirth) formData.append('dateOfBirth', certificate.dateOfBirth);
      if (certificate.placeOfBirth) formData.append('placeOfBirth', certificate.placeOfBirth);
      if (certificate.fatherName) formData.append('fatherName', certificate.fatherName);
      if (certificate.motherName) formData.append('motherName', certificate.motherName);
      if (certificate.gender) formData.append('gender', certificate.gender);
      if (certificate.dateOfDeath) formData.append('dateOfDeath', certificate.dateOfDeath);
      if (certificate.placeOfDeath) formData.append('placeOfDeath', certificate.placeOfDeath);
      if (certificate.deceasedName) formData.append('deceasedName', certificate.deceasedName);
      if (certificate.relationship) formData.append('relationship', certificate.relationship);
      if (certificate.residenceAddress) formData.append('residenceAddress', certificate.residenceAddress);
      if (certificate.residenceYears) formData.append('residenceYears', certificate.residenceYears);
      if (certificate.occupation) formData.append('occupation', certificate.occupation);
      if (certificate.spouseName) formData.append('spouseName', certificate.spouseName);
      if (certificate.marriageDate) formData.append('marriageDate', certificate.marriageDate);
      if (certificate.marriagePlace) formData.append('marriagePlace', certificate.marriagePlace);

      // Extended marriage certificate fields
      if (certificate.bridegroomName) formData.append('bridegroomName', certificate.bridegroomName);
      if (certificate.brideName) formData.append('brideName', certificate.brideName);
      if (certificate.bridegroomFatherName) formData.append('bridegroomFatherName', certificate.bridegroomFatherName);
      if (certificate.brideFatherName) formData.append('brideFatherName', certificate.brideFatherName);
      if (certificate.bridegroomAddress) formData.append('bridegroomAddress', certificate.bridegroomAddress);
      if (certificate.brideAddress) formData.append('brideAddress', certificate.brideAddress);
      if (certificate.bridegroomAge !== undefined && certificate.bridegroomAge !== '') formData.append('bridegroomAge', certificate.bridegroomAge.toString());
      if (certificate.brideAge !== undefined && certificate.brideAge !== '') formData.append('brideAge', certificate.brideAge.toString());

      // Append documents/files with their type as fieldname
      if (certificate.documents && Array.isArray(certificate.documents)) {
        certificate.documents.forEach((doc: any) => {
          if (doc.file) {
            // Use document type (e.g., 'aadhaar', 'ration-card', 'photo') as fieldname
            formData.append(doc.type, doc.file);
          }
        });
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/certificates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        // Show validation errors if present
        if (data.errors && Array.isArray(data.errors)) {
          setFormErrors(data.errors);
        } else if (data.message) {
          setFormErrors([data.message]);
        } else {
          setFormErrors(['Failed to submit certificate']);
        }
        return;
      }

      // Refetch certificates to get updated list
      const fetchResponse = await fetch('http://localhost:5000/api/certificates/my-certificates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const fetchData = await fetchResponse.json();
      if (fetchResponse.ok) {
        const formattedCertificates = fetchData.data.certificates.map((cert: any) => ({
          id: cert._id,
          applicantId: cert.applicantId._id || cert.applicantId,
          applicantName: cert.applicantName,
          applicantEmail: cert.applicantEmail,
          applicantPhone: cert.applicantPhone,
          applicantAge: cert.applicantAge,
          certificateType: cert.certificateType,
          applicationDate: new Date(cert.applicationDate).toISOString().split('T')[0],
          issuanceDate: cert.issuanceDate ? new Date(cert.issuanceDate).toISOString().split('T')[0] : '',
          status: cert.status,
          certificateNumber: cert.certificateNumber || '',
          documents: cert.documents || [],
          reviewedBy: cert.reviewedBy?.name || cert.reviewedBy,
          reviewDate: cert.reviewDate ? new Date(cert.reviewDate).toISOString().split('T')[0] : undefined,
          approvedBy: cert.approvedBy?.name || cert.approvedBy,
          approvalDate: cert.approvalDate ? new Date(cert.approvalDate).toISOString().split('T')[0] : undefined,
          rejectionReason: cert.rejectionReason,
          downloadUrl: cert.downloadUrl,
          remarks: cert.remarks,
          partialApproved: cert.partialApproved,
          staffRemarks: cert.staffRemarks,
          adminRemarks: cert.adminRemarks
        }));
        setCertificates(formattedCertificates);
      }

      setShowForm(false);
      alert('Certificate application submitted successfully and sent to staff for review!');
    } catch (error: any) {
      console.error('Certificate submission error:', error);
      setFormErrors([error.message || 'Unknown error occurred']);
    }
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

  const handleApproveCertificate = async (id: string, remarks: string, partial?: boolean) => {
    try {
      const token = localStorage.getItem('token');

      if (partial && userRole === 'staff') {
        // Staff partial approval - send to admin review
        const response = await fetch(`http://localhost:5000/api/certificates/${id}/partial-review`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            overallStatus: 'admin-review',
            remarks: remarks,
            documentApprovals: [] // Staff can approve all documents for now
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to submit partial review');
        }

        alert('Certificate reviewed by staff and sent to admin for final approval!');
      } else if (userRole === 'admin') {
        // Admin final approval
        const response = await fetch(`http://localhost:5000/api/certificates/${id}/admin-approve`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: 'approved',
            adminRemarks: remarks
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to approve certificate');
        }

        alert('Certificate approved successfully!');
      }

      // Refetch certificates
      let url = 'http://localhost:5000/api/certificates';
      if (userRole === 'citizen') {
        url = 'http://localhost:5000/api/certificates/my-certificates';
      }

      const fetchResponse = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const fetchData = await fetchResponse.json();
      if (fetchResponse.ok) {
        const certs = userRole === 'citizen' ? fetchData.data.certificates : fetchData.data.certificates;
        const formattedCertificates = certs.map((cert: any) => ({
          id: cert._id,
          applicantId: cert.applicantId._id || cert.applicantId,
          applicantName: cert.applicantName,
          applicantEmail: cert.applicantEmail,
          applicantPhone: cert.applicantPhone,
          applicantAge: cert.applicantAge,
          certificateType: cert.certificateType,
          applicationDate: new Date(cert.applicationDate).toISOString().split('T')[0],
          issuanceDate: cert.issuanceDate ? new Date(cert.issuanceDate).toISOString().split('T')[0] : '',
          status: cert.status,
          certificateNumber: cert.certificateNumber || '',
          documents: cert.documents || [],
          reviewedBy: cert.reviewedBy?.name || cert.reviewedBy,
          reviewDate: cert.reviewDate ? new Date(cert.reviewDate).toISOString().split('T')[0] : undefined,
          approvedBy: cert.approvedBy?.name || cert.approvedBy,
          approvalDate: cert.approvalDate ? new Date(cert.approvalDate).toISOString().split('T')[0] : undefined,
          rejectionReason: cert.rejectionReason,
          downloadUrl: cert.downloadUrl,
          remarks: cert.remarks,
          partialApproved: cert.partialApproved,
          staffRemarks: cert.staffRemarks,
          adminRemarks: cert.adminRemarks
        }));
        setCertificates(formattedCertificates);
      }

      setShowReview(false);
      setSelectedCertificate(null);
    } catch (error: any) {
      console.error('Approval error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleRejectCertificate = async (id: string, reason: string) => {
    try {
      const token = localStorage.getItem('token');

      if (userRole === 'staff') {
        // Staff rejection
        const response = await fetch(`http://localhost:5000/api/certificates/${id}/partial-review`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            overallStatus: 'rejected',
            remarks: reason
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to reject certificate');
        }
      } else if (userRole === 'admin') {
        // Admin rejection
        const response = await fetch(`http://localhost:5000/api/certificates/${id}/admin-approve`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: 'rejected',
            rejectReason: reason
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to reject certificate');
        }
      }

      // Refetch certificates
      let url = 'http://localhost:5000/api/certificates';
      if (userRole === 'citizen') {
        url = 'http://localhost:5000/api/certificates/my-certificates';
      }

      const fetchResponse = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const fetchData = await fetchResponse.json();
      if (fetchResponse.ok) {
        const certs = userRole === 'citizen' ? fetchData.data.certificates : fetchData.data.certificates;
        const formattedCertificates = certs.map((cert: any) => ({
          id: cert._id,
          applicantId: cert.applicantId._id || cert.applicantId,
          applicantName: cert.applicantName,
          applicantEmail: cert.applicantEmail,
          applicantPhone: cert.applicantPhone,
          applicantAge: cert.applicantAge,
          certificateType: cert.certificateType,
          applicationDate: new Date(cert.applicationDate).toISOString().split('T')[0],
          issuanceDate: cert.issuanceDate ? new Date(cert.issuanceDate).toISOString().split('T')[0] : '',
          status: cert.status,
          certificateNumber: cert.certificateNumber || '',
          documents: cert.documents || [],
          reviewedBy: cert.reviewedBy?.name || cert.reviewedBy,
          reviewDate: cert.reviewDate ? new Date(cert.reviewDate).toISOString().split('T')[0] : undefined,
          approvedBy: cert.approvedBy?.name || cert.approvedBy,
          approvalDate: cert.approvalDate ? new Date(cert.approvalDate).toISOString().split('T')[0] : undefined,
          rejectionReason: cert.rejectionReason,
          downloadUrl: cert.downloadUrl,
          remarks: cert.remarks,
          partialApproved: cert.partialApproved,
          staffRemarks: cert.staffRemarks,
          adminRemarks: cert.adminRemarks
        }));
        setCertificates(formattedCertificates);
      }

      setShowReview(false);
      setSelectedCertificate(null);
      alert('Certificate rejected. Applicant will be notified.');
    } catch (error: any) {
      console.error('Rejection error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDownloadCertificate = async (certificate: Certificate) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to download certificates.');
      return;
    }

    // Always use the full backend URL, not the relative path from database
    const downloadUrl = `http://localhost:5000/api/certificates/${certificate.id}/download`;

    try {
      const response = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Failed to download certificate');
      }

      const contentType = response.headers.get('content-type') || '';
      const contentDisposition = response.headers.get('content-disposition') || '';
      const match = /filename="([^"]+)"/.exec(contentDisposition);
      const fileName = match?.[1] || `Certificate-${certificate.certificateNumber}.html`;
      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);

      if (contentType.includes('text/html')) {
        const anchor = document.createElement('a');
        anchor.href = fileUrl;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      } else {
        const element = document.createElement('a');
        element.href = fileUrl;
        element.download = fileName;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }

      setTimeout(() => window.URL.revokeObjectURL(fileUrl), 1000);
    } catch (error: any) {
      console.error('Download error:', error);
      alert(`Download failed: ${error.message || 'Unable to fetch certificate.'}`);
    }
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
          <div>
            {formErrors.length > 0 && (
              <div className="form-errors">
                <ul>
                  {formErrors.map((err, idx) => (
                    <li key={idx} style={{ color: 'red' }}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
            <CertificateForm onSubmit={handleAddCertificate} />
          </div>
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
            className={`filter-btn ${filterStatus === 'admin-review' ? 'active' : ''}`}
            onClick={() => setFilterStatus('admin-review')}
          >
            Admin Review ({getCountByStatus('admin-review')})
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

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading certificates...</div>
        </div>
      )}
    </div>
  );
};

export default CertificateManagement;
