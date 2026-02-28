import React, { useState } from 'react';
import { TaxRecord } from '../../types';
import '../../styles/components/TaxForm.css';

interface TaxFormProps {
  onSubmit: (tax: Omit<TaxRecord, 'id'>) => void;
}

const TaxForm: React.FC<TaxFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    taxpayerId: '',
    taxpayerName: '',
    taxYear: new Date().getFullYear(),
    taxAmount: 0,
    amountPaid: 0,
    status: 'pending' as const,
    dueDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      taxpayerId: '',
      taxpayerName: '',
      taxYear: new Date().getFullYear(),
      taxAmount: 0,
      amountPaid: 0,
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('Amount') || name === 'taxYear' ? Number(value) : value,
    }));
  };

  return (
    <form className="tax-form" onSubmit={handleSubmit}>
      <h2>New Tax Record</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="taxpayerId">Taxpayer ID *</label>
          <input
            type="text"
            id="taxpayerId"
            name="taxpayerId"
            value={formData.taxpayerId}
            onChange={handleChange}
            required
            placeholder="e.g., TP001"
          />
        </div>

        <div className="form-group">
          <label htmlFor="taxpayerName">Taxpayer Name *</label>
          <input
            type="text"
            id="taxpayerName"
            name="taxpayerName"
            value={formData.taxpayerName}
            onChange={handleChange}
            required
            placeholder="Enter taxpayer name"
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
          <label htmlFor="taxAmount">Tax Amount (₹) *</label>
          <input
            type="number"
            id="taxAmount"
            name="taxAmount"
            value={formData.taxAmount}
            onChange={handleChange}
            required
            min="0"
            step="100"
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
            step="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date *</label>
          <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
        </div>
      </div>

      <button type="submit" className="btn-submit">
        Create Tax Record
      </button>
    </form>
  );
};

export default TaxForm;
