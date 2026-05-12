import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificateDocument {
  type: 'aadhaar' | 'ration-card' | 'photo';
  fileName: string;
  filePath: string;
  uploadDate: Date;
  fileSize: number;
  mimeType: string;
  status?: 'pending' | 'approved' | 'rejected'; // For partial approval
  rejectionReason?: string; // Reason if document is rejected
}

export interface ICertificate extends Document {
  applicantId: mongoose.Types.ObjectId;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantAge: number;
  certificateType: 'birth' | 'death' | 'residence' | 'marriage';
  applicationDate: Date;
  issuanceDate?: Date;
  status: 'pending' | 'under-review' | 'admin-review' | 'approved' | 'rejected';
  certificateNumber?: string;
  documents: ICertificateDocument[];
  language?: 'en' | 'mr';
  reviewedBy?: mongoose.Types.ObjectId; // Staff member who reviewed
  reviewDate?: Date;
  staffRemarks?: string; // Remarks from staff review
  approvedBy?: mongoose.Types.ObjectId; // Admin who approved
  approvalDate?: Date;
  adminRemarks?: string; // Remarks from admin approval
  rejectionReason?: string;
  downloadUrl?: string;
  remarks?: string;
  partialApproved?: boolean;

  // Marriage certificate extended fields
  bridegroomName?: string;
  brideName?: string;
  bridegroomFatherName?: string;
  brideFatherName?: string;
  bridegroomAddress?: string;
  brideAddress?: string;
  bridegroomAge?: number;
  brideAge?: number;
}

const CertificateDocumentSchema = new Schema({
  type: {
    type: String,
    enum: ['aadhaar', 'ration-card', 'photo'],
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [300, 'Rejection reason cannot be more than 300 characters']
  }
}, { _id: false });

const CertificateSchema: Schema = new Schema({
      marriageDate: {
        type: Date
      },
      marriagePlace: {
        type: String,
        trim: true,
        maxlength: [200, 'Marriage place cannot be more than 200 characters']
      },
    gender: {
      type: String,
      trim: true,
      maxlength: [20, 'Gender cannot be more than 20 characters']
    },
    fatherName: {
      type: String,
      trim: true,
      maxlength: [100, 'Father\'s name cannot be more than 100 characters']
    },
    motherName: {
      type: String,
      trim: true,
      maxlength: [100, 'Mother\'s name cannot be more than 100 characters']
    },
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant ID is required']
  },
  applicantName: {
    type: String,
    required: [true, 'Applicant name is required'],
    trim: true,
    maxlength: [100, 'Applicant name cannot be more than 100 characters']
  },
  applicantEmail: {
    type: String,
    required: [true, 'Applicant email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  applicantPhone: {
    type: String,
    required: [true, 'Applicant phone is required'],
    match: [/^\d{10}$/, 'Phone number must be 10 digits']
  },
  applicantAge: {
    type: Number,
    required: [true, 'Applicant age is required'],
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age cannot be more than 150']
  },
  certificateType: {
    type: String,
    enum: ['birth', 'death', 'residence', 'marriage'],
    required: [true, 'Certificate type is required']
  },
  language: {
    type: String,
    enum: ['en', 'mr'],
    default: 'en'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  issuanceDate: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value >= this.applicationDate;
      },
      message: 'Issuance date cannot be before application date'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'under-review', 'admin-review', 'approved', 'rejected'],
    default: 'pending'
  },
  certificateNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  documents: [CertificateDocumentSchema],
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewDate: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value >= this.applicationDate;
      },
      message: 'Review date cannot be before application date'
    }
  },
  staffRemarks: {
    type: String,
    trim: true,
    maxlength: [500, 'Staff remarks cannot be more than 500 characters']
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value >= this.applicationDate;
      },
      message: 'Approval date cannot be before application date'
    }
  },
  adminRemarks: {
    type: String,
    trim: true,
    maxlength: [500, 'Admin remarks cannot be more than 500 characters']
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Rejection reason cannot be more than 500 characters']
  },
  downloadUrl: {
    type: String,
    trim: true
  },
  remarks: {
    type: String,
    trim: true,
    maxlength: [1000, 'Remarks cannot be more than 1000 characters']
  },
  partialApproved: {
    type: Boolean,
    default: false
  },
  // Marriage certificate extended fields
  bridegroomName: {
    type: String,
    trim: true,
    maxlength: [100, "Bridegroom's name cannot be more than 100 characters"]
  },
  brideName: {
    type: String,
    trim: true,
    maxlength: [100, "Bride's name cannot be more than 100 characters"]
  },
  bridegroomFatherName: {
    type: String,
    trim: true,
    maxlength: [100, "Bridegroom's father's name cannot be more than 100 characters"]
  },
  brideFatherName: {
    type: String,
    trim: true,
    maxlength: [100, "Bride's father's name cannot be more than 100 characters"]
  },
  bridegroomAddress: {
    type: String,
    trim: true,
    maxlength: [200, "Bridegroom's address cannot be more than 200 characters"]
  },
  brideAddress: {
    type: String,
    trim: true,
    maxlength: [200, "Bride's address cannot be more than 200 characters"]
  },
  bridegroomAge: {
    type: Number,
    min: [0, "Bridegroom's age cannot be negative"],
    max: [150, "Bridegroom's age cannot be more than 150"]
  },
  brideAge: {
    type: Number,
    min: [0, "Bride's age cannot be negative"],
    max: [150, "Bride's age cannot be more than 150"]
  },
  // Store complete user profile from database for certificate generation
  userProfile: {
    type: {
      name: String,
      email: String,
      phone: String,
      village: String,
      aadharNumber: String,
      dateOfBirth: Date,
      address: String,
      occupation: String,
      yearsInVillage: Number,
      spouseName: String,
      marriageDate: Date,
      marriagePlace: String,
      dateOfDeath: Date,
      placeOfDeath: String
    },
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
CertificateSchema.index({ applicantId: 1 });
CertificateSchema.index({ status: 1 });
CertificateSchema.index({ certificateType: 1 });
CertificateSchema.index({ applicationDate: -1 });
// Pre-save middleware to generate certificate number for approved certificates
CertificateSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'approved' && !this.certificateNumber) {
    const year = new Date().getFullYear();
    const typeCode = this.certificateType.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.certificateNumber = `${typeCode}-${year}-${randomNum}`;
  }
  next();
});

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);