import React, { useState } from 'react';
import { Scheme } from '../../types';
import '../../styles/components/SchemeList.css';
import { ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react';

interface SchemeListProps {
  schemes: Scheme[];
}

const SchemeList: React.FC<SchemeListProps> = ({ schemes }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getCategoryColor = (category: Scheme['category']) => {
    const colors: Record<Scheme['category'], string> = {
      agriculture: '#10b981',
      health: '#ef4444',
      education: '#3b82f6',
      social: '#f59e0b',
      infrastructure: '#8b5cf6',
      employment: '#06b6d4',
    };
    return colors[category];
  };

  const getCategoryIcon = (category: Scheme['category']) => {
    const icons: Record<Scheme['category'], string> = {
      agriculture: '🌾',
      health: '⚕️',
      education: '📚',
      social: '👥',
      infrastructure: '🏗️',
      employment: '💼',
    };
    return icons[category];
  };

  if (schemes.length === 0) {
    return (
      <div className="empty-state">
        <p>No schemes found</p>
      </div>
    );
  }

  return (
    <div className="scheme-list">
      {schemes.map((scheme) => (
        <div key={scheme.id} className="scheme-card">
          <div className="card-header" onClick={() => setExpandedId(expandedId === scheme.id ? null : scheme.id)}>
            <div className="header-left">
              <div className="category-icon" style={{ backgroundColor: getCategoryColor(scheme.category) }}>
                {getCategoryIcon(scheme.category)}
              </div>
              <div className="header-content">
                <h3>{scheme.name}</h3>
                <p className="scheme-description">{scheme.description}</p>
              </div>
            </div>
            <button className="expand-btn">
              {expandedId === scheme.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>

          {expandedId === scheme.id && (
            <div className="card-body">
              <div className="detail-section">
                <h4>Eligibility Criteria</h4>
                <ul className="criteria-list">
                  {scheme.eligibility.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h4>Benefits</h4>
                <ul className="benefits-list">
                  {scheme.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h4>How to Apply</h4>
                <p className="application-process">{scheme.applicationProcess}</p>
              </div>

              <div className="contact-section">
                <h4>Contact Information</h4>
                <div className="contact-grid">
                  <div className="contact-item">
                    <label>Department</label>
                    <p>{scheme.contactInfo.department}</p>
                  </div>
                  <div className="contact-item">
                    <label>
                      <Phone size={16} /> Phone
                    </label>
                    <p>
                      <a href={`tel:${scheme.contactInfo.phone}`}>{scheme.contactInfo.phone}</a>
                    </p>
                  </div>
                  <div className="contact-item">
                    <label>
                      <Mail size={16} /> Email
                    </label>
                    <p>
                      <a href={`mailto:${scheme.contactInfo.email}`}>{scheme.contactInfo.email}</a>
                    </p>
                  </div>
                  <div className="contact-item">
                    <label>Last Updated</label>
                    <p>{new Date(scheme.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SchemeList;
