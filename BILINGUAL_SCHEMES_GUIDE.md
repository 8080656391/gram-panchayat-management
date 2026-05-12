# Bilingual Government Schemes Setup Guide

This guide explains how to use the bilingual government schemes feature in the Gram Panchayat Management System.

## Overview

The system now supports government schemes in **two languages**:
- **English (en)**
- **Marathi (mr)** - मराठी

All scheme information (name, description, eligibility, benefits, and application process) is available in both languages.

## Pre-loaded Schemes

The following schemes are automatically loaded when you run the seeding script:

### Housing & Infrastructure Schemes (आवास व अवस्थापना योजनांनी)

1. **Gruhnirman Ramai Avas Yojana** / गृहनिर्माण रामाई आवास योजना
   - Category: Infrastructure
   - Purpose: Housing construction assistance for economically weaker sections
   - Benefits: Up to 1.5 lakhs rupees financial assistance

2. **Shabari Adivasi Gharkul Yojana** / शबरी आदिवासी घरकुल योजना
   - Category: Social
   - Purpose: Housing scheme exclusively for Adivasi community members
   - Benefits: Up to 2.5 lakhs rupees assistance with priority processing

3. **Pradhanmantri Avas Yojana** / प्रधानमंत्री आवास योजना
   - Category: Infrastructure
   - Purpose: Central government scheme for affordable housing
   - Benefits: Up to 2 lakhs rupees central assistance + state assistance

### Rural Development Schemes (ग्रामीण विकास योजना)

4. **Samridh Gram Yojana** / समृद्ध ग्राम योजना
   - Category: Social
   - Purpose: Integrated rural development for holistic village development
   - Benefits: Community infrastructure development, skills training, microfinance

5. **Mukhyamantri Gram Sadak Yojana** / मुख्यमंत्री ग्राम सड़क योजना
   - Category: Infrastructure
   - Purpose: Connecting villages with all-weather road network
   - Benefits: Government-funded road construction, improved transportation access

6. **Swachh Bharat Mission** / स्वच्छ भारत मिशन
   - Category: Social
   - Purpose: National cleanliness campaign for sanitation and waste management
   - Benefits: Toilet construction assistance, awareness programs, recognition awards

## Setup Instructions

### Step 1: Backend Configuration

Ensure your `.env` file in the backend directory contains:
```
MONGODB_URI=mongodb://localhost:27017/gram-panchayat
JWT_SECRET=your_secret_key
PORT=5000
```

### Step 2: Seed the Schemes

Run the following command in the backend directory to load all bilingual schemes into the database:

```bash
npm run seed:schemes
```

This command:
- Connects to your MongoDB database
- Clears existing schemes
- Creates a default admin user if none exists
- Adds all 6 schemes with complete bilingual information

**Expected Output:**
```
Connected to MongoDB
Cleared existing schemes
Successfully seeded 6 schemes with bilingual content

📋 Created Schemes:
1. Gruhnirman Ramai Avas Yojana / गृहनिर्माण रामाई आवास योजना
   Category: infrastructure
...
Seeding completed successfully!
```

## Using the Frontend

### Viewing Schemes in Your Language

1. **Select Language**: Click the language toggle in the Navigation component (top-right corner)
2. **Choose Language**: Select between **English** and **मराठी (Marathi)**
3. **View Schemes**: Navigate to **Schemes** menu
   - All scheme information will automatically display in your selected language
   - Language is displayed at the top of the page: "🌐 Language: English" or "🌐 Language: मराठी (Marathi)"

### Filtering Schemes

1. Use the **"Filter by Category"** section to view schemes by:
   - Agriculture (कृषि)
   - Health (स्वास्थ्य)
   - Education (शिक्षा)
   - Social (सामाजिक)
   - Infrastructure (अवस्थापना)
   - Employment (रोजगार)

2. Click category buttons to filter schemes
3. Click **"All"** to see all schemes

### Expanding Scheme Details

1. Click on any scheme card to expand its details
2. View the following information in your selected language:
   - **Eligibility Criteria** (पात्रता मानदंड)
   - **Benefits** (लाभ)
   - **How to Apply** (आवेदन कैसे करें)
   - **Contact Information** (संपर्क जानकारी)

### Adding New Schemes (Admin/Staff Only)

1. Click **"Add Scheme"** button (only visible to Admin/Staff users)
2. Fill in the scheme details:
   - Switch between **English** and **मराठी** tabs to enter scheme information in both languages
   - Fill **Name**, **Description**, **Eligibility**, **Benefits**, and **Application Process** in English first
   - Switch to Marathi tab and provide the same information in Marathi
   - Category, Department, Phone, and Email are shared across languages
3. Click **"Add Scheme"** to save

## API Endpoints

### Get All Schemes
```
GET /api/schemes?page=1&limit=10&category=infrastructure
Headers: Authorization: Bearer {token}
```

### Get Schemes by Category
```
GET /api/schemes/category/infrastructure
Headers: Authorization: Bearer {token}
```

### Get Single Scheme
```
GET /api/schemes/{id}
Headers: Authorization: Bearer {token}
```

### Create Scheme (Admin Only)
```
POST /api/schemes
Headers: 
  Authorization: Bearer {admin_token}
  Content-Type: application/json

Body:
{
  "name": {
    "en": "Scheme Name",
    "mr": "योजनेचे नाव"
  },
  "description": {
    "en": "Description",
    "mr": "वर्णन"
  },
  "category": "infrastructure",
  "eligibility": {
    "en": ["Criteria 1", "Criteria 2"],
    "mr": ["मानदंड १", "मानदंड २"]
  },
  "benefits": {
    "en": ["Benefit 1", "Benefit 2"],
    "mr": ["लाभ १", "लाभ २"]
  },
  "applicationProcess": {
    "en": "How to apply",
    "mr": "कसे आवेदन करायचे"
  },
  "contactInfo": {
    "department": "Department Name",
    "phone": "9876543210",
    "email": "email@example.com"
  }
}
```

### Update Scheme (Admin Only)
```
PUT /api/schemes/{id}
Headers: Authorization: Bearer {admin_token}
```

### Delete Scheme (Admin Only)
```
DELETE /api/schemes/{id}
Headers: Authorization: Bearer {admin_token}
```

### Delete All Schemes (Admin Only)
```
DELETE /api/schemes
Headers: Authorization: Bearer {admin_token}
```

## Technical Details

### Database Schema Changes

The Scheme model has been updated to support bilingual fields:

```typescript
interface IScheme extends Document {
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
  contactInfo: {
    department: string;
    phone: string;
    email: string;
  };
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
}
```

### Frontend Components

- **GovernmentSchemes.tsx**: Main page component that fetches schemes from API and filters by category
- **SchemeList.tsx**: Displays schemes with language-aware content rendering
- **SchemeForm.tsx**: Bilingual form for adding new schemes with English/Marathi tabs

### Language Context

The application uses the `useLanguage()` hook from `LanguageContext` to:
- Get the currently selected language
- Automatically display scheme content in the selected language
- Update the UI language labels

## Troubleshooting

### Schemes Not Displaying

1. **Verify MongoDB connection**: Check that MongoDB is running
2. **Run seeding script**: Execute `npm run seed:schemes` in the backend directory
3. **Clear browser cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. **Check API response**: Open browser DevTools → Network → Check `/api/schemes` response

### Bilingual Content Not Showing

1. **Verify language selection**: Ensure language is switched in Navigation component
2. **Check database**: Confirm schemes have both `en` and `mr` fields with content
3. **Restart backend**: The frontend cache may need to be cleared

### Seeding Script Errors

```bash
# If you encounter "Cannot find module" errors:
npm install

# If MongoDB connection fails:
# Ensure MongoDB service is running:
# Windows: Start "MongoDB" from Services
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# If port conflicts occur:
# Change PORT in .env file and restart backend
```

## Future Enhancements

Planned features for the schemes system:
- [ ] Scheme application tracking
- [ ] User bookmarks/favorites for schemes
- [ ] Notification alerts for new schemes
- [ ] Scheme document downloads (PDF/Word)
- [ ] Advanced filtering (income level, caste, etc.)
- [ ] Scheme eligibility checker tool
- [ ] User feedback and ratings for schemes

## Support

For issues or questions about the bilingual schemes feature:
1. Check the troubleshooting section above
2. Review the API documentation
3. Check browser console for errors
4. Verify backend logs for API errors
