import React, { useState, useEffect } from 'react';
import { TaxRecord } from '../../types';
import '../../styles/components/TaxForm.css';

interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  village: string;
}

interface TaxFormProps {
  onSubmit: (tax: Omit<TaxRecord, 'id'>) => void;
}

const API_BASE_URL = 'http://localhost:5000/api';

const TaxForm: React.FC<TaxFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    taxpayerId: '',
    taxpayerName: '',
    houseTaxAmount: 0,
    healthTaxAmount: 0,
    waterTaxAmount: 0,
    taxAmount: 0,
    amountPaid: 0,
    status: 'pending' as const,
    taxYear: new Date().getFullYear(),
    dueDate: new Date().toISOString().split('T')[0],
  });

  const [userSearch, setUserSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Search for users when search term changes
  useEffect(() => {
    if (userSearch.length > 2) {
      searchUsers();
    } else {
      setUsers([]);
      setShowUserDropdown(false);
    }
  }, [userSearch]);

  const searchUsers = async () => {
    try {
      setSearchError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/users?search=${encodeURIComponent(userSearch)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users || []);
        setShowUserDropdown(true);
      }
    } catch (err: any) {
      setSearchError(err.message);
    }
  };

  const selectUser = (user: User) => {
    setFormData((prev) => ({
      ...prev,
      taxpayerId: user._id || user.id || '',
      taxpayerName: user.name
    }));
    setUserSearch('');
    setShowUserDropdown(false);
    setUsers([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.taxpayerId) {
      setSearchError('Please select a taxpayer');
      return;
    }

    onSubmit(formData);
    setFormData({
      taxpayerId: '',
      taxpayerName: '',
      houseTaxAmount: 0,
      healthTaxAmount: 0,
      waterTaxAmount: 0,
      taxAmount: 0,
      amountPaid: 0,
      status: 'pending',
      taxYear: new Date().getFullYear(),
      dueDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const fieldValue = name.includes('Amount') || name === 'taxYear' ? Number(value) : value;
      const nextForm = {
        ...prev,
        [name]: fieldValue,
      };

      if (
        name === 'houseTaxAmount' ||
        name === 'healthTaxAmount' ||
        name === 'waterTaxAmount'
      ) {
        nextForm.taxAmount =
          Number(nextForm.houseTaxAmount) +
          Number(nextForm.healthTaxAmount) +
          Number(nextForm.waterTaxAmount);
      }

      return nextForm;
    });
  };

  return (
    <form className="tax-form" onSubmit={handleSubmit}>
      <h2>New Tax Record</h2>
      
      {searchError && (
        <div style={{ 
          backgroundColor: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {searchError}
        </div>
      )}

      <div className="form-grid">
        {/* User Search Section */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="userSearch">Search Taxpayer *</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              id="userSearch"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Type citizen name, email, or phone (min 3 characters)"
              autoComplete="off"
            />
            {showUserDropdown && users.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 10
              }}>
                {users.map((user) => (
                  <div
                    key={user._id || user.id}
                    onClick={() => selectUser(user)}
                    style={{
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                      backgroundColor: '#f9f9f9'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                  >
                    <div><strong>{user.name}</strong></div>
                    <div style={{ fontSize: '0.85em', color: '#666' }}>
                      {user.email} • {user.phone} • {user.village}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {showUserDropdown && users.length === 0 && userSearch.length > 2 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '10px',
                color: '#999'
              }}>
                No users found
              </div>
            )}
          </div>
        </div>

        {/* Selected Taxpayer Display */}
        {formData.taxpayerId && (
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <div style={{
              backgroundColor: '#e8f5e9',
              padding: '10px',
              borderRadius: '4px',
              color: '#2e7d32'
            }}>
              ✓ Selected: <strong>{formData.taxpayerName}</strong> (ID: {formData.taxpayerId})
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="houseTaxAmount">House Tax Amount (₹)</label>
          <input
            type="number"
            id="houseTaxAmount"
            name="houseTaxAmount"
            value={formData.houseTaxAmount}
            onChange={handleChange}
            required
            min="0"
            step="1"
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="healthTaxAmount">Health Tax Amount (₹)</label>
          <input
            type="number"
            id="healthTaxAmount"
            name="healthTaxAmount"
            value={formData.healthTaxAmount}
            onChange={handleChange}
            required
            min="0"
            step="1"
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="waterTaxAmount">Water Tax Amount (₹)</label>
          <input
            type="number"
            id="waterTaxAmount"
            name="waterTaxAmount"
            value={formData.waterTaxAmount}
            onChange={handleChange}
            required
            min="0"
            step="1"
            placeholder="0"
          />
        </div>

        <div className="form-group total-field">
          <label htmlFor="totalTaxAmount">Total Tax Amount (₹)</label>
          <input
            type="number"
            id="totalTaxAmount"
            name="totalTaxAmount"
            value={formData.taxAmount}
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="taxYear">Tax Year *</label>
          <input
            type="number"
            id="taxYear"
            name="taxYear"
            value={formData.taxYear}
            onChange={handleChange}
            required
            min="2000"
            max="2100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amountPaid">Amount Paid (₹)</label>
          <input
            type="number"
            id="amountPaid"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
            min="0"
            step="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date *</label>
          <input 
            type="date" 
            id="dueDate" 
            name="dueDate" 
            value={formData.dueDate} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>

      <button type="submit" className="btn-submit">
        Create Tax Record
      </button>
    </form>
  );
};

export default TaxForm;
