import React, { useState } from 'react';
import { Scheme } from '../../types';
import '../../styles/components/SchemeList.css';
import { ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SchemeListProps {
  schemes: Scheme[];
  language?: 'en' | 'mr';
}

const SchemeList: React.FC<SchemeListProps> = ({ schemes, language: overrideLanguage }) => {
  const { language: contextLanguage, t } = useLanguage();
  const language = overrideLanguage || contextLanguage;
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
      {schemes.map((scheme) => {
        const schemeId = scheme._id || scheme.id || Math.random().toString();
        const schemeName = typeof scheme.name === 'string' ? scheme.name : scheme.name[language];
        const schemeDesc = typeof scheme.description === 'string' ? scheme.description : scheme.description[language];
        const eligibility = Array.isArray(scheme.eligibility)
          ? scheme.eligibility
          : scheme.eligibility[language];
        const benefits = Array.isArray(scheme.benefits)
          ? scheme.benefits
          : scheme.benefits[language];
        const appProcess = typeof scheme.applicationProcess === 'string'
          ? scheme.applicationProcess
          : scheme.applicationProcess[language];

        return (
          <div key={schemeId} className="scheme-card">
            <div className="card-header" onClick={() => setExpandedId(expandedId === schemeId ? null : schemeId)}>
              <div className="header-left">
                <div className="category-icon" style={{ backgroundColor: getCategoryColor(scheme.category) }}>
                  {getCategoryIcon(scheme.category)}
                </div>
                <div className="header-content">
                  <h3>{schemeName}</h3>
                  <p className="scheme-description">{schemeDesc}</p>
                </div>
              </div>
              <button className="expand-btn">
                {expandedId === schemeId ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>

            {expandedId === schemeId && (
              <div className="card-body">
                <div className="detail-section">
                  <h4>{language === 'en' ? 'Eligibility Criteria' : 'पात्रता मानदंड'}</h4>
                  <ul className="criteria-list">
                    {eligibility?.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h4>{language === 'en' ? 'Benefits' : 'लाभ'}</h4>
                  <ul className="benefits-list">
                    {benefits?.map((benefit: string, idx: number) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h4>{language === 'en' ? 'How to Apply' : 'आवेदन कैसे करें'}</h4>
                  <p className="application-process">{appProcess}</p>
                </div>

                <div className="contact-section">
                  <h4>{language === 'en' ? 'Contact Information' : 'संपर्क जानकारी'}</h4>
                  <div className="contact-grid">
                    <div className="contact-item">
                      <label>{language === 'en' ? 'Department' : 'विभाग'}</label>
                      <p>{scheme.contactInfo.department}</p>
                    </div>
                    <div className="contact-item">
                      <label>
                        <Phone size={16} /> {language === 'en' ? 'Phone' : 'फोन'}
                      </label>
                      <p>
                        <a href={`tel:${scheme.contactInfo.phone}`}>{scheme.contactInfo.phone}</a>
                      </p>
                    </div>
                    <div className="contact-item">
                      <label>
                        <Mail size={16} /> {language === 'en' ? 'Email' : 'ईमेल'}
                      </label>
                      <p>
                        <a href={`mailto:${scheme.contactInfo.email}`}>{scheme.contactInfo.email}</a>
                      </p>
                    </div>
                    <div className="contact-item">
                      <label>{language === 'en' ? 'Last Updated' : 'अंतिम अपडेट'}</label>
                      <p>{new Date(scheme.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="apply-section">
                  {scheme.applicationLink?.trim() ? (
                    <a
                      href={scheme.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apply-button"
                    >
                      {t('scheme.apply')}
                    </a>
                  ) : scheme.contactInfo.email ? (
                    <a href={`mailto:${scheme.contactInfo.email}`} className="apply-button">
                      {t('scheme.apply')} via Email
                    </a>
                  ) : scheme.contactInfo.phone ? (
                    <a href={`tel:${scheme.contactInfo.phone}`} className="apply-button">
                      {t('scheme.apply')} via Phone
                    </a>
                  ) : (
                    <div className="apply-note">
                      {language === 'en'
                        ? 'Contact the department to apply.'
                        : 'अर्ज करण्यासाठी विभागाशी संपर्क करा.'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SchemeList;
