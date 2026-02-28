# Gram Panchayat Management System - Feature Guide

## 🏠 Dashboard Page
Welcome page with:
- Hero section with system introduction
- Quick statistics cards (Total Citizens, Active Schemes, Revenue, Resolved Grievances)
- Feature cards linking to all modules
- Information cards about the system
- Call-to-action buttons
- Footer with links

**URL**: `/`

---

## 📋 Certificate Management Page

### Main Features
1. **Add New Certificate Button** - Opens form to issue new certificate
2. **Status Filters** - Filter by All, Pending, Approved, Rejected
3. **Certificate Table** with columns:
   - Certificate Number (unique ID)
   - Applicant Name
   - Certificate Type
   - Application Date
   - Issuance Date (if issued)
   - Status (with color-coded badges)
   - Delete button

### Functionality
- ✅ Create new certificates
- ✅ View all issued certificates
- ✅ Filter by status
- ✅ Delete certificates
- ✅ Track application timeline

### Sample Data
- Rajesh Kumar - Residence Certificate - Approved
- Priya Singh - Birth Certificate - Pending
- Amit Patel - Marriage Certificate - Approved

**URL**: `/certificates`

---

## 💰 Tax Collection Page

### Statistics Cards
- Total Tax Amount (₹5,000 - ₹15,000 total)
- Amount Collected (₹10,500)
- Collection Rate (87%)
- Outstanding Amount (₹7,500)

### Main Features
1. **New Tax Record Button** - Add new taxpayer (staff/admin only)
2. **Status Filters** - All, Pending, Partial, Paid
3. **Tax Records Table** with:
   - Taxpayer ID
   - Taxpayer Name
   - Tax Year
   - Total Amount
   - Amount Paid (with progress bar)
   - Outstanding Amount
   - Due Date
   - Status (color-coded)
   - Edit button for payment updates (staff/admin) or **Pay Tax Online** button for citizens, which navigates to a full payment portal with:
  - Order summary (taxpayer details, total amount, outstanding balance)
  - Payment amount adjustment (up to outstanding amount)
  - Multiple payment methods: Credit/Debit Card, UPI, Net Banking
  - Form validation for each payment method
  - Success confirmation with reference ID

### Functionality
- ✅ Create tax records
- ✅ Update payment status
- ✅ View payment progress
- ✅ Filter by payment status
- ✅ Calculate statistics
- ✅ View outstanding amounts

### Sample Data
- Sharma Family - ₹5,000 - Paid
- Patel Enterprises - ₹15,000 - Partial (₹7,500)
- Singh Traders - ₹8,000 - Pending
- Gupta Farm - ₹3,000 - Paid

**URL**: `/taxes`

---

## 🚨 Grievance System Page

### Statistics Cards
- Total Grievances
- Pending Grievances
- In Progress
- Resolved

### Features
1. **File Grievance Button** - Opens form
2. **Alert Banner** - Shows high-priority grievances
3. **Status Filters** - All, Registered, Under Review, In Progress, Resolved
4. **Priority Filters** - All, Low, Medium, High

### Grievance Cards (Expandable)
When collapsed: Shows priority badge, name, category, status
When expanded: Shows:
- Full description
- Location
- Contact information
- Filed date
- Status selector (with color-coded options)
- Resolution box (if status is resolved)
- Actions to update status and mark as resolved

### Functionality
- ✅ File new grievances
- ✅ View grievance details
- ✅ Update grievance status
- ✅ Add resolution notes
- ✅ Filter by status and priority
- ✅ Priority badges with colors
- ✅ Alert notifications for high-priority items

### Sample Data
- Roads: Pothole (High, Resolved)
- Water Supply: Shortage (High, In Progress)
- Electricity: Streetlight (Medium, Under Review)
- Sanitation: Garbage (Medium, Registered)

**URL**: `/grievances`

---

## 📚 Government Schemes Page

### Statistics
- Total Schemes
- Number of Categories
- Total Benefits Available
- Last Update

### Features
1. **Add Scheme Button** - Available to **staff** and **admin** users for adding new schemes
2. **Search Box** - Search by name or description
3. **Category Filters**:
   - All
   - Agriculture (🌾)
   - Health (⚕️)
   - Education (📚)
   - Social (👥)
   - Infrastructure (🏗️)
   - Employment (💼)

### Scheme Cards (Expandable)
When collapsed:
- Category icon (color-coded)
- Scheme name
- Brief description
- Expand button

When expanded:
- **Eligibility Criteria** - Bulleted list
- **Benefits** - Bulleted list with checkmarks
- **How to Apply** - Detailed process
- **Contact Information**:
  - Department name
  - Phone number (clickable tel link)
  - Email (clickable mailto link)
  - Last updated date

### Functionality
- ✅ Browse schemes by category
- ✅ Search schemes
- ✅ View detailed information
- ✅ See eligibility criteria
- ✅ Understand benefits
- ✅ Get contact details
- ✅ Direct contact links

### Sample Schemes
1. **Pradhan Mantri Fasal Bima Yojana** (Agriculture)
   - Crop insurance for farmers
   - Up to 2% premium coverage

2. **Ayushman Bharat** (Health)
   - Health insurance for poor families
   - ₹5 lakh coverage

3. **PM-KISAN** (Agriculture)
   - Income support for farmers
   - ₹6,000 per annum

4. **Bhamashah Card** (Social)
   - Welfare and security scheme
   - Multiple benefits

**URL**: `/schemes`

---

## 🧭 Navigation Bar

Located at the top, includes:
- **Logo**: Gram Panchayat (with 🏛️ emoji)
- **Links**:
  - Dashboard (Home icon)
  - Certificates (Document icon)
  - Tax Collection (Dollar icon)
  - Grievances (Alert icon)
  - Schemes (Book icon)
- **Mobile Menu**: Hamburger icon on smaller screens

---

## 🎨 Design System

### Colors
- **Primary**: #667eea (Purple Blue)
- **Secondary**: #764ba2 (Darker Purple)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Danger**: #ef4444 (Red)
- **Info**: #3b82f6 (Blue)
- **Neutral**: #666, #999, #ddd

### Typography
- Font: Inter, system-ui, Avenir, Helvetica, Arial
- Headings: Bold, 1.5rem - 2.5rem
- Body: 0.95rem - 1rem
- Labels: 0.85rem - 0.9rem

### Components
- Cards: 12px border-radius, shadows
- Buttons: 8px border-radius, hover effects
- Forms: 8px inputs, focus states
- Tables: Striped rows, hover effects
- Badges: Color-coded status indicators

---

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (Full layout)
- **Tablet**: 768px - 1199px (2-column grid)
- **Mobile**: Below 768px (1-column, hamburger menu)

---

## 🔄 User Workflows

### Certificate Issuance
1. Go to Certificate Management
2. Click "New Certificate"
3. Fill form with applicant details
4. Submit
5. Certificate appears in list
6. Update status when issued

### Tax Payment Tracking
1. Go to Tax Collection
2. Create new tax record OR find existing
3. Click edit button to update payment
4. Enter amount paid
5. Status auto-updates
6. View statistics updated in real-time

### Filing & Resolving Grievances
1. Go to Grievances
2. Click "File Grievance"
3. Enter complainant info and issue details
4. Submit grievance
5. Staff clicks expand on grievance card
6. Updates status as work progresses
7. Adds resolution notes when complete
8. Marks as resolved

### Exploring Schemes
1. Go to Government Schemes
2. Search by name (optional)
3. Filter by category
4. Click scheme card to expand
5. Read eligibility and benefits
6. Click contact info to reach department

---

## ⚙️ Settings & Customization

### Form Validation
- Required fields marked with *
- Email validation
- Phone number validation
- Date validation

### Status Management
- Automatic status updates based on data
- Color-coded indicators
- Clear status transitions

### Filters
- Multi-select capable
- Reset to "All" option
- Real-time filtering

---

## 📊 Data Management

### Create Operations
- All forms include validation
- Unique ID auto-generation
- Timestamp tracking
- Automatic status defaults

### Read Operations
- Display in tables or cards
- Sortable columns (ready for implementation)
- Search and filter capabilities
- Expandable details

### Update Operations
- Edit buttons on records
- Status dropdowns
- Payment/amount inputs
- Resolution note textarea

### Delete Operations
- Delete buttons on records
- Confirmation ready (to add)
- Instant removal

---

## 🔔 Notifications & Alerts

### High-Priority Alert Banner
- Shows when high-priority grievances exist
- Red color with warning icon
- Counts pending high-priority items

### Status Badges
- Pending: Orange
- In Progress: Blue
- Resolved: Green
- Rejected: Red

### Progress Indicators
- Payment progress bars
- Status transitions
- Timeline tracking

---

**This comprehensive system provides all tools needed for modern gram panchayat governance!**
