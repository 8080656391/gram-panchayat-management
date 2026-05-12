// Certificate Document Type
export interface CertificateDocument {
  type: 'aadhaar' | 'ration-card' | 'photo';
  file?: File;
  fileName: string;
  uploadDate: string;
  status?: string;
}

// Certificate Types
export interface Certificate {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantAge: number;
  certificateType: 'birth' | 'death' | 'residence' | 'marriage';
  language?: 'en' | 'mr';
  applicationDate: string;
  issuanceDate: string;
  status: 'pending' | 'under-review' | 'admin-review' | 'approved' | 'rejected';
  certificateNumber: string;
  documents: CertificateDocument[];
  reviewedBy?: string;
  reviewDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  downloadUrl?: string;
  remarks?: string;
  partialApproved?: boolean;
  staffRemarks?: string;
  adminRemarks?: string;
}

// Tax Collection Types
export interface TaxRecord {
  id: string;
  taxpayerId: string;
  taxpayerName: string;
  houseTaxAmount: number;
  healthTaxAmount: number;
  waterTaxAmount: number;
  taxAmount: number;
  amountPaid: number;
  status: 'pending' | 'partial' | 'paid';
  taxYear: number;
  dueDate: string;
  paymentDate?: string;
}

// Grievance Types
export interface Grievance {
  id: string;
  complainantName: string;
  email: string;
  phone: string;
  category: 'roads' | 'water' | 'electricity' | 'sanitation' | 'health' | 'education' | 'other';
  description: string;
  location: string;
  filedDate: string;
  status: 'registered' | 'under-review' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
  resolution?: string;
  resolutionDate?: string;
  // Approval workflow fields
  staffApproval?: 'pending' | 'approved' | 'rejected';
  staffApprovalDate?: string;
  staffRemarks?: string;
  adminApproval?: 'pending' | 'approved' | 'rejected';
  adminApprovalDate?: string;
  adminRemarks?: string;
}

// Government Scheme Types
export interface Scheme {
  id: string;
  name: string;
  description: string;
  category: 'agriculture' | 'health' | 'education' | 'social' | 'infrastructure' | 'employment';
  eligibility: string[];
  benefits: string[];
  applicationProcess: string;
  lastUpdated: string;
  contactInfo: {
    department: string;
    phone: string;
    email: string;
  };
}

// User Types
export interface User {
  id: string;
  name: string;
  role: 'citizen' | 'staff' | 'admin';
  email: string;
  phone: string;
  village: string;
  age?: number;
  registrationDate?: string;
  aadharNumber?: string;
  dateOfBirth?: string;
  address?: string;
}

// Citizen Registration Type
export interface CitizenRegistration {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  aadharNumber: string;
  address: string;
  village: string;
  password: string;
  registrationDate: string;
  status: 'active' | 'inactive';
}
