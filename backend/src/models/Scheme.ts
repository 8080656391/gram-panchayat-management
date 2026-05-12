import mongoose, { Document, Schema } from 'mongoose';

export interface IScheme extends Document {
  name: {
    en: string;
    mr: string;
  };
  description: {
    en: string;
    mr: string;
  };
  category: 'agriculture' | 'health' | 'education' | 'social' | 'infrastructure' | 'employment';
  eligibility: {
    en: string[];
    mr: string[];
  };
  benefits: {
    en: string[];
    mr: string[];
  };
  applicationProcess: {
    en: string;
    mr: string;
  };
  applicationLink?: string;
  lastUpdated: Date;
  contactInfo: {
    department: string;
    phone: string;
    email: string;
  };
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
}

const SchemeSchema: Schema = new Schema({
  name: {
    en: {
      type: String,
      required: [true, 'English scheme name is required'],
      trim: true,
      maxlength: [200, 'Scheme name cannot be more than 200 characters']
    },
    mr: {
      type: String,
      required: [true, 'Marathi scheme name is required'],
      trim: true,
      maxlength: [200, 'Scheme name cannot be more than 200 characters']
    }
  },
  description: {
    en: {
      type: String,
      required: [true, 'English description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    mr: {
      type: String,
      required: [true, 'Marathi description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    }
  },
  category: {
    type: String,
    enum: ['agriculture', 'health', 'education', 'social', 'infrastructure', 'employment'],
    required: [true, 'Category is required']
  },
  eligibility: {
    en: [{
      type: String,
      trim: true,
      maxlength: [500, 'Eligibility criteria cannot be more than 500 characters']
    }],
    mr: [{
      type: String,
      trim: true,
      maxlength: [500, 'Eligibility criteria cannot be more than 500 characters']
    }]
  },
  benefits: {
    en: [{
      type: String,
      trim: true,
      maxlength: [500, 'Benefit description cannot be more than 500 characters']
    }],
    mr: [{
      type: String,
      trim: true,
      maxlength: [500, 'Benefit description cannot be more than 500 characters']
    }]
  },
  applicationProcess: {
    en: {
      type: String,
      required: [true, 'English application process is required'],
      trim: true,
      maxlength: [2000, 'Application process cannot be more than 2000 characters']
    },
    mr: {
      type: String,
      required: [true, 'Marathi application process is required'],
      trim: true,
      maxlength: [2000, 'Application process cannot be more than 2000 characters']
    }
  },
  applicationLink: {
    type: String,
    trim: true,
    default: ''
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  contactInfo: {
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      maxlength: [200, 'Department name cannot be more than 200 characters']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?\d{11}$/, 'Phone number must be 11 digits']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
SchemeSchema.index({ category: 1 });
SchemeSchema.index({ isActive: 1 });
SchemeSchema.index({ name: 'text', description: 'text' }); // Text search
SchemeSchema.index({ lastUpdated: -1 });

// Pre-save middleware to update lastUpdated
SchemeSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

export default mongoose.model<IScheme>('Scheme', SchemeSchema);