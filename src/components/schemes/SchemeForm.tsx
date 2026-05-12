import React, { useState } from 'react';
import '../../styles/components/SchemeForm.css';

interface SchemeFormProps {
  onSubmit: (scheme: any) => void;
}

const SchemeForm: React.FC<SchemeFormProps> = ({ onSubmit }) => {
  const [activeTab, setActiveTab] = useState<'en' | 'mr'>('en');

  const [formData, setFormData] = useState({
    name: {
      en: '',
      mr: '',
    },
    description: {
      en: '',
      mr: '',
    },
    category: 'agriculture' as const,
    eligibility: {
      en: '',
      mr: '',
    },
    benefits: {
      en: '',
      mr: '',
    },
    applicationProcess: {
      en: '',
      mr: '',
    },
    applicationLink: '',
    contactInfo: {
      department: '',
      phone: '',
      email: '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate bilingual fields
    if (!formData.name.en.trim() || !formData.name.mr.trim()) {
      alert('Please enter scheme name in both English and Marathi');
      return;
    }

    if (!formData.description.en.trim() || !formData.description.mr.trim()) {
      alert('Please enter description in both English and Marathi');
      return;
    }

    if (!formData.eligibility.en.trim() || !formData.eligibility.mr.trim()) {
      alert('Please enter eligibility criteria in both English and Marathi');
      return;
    }

    if (!formData.benefits.en.trim() || !formData.benefits.mr.trim()) {
      alert('Please enter benefits in both English and Marathi');
      return;
    }

    if (!formData.applicationProcess.en.trim() || !formData.applicationProcess.mr.trim()) {
      alert('Please enter application process in both English and Marathi');
      return;
    }

    if (!formData.contactInfo.department.trim() || !formData.contactInfo.phone.trim() || !formData.contactInfo.email.trim()) {
      alert('Please fill in all contact information fields');
      return;
    }

    const eligibilityEn = formData.eligibility.en
      .split('\n')
      .map((e) => e.trim())
      .filter((e) => e);
    const eligibilityMr = formData.eligibility.mr
      .split('\n')
      .map((e) => e.trim())
      .filter((e) => e);
    const benefitsEn = formData.benefits.en
      .split('\n')
      .map((b) => b.trim())
      .filter((b) => b);
    const benefitsMr = formData.benefits.mr
      .split('\n')
      .map((b) => b.trim())
      .filter((b) => b);

    onSubmit({
      name: formData.name,
      description: formData.description,
      category: formData.category,
      eligibility: {
        en: eligibilityEn,
        mr: eligibilityMr,
      },
      benefits: {
        en: benefitsEn,
        mr: benefitsMr,
      },
      applicationProcess: formData.applicationProcess,
      applicationLink: formData.applicationLink,
      contactInfo: formData.contactInfo,
    });

    // Reset form
    setFormData({
      name: {
        en: '',
        mr: '',
      },
      description: {
        en: '',
        mr: '',
      },
      category: 'agriculture',
      eligibility: {
        en: '',
        mr: '',
      },
      benefits: {
        en: '',
        mr: '',
      },
      applicationProcess: {
        en: '',
        mr: '',
      },
      applicationLink: '',
      contactInfo: {
        department: '',
        phone: '',
        email: '',
      },
    });
  };

  const handleBilingualChange = (
    field: 'name' | 'description' | 'eligibility' | 'benefits' | 'applicationProcess',
    lang: 'en' | 'mr',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...((prev[field] as any) || {}),
        [lang]: value,
      },
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  return (
    <form className="scheme-form" onSubmit={handleSubmit}>
      <h2>Add New Government Scheme</h2>

      <div className="language-tabs">
        <button
          type="button"
          className={`tab ${activeTab === 'en' ? 'active' : ''}`}
          onClick={() => setActiveTab('en')}
        >
          English
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'mr' ? 'active' : ''}`}
          onClick={() => setActiveTab('mr')}
        >
          मराठी
        </button>
      </div>

      <div className="form-grid">
        <div className="form-group full">
          <label htmlFor="name">
            Scheme Name ({activeTab === 'en' ? 'English' : 'मराठी'}) *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name[activeTab]}
            onChange={(e) => handleBilingualChange('name', activeTab, e.target.value)}
            required
            placeholder={activeTab === 'en' ? 'Enter scheme name in English' : 'मराठीत योजनेचे नाव टाका'}
          />
        </div>

        <div className="form-group full">
          <label htmlFor="description">
            Description ({activeTab === 'en' ? 'English' : 'मराठी'}) *
          </label>
          <textarea
            id="description"
            value={formData.description[activeTab]}
            onChange={(e) => handleBilingualChange('description', activeTab, e.target.value)}
            required
            placeholder={activeTab === 'en' ? 'Describe the scheme' : 'योजनेचे वर्णन करा'}
            rows={3}
          />
        </div>

        {activeTab === 'en' && (
          <>
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as any,
                  }))
                }
                required
              >
                <option value="agriculture">Agriculture</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="social">Social</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="employment">Employment</option>
              </select>
            </div>

            <div className="form-group full">
              <label htmlFor="applicationLink">Application Link</label>
              <input
                type="url"
                id="applicationLink"
                value={formData.applicationLink}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    applicationLink: e.target.value,
                  }))
                }
                placeholder="https://example.com/apply"
              />
            </div>
          </>
        )}

        <div className="form-group full">
          <label htmlFor="eligibility">
            Eligibility Criteria ({activeTab === 'en' ? 'English' : 'मराठी'}) * (one per line)
          </label>
          <textarea
            id="eligibility"
            value={formData.eligibility[activeTab]}
            onChange={(e) => handleBilingualChange('eligibility', activeTab, e.target.value)}
            required
            placeholder={activeTab === 'en' ? 'Enter eligibility criteria (one per line)' : 'पात्रता मानदंड टाका (प्रत्येक ओळीवर एक)'}
            rows={4}
          />
        </div>

        <div className="form-group full">
          <label htmlFor="benefits">
            Benefits ({activeTab === 'en' ? 'English' : 'मराठी'}) * (one per line)
          </label>
          <textarea
            id="benefits"
            value={formData.benefits[activeTab]}
            onChange={(e) => handleBilingualChange('benefits', activeTab, e.target.value)}
            required
            placeholder={activeTab === 'en' ? 'Enter benefits (one per line)' : 'लाभ टाका (प्रत्येक ओळीवर एक)'}
            rows={4}
          />
        </div>

        <div className="form-group full">
          <label htmlFor="applicationProcess">
            Application Process ({activeTab === 'en' ? 'English' : 'मराठी'}) *
          </label>
          <textarea
            id="applicationProcess"
            value={formData.applicationProcess[activeTab]}
            onChange={(e) => handleBilingualChange('applicationProcess', activeTab, e.target.value)}
            required
            placeholder={activeTab === 'en' ? 'Describe how to apply for this scheme' : 'या योजनेसाठी आवेदन कसे करायचे ते वर्णन करा'}
            rows={3}
          />
        </div>

        {activeTab === 'en' && (
          <>
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <input
                type="text"
                id="department"
                value={formData.contactInfo.department}
                onChange={(e) => handleContactChange('department', e.target.value)}
                required
                placeholder="Department name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Contact Phone *</label>
              <input
                type="tel"
                id="phone"
                value={formData.contactInfo.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                required
                placeholder="Phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Contact Email *</label>
              <input
                type="email"
                id="email"
                value={formData.contactInfo.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                required
                placeholder="Email address"
              />
            </div>
          </>
        )}
      </div>

      <button type="submit" className="btn-submit">
        Add Scheme
      </button>
    </form>
  );
};

export default SchemeForm;
