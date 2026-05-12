import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { useParams, useNavigate } from 'react-router-dom';
import { TaxRecord } from '../types';
import '../styles/pages/TaxPayment.css';
import { CreditCard, Smartphone, Building2, CheckCircle, ArrowLeft } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const TaxPayment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [taxRecord, setTaxRecord] = useState<TaxRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [lastPaidAmount, setLastPaidAmount] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: '',
    accountNumber: ''
  });
  const [upiValidationMessage, setUpiValidationMessage] = useState<string>('');
  const [upiIsValid, setUpiIsValid] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('Tax ID is missing');
      return;
    }
    fetchTaxRecord();
  }, [id]);

  useEffect(() => {
    if (taxRecord) {
      setPaymentAmount(taxRecord.taxAmount - taxRecord.amountPaid);
    }
  }, [taxRecord]);

  const fetchTaxRecord = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/taxes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || 'Failed to load tax record');
      }

      const data = await response.json();
      const tax = data.data.taxRecord;

      setTaxRecord({
        id: tax._id,
        taxpayerId: tax.taxpayerId._id || tax.taxpayerId,
        taxpayerName: tax.taxpayerName,
        houseTaxAmount: tax.houseTaxAmount,
        healthTaxAmount: tax.healthTaxAmount,
        waterTaxAmount: tax.waterTaxAmount,
        taxAmount: tax.taxAmount,
        amountPaid: tax.amountPaid,
        status: tax.status,
        taxYear: tax.taxYear,
        dueDate: tax.dueDate ? tax.dueDate.split('T')[0] : '',
        paymentDate: tax.paymentDate ? tax.paymentDate.split('T')[0] : undefined
      });
    } catch (err: any) {
      setError(err.message || 'Unable to load tax details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!taxRecord) return;
    const outstandingAmount = taxRecord.taxAmount - taxRecord.amountPaid;
    const value = Math.min(parseFloat(e.target.value) || 0, outstandingAmount);
    setPaymentAmount(Math.max(value, 0));
  };

  const validatePaymentAmount = () => {
    if (!taxRecord) return false;
    const outstandingAmount = taxRecord.taxAmount - taxRecord.amountPaid;
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

  const validateUPIId = (upiId: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]{3,}$/;
    return regex.test(upiId.trim());
  };

  const validateForm = () => {
    if (paymentMethod === 'card') {
      if (!formData.cardholderName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        alert('Please fill all card details');
        return false;
      }
      if (formData.cardNumber.replace(/\s+/g, '').length !== 16) {
        alert('Card number must be 16 digits');
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!formData.upiId) {
        alert('Please enter UPI ID');
        return false;
      }
      if (!validateUPIId(formData.upiId)) {
        alert('Please enter a valid UPI ID (e.g., user@upi)');
        return false;
      }
      if (!upiIsValid) {
        alert('Please validate your UPI ID before submitting the payment.');
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

    if (!taxRecord || !validatePaymentAmount() || !validateForm()) {
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      const token = localStorage.getItem('token');
      const paidNow = paymentAmount;
      const requestBody = {
        amountPaid: paidNow,
        paymentMethod: paymentMethod === 'card' ? 'online' : paymentMethod === 'upi' ? 'online' : 'bank-transfer',
        transactionId: `TXN${Date.now()}`
      };
      const response = await fetch(`${API_BASE_URL}/taxes/${id}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || 'Payment failed');
      }
      const result = await response.json();
      const updated = result.data.taxRecord;
      setTaxRecord({
        id: updated._id,
        taxpayerId: updated.taxpayerId._id || updated.taxpayerId,
        taxpayerName: updated.taxpayerName,
        houseTaxAmount: updated.houseTaxAmount,
        healthTaxAmount: updated.healthTaxAmount,
        waterTaxAmount: updated.waterTaxAmount,
        taxAmount: updated.taxAmount,
        amountPaid: updated.amountPaid,
        status: updated.status,
        taxYear: updated.taxYear,
        dueDate: updated.dueDate ? updated.dueDate.split('T')[0] : '',
        paymentDate: updated.paymentDate ? updated.paymentDate.split('T')[0] : undefined
      });
      setLastPaidAmount(paidNow);
      setPaymentSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToTaxes = () => {
    navigate('/taxes');
  };

  if (loading) {
    return (
      <div className="tax-payment">
        <div className="page-header">
          <div>
            <h1>Online Tax Payment</h1>
            <p>Loading tax details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tax-payment">
        <div className="page-header">
          <div>
            <h1>Online Tax Payment</h1>
            <p>{error}</p>
          </div>
          <button className="btn-primary" onClick={handleBackToTaxes}>
            Back to Records
          </button>
        </div>
      </div>
    );
  }

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
    // PDF receipt download handler
    const handleDownloadPDFReceipt = () => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Gram Panchayat Tax Payment Receipt', 20, 20);
      doc.setFontSize(12);
      doc.text('------------------------------------------', 20, 28);
      doc.text(`Taxpayer ID: ${taxRecord.taxpayerId}`, 20, 38);
      doc.text(`Taxpayer Name: ${taxRecord.taxpayerName}`, 20, 46);
      doc.text(`Tax Year: ${taxRecord.taxYear}`, 20, 54);
      doc.text(`Amount Paid: ₹${lastPaidAmount !== null ? lastPaidAmount.toFixed(2) : paymentAmount.toFixed(2)}`, 20, 62);
      doc.text(`Payment Method: ${paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI' : 'Net Banking'}`, 20, 70);
      doc.text(`Date: ${new Date().toLocaleString()}`, 20, 78);
      doc.text(`Reference ID: REF${Date.now()}`, 20, 86);
      doc.text('------------------------------------------', 20, 94);
      doc.text('Thank you for your payment!', 20, 104);
      doc.save(`TaxReceipt_${taxRecord.taxpayerId}_${Date.now()}.pdf`);
    };
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
              <span className="value">₹{(lastPaidAmount !== null ? lastPaidAmount : paymentAmount).toLocaleString()}</span>
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
          <button className="btn-primary" style={{ marginTop: 24 }} onClick={handleDownloadPDFReceipt}>
            Download PDF Receipt
          </button>
        </div>
      </div>
    );
  }

  const outstandingAmount = taxRecord.taxAmount - taxRecord.amountPaid;

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
              <span>House Tax:</span>
              <span className="value">₹{taxRecord.houseTaxAmount.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span>Health Tax:</span>
              <span className="value">₹{taxRecord.healthTaxAmount.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span>Water Tax:</span>
              <span className="value">₹{taxRecord.waterTaxAmount.toLocaleString()}</span>
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
                    maxLength={16}
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
                      maxLength={5}
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
                      maxLength={3}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="method-form">
                <div className="form-group upi-validation-group">
                  <label>UPI ID</label>
                  <div className="upi-input-row">
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={(e) => {
                        handleInputChange(e);
                        setUpiIsValid(false);
                        setUpiValidationMessage('');
                      }}
                      placeholder="username@upi"
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="btn-secondary validate-upi-btn"
                      onClick={() => {
                        const isValid = validateUPIId(formData.upiId);
                        setUpiIsValid(isValid);
                        setUpiValidationMessage(
                          isValid ? 'UPI ID is valid! Redirecting to payment...' : 'Please enter a valid UPI ID format.'
                        );
                        if (isValid) {
                          setTimeout(() => {
                            // Redirect to UPI payment URL (intent)
                            const upiUrl = `upi://pay?pa=${encodeURIComponent(formData.upiId)}&pn=${encodeURIComponent(taxRecord?.taxpayerName || 'Taxpayer')}&am=${paymentAmount.toFixed(2)}&cu=INR&tn=Gram Panchayat Tax Payment`;
                            window.location.href = upiUrl;
                          }, 1200);
                        }
                      }}
                    >
                      Validate UPI ID
                    </button>
                  </div>
                </div>
                {upiValidationMessage && (
                  <p
                    className={`info-text ${upiIsValid ? 'success-text' : 'error-text'}`}
                    style={upiIsValid ? { color: 'green', fontWeight: 500 } : {}}
                  >
                    {upiValidationMessage}
                  </p>
                )}
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
