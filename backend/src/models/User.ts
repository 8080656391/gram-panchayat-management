import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'citizen' | 'staff' | 'admin';
  phone: string;
  village: string;
  aadharNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  registrationDate: Date;
  isActive: boolean;
  // Additional fields for certificates
  gender?: string;
  occupation?: string;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  marriageDate?: Date;
  marriagePlace?: string;
  yearsInVillage?: number;
  // For death certificate
  dateOfDeath?: Date;
  placeOfDeath?: string;
  age?: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['citizen', 'staff', 'admin'],
    default: 'citizen'
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Phone number must be 10 digits']
  },
  village: {
    type: String,
    required: [true, 'Village is required'],
    trim: true
  },
  aadharNumber: {
    type: String,
    match: [/^\d{12}$/, 'Aadhar number must be 12 digits'],
    sparse: true // Allow null values but ensure uniqueness when present
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return value <= new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
UserSchema.index({ role: 1, village: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    // Add type guard for password
    if (!this.password || typeof this.password !== 'string') {
      this.password = '';
    }
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for age calculation
UserSchema.virtual('age').get(function() {
  if (!this.dateOfBirth || isNaN(new Date(this.dateOfBirth).getTime())) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
});

export default mongoose.model<IUser>('User', UserSchema);