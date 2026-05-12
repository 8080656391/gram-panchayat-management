import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { TaxRecord } from '../../types';
import '../../styles/components/TaxList.css';
import { CheckCircle, Clock, AlertCircle, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TaxListProps {
  taxes: TaxRecord[];
  onUpdatePayment: (id: string, amountPaid: number) => void;
}

const TaxList: React.FC<TaxListProps> = ({ taxes, onUpdatePayment }) => {
  const { userRole } = useAuth();
  const canManage = userRole === 'staff' || userRole === 'admin';
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);

  const getStatusIcon = (status: TaxRecord['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={20} className="status-icon paid" />;
      case 'partial':
        return <AlertCircle size={20} className="status-icon partial" />;
      case 'pending':
        return <Clock size={20} className="status-icon pending" />;
    }
  };

  const handleEditClick = (tax: TaxRecord) => {
    setEditingId(tax.id);
    setEditAmount(tax.amountPaid);
  };

  const handleSavePayment = (id: string) => {
    onUpdatePayment(id, editAmount);
    setEditingId(null);
  };

  if (taxes.length === 0) {
    return (
      <div className="empty-state">
        <p>No tax records found</p>
      </div>
    );
  }

  return (
    <div className="tax-list">
      <div className="table-responsive">
        <table className="taxes-table">
          <thead>
            <tr>
              <th>Taxpayer ID</th>
              <th>Taxpayer Name</th>
              <th>Tax Year</th>
              <th>House Tax</th>
              <th>Health Tax</th>
              <th>Water Tax</th>
              <th>Total Amount</th>
              <th>Amount Paid</th>
              <th>Outstanding</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {taxes.map((tax) => {
              const outstanding = Number((tax.taxAmount - tax.amountPaid).toFixed(2));
              const percentageNum = Math.round((tax.amountPaid / tax.taxAmount) * 100);
              const percentage = percentageNum.toString();

              return (
                <tr key={tax.id} className={`status-${tax.status}`}>
                  <td className="tax-id">{tax.taxpayerId}</td>
                  <td>{tax.taxpayerName}</td>
                  <td>{tax.taxYear}</td>
                  <td className="amount">₹{tax.houseTaxAmount.toFixed(2)}</td>
                  <td className="amount">₹{tax.healthTaxAmount.toFixed(2)}</td>
                  <td className="amount">₹{tax.waterTaxAmount.toFixed(2)}</td>
                  <td className="amount">₹{tax.taxAmount.toFixed(2)}</td>
                  <td>
                    <div className="payment-cell">
                      <span>₹{tax.amountPaid.toFixed(2)}</span>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${Math.min(percentageNum, 100)}%` }}></div>
                      </div>
                      <span className="percentage">{percentage}%</span>
                    </div>
                  </td>
                  <td className="amount">₹{outstanding.toFixed(2)}</td>
                  <td>{new Date(tax.dueDate).toLocaleDateString()}</td>
                  <td>
                    <div className="status-cell">
                      {getStatusIcon(tax.status)}
                      <span className={`status-label ${tax.status}`}>{tax.status.toUpperCase()}</span>
                    </div>
                  </td>
                  <td>
                    {canManage ? (
                      editingId === tax.id ? (
                        <div className="edit-payment">
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(Number(e.target.value))}
                            min="0"
                            max={tax.taxAmount}
                            step="1"
                          />
                          <button
                            className="btn-save"
                            onClick={() => handleSavePayment(tax.id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            className="btn-edit"
                            onClick={() => handleEditClick(tax)}
                            title="Update payment"
                          >
                            <Edit2 size={18} />
                          </button>
                          {tax.status === 'paid' && (
                            <button
                              className="btn-receipt"
                              style={{ marginLeft: 8 }}
                              onClick={() => {
                                const doc = new jsPDF();
                                doc.setFontSize(16);
                                doc.text('Gram Panchayat Tax Payment Receipt', 20, 20);
                                doc.setFontSize(12);
                                doc.text('------------------------------------------', 20, 28);
                                doc.text(`Taxpayer ID: ${tax.taxpayerId}`, 20, 38);
                                doc.text(`Taxpayer Name: ${tax.taxpayerName}`, 20, 46);
                                doc.text(`Tax Year: ${tax.taxYear}`, 20, 54);
                                doc.text(`Amount Paid: ₹${tax.amountPaid.toFixed(2)}`, 20, 62);
                                doc.text(`Payment Method: Online`, 20, 70);
                                doc.text(`Date: ${new Date().toLocaleString()}`, 20, 78);
                                doc.text(`Reference ID: REF${tax.id}`, 20, 86);
                                doc.text('------------------------------------------', 20, 94);
                                doc.text('Thank you for your payment!', 20, 104);
                                doc.save(`TaxReceipt_${tax.taxpayerId}_${tax.id}.pdf`);
                              }}
                              title="Download PDF Receipt"
                            >
                              Download Receipt
                            </button>
                          )}
                        </>
                      )
                    ) : userRole === 'citizen' && outstanding > 0 ? (
                      <button
                        className="btn-pay-online"
                        onClick={() => navigate(`/taxes/pay/${tax.id}`)}
                      >
                        Pay Tax Online
                      </button>
                    ) : userRole === 'citizen' && tax.status === 'paid' ? (
                          <span
                            className="download-receipt-link"
                            style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}
                            onClick={() => {
                              const doc = new jsPDF();
                              doc.setFontSize(16);
                              doc.text('Gram Panchayat Tax Payment Receipt', 20, 20, { maxWidth: 170 });
                              doc.setFontSize(12);
                              let y = 32;
                              doc.text('------------------------------------------', 20, y, { maxWidth: 170 }); y += 8;
                              doc.text(`Taxpayer ID: ${tax.taxpayerId}`, 20, y, { maxWidth: 170 }); y += 8;
                              doc.text(`Taxpayer Name: ${tax.taxpayerName}`, 20, y, { maxWidth: 170 }); y += 8;
                              doc.text(`Tax Year: ${tax.taxYear}`, 20, y, { maxWidth: 170 }); y += 8;
                              doc.text(`Amount Paid: Rs. ${tax.amountPaid.toFixed(2)}`, 20, y, { maxWidth: 170 }); y += 8;
                              doc.text(`Payment Method: Online`, 20, y, { maxWidth: 170 }); y += 8;
                              doc.text(`Date: ${new Date().toLocaleString()}`, 20, y, { maxWidth: 170 }); y += 8;
                              doc.text(`Reference ID: REF${tax.id}`, 20, y, { maxWidth: 170 }); y += 8;
                              doc.text('------------------------------------------', 20, y, { maxWidth: 170 }); y += 8;
                              doc.text('Thank you for your payment!', 20, y, { maxWidth: 170 });
                              doc.save(`TaxReceipt_${tax.taxpayerId}_${tax.id}.pdf`);
                            }}
                            title="Download PDF Receipt"
                          >
                            Download Receipt
                          </span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaxList;
