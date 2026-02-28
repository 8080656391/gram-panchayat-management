import React, { useState } from 'react';
import { TaxRecord } from '../types';
import TaxList from '../components/taxes/TaxList';
import TaxForm from '../components/taxes/TaxForm';
import '../styles/pages/TaxCollection.css';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TaxCollection: React.FC = () => {
  const { userRole } = useAuth();
  const canManage = userRole === 'staff' || userRole === 'admin';

  const [taxes, setTaxes] = useState<TaxRecord[]>([
    {
      id: '1',
      taxpayerId: 'TP001',
      taxpayerName: 'Sharma Family',
      taxYear: 2024,
      taxAmount: 5000,
      amountPaid: 5000,
      status: 'paid',
      dueDate: '2024-03-31',
      paymentDate: '2024-03-15',
    },
    {
      id: '2',
      taxpayerId: 'TP002',
      taxpayerName: 'Patel Enterprises',
      taxYear: 2024,
      taxAmount: 15000,
      amountPaid: 7500,
      status: 'partial',
      dueDate: '2024-03-31',
      paymentDate: '2024-03-10',
    },
    {
      id: '3',
      taxpayerId: 'TP003',
      taxpayerName: 'Singh Traders',
      taxYear: 2024,
      taxAmount: 8000,
      amountPaid: 0,
      status: 'pending',
      dueDate: '2024-03-31',
    },
    {
      id: '4',
      taxpayerId: 'TP004',
      taxpayerName: 'Gupta Farm',
      taxYear: 2024,
      taxAmount: 3000,
      amountPaid: 3000,
      status: 'paid',
      dueDate: '2024-03-31',
      paymentDate: '2024-02-20',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'partial' | 'paid'>('all');

  const handleAddTax = (tax: Omit<TaxRecord, 'id'>) => {
    const newTax: TaxRecord = {
      ...tax,
      id: Date.now().toString(),
    };
    setTaxes([...taxes, newTax]);
    setShowForm(false);
  };

  const handleUpdatePayment = (id: string, amountPaid: number) => {
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
          <h1>Tax Collection</h1>
          <p>Track and manage tax collection from citizens and businesses</p>
        </div>
        {canManage && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={20} />
            <span>{showForm ? 'Cancel' : 'New Tax Record'}</span>
          </button>
        )}
      </div>

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
    </div>
  );
};

export default TaxCollection;
