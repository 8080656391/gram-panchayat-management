# Gram Panchayat Management System - Backend

A comprehensive backend API for the Gram Panchayat Management System built with Node.js, Express, TypeScript, and MongoDB.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Citizen, Staff, Admin)
- Secure password hashing with bcrypt

### 📋 Certificate Management
- CRUD operations for certificate applications
- Document upload support (images, PDFs)
- Status tracking and approval workflow
- Certificate number generation

### 🚨 Grievance Management
- File and track citizen grievances
- Priority levels and status management
- Attachment support
- Resolution tracking and feedback

### 💰 Tax Collection
- Tax record management
- Payment tracking and status updates
- Collection statistics and reporting

### 📚 Government Schemes
- Scheme information management
- Category-based filtering
- Public access to scheme details

### 👥 User Management
- User registration and profile management
- Role-based permissions
- User statistics and analytics

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd gram-panchayat-management/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env` file and update the values:
   ```bash
   cp .env.example .env
   ```
   - Update the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/gram-panchayat
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   UPLOAD_PATH=../uploads
   MAX_FILE_SIZE=5242880
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Users (Staff/Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - User statistics

### Certificates
- `GET /api/certificates/my-certificates` - Get user's certificates (Citizen)
- `POST /api/certificates` - Create certificate application (Citizen)
- `GET /api/certificates` - Get all certificates (Staff/Admin)
- `GET /api/certificates/:id` - Get certificate by ID (Staff/Admin)
- `PUT /api/certificates/:id` - Update certificate (Staff/Admin)
- `DELETE /api/certificates/:id` - Delete certificate (Admin)
- `POST /api/certificates/:id/upload` - Upload document (Staff/Admin)

### Grievances
- `GET /api/grievances/my-grievances` - Get user's grievances (Citizen)
- `POST /api/grievances` - File new grievance (Citizen)
- `POST /api/grievances/:id/feedback` - Add feedback (Citizen)
- `GET /api/grievances` - Get all grievances (Staff/Admin)
- `GET /api/grievances/:id` - Get grievance by ID (Staff/Admin)
- `PUT /api/grievances/:id` - Update grievance (Staff/Admin)
- `DELETE /api/grievances/:id` - Delete grievance (Admin)
- `POST /api/grievances/:id/upload` - Upload attachment (Staff/Admin)

### Government Schemes
- `GET /api/schemes` - Get all schemes (Public)
- `GET /api/schemes/category/:category` - Get schemes by category (Public)
- `GET /api/schemes/:id` - Get scheme by ID (Public)
- `POST /api/schemes` - Create scheme (Admin)
- `PUT /api/schemes/:id` - Update scheme (Admin)
- `DELETE /api/schemes/:id` - Delete scheme (Admin)

### Taxes
- `GET /api/taxes/my-records` - Get user's tax records (Citizen)
- `POST /api/taxes/:id/payment` - Record payment (Citizen)
- `GET /api/taxes` - Get all tax records (Staff/Admin)
- `GET /api/taxes/:id` - Get tax record by ID (Staff/Admin)
- `POST /api/taxes` - Create tax record (Staff/Admin)
- `PUT /api/taxes/:id` - Update tax record (Staff/Admin)
- `DELETE /api/taxes/:id` - Delete tax record (Admin)
- `GET /api/taxes/stats` - Tax statistics (Staff/Admin)

## Data Models

### User
- Basic profile information
- Role-based permissions
- Authentication details

### Certificate
- Application details
- Document attachments
- Approval workflow
- Status tracking

### Grievance
- Complaint details
- Priority and status
- Resolution tracking
- Feedback system

### Tax Record
- Tax assessment details
- Payment tracking
- Status management

### Scheme
- Government scheme information
- Eligibility criteria
- Contact details

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Input Validation**: Comprehensive request validation
- **File Upload Security**: Type and size restrictions

## File Upload

The system supports file uploads for certificates and grievances:
- **Allowed formats**: Images (JPEG, PNG, GIF), PDFs, Word documents
- **Max file size**: 5MB per file
- **Storage**: Local file system with organized directories

## Error Handling

Comprehensive error handling with:
- Custom error classes
- Consistent error response format
- Validation error messages
- Server error logging

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
backend/
├── src/
│   ├── config/          # Database and configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Custom middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   └── server.ts       # Main server file
├── uploads/            # File upload directories
├── .env               # Environment variables
├── package.json       # Dependencies
└── tsconfig.json      # TypeScript configuration
```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables for production

3. Start the server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.