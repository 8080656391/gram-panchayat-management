import React, { useState } from 'react';
import { Scheme } from '../types';
import SchemeList from '../components/schemes/SchemeList';
import SchemeForm from '../components/schemes/SchemeForm';
import '../styles/pages/GovernmentSchemes.css';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GovernmentSchemes: React.FC = () => {
  const { userRole } = useAuth();
  const canAdd = userRole === 'staff' || userRole === 'admin';

  const [schemes, setSchemes] = useState<Scheme[]>([
    {
      id: '1',
      name: 'Pradhan Mantri Fasal Bima Yojana',
      description: 'Crop insurance scheme to provide financial support to farmers',
      category: 'agriculture',
      eligibility: [
        'Loanee farmers of scheduled banks',
        'Non-loanee farmers',
        'Tenant farmers',
        'Indian citizens only',
      ],
      benefits: [
        'Premium coverage up to 2%',
        'Sum insured based on crop type',
        'Claims settlement within 30 days',
        'Risk coverage up to harvest',
      ],
      applicationProcess: 'Apply through nearest bank or official website',
      lastUpdated: '2024-01-15',
      contactInfo: {
        department: 'Ministry of Agriculture',
        phone: '1800-180-1551',
        email: 'pmfby@nic.in',
      },
    },
    {
      id: '2',
      name: 'Ayushman Bharat Scheme',
      description: 'Health insurance scheme for economically weaker families',
      category: 'health',
      eligibility: [
        'Families in bottom 40% income group',
        'APL card holders in rural areas',
        'Urban population in specific categories',
      ],
      benefits: [
        'Up to ₹5 lakh annual health insurance',
        'Cashless treatment at empaneled hospitals',
        'No registration charges',
        'Pre-existing disease coverage',
      ],
      applicationProcess: 'Registration at nearest ASHA worker or online portal',
      lastUpdated: '2024-01-20',
      contactInfo: {
        department: 'Ministry of Health',
        phone: '14555',
        email: 'support@pmjay.gov.in',
      },
    },
    {
      id: '3',
      name: 'PM-KISAN Scheme',
      description: 'Income support scheme for agricultural families',
      category: 'agriculture',
      eligibility: [
        'Agricultural families with land holdings',
        'Must own cultivable land',
        'Indian citizens',
      ],
      benefits: [
        '₹6000 per annum (₹2000 per quarter)',
        'Direct bank transfer to farmers',
        'No age limit',
      ],
      applicationProcess: 'Register online at pmkisan.gov.in or visit Panchayat office',
      lastUpdated: '2024-01-25',
      contactInfo: {
        department: 'Department of Agriculture',
        phone: '155261',
        email: 'pmkisan-ict@gov.in',
      },
    },
    {
      id: '4',
      name: 'Bhamashah Card Scheme',
      description: 'Social security and welfare scheme for families',
      category: 'social',
      eligibility: [
        'Indian citizens resident in rural areas',
        'BPL and APL families',
        'Landless laborers',
      ],
      benefits: [
        'Free medical treatment',
        'Educational scholarships',
        'Old age pension',
        'Accident insurance',
      ],
      applicationProcess: 'Apply at Gram Panchayat with necessary documents',
      lastUpdated: '2024-02-01',
      contactInfo: {
        department: 'Social Welfare Department',
        phone: '1800-180-6127',
        email: 'bhamashah@raj.nic.in',
      },
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | Scheme['category']>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddScheme = (scheme: Omit<Scheme, 'id'>) => {
    const newScheme: Scheme = {
      ...scheme,
      id: Date.now().toString(),
    };
    setSchemes([...schemes, newScheme]);
    setShowForm(false);
  };

  const filteredSchemes = schemes.filter((scheme) => {
    const categoryMatch = filterCategory === 'all' || scheme.category === filterCategory;
    const searchMatch =
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const categories = [
    'agriculture',
    'health',
    'education',
    'social',
    'infrastructure',
    'employment',
  ] as const;

  return (
    <div className="government-schemes">
      <div className="page-header">
        <div>
          <h1>Government Schemes Information Hub</h1>
          <p>Discover and explore government welfare schemes available for citizens</p>
        </div>
        {canAdd && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={20} />
            <span>{showForm ? 'Cancel' : 'Add Scheme'}</span>
          </button>
        )}
      </div>

      <div className="statistics">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Schemes</h3>
            <p className="stat-value">{schemes.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Categories</h3>
            <p className="stat-value">{new Set(schemes.map((s) => s.category)).size}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💡</div>
          <div className="stat-content">
            <h3>Benefits Available</h3>
            <p className="stat-value">50+</p>
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
        <div className="search-box">
          <input
            type="text"
            placeholder="Search schemes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-section">
          <label>Category:</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCategory('all')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <SchemeList schemes={filteredSchemes} />
    </div>
  );
};

export default GovernmentSchemes;
