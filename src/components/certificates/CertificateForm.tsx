import React, { useState } from 'react';
import { Certificate, CertificateDocument } from '../../types';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/CertificateForm.css';
import { Upload, X } from 'lucide-react';

interface CertificateFormProps {
  onSubmit: (certificate: Omit<Certificate, 'id'>) => void;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    applicantName: user?.name || '',
    applicantEmail: user?.email || '',
    applicantPhone: user?.phone || '',
    applicantAge: 0,
    certificateType: 'residence' as const,
    applicationDate: new Date().toISOString().split('T')[0],
    issuanceDate: '',
    status: 'pending' as const,
    certificateNumber: `${Date.now()}`,
    remarks: '',
  });

  const [documents, setDocuments] = useState<CertificateDocument[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'applicantAge' ? parseInt(value) || 0 : value,
    }));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: 'birth' | 'death' | 'residence' | 'marriage' | 'photo') => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc: CertificateDocument = {
        type: docType,
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        file,
      };
      setDocuments([...documents.filter(d => d.type !== docType), newDoc]);
    }
  };

  const handleRemoveDocument = (docType: string) => {
    setDocuments(documents.filter(d => d.type !== docType));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (documents.length === 0) {
      alert('Please upload at least one document');
      return;
    }

    const certificate: Omit<Certificate, 'id'> = {
      applicantId: user?.id || '',
      applicantName: formData.applicantName,
      applicantEmail: formData.applicantEmail,
      applicantPhone: formData.applicantPhone,
      applicantAge: formData.applicantAge,
      certificateType: formData.certificateType,
      applicationDate: formData.applicationDate,
      issuanceDate: formData.issuanceDate,
      status: formData.status,
      certificateNumber: formData.certificateNumber,
      documents,
      remarks: formData.remarks,
    };

    onSubmit(certificate);
    
    // Reset form
    setFormData({
      applicantName: user?.name || '',
      applicantEmail: user?.email || '',
      applicantPhone: user?.phone || '',
      applicantAge: 0,
      certificateType: 'residence',
      applicationDate: new Date().toISOString().split('T')[0],
      issuanceDate: '',
      status: 'pending',
      certificateNumber: `${Date.now()}`,
      remarks: '',
    });
    setDocuments([]);
  };

  const documentTypes: Array<'birth' | 'death' | 'residence' | 'marriage' | 'photo'> = ['birth', 'death', 'residence', 'marriage', 'photo'];

  return (
    <form className="certificate-form" onSubmit={handleSubmit}>
      <h2>New Certificate Application</h2>
      
      <div className="form-section">
        <h3>Personal Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="applicantName">Full Name *</label>
            <input
              type="text"
              id="applicantName"
              name="applicantName"
              value={formData.applicantName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="applicantEmail">Email *</label>
            <input
              type="email"
              id="applicantEmail"
              name="applicantEmail"
              value={formData.applicantEmail}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="applicantPhone">Phone Number *</label>
            <input
              type="tel"
              id="applicantPhone"
              name="applicantPhone"
              value={formData.applicantPhone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="applicantAge">Age *</label>
            <input
              type="number"
              id="applicantAge"
              name="applicantAge"
              value={formData.applicantAge}
              onChange={handleChange}
              required
              min="0"
              max="120"
              placeholder="Enter your age"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Certificate Details</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="certificateType">Certificate Type *</label>
            <select name="certificateType" value={formData.certificateType} onChange={handleChange} required>
              <option value="residence">Residence Certificate</option>
              <option value="birth">Birth Certificate</option>
              <option value="death">Death Certificate</option>
              <option value="marriage">Marriage Certificate</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="applicationDate">Application Date *</label>
            <input
              type="date"
              id="applicationDate"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Document Upload *</h3>
        <p className="section-description">Upload required documents (Birth, Death, Residence, Marriage certificates) and optionally a photo</p>
        <div className="document-upload-grid">
          {documentTypes.map((docType) => {
            const uploadedDoc = documents.find(d => d.type === docType);
            const labelText = docType === 'photo'
              ? 'Photo'
              : `${docType.charAt(0).toUpperCase() + docType.slice(1)} Certificate`;
            return (
              <div key={docType} className="document-upload-item">
                <div className="document-header">
                  <label htmlFor={`upload-${docType}`} className="document-label">
                    {labelText}
                  </label>
                  {uploadedDoc && <span className="upload-badge">✓ Uploaded</span>}
                </div>
                
                {uploadedDoc ? (
                  <div className="uploaded-file">
                    <div className="file-info">
                      <span className="file-name">{uploadedDoc.fileName}</span>
                      <span className="file-date">{new Date(uploadedDoc.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => handleRemoveDocument(docType)}
                      title="Remove file"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="upload-area">
                    <input
                      type="file"
                      id={`upload-${docType}`}
                      onChange={(e) => handleDocumentUpload(e, docType)}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="file-input"
                    />
                    <label htmlFor={`upload-${docType}`} className="upload-label">
                      <Upload size={24} />
                      <span>Click to upload</span>
                      <small>PDF, JPG, PNG (Max 5MB)</small>
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="form-section">
        <h3>Additional Remarks</h3>
        <div className="form-group">
          <label htmlFor="remarks">Remarks (Optional)</label>
          <textarea
            id="remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Add any additional remarks or information"
            rows={4}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">
          Submit Application
        </button>
      </div>
    </form>
  );
};

export default CertificateForm;
