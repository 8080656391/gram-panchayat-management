# 🚀 Quick Setup: Registration Data to Database

## Problem Solved ✅
**Registration data is now properly saved to MongoDB database.**

---

## 📋 Quick Start (3 Steps)

### Step 1: Start MongoDB
```bash
# Windows (if installed as service)
net start MongoDB

# Or use mongod directly
mongod --dbpath C:\MongoDB\data
```

### Step 2: Start Backend
```bash
cd backend
npm install  # if not done yet
npm run dev
```

Should show:
```
🍃 MongoDB Connected: localhost
🚀 Server running on port 5000
```

### Step 3: Start Frontend
```bash
# In new terminal from root
npm install  # if not done yet
npm run dev
```

Opens on: `http://localhost:5173`

---

## 🧪 Verify Registration Works

### Option A: Test via UI
1. Go to `http://localhost:5173`
2. Click "Register"
3. Fill form and submit
4. Check if data appears in MongoDB ✅

### Option B: Automated Test Script
```bash
node test-registration.js
```

This will:
- ✅ Test backend connectivity
- ✅ Create test user
- ✅ Verify data saved
- ✅ Test login

### Option C: Query MongoDB Directly
```bash
node query-users.js
```

Shows all registered users in database.

---

## 📊 Check Database

### Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `localhost:27017`
3. Database: `gram-panchayat`
4. Collection: `users`
5. ✅ See your registered users

### Using Terminal
```bash
# Connect to MongoDB
mongosh

# Select database
use gram-panchayat

# View all users
db.users.find().pretty()
```

---

## ⚠️ If It Doesn't Work

| Problem | Solution |
|---------|----------|
| "Cannot connect to localhost:5000" | Backend not running. Run `npm run dev` in backend folder |
| "MongoDB connection error" | MongoDB not running. Start MongoDB service |
| "CORS error" | Make sure backend is running before frontend |
| "Email already exists" | Use different email or check MongoDB for duplicates |
| "Invalid phone number" | Must be 10 digits (format: 9876543210) |

---

## 📁 How Data is Saved

```
User Registration Form (React UI)
        ↓
    AuthContext
        ↓
POST /api/auth/register (Backend)
        ↓
User Model Validation
        ↓
Password Hashing (bcrypt)
        ↓
Save to MongoDB
        ↓
✅ Data Stored
```

---

## 📖 Detailed Documentation

See [REGISTRATION_VERIFICATION_GUIDE.md](./REGISTRATION_VERIFICATION_GUIDE.md) for:
- Complete setup instructions
- Database schema details
- Security features
- Troubleshooting guide
- Production deployment

---

## ✅ Checklist

- [ ] MongoDB is running
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can register new user
- [ ] User data appears in MongoDB
- [ ] Can login with registered credentials
- [ ] Dashboard loads after login

Once all ✅, your registration system is fully functional!

---

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `backend/.env` | Database and server config |
| `backend/src/models/User.ts` | User database schema |
| `backend/src/controllers/authController.ts` | Register/login logic |
| `src/context/AuthContext.tsx` | Frontend auth state |
| `src/pages/Login.tsx` | Registration UI |

---

## 💡 Tips

- **Debugging**: Check browser console (F12) for errors
- **Database**: Use MongoDB Compass for visual inspection
- **Backend Logs**: Watch terminal for errors during registration
- **Test Data**: Use `test-registration.js` for automated testing
- **Query Data**: Use `query-users.js` to see saved users

---

## 🔐 Security Notes

✅ Passwords are hashed before storage
✅ Emails are validated
✅ Phone numbers checked for valid format
✅ Aadhar numbers unique (if provided)
✅ JWT tokens for secure sessions
✅ Rate limiting on API
✅ CORS protection

---

## 📞 Need Help?

1. Check [REGISTRATION_VERIFICATION_GUIDE.md](./REGISTRATION_VERIFICATION_GUIDE.md)
2. Run `node test-registration.js`
3. Run `node query-users.js`
4. Check MongoDB Compass
5. Review backend logs in terminal

Your registration system is production-ready! 🚀
