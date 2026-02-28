import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TaxRecord } from '../types';
import '../styles/pages/TaxPayment.css';
import { CreditCard, Smartphone, Building2, CheckCircle, ArrowLeft } from 'lucide-react';

const TaxPayment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock tax record - in a real app, fetch from API
  const mockTaxRecords: Record<string, TaxRecord> = {
    '1': {
      id: '1',
      taxpayerId: 'TP001',
      taxpayerName: 'Sharma Family',
      taxYear: 2024,
      taxAmount: 5000,
      amountPaid: 0,
      status: 'pending',
      dueDate: '2024-03-31',
    },
    '2': {
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
    '3': {
      id: '3',
      taxpayerId: 'TP003',
      taxpayerName: 'Singh Traders',
      taxYear: 2024,
      taxAmount: 8000,
      amountPaid: 0,
      status: 'pending',
      dueDate: '2024-03-31',
    },
    '4': {
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
  };

  const taxRecord = id ? mockTaxRecords[id] : null;
  const outstandingAmount = taxRecord ? taxRecord.taxAmount - taxRecord.amountPaid : 0;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [paymentAmount, setPaymentAmount] = useState<number>(outstandingAmount);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(parseFloat(e.target.value) || 0, outstandingAmount);
    setPaymentAmount(Math.max(value, 0));
  };

  const validatePaymentAmount = () => {
    if (paymentAmount <= 0) {
      alert('Payment amount must be greater than 0');
      return false;
    }
    if (paymentAmount > outstandingAmount) {
      alert(`Payment amount cannot exceed outstanding amount (₹${outstandingAmount})`);
      return false;
    }
    return true;
  };

  const validateForm = () => {
    if (paymentMethod === 'card') {
      if (!formData.cardholderName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        alert('Please fill all card details');
        return false;
      }
      if (formData.cardNumber.length !== 16) {
        alert('Card number must be 16 digits');
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!formData.upiId) {
        alert('Please enter UPI ID');
        return false;
      }
      if (!formData.upiId.includes('@')) {
        alert('Please enter a valid UPI ID (e.g., user@upi)');
        return false;
      }
    } else if (paymentMethod === 'netbanking') {
      if (!formData.bankName || !formData.accountNumber) {
        alert('Please fill all bank details');
        return false;
      }
    }
    return true;
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePaymentAmount() || !validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  const handleBackToTaxes = () => {
    navigate('/taxes');
  };

  if (!taxRecord) {
    return (
      <div className="tax-payment">
        <div className="page-header">
          <div>
            <h1>Online Tax Payment</h1>
            <p>Payment record not found</p>
          </div>
          <button className="btn-primary" onClick={handleBackToTaxes}>
            Back to Records
          </button>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="tax-payment">
        <div className="page-header">
          <div>
            <h1>Online Tax Payment</h1>
            <p>Payment Successful</p>
          </div>
          <button className="btn-primary" onClick={handleBackToTaxes}>
            Back to Records
          </button>
        </div>

        <div className="payment-success">
          <CheckCircle size={80} className="success-icon" />
          <h2>Payment Successful!</h2>
          <p>Your tax payment has been processed successfully.</p>

          <div className="success-details">
            <div className="success-item">
              <span className="label">Taxpayer ID:</span>
              <span className="value">{taxRecord.taxpayerId}</span>
            </div>
            <div className="success-item">
              <span className="label">Amount Paid:</span>
              <span className="value">₹{paymentAmount.toLocaleString()}</span>
            </div>
            <div className="success-item">
              <span className="label">Payment Method:</span>
              <span className="value">
                {paymentMethod === 'card'
                  ? 'Credit/Debit Card'
                  : paymentMethod === 'upi'
                    ? 'UPI'
                    : 'Net Banking'}
              </span>
            </div>
            <div className="success-item">
              <span className="label">Reference ID:</span>
              <span className="value">REF{Date.now()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tax-payment">
      <div className="page-header">
        <div>
          <h1>Online Tax Payment</h1>
          <p>Complete your tax payment securely</p>
        </div>
        <button className="btn-primary" onClick={handleBackToTaxes}>
          <ArrowLeft size={20} />
          Back to Records
        </button>
      </div>

      <div className="payment-container">
        {/* Order Summary */}
        <div className="payment-summary">
          <h2>Order Summary</h2>
          <div className="summary-card">
            <div className="summary-item">
              <span>Taxpayer Name:</span>
              <span className="value">{taxRecord.taxpayerName}</span>
            </div>
            <div className="summary-item">
              <span>Taxpayer ID:</span>
              <span className="value">{taxRecord.taxpayerId}</span>
            </div>
            <div className="summary-item">
              <span>Tax Year:</span>
              <span className="value">{taxRecord.taxYear}</span>
            </div>
            <div className="summary-item">
              <span>Total Tax Amount:</span>
              <span className="value">₹{taxRecord.taxAmount.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span>Already Paid:</span>
              <span className="value">₹{taxRecord.amountPaid.toLocaleString()}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-item outstanding">
              <span>Outstanding Amount:</span>
              <span className="value">₹{outstandingAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="payment-form-section">
          <h2>Payment Details</h2>

          {/* Payment Amount */}
          <div className="form-group">
            <label>Amount to Pay (₹)</label>
            <input
              type="number"
              value={paymentAmount}
              onChange={handlePaymentAmountChange}
              min="0"
              max={outstandingAmount}
              step="0.01"
              className="form-input"
            />
            <small>Max: ₹{outstandingAmount.toLocaleString()}</small>
          </div>

          {/* Payment Method Selection */}
          <div className="payment-methods">
            <h3>Select Payment Method</h3>
            <div className="method-buttons">
              <button
                type="button"
                className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={24} />
                <span>Card</span>
              </button>
              <button
                type="button"
                className={`method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <Smartphone size={24} />
                <span>UPI</span>
              </button>
              <button
                type="button"
                className={`method-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('netbanking')}
              >
                <Building2 size={24} />
                <span>Net Banking</span>
              </button>
            </div>
          </div>

          {/* Payment Method Forms */}
          <form onSubmit={handleSubmitPayment}>
            {paymentMethod === 'card' && (
              <div className="method-form">
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="16"
                    className="form-input"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength="3"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="method-form">
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    placeholder="username@upi"
                    className="form-input"
                  />
                </div>
                <p className="info-text">You will be redirected to your UPI app to complete the payment.</p>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="method-form">
                <div className="form-group">
                  <label>Select Bank</label>
                  <select name="bankName" value={formData.bankName} onChange={handleInputChange} className="form-input">
                    <option value="">-- Select a Bank --</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="Other">Other Bank</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Your account number"
                    className="form-input"
                  />
                </div>
                <p className="info-text">You will be redirected to your bank's website to complete the payment.</p>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="btn-pay" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : `Pay ₹${paymentAmount.toLocaleString()}`}
            </button>
          </form>

          <p className="security-info">🔒 Your payment is secure and encrypted. This is a demo application.</p>
        </div>
      </div>
    </div>
  );
};

export default TaxPayment;
