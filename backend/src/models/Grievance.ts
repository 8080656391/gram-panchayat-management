import mongoose, { Document, Schema } from 'mongoose';

export interface IGrievance extends Document {
  complainantId: mongoose.Types.ObjectId;
  complainantName: string;
  email: string;
  phone: string;
  category: 'roads' | 'water' | 'electricity' | 'sanitation' | 'health' | 'education' | 'other';
  description: string;
  location: string;
  filedDate: Date;
  status: 'registered' | 'under-review' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
  assignedTo?: mongoose.Types.ObjectId;
  assignedDate?: Date;
  resolution?: string;
  resolutionDate?: Date;
  closedBy?: mongoose.Types.ObjectId;
  closedDate?: Date;
  feedback?: string;
  feedbackRating?: number;
}

const GrievanceSchema: Schema = new Schema({
  complainantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Complainant ID is required']
  },
  complainantName: {
    type: String,
    required: [true, 'Complainant name is required'],
    trim: true,
    maxlength: [100, 'Complainant name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
  },
  category: {
    type: String,
    enum: ['roads', 'water', 'electricity', 'sanitation', 'health', 'education', 'other'],
    required: [true, 'Category is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  filedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['registered', 'under-review', 'in-progress', 'resolved'],
    default: 'registered'
  },
  // Approval workflow fields
  staffApproval: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  staffApprovedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  staffApprovalDate: {
    type: Date
  },
  staffRemarks: {
    type: String,
    trim: true,
    maxlength: [500, 'Staff remarks cannot be more than 500 characters']
  },
  adminApproval: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminApprovedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  adminApprovalDate: {
    type: Date
  },
  adminRemarks: {
    type: String,
    trim: true,
    maxlength: [500, 'Admin remarks cannot be more than 500 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  attachments: [{
    type: String,
    trim: true
  }],
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedDate: {
    type: Date
  },
  resolution: {
    type: String,
    trim: true,
    maxlength: [2000, 'Resolution cannot be more than 2000 characters']
  },
  resolutionDate: {
    type: Date
  },
  closedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  closedDate: {
    type: Date
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: [500, 'Feedback cannot be more than 500 characters']
  },
  feedbackRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
GrievanceSchema.index({ complainantId: 1 });
GrievanceSchema.index({ status: 1 });
GrievanceSchema.index({ category: 1 });
GrievanceSchema.index({ priority: 1 });
GrievanceSchema.index({ filedDate: -1 });
GrievanceSchema.index({ assignedTo: 1 });

// Virtual for days since filed
GrievanceSchema.virtual('daysSinceFiled').get(function() {
  const now = new Date();
  const filed = new Date(this.filedDate);
  const diffTime = Math.abs(now.getTime() - filed.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for days to resolution
GrievanceSchema.virtual('daysToResolution').get(function() {
  if (!this.resolutionDate) return null;
  const filed = new Date(this.filedDate);
  const resolved = new Date(this.resolutionDate);
  const diffTime = Math.abs(resolved.getTime() - filed.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

export default mongoose.model<IGrievance>('Grievance', GrievanceSchema);