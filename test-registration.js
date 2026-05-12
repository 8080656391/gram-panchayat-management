#!/usr/bin/env node

/**
 * Registration Data Verification Script
 * Tests if registration data is being properly saved to MongoDB
 * 
 * Usage: node test-registration.js
 */

const http = require('http');

// Configuration
const API_URL = 'http://localhost:5000/api';
const TEST_USER = {
  name: 'Test User ' + Date.now(),
  email: `testuser${Date.now()}@example.com`,
  password: 'TestPassword123',
  phone: '9876543210',
  village: 'Test Village',
  role: 'citizen'
};

console.log('\n🧪 Registration Data Verification Test\n');
console.log('=' .repeat(50));

// Helper function to make API calls
function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Test sequence
async function runTests() {
  try {
    // Check 1: Backend health
    console.log('\n✓ Step 1: Checking backend health...');
    const healthResponse = await makeRequest('GET', '/health');
    if (healthResponse.status === 200) {
      console.log('  ✅ Backend is running on port 5000');
    } else {
      throw new Error('Backend health check failed');
    }

    // Check 2: Test registration
    console.log('\n✓ Step 2: Testing user registration...');
    console.log(`  Registering user: ${TEST_USER.email}`);
    const registerResponse = await makeRequest('POST', '/auth/register', TEST_USER);
    
    if (registerResponse.status === 201 && registerResponse.data.success) {
      console.log('  ✅ Registration successful!');
      console.log(`  📧 Email: ${registerResponse.data.data.user.email}`);
      console.log(`  👤 Name: ${registerResponse.data.data.user.name}`);
      console.log(`  🎭 Role: ${registerResponse.data.data.user.role}`);
      console.log(`  📅 Registration Date: ${registerResponse.data.data.user.registrationDate}`);
      console.log(`  🔐 Token received: ${registerResponse.data.data.token.substring(0, 20)}...`);
    } else {
      throw new Error(`Registration failed: ${registerResponse.data.message}`);
    }

    // Check 3: Verify user can login
    console.log('\n✓ Step 3: Testing login with new credentials...');
    const loginResponse = await makeRequest('POST', '/auth/login', {
      email: TEST_USER.email,
      password: TEST_USER.password
    });

    if (loginResponse.status === 200 && loginResponse.data.success) {
      console.log('  ✅ Login successful!');
      console.log(`  👤 Logged in as: ${loginResponse.data.data.user.name}`);
      console.log(`  🎭 Role: ${loginResponse.data.data.user.role}`);
    } else {
      throw new Error(`Login failed: ${loginResponse.data.message}`);
    }

    // Success
    console.log('\n' + '='.repeat(50));
    console.log('✅ ALL TESTS PASSED!\n');
    console.log('Summary:');
    console.log('  ✓ Backend is running and accessible');
    console.log('  ✓ Registration data is being saved to MongoDB');
    console.log('  ✓ User data can be retrieved after registration');
    console.log('  ✓ Login works with registered credentials\n');
    console.log('📝 Next Steps:');
    console.log('  1. Open browser: http://localhost:5173');
    console.log('  2. Register a new user via the UI');
    console.log('  3. Check MongoDB using MongoDB Compass or mongosh');
    console.log('  4. Verify user document exists in gram-panchayat.users\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED\n');
    console.error('Error:', error.message);
    console.error('\n🔍 Troubleshooting:\n');
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('  • Backend is not running!');
      console.error('    Solution: Run "npm run dev" in the backend folder');
    } else if (error.message.includes('MongoDB connection error')) {
      console.error('  • MongoDB is not running!');
      console.error('    Solution: Start MongoDB service or mongod command');
    } else {
      console.error('  • ' + error.message);
    }
    
    process.exit(1);
  }
}

// Run tests
runTests();
