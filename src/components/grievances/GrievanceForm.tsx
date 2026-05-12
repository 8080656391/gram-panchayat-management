import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/GrievanceForm.css';
import { Upload, FileText, MapPin, Phone, Mail, User } from 'lucide-react';

interface GrievanceFormProps {
  onSubmit: (formData: FormData) => void;
}

const GrievanceForm: React.FC<GrievanceFormProps> = ({ onSubmit }) => {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    complainantName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    category: 'roads' as const,
    description: '',
    location: '',
    filedDate: new Date().toISOString().split('T')[0],
    status: 'registered' as const,
    priority: 'medium' as const,
    attachments: [] as string[],
  });

  // Autofill user data when user changes (on login or context update)
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        complainantName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);
  const [files, setFiles] = useState<File[]>([]); // local file objects for preview

  // Category options with bilingual labels
  const categoryOptions = [
    { value: 'roads', label: 'Roads & Infrastructure', labelMr: 'रस्ते व पायाभूत सुविधा' },
    { value: 'water', label: 'Water Supply', labelMr: 'पाणी पुरवठा' },
    { value: 'electricity', label: 'Electricity', labelMr: 'वीज' },
    { value: 'sanitation', label: 'Sanitation', labelMr: 'स्वच्छता' },
    { value: 'health', label: 'Health Services', labelMr: 'आरोग्य सेवा' },
    { value: 'education', label: 'Education', labelMr: 'शिक्षण' },
    { value: 'other', label: 'Other', labelMr: 'इतर' },
  ];

  // Priority options with bilingual labels
  const priorityOptions = [
    { value: 'low', label: 'Low / कमी', color: '#10b981' },
    { value: 'medium', label: 'Medium / मध्यम', color: '#f59e0b' },
    { value: 'high', label: 'High / उच्च', color: '#ef4444' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    // Validate phone number (must be 10 digits, Indian format)
    const phone = formData.phone.trim();
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
      setErrorMsg('Phone number must be 10 digits (e.g., 9876543210)');
      return;
    }
    // Validate required fields
    if (!formData.complainantName || !formData.email || !formData.category || !formData.description || !formData.location) {
      setErrorMsg('Please fill all required fields.');
      return;
    }
    // Create FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append('category', formData.category);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('priority', formData.priority);
    formDataToSend.append('phone', phone);
    // Append files
    files.forEach((file) => {
      formDataToSend.append('attachments', file);
    });
    try {
      // Call onSubmit with FormData and handle backend errors
      const result = await onSubmit(formDataToSend);
      if (result && result.error) {
        setErrorMsg(result.error);
        return;
      }
      // reset form
      setFormData({
        complainantName: '',
        email: '',
        phone: '',
        category: 'roads',
        description: '',
        location: '',
        filedDate: new Date().toISOString().split('T')[0],
        status: 'registered',
        priority: 'medium',
        attachments: [],
      });
      setFiles([]);
    } catch (err: any) {
      setErrorMsg('Server error. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles(selected);
      // preview by storing urls immediately (will be applied on submit too)
      const urls = selected.map((f) => URL.createObjectURL(f));
      setFormData((prev) => ({
        ...prev,
        attachments: urls,
      }));
    }
  };

  return (
    <form className="grievance-form" onSubmit={handleSubmit}>
      {errorMsg && <div className="error-message">{errorMsg}</div>}
      <h2>File a Grievance / तक्रार दाखल करा</h2>
      <p className="form-subtitle">Submit your complaint and track its progress</p>
      
      <div className="form-grid">
        <div className="form-group full">
          <label htmlFor="attachments">
            <Upload size={18} /> Upload Photo(s) / फोटो अपलोड करा
          </label>
          <input
            type="file"
            id="attachments"
            name="attachments"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="file-input"
          />
          {files.length > 0 && (
            <div className="attachment-preview">
              {files.map((f, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(f)}
                  alt={`attachment-${idx}`}
                  className="preview-img"
                />
              ))}
            </div>
          )}
        </div>
        <div className="form-group full">
          <label htmlFor="complainantName">
            <User size={18} /> Your Name * / आपले नाव *
          </label>
          <input
            type="text"
            id="complainantName"
            name="complainantName"
            value={formData.complainantName}
            onChange={handleChange}
            required
            placeholder="Enter your full name / आपले पूर्ण नाव"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <Mail size={18} /> Email * / ईमेल *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            <Phone size={18} /> Phone * / फोन *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter your phone number / आपला फोन नंबर"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">
            <FileText size={18} /> Category * / प्रकार *
          </label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.labelMr})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">
            Priority * / प्राधान्य *
          </label>
          <select name="priority" value={formData.priority} onChange={handleChange} required>
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="filedDate">Date * / तारीख *</label>
          <input
            type="date"
            id="filedDate"
            name="filedDate"
            value={formData.filedDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full">
          <label htmlFor="location">
            <MapPin size={18} /> Location * / ठिकाण *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Location of the issue / समस्येचे स्थान"
          />
        </div>

        <div className="form-group full">
          <label htmlFor="description">
            <FileText size={18} /> Detailed Description * / तपशीलवार वर्णन *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Please describe the issue in detail / कृपया समस्येचा तपशीलवार वर्णन करा"
            rows={5}
          />
        </div>
      </div>

      <button type="submit" className="btn-submit">
        Submit Grievance / तक्रार सादर करा
      </button>
    </form>
  );
};

export default GrievanceForm;
