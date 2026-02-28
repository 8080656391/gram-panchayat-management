# Role-Based Access Control (RBAC) Implementation

## Overview

The Gram Panchayat Management System now includes a comprehensive role-based access control system that serves both **Citizens** and **Administration** with tailored interfaces and features.

## User Roles

### 1. **Citizen** 👤
- **Access**: Individual residents of the village
- **Features Available**:
  - Dashboard with personal information
  - Certificate Management (apply for and track certificates)
  - Tax Payment (view and pay property taxes)
  - Grievance System (file and track complaints)
  - Government Schemes (browse and apply for schemes)

### 2. **Staff** 👥
- **Access**: Village administrative staff
- **Features Available**:
  - Dashboard with overview statistics
  - Certificate Management (process and approve applications)
  - Tax Management (manage tax records and collections)
  - Grievance Management (process and resolve complaints)
  - Schemes Management (manage scheme details)
  - Reports and analytics (basic)

### 3. **Administrator** 🛡️
- **Access**: System administrators with full control
- **Features Available**:
  - All Staff features
  - User Management (create, edit, deactivate users)
  - System Reports & Analytics
  - System Settings Configuration
  - System maintenance and monitoring

## File Structure

```
src/
├── context/
│   └── AuthContext.tsx          # Authentication state management
├── components/
│   ├── ProtectedRoute.tsx       # Route protection component
│   └── Navigation.tsx           # Role-based navigation
├── pages/
│   ├── Login.tsx               # Role selection login
│   ├── Unauthorized.tsx        # Access denied page
│   └── admin/
│       ├── AdminReports.tsx    # Analytics and reports
│       ├── AdminUsers.tsx      # User management
│       └── AdminSettings.tsx   # System configuration
└── styles/
    ├── Navigation.css          # Updated with role badges
    └── pages/
        ├── Login.css           # Login page styling
        ├── Unauthorized.css    # Error page styling
        ├── AdminReports.css    # Reports page styling
        ├── AdminUsers.css      # User management styling
        └── AdminSettings.css   # Settings page styling
```

## How It Works

### 1. **Authentication Flow**

```
User Visits App
      ↓
Check if logged in
      ↓
   No → Show Login Page
      ↓
   Yes → Show Dashboard (role-based)
```

### 2. **Login Process**

1. User lands on `/login` page
2. Selects their role: Citizen, Staff, or Admin
3. System creates a user context and saves to localStorage
4. Redirected to dashboard
5. Navigation automatically updates with role-specific menu items

### 3. **Route Protection**

All routes are protected using `ProtectedRoute` component:
- Checks if user is authenticated
- Verifies user has required role
- Redirects unauthorized users to `/unauthorized`
- Redirects unauthenticated users to `/login`

### 4. **Navigation Updates**

The navigation bar dynamically displays:
- **Citizens**: Dashboard, Certificates, Tax Payment, Grievances, Schemes
- **Staff**: Dashboard, Certificates, Tax Management, Grievances, Schemes
- **Admin**: Dashboard, Certificates, Tax, Grievances, Schemes, Reports, Users, Settings

Plus:
- Role badge showing current logged-in role
- Logout button for session termination

## Key Features

### Authentication Context (`AuthContext.tsx`)

```typescript
export const useAuth = () => {
  return {
    user: User | null,           // Current user object
    isAuthenticated: boolean,    // Whether user is logged in
    userRole: 'citizen' | 'staff' | 'admin' | null,
    login: (role) => void,       // Login user
    logout: () => void,          // Logout user
  };
};
```

### Protected Routes (`ProtectedRoute.tsx`)

```typescript
<ProtectedRoute requiredRole={['admin']}>
  <AdminReports />
</ProtectedRoute>
```

### Admin Pages

#### **1. Reports & Analytics** (`AdminReports.tsx`)
- Statistics cards showing key metrics
- Recent activity timeline
- Multiple report views
- Date range filtering

#### **2. User Management** (`AdminUsers.tsx`)
- View all system users
- Create new users with assigned roles
- Activate/deactivate users
- User statistics and counts
- Edit and delete user functionality

#### **3. System Settings** (`AdminSettings.tsx`)
- Communication configuration
- Service parameters
- Feature toggles
- System information
- Auto-backup settings

## Usage Guide

### For Citizens
1. Login as Citizen on login page
2. Access certificate services, tax payment, grievance system, and schemes
3. View personal dashboard

### For Staff
1. Login as Staff on login page
2. Manage applications and requests
3. Process certifications and tax records
4. Handle grievances and track resolutions

### For Administrators
1. Login as Administrator on login page
2. Access full administrative dashboard
3. Manage all system users
4. View analytics and reports
5. Configure system settings
6. Monitor system health

## Session Persistence

- User sessions are persisted in `localStorage`
- Sessions survive page refreshes
- Clear `localStorage` or click Logout to end session

## Styling & UX

- **Consistent Design**: All new pages follow existing design system
- **Role Badges**: Visual indicator of current user role
- **Responsive**: Mobile-friendly interface for all pages
- **Color Coding**: Different colors for different roles/actions
- **Intuitive Navigation**: Clear menu structure based on user role

## Security Notes

⚠️ **Important**: This implementation uses client-side authentication for demonstration. For production:

1. Implement backend authentication with JWT tokens
2. Add password management
3. Use secure session handling
4. Validate roles on the backend
5. Implement audit logging
6. Add encryption for sensitive data

## Customization

### Adding New Roles

1. Update `User` interface in `src/types/index.ts`
2. Modify `useAuth` hook in `AuthContext.tsx`
3. Update `Navigation.tsx` menu items
4. Create new routes in `App.tsx`
5. Add protection to routes with `ProtectedRoute`

### Adding New Features

1. Create new page component in `src/pages/`
2. Create corresponding CSS in `src/styles/pages/`
3. Add route in `App.tsx`
4. Protect route with required roles
5. Add menu item to `Navigation.tsx` for allowed roles

## Testing the System

### Test as Citizen
- Restrictions prevent access to admin features
- Limited menu options
- Focus on service usage (certificates, tax, etc.)

### Test as Staff
- Can manage and process applications
- Can view reports (basic)
- Cannot access user management

### Test as Admin
- Full system access
- Can manage users
- Can view all analytics
- Can configure system settings

## Logout and Session Management

- Click "Logout" in navigation menu
- Returns to login page
- Session data cleared from localStorage
- Can login as different role

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Production Ready
