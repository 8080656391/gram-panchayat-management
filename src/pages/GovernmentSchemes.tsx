import React, { useState, useEffect } from 'react';
import { Scheme } from '../types';
import SchemeList from '../components/schemes/SchemeList';
import SchemeForm from '../components/schemes/SchemeForm';
import '../styles/pages/GovernmentSchemes.css';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const GovernmentSchemes: React.FC = () => {
  const { userRole } = useAuth();
  const { language, t } = useLanguage();
  const canAdd = userRole === 'staff' || userRole === 'admin';
  const token = localStorage.getItem('token') || '';

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/schemes', {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        }
      });

      if (!response.ok) throw new Error('Failed to fetch schemes');
      
      const data = await response.json();
      setSchemes(data.data.schemes || []);
      setError('');
    } catch (err) {
      console.error('Error fetching schemes:', err);
      setError('Failed to load schemes');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'health', label: 'Health' },
    { value: 'education', label: 'Education' },
    { value: 'social', label: 'Social' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'employment', label: 'Employment' },
  ];

  const filteredSchemes = selectedCategory
    ? schemes.filter(s => s.category === selectedCategory)
    : schemes;

  const handleAddScheme = async (schemeData: any) => {
    try {
      const response = await fetch('http://localhost:5000/api/schemes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(schemeData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create scheme');
      }

      setShowForm(false);
      await fetchSchemes();
    } catch (err: any) {
      console.error('Error creating scheme:', err);
      setError(err.message || 'Failed to create scheme');
    }
  };

  return (
    <div className="government-schemes">
      <div className="page-header">
        <div>
          <h1>{t('scheme.title')}</h1>
          <p>Discover and explore government welfare schemes available in your language</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
            🌐 Language: {language === 'en' ? 'English' : 'मराठी (Marathi)'}
          </p>
        </div>
        {canAdd && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={20} />
            <span>{showForm ? t('common.cancel') : 'Add Scheme'}</span>
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading schemes...</div>}

      <div className="statistics">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Schemes</h3>
            <p className="stat-value">{filteredSchemes.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div className="stat-content">
            <h3>Housing Schemes</h3>
            <p className="stat-value">{filteredSchemes.filter(s => s.category === 'infrastructure').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌱</div>
          <div className="stat-content">
            <h3>Rural Development</h3>
            <p className="stat-value">{filteredSchemes.filter(s => s.category === 'social').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Recently Updated</h3>
            <p className="stat-value">Today</p>
          </div>
        </div>
      </div>

      {showForm && canAdd && (
        <div className="form-section">
          <SchemeForm onSubmit={handleAddScheme} />
        </div>
      )}

      <div className="search-filter-section">
        <div className="filter-section">
          <label>Filter by Category:</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!loading && filteredSchemes.length > 0 && (
        <SchemeList schemes={filteredSchemes} language={language} />
      )}

      {!loading && filteredSchemes.length === 0 && (
        <div className="no-data-message">
          <p>No schemes found in this category. Select a different category or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default GovernmentSchemes;
