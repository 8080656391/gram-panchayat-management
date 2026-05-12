#!/usr/bin/env node

/**
 * MongoDB Direct Query Script
 * Verifies registered users in MongoDB
 * 
 * Usage: node query-users.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// User Schema (match backend)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  village: String,
  role: String,
  aadharNumber: String,
  dateOfBirth: Date,
  address: String,
  registrationDate: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}, { collection: 'users' });

const User = mongoose.model('User', UserSchema);

async function queryUsers() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gram-panchayat';
    
    console.log('\n📊 MongoDB User Query Tool\n');
    console.log('=' .repeat(60));
    console.log(`Connecting to: ${mongoURI}`);
    console.log('=' .repeat(60));

    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('\n✅ Connected to MongoDB!\n');

    // Get total count
    const totalUsers = await User.countDocuments();
    console.log(`📈 Total users in database: ${totalUsers}\n`);

    if (totalUsers === 0) {
      console.log('⚠️  No users found. Start registration from the app.\n');
    } else {
      // List all users
      console.log('👥 All Registered Users:');
      console.log('-' .repeat(60));
      
      const users = await User.find({}, '-password').sort({ createdAt: -1 });
      
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   📱 Phone: ${user.phone}`);
        console.log(`   🏘️  Village: ${user.village}`);
        console.log(`   🎭 Role: ${user.role.toUpperCase()}`);
        console.log(`   📅 Registered: ${new Date(user.registrationDate).toLocaleDateString()}`);
        console.log(`   ✅ Active: ${user.isActive ? 'Yes' : 'No'}`);
        if (user.aadharNumber) console.log(`   🆔 Aadhar: ${user.aadharNumber}`);
      });

      console.log('\n' + '-' .repeat(60));
      console.log(`\n✅ Successfully retrieved ${totalUsers} user(s) from database!\n`);
    }

    // Statistics
    console.log('📊 Role Distribution:');
    console.log('-' .repeat(60));
    
    const roleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    roleStats.forEach(stat => {
      const roleLabel = stat._id.charAt(0).toUpperCase() + stat._id.slice(1);
      console.log(`${roleLabel}: ${stat.count}`);
    });

    console.log('\n' + '=' .repeat(60));
    console.log('✅ Query completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Error occurred:\n');
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('❌ Cannot connect to MongoDB');
      console.error('\n🔍 Troubleshooting:');
      console.error('  1. Start MongoDB service:');
      console.error('     - Windows: net start MongoDB');
      console.error('     - Linux/Mac: brew services start mongodb-community');
      console.error('     - Manual: mongod --dbpath /path/to/data');
      console.error('\n  2. Verify .env file has correct MONGODB_URI');
      console.error(`     Current: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/gram-panchayat'}`);
    } else if (error.message.includes('authentication failed')) {
      console.error('❌ MongoDB authentication failed');
      console.error('\n🔍 Check your MONGODB_URI credentials in .env file');
    } else {
      console.error(`Error: ${error.message}`);
    }

    process.exit(1);

  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

queryUsers();
