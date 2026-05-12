import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'mr';

interface Translations {
  [key: string]: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.certificates': 'Certificates',
    'nav.taxPayment': 'Tax Payment',
    'nav.taxManagement': 'Tax Management',
    'nav.grievances': 'Grievances',
    'nav.schemes': 'Schemes',
    'nav.reports': 'Reports',
    'nav.users': 'Users',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.gramPanchayat': 'Gram Panchayat',
    
    // Login
    'login.title': 'Gram Panchayat Management System',
    'login.subtitle': 'Login to your account',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.button': 'Login',
    'login.error': 'Invalid username or password',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.title': 'Dashboard',
    'dashboard.totalCertificates': 'Total Certificates',
    'dashboard.pendingCertificates': 'Pending Certificates',
    'dashboard.totalTaxes': 'Total Tax Collected',
    'dashboard.pendingTaxes': 'Pending Taxes',
    'dashboard.totalGrievances': 'Total Grievances',
    'dashboard.pendingGrievances': 'Pending Grievances',
    'dashboard.recentActivity': 'Recent Activity',
    
    // Certificates
    'certificate.title': 'Certificate Management',
    'certificate.apply': 'Apply for Certificate',
    'certificate.type': 'Certificate Type',
    'certificate.status': 'Status',
    'certificate.date': 'Date',
    'certificate.action': 'Action',
    'certificate.view': 'View',
    'certificate.download': 'Download',
    'certificate.approve': 'Approve',
    'certificate.reject': 'Reject',
    'certificate.pending': 'Pending',
    'certificate.approved': 'Approved',
    'certificate.rejected': 'Rejected',
    'certificate.residence': 'Residence Certificate',
    'certificate.birth': 'Birth Certificate',
    'certificate.death': 'Death Certificate',
    'certificate.marriage': 'Marriage Certificate',
    'certificate.income': 'Income Certificate',
    'certificate.caste': 'Caste Certificate',
    'certificate.description': 'Description',
    'certificate.remarks': 'Remarks',
    'certificate.submit': 'Submit',
    'certificate.cancel': 'Cancel',
    
    // Tax
    'tax.title': 'Tax Collection',
    'tax.propertyTax': 'Property Tax',
    'tax.waterTax': 'Water Tax',
    'tax.assessmentYear': 'Assessment Year',
    'tax.amount': 'Amount',
    'tax.status': 'Status',
    'tax.pay': 'Pay Now',
    'tax.paid': 'Paid',
    'tax.due': 'Due',
    'tax.paymentSuccess': 'Payment Successful',
    'tax.paymentFailed': 'Payment Failed',
    
    // Grievances
    'grievance.title': 'Grievance System',
    'grievance.submit': 'Submit Grievance',
    'grievance.subject': 'Subject',
    'grievance.description': 'Description',
    'grievance.category': 'Category',
    'grievance.status': 'Status',
    'grievance.date': 'Date',
    'grievance.open': 'Open',
    'grievance.inProgress': 'In Progress',
    'grievance.resolved': 'Resolved',
    'grievance.closed': 'Closed',
    
    // Schemes
    'scheme.title': 'Government Schemes',
    'scheme.apply': 'Apply',
    'scheme.eligibility': 'Eligibility',
    'scheme.benefits': 'Benefits',
    'scheme.lastDate': 'Last Date',
    'scheme.status': 'Status',
    'scheme.active': 'Active',
    'scheme.expired': 'Expired',
    
    // Admin
    'admin.reports': 'Reports',
    'admin.users': 'User Management',
    'admin.settings': 'Settings',
    'admin.addUser': 'Add User',
    'admin.editUser': 'Edit User',
    'admin.deleteUser': 'Delete User',
    'admin.role': 'Role',
    'admin.name': 'Name',
    'admin.email': 'Email',
    'admin.phone': 'Phone',
    'admin.address': 'Address',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.loading': 'Loading...',
    'common.noData': 'No data available',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
  },
  mr: {
    // Navigation
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.certificates': 'प्रमाणपत्रे',
    'nav.taxPayment': 'कर भरणा',
    'nav.taxManagement': 'कर व्यवस्थापन',
    'nav.grievances': 'तक्रारी',
    'nav.schemes': 'योजना',
    'nav.reports': 'अहवाल',
    'nav.users': 'वापरकर्ते',
    'nav.settings': 'सेटिंग्ज',
    'nav.logout': 'लॉगआउट',
    'nav.gramPanchayat': 'ग्राम पंचायत',
    
    // Login
    'login.title': 'ग्राम पंचायत व्यवस्थापन प्रणाली',
    'login.subtitle': 'आपल्या खात्यात लॉग इन करा',
    'login.username': 'वापरकर्ता नाव',
    'login.password': 'पासवर्ड',
    'login.button': 'लॉग इन',
    'login.error': 'अवैध वापरकर्ता नाव किंवा पासवर्ड',
    
    // Dashboard
    'dashboard.welcome': 'स्वागत आहे',
    'dashboard.title': 'डॅशबोर्ड',
    'dashboard.totalCertificates': 'एकूण प्रमाणपत्रे',
    'dashboard.pendingCertificates': 'प्रलंबित प्रमाणपत्रे',
    'dashboard.totalTaxes': 'एकूण कर गोळा',
    'dashboard.pendingTaxes': 'प्रलंबित कर',
    'dashboard.totalGrievances': 'एकूण तक्रारी',
    'dashboard.pendingGrievances': 'प्रलंबित तक्रारी',
    'dashboard.recentActivity': 'अलीकडील कार्य',
    
    // Certificates
    'certificate.title': 'प्रमाणपत्र व्यवस्थापन',
    'certificate.apply': 'प्रमाणपत्रासाठी अर्ज करा',
    'certificate.type': 'प्रमाणपत्र प्रकार',
    'certificate.status': 'स्थिती',
    'certificate.date': 'तारीख',
    'certificate.action': 'क्रिया',
    'certificate.view': 'पहा',
    'certificate.download': 'डाउनलोड',
    'certificate.approve': 'मंजूर करा',
    'certificate.reject': 'नाकारा',
    'certificate.pending': 'प्रलंबित',
    'certificate.approved': 'मंजूर',
    'certificate.rejected': 'नाकारले',
    'certificate.residence': 'रहिवासी प्रमाणपत्र',
    'certificate.birth': 'जन्म प्रमाणपत्र',
    'certificate.death': 'मृत्यू प्रमाणपत्र',
    'certificate.marriage': 'विवाह प्रमाणपत्र',
    'certificate.income': 'उत्पन्न प्रमाणपत्र',
    'certificate.caste': 'जात प्रमाणपत्र',
    'certificate.description': 'वर्णन',
    'certificate.remarks': 'टिप्पण्या',
    'certificate.submit': 'सबमिट',
    'certificate.cancel': 'रद्द करा',
    
    // Tax
    'tax.title': 'कर संग्रह',
    'tax.propertyTax': 'मालमता कर',
    'tax.waterTax': 'पाणी कर',
    'tax.assessmentYear': 'मूल्यांकन वर्ष',
    'tax.amount': 'रक्कम',
    'tax.status': 'स्थिती',
    'tax.pay': 'आता भरा',
    'tax.paid': 'भरले',
    'tax.due': 'बाकी',
    'tax.paymentSuccess': 'पेमेंट यशस्वी',
    'tax.paymentFailed': 'पेमेंट अयशस्वी',
    
    // Grievances
    'grievance.title': 'तक्रार प्रणाली',
    'grievance.submit': 'तक्रार सबमिट करा',
    'grievance.subject': 'विषय',
    'grievance.description': 'वर्णन',
    'grievance.category': 'श्रेणी',
    'grievance.status': 'स्थिती',
    'grievance.date': 'तारीख',
    'grievance.open': 'खुले',
    'grievance.inProgress': 'प्रगतीत',
    'grievance.resolved': 'सोडवले',
    'grievance.closed': 'बंद',
    
    // Schemes
    'scheme.title': 'सरकारी योजना',
    'scheme.apply': 'अर्ज करा',
    'scheme.eligibility': 'पात्रता',
    'scheme.benefits': 'लाभ',
    'scheme.lastDate': 'शेवटची तारीख',
    'scheme.status': 'स्थिती',
    'scheme.active': 'सक्रिय',
    'scheme.expired': 'बेपात्र',
    
    // Admin
    'admin.reports': 'अहवाल',
    'admin.users': 'वापरकर्ता व्यवस्थापन',
    'admin.settings': 'सेटिंग्ज',
    'admin.addUser': 'वापरकर्ता जोडा',
    'admin.editUser': 'वापरकर्ता संपादित करा',
    'admin.deleteUser': 'वापरकर्ता हटवा',
    'admin.role': 'भूमिका',
    'admin.name': 'नाव',
    'admin.email': 'ईमेल',
    'admin.phone': 'फोन',
    'admin.address': 'पत्ता',
    
    // Common
    'common.save': 'सेव्ह करा',
    'common.cancel': 'रद्द करा',
    'common.delete': 'हटवा',
    'common.edit': 'संपादित करा',
    'common.view': 'पहा',
    'common.back': 'मागे',
    'common.next': 'पुढे',
    'common.previous': 'मागे',
    'common.submit': 'सबमिट',
    'common.loading': 'लोड होत आहे...',
    'common.noData': 'कोणतेही डेटा उपलब्ध नाही',
    'common.success': 'यश',
    'common.error': 'त्रुटी',
    'common.confirm': 'पुष्टी करा',
    'common.yes': 'होय',
    'common.no': 'नाही',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;