# Gram Panchayat Management System

A comprehensive digital platform for efficient governance and citizen services at the gram panchayat level.

## Features

### 📋 Certificate Management
- Issue various types of certificates (Residence, Birth, Death, Marriage)
- Upload supporting documents including an optional photo
- Track application status
- Maintain digital records
- Filter by status and certificate type

### 💰 Tax Collection
- Track tax collection from citizens and businesses
- Monitor payment status (Pending, Partial, Paid)
- Update payment records
- View collection statistics and outstanding amounts
- Generate collection reports

### 🚨 Grievance Management System
- Citizens can file grievances online
- Multiple categories: Roads, Water, Electricity, Sanitation, Health, Education
- Priority levels: Low, Medium, High
- Track grievance status from filing to resolution
- Add resolution notes and follow-up

### 📚 Government Schemes Information Hub
- Browse available welfare and development schemes
- Filter by category: Agriculture, Health, Education, Social, Infrastructure, Employment
- View detailed eligibility criteria
- Check benefits and application process
- Contact information for each scheme

## Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Styling**: CSS3

## Project Structure

```
gram-panchayat-management/
├── public/
├── src/
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── certificates/
│   │   │   ├── CertificateForm.tsx
│   │   │   └── CertificateList.tsx
│   │   ├── taxes/
│   │   │   ├── TaxForm.tsx
│   │   │   └── TaxList.tsx
│   │   ├── grievances/
│   │   │   ├── GrievanceForm.tsx
│   │   │   └── GrievanceList.tsx
│   │   └── schemes/
│   │       ├── SchemeForm.tsx
│   │       └── SchemeList.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── CertificateManagement.tsx
│   │   ├── TaxCollection.tsx
│   │   ├── GrievanceSystem.tsx
│   │   └── GovernmentSchemes.tsx
│   ├── styles/
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── Navigation.css
│   │   ├── pages/
│   │   │   ├── Dashboard.css
│   │   │   ├── CertificateManagement.css
│   │   │   ├── TaxCollection.css
│   │   │   ├── GrievanceSystem.css
│   │   │   └── GovernmentSchemes.css
│   │   └── components/
│   │       ├── CertificateForm.css
│   │       ├── CertificateList.css
│   │       ├── TaxForm.css
│   │       ├── TaxList.css
│   │       ├── GrievanceForm.css
│   │       ├── GrievanceList.css
│   │       ├── SchemeForm.css
│   │       └── SchemeList.css
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. Navigate to the project directory:
```bash
cd gram-panchayat-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open in your browser at `http://localhost:3000`

## Usage

### Dashboard
- View quick statistics and overview
- Access all major features from one place
- See total citizens, active schemes, revenue collected, and grievance resolution rate

### Certificate Management
1. Click "Certificate Management" in the navigation
2. Click "New Certificate" to issue a new certificate
3. Fill in the required details:
   - Applicant name
   - Certificate type
   - Certificate number
   - Application date
   - Issuance date (if approved)
   - Status
4. Filter certificates by status (All, Pending, Approved, Rejected)

### Tax Collection
1. Navigate to "Tax Collection" module
2. View statistics (total tax, collected amount, collection rate, outstanding)
3. Click "New Tax Record" to add a new tax entry
4. Update payment amounts by clicking the edit button
5. Filter by payment status

### Grievance System
1. Go to "Grievances" section
2. Click "File Grievance" to register a new complaint
3. Select category, priority, and provide details
4. View all grievances with various filters
5. Click on grievance cards to expand and:
   - View full details
   - Update status
   - Mark as resolved with notes

### Government Schemes
1. Access "Schemes" module
2. Search for schemes by name or description
3. Filter by category (Agriculture, Health, Education, etc.)
4. Click on any scheme card to expand and view:
   - Detailed description
   - Eligibility criteria
   - Benefits offered
   - Application process
   - Contact information

## Key Data Types

### Certificate
- id: string
- applicantName: string
- certificateType: 'residence' | 'birth' | 'death' | 'marriage'
- applicationDate: string
- issuanceDate: string
- status: 'pending' | 'approved' | 'rejected'
- certificateNumber: string

### Tax Record
- id: string
- taxpayerId: string
- taxpayerName: string
- taxYear: number
- taxAmount: number
- amountPaid: number
- status: 'pending' | 'partial' | 'paid'
- dueDate: string
- paymentDate: string (optional)

### Grievance
- id: string
- complainantName: string
- email: string
- phone: string
- category: 'roads' | 'water' | 'electricity' | 'sanitation' | 'health' | 'education' | 'other'
- description: string
- location: string
- filedDate: string
- status: 'registered' | 'under-review' | 'in-progress' | 'resolved' | 'closed'
- priority: 'low' | 'medium' | 'high'
- attachments: string[] (optional)
- resolution: string (optional)
- resolutionDate: string (optional)

### Government Scheme
- id: string
- name: string
- description: string
- category: 'agriculture' | 'health' | 'education' | 'social' | 'infrastructure' | 'employment'
- eligibility: string[]
- benefits: string[]
- applicationProcess: string
- lastUpdated: string
- contactInfo: { department: string; phone: string; email: string }

## Features Highlights

✅ **User-Friendly Interface**: Clean and intuitive design optimized for all devices
✅ **Real-time Data Management**: Add, edit, and track data instantly
✅ **Advanced Filtering**: Filter records by multiple criteria
✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
✅ **Statistics Dashboard**: View key metrics and analytics
✅ **Search Functionality**: Quickly find schemes and information
✅ **Contact Integration**: Direct links to call or email departments
✅ **Status Tracking**: Monitor progress of applications and grievances

## Build for Production

To build the project for production:

```bash
npm run build
```

The optimized files will be generated in the `dist/` directory.

## Future Enhancements

This repo is a **frontend-only demonstration**; all features currently run in the browser.  
Potential enhancements include:

- User authentication and authorization with a proper backend
- Database integration for persistent storage
- Email and SMS notifications
- Report generation and export
- Mobile app development
- Payment gateway integration
- Document upload and management
- Multi-language support
- Analytics and insights dashboard

## Support

For support or issues, please contact the administration through the contact information provided in the Government Schemes module or your local gram panchayat office.

## License

This project is developed for gram panchayat management and is subject to local governance policies.

---

**Version**: 1.0.0  
**Last Updated**: February 5, 2024
