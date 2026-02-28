import React, { useState } from 'react';
import { Grievance } from '../../types';
import '../../styles/components/GrievanceForm.css';

interface GrievanceFormProps {
  onSubmit: (grievance: Omit<Grievance, 'id'>) => void;
}

const GrievanceForm: React.FC<GrievanceFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    complainantName: '',
    email: '',
    phone: '',
    category: 'roads' as const,
    description: '',
    location: '',
    filedDate: new Date().toISOString().split('T')[0],
    status: 'registered' as const,
    priority: 'medium' as const,
    attachments: [] as string[],
  });
  const [files, setFiles] = useState<File[]>([]); // local file objects for preview

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // convert files to object URLs for storage
    const attachmentUrls = files.map((f) => URL.createObjectURL(f));
    onSubmit({
      ...formData,
      attachments: attachmentUrls,
    } as Omit<Grievance, 'id'>);
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
      <h2>File a Grievance</h2>
      <div className="form-grid">
        <div className="form-group full">
          <label htmlFor="attachments">Upload Photo(s)</label>
          <input
            type="file"
            id="attachments"
            name="attachments"
            accept="image/*"
            multiple
            onChange={handleFileChange}
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
          <label htmlFor="complainantName">Your Name *</label>
          <input
            type="text"
            id="complainantName"
            name="complainantName"
            value={formData.complainantName}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
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
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="10-digit mobile number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="roads">Roads & Infrastructure</option>
            <option value="water">Water Supply</option>
            <option value="electricity">Electricity</option>
            <option value="sanitation">Sanitation</option>
            <option value="health">Health Services</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority *</label>
          <select name="priority" value={formData.priority} onChange={handleChange} required>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="filedDate">Date *</label>
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
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Location of the issue"
          />
        </div>

        <div className="form-group full">
          <label htmlFor="description">Detailed Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Please describe the issue in detail"
            rows={5}
          />
        </div>
      </div>

      <button type="submit" className="btn-submit">
        Submit Grievance
      </button>
    </form>
  );
};

export default GrievanceForm;
