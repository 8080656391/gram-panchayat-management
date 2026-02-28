import React, { useState } from 'react';
import { Scheme } from '../../types';
import '../../styles/components/SchemeForm.css';

interface SchemeFormProps {
  onSubmit: (scheme: Omit<Scheme, 'id'>) => void;
}

const SchemeForm: React.FC<SchemeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'agriculture' as const,
    eligibility: '',
    benefits: '',
    applicationProcess: '',
    lastUpdated: new Date().toISOString().split('T')[0],
    contactInfo: {
      department: '',
      phone: '',
      email: '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eligibilityArray = formData.eligibility
      .split('\n')
      .map((e) => e.trim())
      .filter((e) => e);
    const benefitsArray = formData.benefits
      .split('\n')
      .map((b) => b.trim())
      .filter((b) => b);

    onSubmit({
      ...formData,
      eligibility: eligibilityArray,
      benefits: benefitsArray,
    });

    setFormData({
      name: '',
      description: '',
      category: 'agriculture',
      eligibility: '',
      benefits: '',
      applicationProcess: '',
      lastUpdated: new Date().toISOString().split('T')[0],
      contactInfo: {
        department: '',
        phone: '',
        email: '',
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('contact')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <form className="scheme-form" onSubmit={handleSubmit}>
      <h2>Add New Government Scheme</h2>
      <div className="form-grid">
        <div className="form-group full">
          <label htmlFor="name">Scheme Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter scheme name"
          />
        </div>

        <div className="form-group full">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe the scheme"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="agriculture">Agriculture</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="social">Social</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="employment">Employment</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="lastUpdated">Last Updated *</label>
          <input
            type="date"
            id="lastUpdated"
            name="lastUpdated"
            value={formData.lastUpdated}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full">
          <label htmlFor="eligibility">Eligibility Criteria * (one per line)</label>
          <textarea
            id="eligibility"
            name="eligibility"
            value={formData.eligibility}
            onChange={handleChange}
            required
            placeholder="Enter eligibility criteria (one per line)"
            rows={4}
          />
        </div>

        <div className="form-group full">
          <label htmlFor="benefits">Benefits * (one per line)</label>
          <textarea
            id="benefits"
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            required
            placeholder="Enter benefits (one per line)"
            rows={4}
          />
        </div>

        <div className="form-group full">
          <label htmlFor="applicationProcess">Application Process *</label>
          <textarea
            id="applicationProcess"
            name="applicationProcess"
            value={formData.applicationProcess}
            onChange={handleChange}
            required
            placeholder="Describe how to apply for this scheme"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department *</label>
          <input
            type="text"
            id="department"
            name="contact.department"
            value={formData.contactInfo.department}
            onChange={handleChange}
            required
            placeholder="Department name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Contact Phone *</label>
          <input
            type="tel"
            id="phone"
            name="contact.phone"
            value={formData.contactInfo.phone}
            onChange={handleChange}
            required
            placeholder="Phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Contact Email *</label>
          <input
            type="email"
            id="email"
            name="contact.email"
            value={formData.contactInfo.email}
            onChange={handleChange}
            required
            placeholder="Email address"
          />
        </div>
      </div>

      <button type="submit" className="btn-submit">
        Add Scheme
      </button>
    </form>
  );
};

export default SchemeForm;
