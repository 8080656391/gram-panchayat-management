import React, { useState, useEffect } from 'react';
import { Certificate, CertificateDocument } from '../../types';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/CertificateForm.css';
import { Upload, X, ArrowLeft, Baby, Heart, Home, Users } from 'lucide-react';

interface CertificateFormProps {
  onSubmit: (certificate: Omit<Certificate, 'id'>) => void;
}

type CertificateType = 'birth' | 'death' | 'residence' | 'marriage';

const certificateTypes = [
  { value: 'birth', label: 'Birth Certificate', icon: Baby, description: 'Certificate for newborn birth registration' },
  { value: 'death', label: 'Death Certificate', icon: Heart, description: 'Certificate for death registration' },
  { value: 'residence', label: 'Residence Certificate', icon: Home, description: 'Certificate proving residence in the village' },
  { value: 'marriage', label: 'Marriage Certificate', icon: Users, description: 'Certificate for marriage registration' }
];

const CertificateForm: React.FC<CertificateFormProps> = ({ onSubmit }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1 = select type, 2 = fill form
  const [selectedCertType, setSelectedCertType] = useState<CertificateType | null>(null);
  
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    applicantAge: 0,
    certificateType: 'residence' as CertificateType,
    language: 'en' as const,
    applicationDate: new Date().toISOString().split('T')[0],
    issuanceDate: '',
    status: 'pending' as const,
    certificateNumber: `${Date.now()}`,
    remarks: '',
    // Birth certificate specific fields
    dateOfBirth: '',
    placeOfBirth: '',
    fatherName: '',
    motherName: '',
    gender: '',
    // Death certificate specific fields
    dateOfDeath: '',
    placeOfDeath: '',
    deceasedName: '',
    relationship: '',
    // Residence certificate specific fields
    residenceAddress: '',
    residenceYears: '',
    occupation: '',
    // Marriage certificate specific fields
    spouseName: '',
    marriageDate: '',
    marriagePlace: '',
  });

  const [documents, setDocuments] = useState<CertificateDocument[]>([]);

  // Auto-fetch user profile from database on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.user) {
            const userProfile = data.data.user;
            setFormData(prev => ({
              ...prev,
              applicantName: userProfile.name || prev.applicantName,
              applicantEmail: userProfile.email || prev.applicantEmail,
              applicantPhone: userProfile.phone || prev.applicantPhone,
              applicantAge: userProfile.age || prev.applicantAge,
              fatherName: (userProfile as any).fatherName || prev.fatherName,
              motherName: (userProfile as any).motherName || prev.motherName,
              gender: (userProfile as any).gender || prev.gender,
              dateOfBirth: userProfile.dateOfBirth ? userProfile.dateOfBirth.split('T')[0] : prev.dateOfBirth,
              occupation: (userProfile as any).occupation || prev.occupation,
              spouseName: (userProfile as any).spouseName || prev.spouseName,
              marriageDate: (userProfile as any).marriageDate ? (userProfile as any).marriageDate.split('T')[0] : prev.marriageDate,
              marriagePlace: (userProfile as any).marriagePlace || prev.marriagePlace,
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (user) {
          setFormData(prev => ({
            ...prev,
            applicantName: user.name || '',
            applicantEmail: user.email || '',
            applicantPhone: user.phone || '',
            applicantAge: user.age || 0,
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'applicantAge' ? parseInt(value) || 0 : value,
    }));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: 'aadhaar' | 'ration-card' | 'photo') => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc: CertificateDocument = {
        type: docType,
        fileName: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        file,
      };
      setDocuments([...documents.filter(d => d.type !== docType), newDoc]);
    }
  };

  const handleRemoveDocument = (docType: string) => {
    setDocuments(documents.filter(d => d.type !== docType));
  };

  const handleSelectCertificateType = (type: CertificateType) => {
    setSelectedCertType(type);
    setFormData(prev => ({ ...prev, certificateType: type }));
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) {
      alert('Please wait while your profile is loading...');
      return;
    }

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
      language: formData.language,
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
      applicantName: formData.applicantName,
      applicantEmail: formData.applicantEmail,
      applicantPhone: formData.applicantPhone,
      applicantAge: formData.applicantAge,
      certificateType: 'residence',
      language: 'en',
      applicationDate: new Date().toISOString().split('T')[0],
      issuanceDate: '',
      status: 'pending',
      certificateNumber: `${Date.now()}`,
      remarks: '',
      dateOfBirth: '',
      placeOfBirth: '',
      fatherName: '',
      motherName: '',
      gender: '',
      dateOfDeath: '',
      placeOfDeath: '',
      deceasedName: '',
      relationship: '',
      residenceAddress: '',
      residenceYears: '',
      occupation: '',
      spouseName: '',
      marriageDate: '',
      marriagePlace: '',
    });
    setDocuments([]);
    setStep(1);
    setSelectedCertType(null);
  };

  const documentTypes: Array<'aadhaar' | 'ration-card' | 'photo'> = ['aadhaar', 'ration-card', 'photo'];

  // Show loading while fetching user profile
  if (loading) {
    return (
      <div className="certificate-form loading">
        <div className="loading-spinner">Loading your profile...</div>
      </div>
    );
  }

  // Step 1: Select Certificate Type
  if (step === 1) {
    return (
      <div className="certificate-form">
        <h2>Apply for Certificate</h2>
        <p className="form-subtitle">Select the type of certificate you want to apply for</p>
        
        <div className="cert-type-grid">
          {certificateTypes.map((cert) => {
            const Icon = cert.icon;
            return (
              <div 
                key={cert.value} 
                className="cert-type-card"
                onClick={() => handleSelectCertificateType(cert.value as CertificateType)}
              >
                <div className="cert-type-icon">
                  <Icon size={32} />
                </div>
                <h3>{cert.label}</h3>
                <p>{cert.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Step 2: Fill Form based on certificate type
  const renderCertificateFields = () => {
    switch (formData.certificateType) {
      case 'birth':
        return (
          <div className="form-section">
            <h3>Birth Certificate Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth *</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="placeOfBirth">Place of Birth *</label>
                <input
                  type="text"
                  id="placeOfBirth"
                  name="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={handleChange}
                  required
                  placeholder="Hospital/Place name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="fatherName">Father's Name *</label>
                <input
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  required
                  placeholder="Father's full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="motherName">Mother's Name *</label>
                <input
                  type="text"
                  id="motherName"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  required
                  placeholder="Mother's full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'death':
        return (
          <div className="form-section">
            <h3>Death Certificate Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="deceasedName">Name of Deceased *</label>
                <input
                  type="text"
                  id="deceasedName"
                  name="deceasedName"
                  value={formData.deceasedName}
                  onChange={handleChange}
                  required
                  placeholder="Full name of deceased"
                />
              </div>
              <div className="form-group">
                <label htmlFor="dateOfDeath">Date of Death *</label>
                <input
                  type="date"
                  id="dateOfDeath"
                  name="dateOfDeath"
                  value={formData.dateOfDeath}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="placeOfDeath">Place of Death *</label>
                <input
                  type="text"
                  id="placeOfDeath"
                  name="placeOfDeath"
                  value={formData.placeOfDeath}
                  onChange={handleChange}
                  required
                  placeholder="Hospital/Place name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="relationship">Relationship with Applicant *</label>
                <input
                  type="text"
                  id="relationship"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Father, Mother, Spouse"
                />
              </div>
            </div>
          </div>
        );

      case 'residence':
        return (
          <div className="form-section">
            <h3>Residence Certificate Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="residenceAddress">Current Address *</label>
                <textarea
                  id="residenceAddress"
                  name="residenceAddress"
                  value={formData.residenceAddress}
                  onChange={handleChange}
                  required
                  placeholder="Full residential address"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label htmlFor="residenceYears">Years of Residence in Village *</label>
                <input
                  type="number"
                  id="residenceYears"
                  name="residenceYears"
                  value={formData.residenceYears}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Number of years"
                />
              </div>
              <div className="form-group">
                <label htmlFor="occupation">Occupation *</label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                  placeholder="Your occupation"
                />
              </div>
            </div>
          </div>
        );

      case 'marriage':
        return (
          <div className="form-section">
            <h3>Marriage Certificate Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="spouseName">Spouse Name *</label>
                <input
                  type="text"
                  id="spouseName"
                  name="spouseName"
                  value={formData.spouseName}
                  onChange={handleChange}
                  required
                  placeholder="Spouse's full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="marriageDate">Date of Marriage *</label>
                <input
                  type="date"
                  id="marriageDate"
                  name="marriageDate"
                  value={formData.marriageDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="marriagePlace">Place of Marriage *</label>
                <input
                  type="text"
                  id="marriagePlace"
                  name="marriagePlace"
                  value={formData.marriagePlace}
                  onChange={handleChange}
                  required
                  placeholder="Marriage venue"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getCertificateTypeLabel = () => {
    const cert = certificateTypes.find(c => c.value === formData.certificateType);
    return cert ? cert.label : 'Certificate';
  };

  return (
    <form className="certificate-form" onSubmit={handleSubmit}>
      <div className="form-header-step">
        <button type="button" className="btn-back" onClick={handleBack}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2>{getCertificateTypeLabel()}</h2>
          <p className="form-subtitle">Fill in the details for your certificate application</p>
        </div>
      </div>
      
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

      {/* Dynamic certificate-specific fields */}
      {renderCertificateFields()}

      <div className="form-section">
        <h3>Application Details</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="language">Language / भाषा *</label>
            <select name="language" value={formData.language} onChange={handleChange} required>
              <option value="en">English</option>
              <option value="mr">मराठी (Marathi)</option>
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
        <p className="section-description">Upload required documents (Aadhaar Card, Ration Card) and optionally a photo</p>
        <div className="document-upload-grid">
          {documentTypes.map((docType) => {
            const uploadedDoc = documents.find(d => d.type === docType);
            const labelText = docType === 'photo'
              ? 'Photo'
              : docType === 'aadhaar'
              ? 'Aadhaar Card'
              : 'Ration Card';
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
        <button type="button" className="btn-secondary" onClick={handleBack}>
          <ArrowLeft size={20} />
          Back
        </button>
        <button type="submit" className="btn-submit">
          Submit Application
        </button>
      </div>
    </form>
  );
};

export default CertificateForm;
