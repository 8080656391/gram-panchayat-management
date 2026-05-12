import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Language translations for certificate templates
const translations: Record<string, Record<string, string>> = {
  en: {
    "Father's Name": "Father's Name",
    "Mother's Name": "Mother's Name",
    'Gender': 'Gender',
    'Weight at Birth': 'Weight at Birth',
    'Birth Time': 'Birth Time',
    // Death certificate specific
    'Deceased Name': 'Deceased Name',
    'Date of Death': 'Date of Death',
    'Place of Death': 'Place of Death',
    'Permanent Address': 'Permanent Address',
    'Age at Death': 'Age at Death',
    'Cause of Death': 'Cause of Death',
    'Informant Name': 'Informant Name',
    'Relationship': 'Relationship',
    // Residence certificate specific
    'Residence Address': 'Residence Address',
    'Years of Residence': 'Years of Residence',
    'Occupation': 'Occupation',
    'From Date': 'From Date',
    'To Date': 'To Date',
    'Purpose': 'Purpose',
    // Marriage certificate specific
    'Spouse Name': 'Spouse Name',
    'Marriage Date': 'Marriage Date',
    'Marriage Place': 'Marriage Place',
    'Marriage Registration Number': 'Marriage Registration Number',
    'Bridegroom Name': 'Bridegroom Name',
    'Bride Name': 'Bride Name',
    'Age': 'Age',
    'Marital Status': 'Marital Status',
    'Religion': 'Religion',
    'Civil Status': 'Civil Status',
    
    // Footer
    'In witness whereof, the Gram Panchayat has issued this certificate in accordance with the applicable laws and regulations.': 'In witness whereof, the Gram Panchayat has issued this certificate in accordance with the applicable laws and regulations.',
    'Staff Verification': 'Staff Verification',
    'Authorized Staff Member': 'Authorized Staff Member',
    'Administrative Seal': 'Administrative Seal',
    'Gram Panchayat Authority': 'Gram Panchayat Authority',
    'Official Approval': 'Official Approval',
    'Administrator': 'Administrator',
    'Digitally Verified': 'Digitally Verified',
    'Official Document': 'Official Document',
    'Authorized Issuance': 'Authorized Issuance',
    'This certificate is valid for all official purposes. Unauthorized reproduction or alteration is strictly prohibited.': 'This certificate is valid for all official purposes. Unauthorized reproduction or alteration is strictly prohibited.',
    'Certificate ID': 'Certificate ID',
    'Generated on': 'Generated on',
    'Birth Certificate': 'Birth Certificate',
    'Death Certificate': 'Death Certificate',
    'Residence Certificate': 'Residence Certificate',
    'Marriage Certificate': 'Marriage Certificate',
    'Verified By': 'Verified By',
    'Date': 'Date',
    'Seal': 'Seal',
    'Signature': 'Signature',
    'This is to certify that the person named above is a permanent resident of this Gram Panchayat and has been residing in the village for the mentioned period.': 'This is to certify that the person named above is a permanent resident of this Gram Panchayat and has been residing in the village for the mentioned period.',
    'This birth certificate is issued as per the provisions of the Registration of Births and Deaths Act, 1969.': 'This birth certificate is issued as per the provisions of the Registration of Births and Deaths Act, 1969.',
    'This death certificate is issued as per the provisions of the Registration of Births and Deaths Act, 1969.': 'This death certificate is issued as per the provisions of the Registration of Births and Deaths Act, 1969.',
    'This marriage certificate is issued as per the provisions of the Hindu Marriage Act, 1955 or Special Marriage Act, 1954.': 'This marriage certificate is issued as per the provisions of the Hindu Marriage Act, 1955 or Special Marriage Act, 1954.',
    ' issued this ': ' issued this ',
    ' certificate on ': ' certificate on '
  },
  mr: {
    'Government Certification Authority': 'सरकारी प्रमाणपत्र प्राधिकरण',
    'This is to certify that': 'हे प्रमाणित करण्यासाठी की',
    'has successfully completed the certificate verification process': 'ने प्रमाणपत्र प्रक्रिया यशस्वीरित्या पूर्ण केली आहे',
    'has passed away and this death certificate is issued for official records': 'चे निधन झाले आणि हे मृत्यु प्रमाणपत्र अधिकृत रेकॉर्डसाठी जारी केले आहे',
    'is a permanent resident of this village and this certificate is issued for official records': 'हे गावाचे स्थायी रहिवासी आहे आणि हे प्रमाणपत्र अधिकृत रेकॉर्डसाठी जारी केले आहे',
    'have been lawfully married and this certificate is issued for official records': 'कायदेशीररित्या विवाह केला आणि हे प्रमाणपत्र अधिकृत रेकॉर्डसाठी जारी केले आहे',
    'Certificate Number': 'प्रमाणपत्र क्रमांक',
    'Application Date': 'अर्ज तारीख',
    'Certificate Type': 'प्रमाणपत्र प्रकार',
    'Issuance Date': 'जारी करण्याची तारीख',
    'Applicant Name': 'अर्जदाराचे नाव',
    'Contact Email': 'संपर्क ईमेल',
    'Phone Number': 'फोन नंबर',
    'Village': 'गाव',
    'Aadhar Number': 'आधार क्रमांक',
    'Date of Birth': 'जन्म तारीख',
    'Address': 'पत्ता',
    'Place of Birth': 'जन्मस्थान',
    "Father's Name": 'वडिलांचे नाव',
    "Mother's Name": 'आईचे नाव',
    'Deceased Name': 'मृत व्यक्तीचे नाव',
    'Date of Death': 'मृत्यु तारीख',
    'Place of Death': 'मृत्युस्थान',
    'Permanent Address': 'कायम पत्ता',
    'Residence Address': 'रहिवासी पत्ता',
    'Years of Residence': 'रहिवासी वर्षे',
    'Occupation': 'व्यवसाय',
    'Spouse Name': 'पती/पत्नीचे नाव',
    'Marriage Date': 'विवाह तारीख',
    'Marriage Place': 'विवाह स्थान',
    'In witness whereof, the Gram Panchayat has issued this certificate in accordance with the applicable laws and regulations.': 'याची साक्ष म्हणून, ग्राम पंचायतने लागू कायद्यांनुसार हे प्रमाणपत्र जारी केले आहे.',
    'Staff Verification': 'कर्मचारी पडताळणी',
    'Authorized Staff Member': 'अधिकृत कर्मचारी सदस्य',
    'Administrative Seal': 'प्रशासकीय मुद्रा',
    'Gram Panchayat Authority': 'ग्राम पंचायत प्राधिकरण',
    'Official Approval': 'अधिकृत मंजूरी',
    'Administrator': 'प्रशासक',
    'Digitally Verified': 'डिजिटली पडताळले',
    'Official Document': 'अधिकृत दस्तऐवज',
    'Authorized Issuance': 'अधिकृत जारी',
    'This certificate is valid for all official purposes. Unauthorized reproduction or alteration is strictly prohibited.': 'हे प्रमाणपत्र सर्व अधिकृत उद्देशांसाठी वैध आहे. अनधिकृत पुनरुत्पादन किंवा बदल सखोलपणे प्रतिबंधित आहे.',
    'Certificate ID': 'प्रमाणपत्र ID',
    'Generated on': 'जारी केले',
    'Birth Certificate': 'जन्म प्रमाणपत्र',
    'Death Certificate': 'मृत्यु प्रमाणपत्र',
    'Residence Certificate': 'रहिवास प्रमाणपत्र',
    'Marriage Certificate': 'विवाह प्रमाणपत्र'
  }
};


// Get translation for a given key and language
const getTranslation = (key: string, language: string = 'en'): string => {
  return translations[language]?.[key] || translations['en'][key] || key;
};

// Generate certificate HTML from data and template mapping
export const generateCertificateHTML = (certificateData: {
  certificateNumber: string;
  certificateType: string;
  applicantName: string;
  applicationDate: string;
  issuanceDate: string;
  language?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  applicantAge?: number;
  userVillage?: string;
  userAadharNumber?: string;
  userGender?: string;
  userDateOfBirth?: string | null;
  userOccupation?: string;
  userAddress?: string;
  // Birth certificate specific
  dateOfBirth?: string | null;
  placeOfBirth?: string;
  fatherName?: string;
  motherName?: string;
  // Death certificate specific
  dateOfDeath?: string | null;
  placeOfDeath?: string;
  deceasedName?: string;
  // Residence certificate specific
  residenceAddress?: string;
  residenceVillage?: string;
  residenceYears?: string;
  // Marriage certificate specific
  marriageDate?: string | null;
  spouseName?: string;
  marriagePlace?: string;
}): string => {
  const language = certificateData.language || 'en';
  const t = (key: string) => getTranslation(key, language);

  // Format certificate type for display
  const formattedCertType = certificateData.certificateType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Format dates
  const appDate = new Date(certificateData.applicationDate).toLocaleDateString('en-IN');
  const issDate = new Date(certificateData.issuanceDate).toLocaleDateString('en-IN');
  const dobDate = certificateData.dateOfBirth ? new Date(certificateData.dateOfBirth).toLocaleDateString('en-IN') : 'N/A';
  const deathDate = certificateData.dateOfDeath ? new Date(certificateData.dateOfDeath).toLocaleDateString('en-IN') : 'N/A';
  const marriageDate = certificateData.marriageDate ? new Date(certificateData.marriageDate).toLocaleDateString('en-IN') : 'N/A';
  const userDob = certificateData.userDateOfBirth ? new Date(certificateData.userDateOfBirth).toLocaleDateString('en-IN') : 'N/A';

  return `
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t(formattedCertType + ' Certificate')} - ${certificateData.certificateNumber}</title>
      <style>
        /* ...existing styles... */
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
          <div class="cert-type">${t(formattedCertType + ' Certificate')}</div>
          ${certificateData.certificateType === 'birth' ? `
            <p class="intro-text">${t('This is to certify that')} <strong>${certificateData.applicantName}</strong> ${t('was born on')} <strong>${dobDate}</strong> ${t('at')} <strong>${certificateData.placeOfBirth || ''}</strong> ${t('and this birth certificate is issued for official records')}</p>
            <div class="certificate-details">
              <div class="detail-item"><div class="detail-label">${t('Certificate Number')}</div><div class="detail-value">${certificateData.certificateNumber}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Application Date')}</div><div class="detail-value">${appDate}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Certificate Type')}</div><div class="detail-value">${t(formattedCertType + ' Certificate')}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Issuance Date')}</div><div class="detail-value">${issDate}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Applicant Name')}</div><div class="detail-value">${certificateData.applicantName}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Applicant Email')}</div><div class="detail-value">${certificateData.applicantEmail || ''}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Applicant Phone')}</div><div class="detail-value">${certificateData.applicantPhone || ''}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Village')}</div><div class="detail-value">${certificateData.userVillage || ''}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Aadhar Number')}</div><div class="detail-value">${certificateData.userAadharNumber || ''}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Date of Birth')}</div><div class="detail-value">${userDob}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Address')}</div><div class="detail-value">${certificateData.userAddress || ''}</div></div>
            </div>
            <div class="certificate-details" style="margin-top: 20px; border-color: #1a472a;">
              <div class="detail-item"><div class="detail-label">${t('Place of Birth')}</div><div class="detail-value">${certificateData.placeOfBirth || ''}</div></div>
              <div class="detail-item"><div class="detail-label">${t("Father's Name")}</div><div class="detail-value">${certificateData.fatherName || ''}</div></div>
              <div class="detail-item"><div class="detail-label">${t("Mother's Name")}</div><div class="detail-value">${certificateData.motherName || ''}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Gender')}</div><div class="detail-value">${certificateData.userGender || ''}</div></div>
            </div>
            <p class="closing-text" style="margin-top: 15px; font-size: 12px;">${t('This birth certificate is issued as per the provisions of the Registration of Births and Deaths Act, 1969.')}</p>
          ` : ''}
          ${certificateData.certificateType === 'residence' ? `
            <p class="intro-text">${t('This is to certify that')}</p>
            <div class="recipient-name">${certificateData.applicantName}</div>
            <p class="intro-text">${t('is a permanent resident of this village and this certificate is issued for official records')}</p>
            <div class="certificate-details">
              <div class="detail-item"><div class="detail-label">${t('Certificate Number')}</div><div class="detail-value">${certificateData.certificateNumber}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Application Date')}</div><div class="detail-value">${appDate}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Certificate Type')}</div><div class="detail-value">${t(formattedCertType + ' Certificate')}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Issuance Date')}</div><div class="detail-value">${issDate}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Applicant Name')}</div><div class="detail-value">${certificateData.applicantName}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Contact Email')}</div><div class="detail-value">${certificateData.applicantEmail || 'N/A'}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Phone Number')}</div><div class="detail-value">${certificateData.applicantPhone || 'N/A'}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Village')}</div><div class="detail-value">${certificateData.residenceVillage || certificateData.userVillage || 'N/A'}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Years of Residence')}</div><div class="detail-value">${certificateData.residenceYears || 'N/A'} years</div></div>
              <div class="detail-item"><div class="detail-label">${t('Occupation')}</div><div class="detail-value">${certificateData.userOccupation || 'N/A'}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Aadhar Number')}</div><div class="detail-value">${certificateData.userAadharNumber || 'N/A'}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Phone Number')}</div><div class="detail-value">${certificateData.applicantPhone || 'N/A'}</div></div>
            </div>
            <p class="closing-text" style="margin-top: 15px; font-size: 12px;">${t('This is to certify that the person named above is a permanent resident of this Gram Panchayat and has been residing in the village for the mentioned period.')}</p>
          ` : ''}
          ${certificateData.certificateType === 'marriage' ? `
            <p class="intro-text">${t('This is to certify that')}</p>
            <div class="recipient-name">${certificateData.applicantName}</div>
            <p class="intro-text">${t('have been lawfully married on')} <strong>${marriageDate}</strong> ${t('at')} <strong>${certificateData.marriagePlace || 'N/A'}</strong> ${t('and this certificate is issued for official records')}</p>
            <div class="certificate-details">
              <div class="detail-item"><div class="detail-label">${t('Certificate Number')}</div><div class="detail-value">${certificateData.certificateNumber}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Application Date')}</div><div class="detail-value">${appDate}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Certificate Type')}</div><div class="detail-value">${t(formattedCertType + ' Certificate')}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Issuance Date')}</div><div class="detail-value">${issDate}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Applicant Name')}</div><div class="detail-value">${certificateData.applicantName}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Contact Email')}</div><div class="detail-value">${certificateData.applicantEmail || 'N/A'}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Phone Number')}</div><div class="detail-value">${certificateData.applicantPhone || 'N/A'}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Village')}</div><div class="detail-value">${certificateData.userVillage || 'N/A'}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Aadhar Number')}</div><div class="detail-value">${certificateData.userAadharNumber || 'N/A'}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Age')}</div><div class="detail-value">${certificateData.applicantAge || 'N/A'} years</div></div>
              <div class="detail-item"><div class="detail-label">${t('Marriage Date')}</div><div class="detail-value">${marriageDate}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Marriage Place')}</div><div class="detail-value">${certificateData.marriagePlace || certificateData.userVillage || 'N/A'}</div></div>
              <div class="detail-item"><div class="detail-label">${t('Spouse Name')}</div><div class="detail-value">${certificateData.spouseName || 'N/A'}</div></div>
            </div>
            <p class="closing-text" style="margin-top: 15px; font-size: 12px;">${t('This marriage certificate is issued as per the provisions of the Hindu Marriage Act, 1955 or Special Marriage Act, 1954.')}</p>
          ` : ''}
          <p class="closing-text">${t('In witness whereof, the Gram Panchayat has issued this certificate in accordance with the applicable laws and regulations.')}</p>
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
        <div class="security-features">
          <div class="security-item">✓ ${t('Digitally Verified')}</div>
          <div class="security-item">✓ ${t('Official Document')}</div>
          <div class="security-item">✓ ${t('Authorized Issuance')}</div>
        </div>
        <div class="footer">
          <p>${t('This certificate is valid for all official purposes. Unauthorized reproduction or alteration is strictly prohibited.')}</p>
          <p style="margin-top: 10px;">${t('Certificate ID')}: ${certificateData.certificateNumber} | ${t('Generated on')} ${issDate}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const saveCertificateFile = (
  certificateData: any,
  fileName: string,
  uploadDir: string
): string => {
  const certificateHTML = generateCertificateHTML(certificateData);
  const filePath = path.join(uploadDir, fileName);

  // Create directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Save HTML file
  fs.writeFileSync(filePath, certificateHTML, 'utf-8');

  return filePath;
};

export const generateCertificateFileName = (certificateNumber: string, certificateType: string): string => {
  // Use type-specific prefixes: BIR (Birth), DTH (Death), RES (Residence), MAR (Marriage)
  const typePrefix: Record<string, string> = {
    'birth': 'BIR',
    'death': 'DTH',
    'residence': 'RES',
    'marriage': 'MAR'
  };
  const prefix = typePrefix[certificateType?.toLowerCase()] || 'CERT';
  return `Certificate-${prefix}-${certificateNumber}.html`;
};
