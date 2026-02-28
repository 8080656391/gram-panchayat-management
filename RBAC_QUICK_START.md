# Quick Start: Role-Based System

## 🚀 Getting Started

### 1. **First Time Running the App**

When you start the application, you'll be automatically redirected to the Login page.

### 2. **Select Your Role**

Three options are available:

```
┌─────────────────────────────────────────┐
│  🧑 CITIZEN         👥 STAFF     🛡️ ADMIN  │
│  Services Access   Management   Full Control │
└─────────────────────────────────────────┘
```

### 3. **Access Your Dashboard**

After login, you'll see a customized dashboard based on your role.

---

## 👤 Citizen Workflow

### Login as Citizen
1. Click "Login as Citizen" button
2. You'll access the citizen portal

### Available Services
- **Dashboard**: Personal information and summary
- **Certificates**: Apply for certificates (Residence, Birth, Death, Marriage)
- **Tax Payment**: View property taxes and make payments
- **Grievances**: File complaints about village infrastructure and services
- **Schemes**: Browse and apply for government schemes

### Sample Citizen Tasks
- Apply for a residence certificate
- Check tax payment status
- File a grievance about road damage
- View available agricultural schemes

---

## 👥 Staff Workflow

### Login as Staff
1. Click "Login as Staff" button
2. You'll access the staff management portal

### Available Functions
- **Dashboard**: System statistics and overview
- **Certificates**: Review and process applications
- **Tax Management**: Track collections and payments
- **Grievances**: Monitor and update complaint status
- **Schemes**: Manage scheme details and eligibility

### Sample Staff Tasks
- Approve pending certificate requests
- Record tax payments
- Update grievance status from "under-review" to "resolved"
- Update scheme eligibility criteria

---

## 🛡️ Administrator Workflow

### Login as Administrator
1. Click "Login as Administrator" button
2. You'll access the full administrative system

### Available Features

#### 📊 **Reports & Analytics** (`/admin/reports`)
- View system statistics
- Monitor recent activities
- Analyze service distribution
- Track system health
- Filter by date range

#### 👨‍💼 **User Management** (`/admin/users`)
- View all system users
- Create new user accounts
- Assign roles to users
- Activate/deactivate users
- Delete user accounts
- View user statistics

#### ⚙️ **System Settings** (`/admin/settings`)
- Configure communication preferences
- Set service processing times
- Enable/disable system features
- Configure backup settings
- View system information

### Sample Admin Tasks
- Create new staff account for new employee
- Deactivate user who left the village
- View monthly transaction report
- Update tax deadline month
- Enable/disable notifications system

---

## 🔐 Session Management

### Logout
- Click your **Role Badge** in navigation
- Click **Logout** button
- You'll be redirected to login page

### Session Persistence
- Your login persists across page refreshes
- Close browser and reopen - you'll still be logged in
- Only logs out when you explicitly click Logout

### Login as Different Role
1. Click Logout
2. Select different role on login page
3. New role-specific dashboard loads

---

## 🗂️ Navigation Guide

### Menu Items by Role

**Citizen Menu:**
```
🏛️ Gram Panchayat
├── 🏠 Dashboard
├── 📄 Certificates
├── 💵 Tax Payment
├── 🚨 Grievances
└── 📚 Schemes
└── [CITIZEN] [Logout]
```

**Staff Menu:**
```
🏛️ Gram Panchayat
├── 🏠 Dashboard
├── 📄 Certificates
├── 💵 Tax Management
├── 🚨 Grievances
├── 📚 Schemes
└── [STAFF] [Logout]
```

**Admin Menu:**
```
🏛️ Gram Panchayat
├── 🏠 Dashboard
├── 📄 Certificates
├── 💵 Tax Management
├── 🚨 Grievances
├── 📚 Schemes
├── 📊 Reports
├── 👥 Users
├── ⚙️ Settings
└── [ADMIN] [Logout]
```

---

## 🔄 Common Tasks

### Create a New Staff Member (Admin Only)
1. Login as Administrator
2. Go to **Users** section
3. Click **Add New User**
4. Fill in details (Name, Email, Role)
5. Select **Staff** as role
6. Click **Add User**

### Process a Certificate Request (Staff)
1. Login as Staff
2. Go to **Certificates**
3. Find pending certificate
4. Review application
5. Approve or reject
6. Update status

### File a Grievance (Citizen)
1. Login as Citizen
2. Go to **Grievances**
3. Click **New Grievance**
4. Fill form (Category, Description, Location)
5. Submit
6. Track status in Grievance List

### View System Analytics (Admin)
1. Login as Administrator
2. Go to **Reports**
3. Select date range
4. View statistics and trends
5. Analyze activities

---

## 💡 Tips & Tricks

### Multi-Role Testing
- Test all features by logging in as different roles
- Notice how menus and access change
- Understand separation of concerns

### Demo Features
- All demo data is sample/mock
- No backend persistence yet
- Data resets on page refresh (unless stored in localStorage)

### UI Indicators
- **Role Badge**: Shows current logged-in role in navbar
- **Menu Items**: Change based on role access
- **Color Coding**: Different colors for Admin (Orange), Staff (Blue), Citizen (Green)

---

## ❓ Troubleshooting

### I'm stuck on login page
- Clear browser cache: `Ctrl + Shift + Delete`
- Try a different role
- Check browser console for errors (F12)

### Menu items not showing up
- Verify you're logged in (check role badge)
- Try logging out and back in
- Refresh page (F5)

### Unauthorized access error
- Your role doesn't have permission for that page
- Logout and login with appropriate role
- Contact administrator if needed

---

## 🎓 Learning Path

**For New Users:**
1. Start as Citizen
2. Explore basic services
3. Login as Staff to see management view
4. Finally login as Admin to explore full system

**For Administrators:**
1. Review user management features
2. Configure system settings
3. Monitor reports and analytics
4. Create and manage user accounts

---

## 📞 Support

For issues or questions:
1. Check RBAC_GUIDE.md for detailed documentation
2. Review component files in `src/pages/admin/`
3. Check authentication context in `src/context/`

---

**Happy Using! 🎉**

*Last Updated: February 2026*
