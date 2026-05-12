# Registration Data Save Verification Guide

## ✅ How Registration Data is Saved to Database

The system has been properly configured to save registration data:

### Data Flow
1. **Frontend** (React) → User fills registration form in Login.tsx
2. **API Call** → AuthContext.tsx sends POST to `/api/auth/register`
3. **Backend Validation** → authController.ts validates all fields
4. **Database Save** → User.ts model saves to MongoDB with:
   - Password hashing (bcryptjs)
   - Data validation
   - Duplicate email/aadhar checks
   - Registration timestamp

### Required Setup Steps

#### Step 1: Start MongoDB
```bash
# On Windows, if installed as service:
net start MongoDB

# Or if running locally, start MongoDB manually
mongod --dbpath /path/to/your/data
```

**Default MongoDB**: `mongodb://localhost:27017/gram-panchayat`

#### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

#### Step 3: Start Backend Server
```bash
npm run dev
```

You should see:
- `🍃 MongoDB Connected: localhost`
- `🚀 Server running on port 5000`

#### Step 4: Start Frontend
In new terminal:
```bash
# From root directory
npm run dev
```

Frontend will run on `http://localhost:5173`
Backend API: `http://localhost:5000/api`

### ✅ Verify Data is Being Saved

#### Option A: Using MongoDB Compass (GUI)
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to `localhost:27017`
3. Navigate to `gram-panchayat` database
4. Check `users` collection
5. Verify user documents after registration

#### Option B: Using Terminal
```bash
# Connect to MongoDB CLI
mongosh

# Select database
use gram-panchayat

# View all users
db.users.find().pretty()

# View specific user
db.users.findOne({ email: "user@example.com" })
```

#### Option C: Using API Test Tool
Use Postman or Thunder Client:

**Test Registration:**
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "9876543210",
  "village": "Test Village",
  "role": "citizen"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "Test User",
      "email": "test@example.com",
      "role": "citizen",
      "registrationDate": "2024-..."
    },
    "token": "eyJhbG..."
  }
}
```

### 📊 Database Schema

**User Collection Fields:**
- `name` (string, required)
- `email` (string, required, unique)
- `password` (string, hashed with bcrypt)
- `phone` (string, 10 digits required)
- `village` (string, required)
- `role` (citizen | staff | admin, default: citizen)
- `aadharNumber` (optional, unique if provided)
- `dateOfBirth` (optional)
- `address` (optional)
- `registrationDate` (automatic, default: now)
- `isActive` (boolean, default: true)
- `createdAt` (automatic timestamp)
- `updatedAt` (automatic timestamp)

### 🔒 Security Features

✅ **Password Hashing**: bcryptjs with salt rounds=12
✅ **Email Validation**: Valid email format required
✅ **Phone Validation**: Valid phone number required
✅ **Duplicate Prevention**: Email and Aadhar unique checks
✅ **JWT Authentication**: Secure token generation
✅ **Rate Limiting**: 100 requests per 15 minutes per IP
✅ **CORS**: Cross-origin requests from frontend

### ⚠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot GET /api/auth/register" | Backend not running. Run `npm run dev` in backend folder |
| "MongoDB connection error" | MongoDB not running. Start MongoDB service |
| "Email already exists" | Use different email for registration |
| "Invalid phone number" | Phone must be 10 digits starting with 6-9 |
| "CORS error" | Ensure backend CORS allows frontend URL (http://localhost:5173) |

### 🧪 Test Checklist

- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Frontend is running on port 5173
- [ ] No CORS errors in browser console
- [ ] Registration form submits without errors
- [ ] New user appears in MongoDB after registration
- [ ] Login works with registered credentials
- [ ] User can access dashboard after login

### 📝 Environment Configuration

Backend uses `.env` file at `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gram-panchayat
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
UPLOAD_PATH=../uploads
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:5173
```

**For Production**: Change these:
- `NODE_ENV=production`
- `MONGODB_URI={your-production-mongodb-url}`
- `JWT_SECRET={strong-random-key}`
- `FRONTEND_URL={production-frontend-url}`

### 🚀 Complete Startup Sequence

```bash
# Terminal 1: Start MongoDB
mongod --dbpath /path/to/data

# Terminal 2: Start Backend
cd backend
npm install (if not done)
npm run dev

# Terminal 3: Start Frontend
npm install (if not done)
npm run dev
```

Then open `http://localhost:5173` in browser.
