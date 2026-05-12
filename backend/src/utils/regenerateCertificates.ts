import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gramPanchayat');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// User Schema (simplified)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  village: String,
  aadharNumber: String,
  dateOfBirth: Date,
  address: String,
  gender: String,
  occupation: String,
  fatherName: String,
  motherName: String,
  spouseName: String,
  marriageDate: Date,
  marriagePlace: String,
  yearsInVillage: Number,
  dateOfDeath: Date,
  placeOfDeath: String,
  age: Number
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Certificate Schema (simplified)
const certificateSchema = new mongoose.Schema({
  applicantId: mongoose.Schema.Types.ObjectId,
  applicantName: String,
  applicantEmail: String,
  applicantPhone: String,
  applicantAge: Number,
  certificateType: String,
  applicationDate: Date,
  issuanceDate: Date,
  status: String,
  certificateNumber: String,
  userProfile: {
    name: String,
    email: String,
    phone: String,
    village: String,
    aadharNumber: String,
    dateOfBirth: Date,
    address: String,
    gender: String,
    occupation: String,
    fatherName: String,
    motherName: String,
    spouseName: String,
    marriageDate: Date,
    marriagePlace: String,
    yearsInVillage: Number,
    dateOfDeath: Date,
    placeOfDeath: String
  }
});

const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);

// English translations for certificates
const translations: Record<string, string> = {
  'Government Certification Authority': 'Government Certification Authority',
  'Gram Panchayat': 'Gram Panchayat',
  'Certificate Number': 'Certificate Number',
  'Application Date': 'Application Date',
  'Certificate Type': 'Certificate Type',
  'Issuance Date': 'Issuance Date',
  'Applicant Name': 'Applicant Name',
  'Contact Email': 'Contact Email',
  'Phone Number': 'Phone Number',
  'Village': 'Village',
  'Aadhar Number': 'Aadhar Number',
  'Date of Birth': 'Date of Birth',
  'Address': 'Address',
  'Place of Birth': 'Place of Birth',
  "Father's Name": "Father's Name",
  "Mother's Name": "Mother's Name",
  'Gender': 'Gender',
  'Deceased Name': 'Deceased Name',
  'Date of Death': 'Date of Death',
  'Place of Death': 'Place of Death',
  'Permanent Address': 'Permanent Address',
  'Age at Death': 'Age at Death',
  'Residence Address': 'Residence Address',
  'Years of Residence': 'Years of Residence',
  'Occupation': 'Occupation',
  'Spouse Name': 'Spouse Name',
  'Marriage Date': 'Marriage Date',
  'Marriage Place': 'Marriage Place',
  'Bridegroom Name': 'Bridegroom Name',
  'Bride Name': 'Bride Name',
  'Age': 'Age',
  'Staff Verification': 'Staff Verification',
  'Authorized Staff Member': 'Authorized Staff Member',
  'Administrative Seal': 'Administrative Seal',
  'Gram Panchayat Authority': 'Gram Panchayat Authority',
  'Official Approval': 'Official Approval',
  'Administrator': 'Administrator',
  'Digitally Verified': 'Digitally Verified',
  'Official Document': 'Official Document',
  'Authorized Issuance': 'Authorized Issuance',
  'Birth Certificate': 'Birth Certificate',
  'Death Certificate': 'Death Certificate',
  'Residence Certificate': 'Residence Certificate',
  'Marriage Certificate': 'Marriage Certificate',
  'Certificate ID': 'Certificate ID',
  'Generated on': 'Generated on'
};

function t(key: string): string {
  return translations[key] || key;
}

function generateEnglishCertificate(data: {
  certificateNumber: string;
  certificateType: string;
  applicantName: string;
  applicationDate: string;
  issuanceDate: string;
  applicantEmail?: string;
  applicantPhone?: string;
  applicantAge?: number;
  userVillage?: string;
  userAadharNumber?: string;
  userDateOfBirth?: string;
  userAddress?: string;
  userGender?: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  dateOfDeath?: string;
  placeOfDeath?: string;
  deceasedName?: string;
  residenceAddress?: string;
  residenceVillage?: string;
  residenceYears?: string;
  marriageDate?: string;
  spouseName?: string;
  marriagePlace?: string;
}): string {
  const certTypeLabels: Record<string, string> = {
    'birth': 'Birth Certificate',
    'death': 'Death Certificate',
    'residence': 'Residence Certificate',
    'marriage': 'Marriage Certificate'
  };
  
  const formattedCertType = certTypeLabels[data.certificateType] || data.certificateType;
  const appDate = new Date(data.applicationDate).toLocaleDateString('en-IN');
  const issDate = new Date(data.issuanceDate).toLocaleDateString('en-IN');
  const dobDate = data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString('en-IN') : 'N/A';
  const deathDate = data.dateOfDeath ? new Date(data.dateOfDeath).toLocaleDateString('en-IN') : 'N/A';
  const marriageDate = data.marriageDate ? new Date(data.marriageDate).toLocaleDateString('en-IN') : 'N/A';
  const userDob = data.userDateOfBirth ? new Date(data.userDateOfBirth).toLocaleDateString('en-IN') : 'N/A';

  let introText = '';
  let specificDetails = '';
  
  if (data.certificateType === 'birth') {
    introText = `This is to certify that <strong>${data.applicantName}</strong> was born on <strong>${dobDate}</strong> at <strong>${data.placeOfBirth || data.userAddress || 'N/A'}</strong> and this birth certificate is issued for official records.`;
    specificDetails = `
      <div class="certificate-details" style="margin-top: 20px; border-color: #1a472a;">
        <div class="detail-item"><div class="detail-label">${t('Date of Birth')}</div><div class="detail-value">${dobDate}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Place of Birth')}</div><div class="detail-value">${data.placeOfBirth || data.userAddress || 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">${t("Father's Name")}</div><div class="detail-value">${data.fatherName || 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">${t("Mother's Name")}</div><div class="detail-value">${data.motherName || 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Gender')}</div><div class="detail-value">${data.userGender || 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Address')}</div><div class="detail-value">${data.userAddress || 'N/A'}</div></div>
      </div>
      <p class="closing-text" style="margin-top: 15px; font-size: 12px;">This birth certificate is issued as per the provisions of the Registration of Births and Deaths Act, 1969.</p>
    `;
  } else if (data.certificateType === 'death') {
    introText = `This is to certify that <strong>${data.deceasedName || data.applicantName}</strong> has passed away on <strong>${deathDate}</strong> at <strong>${data.placeOfDeath || 'N/A'}</strong> and this death certificate is issued for official records.`;
    specificDetails = `
      <div class="certificate-details" style="margin-top: 20px; border-color: #1a472a;">
        <div class="detail-item"><div class="detail-label">${t('Deceased Name')}</div><div class="detail-value">${data.deceasedName || data.applicantName}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Date of Death')}</div><div class="detail-value">${deathDate}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Place of Death')}</div><div class="detail-value">${data.placeOfDeath || 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Age at Death')}</div><div class="detail-value">${data.applicantAge || 'N/A'} years</div></div>
        <div class="detail-item"><div class="detail-label">${t('Permanent Address')}</div><div class="detail-value">${data.userAddress || 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Village')}</div><div class="detail-value">${data.userVillage || 'N/A'}</div></div>
      </div>
      <p class="closing-text" style="margin-top: 15px; font-size: 12px;">This death certificate is issued as per the provisions of the Registration of Births and Deaths Act, 1969.</p>
    `;
  } else if (data.certificateType === 'residence') {
    introText = `This is to certify that <strong>${data.applicantName}</strong> is a permanent resident of this village and this certificate is issued for official records.`;
    specificDetails = `
      <div class="certificate-details" style="margin-top: 20px; border-color: #1a472a;">
        <div class="detail-item"><div class="detail-label">${t('Residence Address')}</div><div class="detail-value">${data.residenceAddress || data.userAddress || 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Village')}</div><div class="detail-value">${data.residenceVillage || data.userVillage || 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Years of Residence')}</div><div class="detail-value">${data.residenceYears || 'N/A'} years</div></div>
        <div class="detail-item"><div class="detail-label">${t('Occupation')}</div><div class="detail-value">N/A</div></div>
        <div class="detail-item"><div class="detail-label">${t('Aadhar Number')}</div><div class="detail-value">${data.userAadharNumber || 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Phone Number')}</div><div class="detail-value">${data.applicantPhone || 'N/A'}</div></div>
      </div>
      <p class="closing-text" style="margin-top: 15px; font-size: 12px;">This is to certify that the person named above is a permanent resident of this Gram Panchayat and has been residing in the village for the mentioned period.</p>
    `;
  } else if (data.certificateType === 'marriage') {
    introText = `This is to certify that <strong>${data.applicantName}</strong> have been lawfully married on <strong>${marriageDate}</strong> at <strong>${data.marriagePlace || data.userVillage || 'N/A'}</strong> and this certificate is issued for official records.`;
    specificDetails = `
      <div class="certificate-details" style="margin-top: 20px; border-color: #1a472a;">
        <div class="detail-item"><div class="detail-label">${t('Bridegroom Name')}</div><div class="detail-value">${data.applicantName}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Bride Name')}</div><div class="detail-value">${data.spouseName || 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Marriage Date')}</div><div class="detail-value">${marriageDate}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Marriage Place')}</div><div class="detail-value">${data.marriagePlace || data.userVillage || 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Age')}</div><div class="detail-value">${data.applicantAge || 'N/A'} years</div></div>
        <div class="detail-item"><div class="detail-label">${t('Village')}</div><div class="detail-value">${data.userVillage || 'N/A'}</div></div>
      </div>
      <p class="closing-text" style="margin-top: 15px; font-size: 12px;">This marriage certificate is issued as per the provisions of the Hindu Marriage Act, 1955 or Special Marriage Act, 1954.</p>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formattedCertType} - ${data.certificateNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
    .certificate-container { width: 100%; max-width: 900px; background: linear-gradient(135deg, #fff9e6 0%, #fffef0 100%); border: 8px solid #d4af37; padding: 60px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); position: relative; page-break-after: always; }
    .certificate-container::before { content: ''; position: absolute; top: -8px; left: -8px; right: -8px; bottom: -8px; background: linear-gradient(45deg, transparent 0%, rgba(212, 175, 55, 0.1) 50%, transparent 100%); border: 1px solid #d4af37; z-index: -1; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #d4af37; padding-bottom: 20px; }
    .govt-logo { width: 60px; height: 60px; margin: 0 auto 15px; background: #1a472a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #d4af37; font-size: 12px; font-weight: bold; text-align: center; padding: 5px; }
    .header h1 { color: #1a472a; font-size: 32px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
    .header p { color: #333; font-size: 14px; letter-spacing: 1px; }
    .content { text-align: center; margin: 40px 0; }
    .cert-type { font-size: 28px; color: #1a472a; font-weight: bold; margin-bottom: 20px; text-transform: uppercase; }
    .intro-text { font-size: 16px; color: #333; margin-bottom: 20px; font-style: italic; }
    .recipient-name { font-size: 36px; color: #d4af37; font-weight: bold; margin: 30px 0; text-decoration: underline; text-decoration-style: dotted; text-decoration-color: #d4af37; text-underline-offset: 8px; }
    .certificate-details { margin: 40px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 20px; border: 1px dashed #d4af37; background-color: rgba(212, 175, 55, 0.05); }
    .detail-item { text-align: left; }
    .detail-label { font-size: 12px; color: #1a472a; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
    .detail-value { font-size: 14px; color: #333; margin-top: 5px; font-family: 'Courier New', monospace; }
    .closing-text { font-size: 14px; color: #333; margin: 30px 0; font-style: italic; }
    .signature-section { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; margin-top: 60px; padding-top: 40px; border-top: 2px solid #d4af37; }
    .signature-block { text-align: center; }
    .signature-line { border-top: 2px solid #333; height: 50px; margin-bottom: 10px; }
    .signature-title { font-size: 12px; color: #333; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
    .signature-designation { font-size: 11px; color: #666; margin-top: 5px; }
    .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #999; border-top: 1px solid #d4af37; padding-top: 20px; }
    .security-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px; padding: 15px; background-color: rgba(212, 175, 55, 0.03); border-radius: 5px; }
    .security-item { font-size: 10px; color: #666; text-align: center; }
    @media print { body { background: white; padding: 0; } .certificate-container { box-shadow: none; max-width: 100%; margin: 0; } }
  </style>
</head>
<body>
  <div class="certificate-container">
    <div class="header">
      <div class="govt-logo">🏛️</div>
      <h1>${t('Gram Panchayat')}</h1>
      <p>${t('Government Certification Authority')}</p>
    </div>
    <div class="content">
      <div class="cert-type">${formattedCertType}</div>
      <p class="intro-text">This is to certify that</p>
      <div class="recipient-name">${data.applicantName}</div>
      <p class="intro-text">${introText}</p>
      <div class="certificate-details">
        <div class="detail-item"><div class="detail-label">${t('Certificate Number')}</div><div class="detail-value">${data.certificateNumber}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Application Date')}</div><div class="detail-value">${appDate}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Certificate Type')}</div><div class="detail-value">${formattedCertType}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Issuance Date')}</div><div class="detail-value">${issDate}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Applicant Name')}</div><div class="detail-value">${data.applicantName}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Contact Email')}</div><div class="detail-value">${data.applicantEmail || 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Phone Number')}</div><div class="detail-value">${data.applicantPhone || 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Village')}</div><div class="detail-value">${data.userVillage || 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Aadhar Number')}</div><div class="detail-value">${data.userAadharNumber || 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Date of Birth')}</div><div class="detail-value">${userDob}</div></div>
        <div class="detail-item"><div class="detail-label">${t('Address')}</div><div class="detail-value">${data.userAddress || 'N/A'}</div></div>
      </div>
      ${specificDetails}
      <p class="closing-text">In witness whereof, the Gram Panchayat has issued this certificate in accordance with the applicable laws and regulations.</p>
    </div>
    <div class="signature-section">
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="signature-title">${t('Staff Verification')}</div>
        <div class="signature-designation">${t('Authorized Staff Member')}</div>
      </div>
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="signature-title">${t('Administrative Seal')}</div>
        <div class="signature-designation">${t('Gram Panchayat Authority')}</div>
      </div>
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="signature-title">${t('Official Approval')}</div>
        <div class="signature-designation">${t('Administrator')}</div>
      </div>
    </div>
    <div class="footer">
      <p>This certificate is valid for all official purposes. Unauthorized reproduction or alteration is strictly prohibited.</p>
      <p style="margin-top: 10px;">${t('Certificate ID')}: ${data.certificateNumber} | ${t('Generated on')} ${issDate}</p>
    </div>
  </div>
</body>
</html>`;
}

async function regenerateCertificates() {
  await connectDB();
  
  // Fetch all approved certificates from database
  const certificates = await Certificate.find({ status: 'approved' }).lean();
  
  console.log(`Found ${certificates.length} approved certificates in database`);
  
  const uploadDir = 'C:/gram-panchayat-management/uploads/certificates';
  
  for (const cert of certificates) {
    try {
      // Get user data directly from users collection
      const user = await User.findById(cert.applicantId).lean();
      const profile = cert.userProfile || user;
      
      if (!profile) {
        console.log(`Skipping certificate ${cert.certificateNumber} - no user data found`);
        continue;
      }
      
      // Build certificate data from database user - ALWAYS use current user data from User collection
      const certData: any = {
        certificateNumber: cert.certificateNumber || 'CERT',
        certificateType: cert.certificateType,
        applicantName: profile.name || 'Unknown', // Always fetch from User collection
        applicationDate: cert.applicationDate?.toISOString() || new Date().toISOString(),
        issuanceDate: cert.issuanceDate?.toISOString() || new Date().toISOString(),
        applicantEmail: cert.applicantEmail || profile.email || '',
        applicantPhone: cert.applicantPhone || profile.phone || '',
        applicantAge: cert.applicantAge || profile.age || 0,
        userVillage: profile.village || 'N/A',
        userAadharNumber: profile.aadharNumber || 'N/A',
        userDateOfBirth: profile.dateOfBirth?.toISOString() || null,
        userAddress: profile.address || 'N/A',
        userGender: profile.gender || '',
      };
      
      // Add certificate-type-specific fields
      if (cert.certificateType === 'birth') {
        certData.dateOfBirth = profile.dateOfBirth?.toISOString() || null;
        certData.placeOfBirth = profile.address || 'N/A';
        certData.fatherName = profile.fatherName || 'N/A';
        certData.motherName = profile.motherName || 'N/A';
      } else if (cert.certificateType === 'death') {
        certData.dateOfDeath = profile.dateOfDeath?.toISOString() || null;
        certData.placeOfDeath = profile.placeOfDeath || 'N/A';
        certData.deceasedName = cert.applicantName;
      } else if (cert.certificateType === 'residence') {
        certData.residenceAddress = profile.address || 'N/A';
        certData.residenceVillage = profile.village || 'N/A';
        certData.residenceYears = profile.yearsInVillage?.toString() || 'N/A';
      } else if (cert.certificateType === 'marriage') {
        certData.marriageDate = profile.marriageDate?.toISOString() || null;
        certData.spouseName = profile.spouseName || 'N/A';
        certData.marriagePlace = profile.marriagePlace || 'N/A';
      }
      
      // Generate file name - use the certificate number directly
      const typePrefix: Record<string, string> = {
        'birth': 'BIR',
        'death': 'DTH',
        'residence': 'RES',
        'marriage': 'MAR'
      };
      const prefix = typePrefix[cert.certificateType] || 'CERT';
      // Extract just the number part (e.g., "0530" from "BIR-2026-0530")
      const certNum = cert.certificateNumber || '';
      const numPart = certNum.replace(/^[A-Z]+-/, ''); // Remove prefix like "BIR-"
      const fileName = `Certificate-${prefix}-${numPart}.html`;
      
      // Generate and save certificate
      const html = generateEnglishCertificate(certData);
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, html, 'utf-8');
      console.log(`Regenerated: ${fileName} for user ${certData.applicantName}`);
      console.log(`  - Name: ${profile.name}`);
      console.log(`  - Email: ${certData.applicantEmail}`);
      console.log(`  - Phone: ${certData.applicantPhone}`);
      console.log(`  - Village: ${certData.userVillage}`);
      console.log(`  - Aadhar: ${certData.userAadharNumber}`);
      console.log(`  - DOB: ${certData.userDateOfBirth}`);
      console.log(`  - Address: ${certData.userAddress}`);
      
    } catch (err) {
      console.error(`Error regenerating certificate ${cert.certificateNumber}:`, err);
    }
  }
  
  console.log('Certificate regeneration completed!');
  process.exit(0);
}

regenerateCertificates();