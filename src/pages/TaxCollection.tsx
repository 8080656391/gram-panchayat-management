import React, { useState, useEffect } from 'react';
import { TaxRecord } from '../types';
import TaxList from '../components/taxes/TaxList';
import TaxForm from '../components/taxes/TaxForm';
import '../styles/pages/TaxCollection.css';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const API_BASE_URL = 'http://localhost:5000/api';

const TaxCollection: React.FC = () => {
  const { userRole } = useAuth();
  const { t } = useLanguage();
  const canManage = userRole === 'staff' || userRole === 'admin';

  const [taxes, setTaxes] = useState<TaxRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'partial' | 'paid'>('all');

  // Fetch tax records on component mount
  useEffect(() => {
    fetchTaxRecords();
  }, []);

  const fetchTaxRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let endpoint = canManage ? '/taxes' : '/taxes/my-records';
      // For admin/staff, fetch all records (no pagination)
      if (canManage) {
        endpoint = '/taxes?limit=all';
      }
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tax records');
      }

      const data = await response.json();
      // Transform backend data to match frontend interface
      const transformedTaxes = data.data.taxRecords
        .filter((tax: any) => tax.taxpayerId) // Only include records with valid taxpayerId
        .map((tax: any) => ({
          id: tax._id,
          taxpayerId: tax.taxpayerId?._id || tax.taxpayerId,
          taxpayerName: tax.taxpayerName,
          houseTaxAmount: tax.houseTaxAmount,
          healthTaxAmount: tax.healthTaxAmount,
          waterTaxAmount: tax.waterTaxAmount,
          taxAmount: tax.taxAmount,
          amountPaid: tax.amountPaid,
          status: tax.status,
          taxYear: tax.taxYear,
          dueDate: tax.dueDate.split('T')[0], // Convert to YYYY-MM-DD format
          paymentDate: tax.paymentDate ? tax.paymentDate.split('T')[0] : undefined
        }));
      setTaxes(transformedTaxes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTax = async (tax: Omit<TaxRecord, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/taxes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taxpayerId: tax.taxpayerId,
          houseTaxAmount: tax.houseTaxAmount,
          healthTaxAmount: tax.healthTaxAmount,
          waterTaxAmount: tax.waterTaxAmount,
          taxYear: tax.taxYear,
          amountPaid: tax.amountPaid,
          dueDate: tax.dueDate
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create tax record');
      }

      // Refresh tax records after successful creation
      setShowForm(false);
      fetchTaxRecords();
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdatePayment = async (id: string, amountPaid: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/taxes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amountPaid,
          paymentDate: amountPaid > 0 ? new Date().toISOString() : undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update payment');
      }

      // Update local state
      setTaxes(
        taxes.map((tax) => {
          if (tax.id === id) {
            const newStatus: TaxRecord['status'] =
              amountPaid === 0 ? 'pending' : amountPaid >= tax.taxAmount ? 'paid' : 'partial';
            return {
              ...tax,
              amountPaid,
              status: newStatus,
              paymentDate: amountPaid > 0 ? new Date().toISOString().split('T')[0] : undefined,
            };
          }
          return tax;
        })
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredTaxes =
    filterStatus === 'all' ? taxes : taxes.filter((tax) => tax.status === filterStatus);

  const totalTaxAmount = taxes.reduce((sum, tax) => sum + tax.taxAmount, 0);
  const totalCollected = taxes.reduce((sum, tax) => sum + tax.amountPaid, 0);
  const collectionPercentage = ((totalCollected / totalTaxAmount) * 100).toFixed(2);

  return (
    <div className="tax-collection">
      <div className="page-header">
        <div>
          <h1>{t('tax.title')}</h1>
          <p>Track and manage tax collection from citizens and businesses</p>
        </div>
        {canManage && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={20} />
            <span>{showForm ? t('common.cancel') : 'New Tax Record'}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="error-message" style={{ 
          backgroundColor: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '10px' }}>×</button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading tax records...</p>
        </div>
      ) : (
        <>
          <div className="statistics">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Tax Amount</h3>
                <p className="stat-value">₹{totalTaxAmount.toLocaleString()}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✓</div>
              <div className="stat-content">
                <h3>Amount Collected</h3>
                <p className="stat-value">₹{totalCollected.toLocaleString()}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Collection Rate</h3>
                <p className="stat-value">{collectionPercentage}%</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>Outstanding</h3>
                <p className="stat-value">₹{(totalTaxAmount - totalCollected).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {showForm && canManage && (
            <div className="form-section">
              <TaxForm onSubmit={handleAddTax} />
            </div>
          )}

          <div className="filter-section">
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All ({taxes.length})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                onClick={() => setFilterStatus('pending')}
              >
                Pending ({taxes.filter((t) => t.status === 'pending').length})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'partial' ? 'active' : ''}`}
                onClick={() => setFilterStatus('partial')}
              >
                Partial ({taxes.filter((t) => t.status === 'partial').length})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'paid' ? 'active' : ''}`}
                onClick={() => setFilterStatus('paid')}
              >
                Paid ({taxes.filter((t) => t.status === 'paid').length})
              </button>
            </div>
          </div>

          <TaxList taxes={filteredTaxes} onUpdatePayment={handleUpdatePayment} />
        </>
      )}
    </div>
  );
};

export default TaxCollection;
