import mongoose, { Document, Schema } from 'mongoose';

export interface ITaxRecord extends Document {
  taxpayerId: mongoose.Types.ObjectId;
  taxpayerName: string;
  houseTaxAmount: number;
  healthTaxAmount: number;
  waterTaxAmount: number;
  taxAmount: number;
  amountPaid: number;
  status: 'pending' | 'partial' | 'paid';
  taxYear: number;
  dueDate: Date;
  paymentDate?: Date;
  paymentMethod?: 'cash' | 'online' | 'cheque' | 'bank-transfer';
  transactionId?: string;
  remarks?: string;
  collectedBy?: mongoose.Types.ObjectId;
  lastUpdated: Date;
}

const TaxRecordSchema: Schema = new Schema({
  taxpayerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Taxpayer ID is required']
  },
  taxpayerName: {
    type: String,
    required: [true, 'Taxpayer name is required'],
    trim: true,
    maxlength: [100, 'Taxpayer name cannot be more than 100 characters']
  },
  houseTaxAmount: {
    type: Number,
    required: [true, 'House tax amount is required'],
    min: [0, 'House tax amount cannot be negative']
  },
  healthTaxAmount: {
    type: Number,
    required: [true, 'Health tax amount is required'],
    min: [0, 'Health tax amount cannot be negative']
  },
  waterTaxAmount: {
    type: Number,
    required: [true, 'Water tax amount is required'],
    min: [0, 'Water tax amount cannot be negative']
  },
  taxYear: {
    type: Number,
    required: [true, 'Tax year is required'],
    min: [2000, 'Tax year must be 2000 or later'],
    max: [new Date().getFullYear() + 1, 'Tax year cannot be more than 1 year in the future']
  },
  taxAmount: {
    type: Number,
    required: [true, 'Total tax amount is required'],
    min: [0, 'Total tax amount cannot be negative']
  },
  amountPaid: {
    type: Number,
    default: 0,
    min: [0, 'Amount paid cannot be negative'],
    validate: {
      validator: function(value: number) {
        return value <= this.taxAmount;
      },
      message: 'Amount paid cannot exceed tax amount'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'partial', 'paid'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  paymentDate: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value <= new Date();
      },
      message: 'Payment date cannot be in the future'
    }
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online', 'cheque', 'bank-transfer']
  },
  transactionId: {
    type: String,
    trim: true,
    maxlength: [100, 'Transaction ID cannot be more than 100 characters']
  },
  remarks: {
    type: String,
    trim: true,
    maxlength: [500, 'Remarks cannot be more than 500 characters']
  },
  collectedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
TaxRecordSchema.index({ taxpayerId: 1 });
TaxRecordSchema.index({ taxYear: 1 });
TaxRecordSchema.index({ status: 1 });
TaxRecordSchema.index({ dueDate: 1 });
TaxRecordSchema.index({ collectedBy: 1 });

// Virtual for outstanding amount
TaxRecordSchema.virtual('outstandingAmount').get(function() {
  return this.taxAmount - this.amountPaid;
});

// Virtual for payment status based on amounts
TaxRecordSchema.virtual('paymentStatus').get(function() {
  if (this.amountPaid === 0) return 'unpaid';
  if (this.amountPaid < this.taxAmount) return 'partial';
  return 'paid';
});

// Pre-save middleware to update status and lastUpdated
TaxRecordSchema.pre('save', function(next) {
  this.lastUpdated = new Date();

  // Auto-update status based on payment
  if (this.amountPaid === 0) {
    this.status = 'pending';
  } else if (this.amountPaid < this.taxAmount) {
    this.status = 'partial';
  } else {
    this.status = 'paid';
    if (!this.paymentDate) {
      this.paymentDate = new Date();
    }
  }

  next();
});

// Static method to get total tax collection for a year
TaxRecordSchema.statics.getTotalCollection = async function(year: number) {
  const result = await this.aggregate([
    { $match: { taxYear: year } },
    {
      $group: {
        _id: null,
        totalTax: { $sum: '$taxAmount' },
        totalPaid: { $sum: '$amountPaid' },
        totalOutstanding: { $sum: { $subtract: ['$taxAmount', '$amountPaid'] } }
      }
    }
  ]);

  return result[0] || { totalTax: 0, totalPaid: 0, totalOutstanding: 0 };
};

export default mongoose.model<ITaxRecord>('TaxRecord', TaxRecordSchema);