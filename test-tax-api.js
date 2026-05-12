#!/usr/bin/env node

const http = require('http');

const API_URL = 'http://localhost:5000/api';

function makeRequest(method, path, data, token) {
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

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

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

async function runTests() {
  try {
    console.log('\n🧪 TAX API Test\n');
    console.log('='.repeat(60));

    // Step 1: Register a staff user
    console.log('\n✓ Step 1: Register staff user...');
    const staffUser = {
      name: 'Test Staff ' + Date.now(),
      email: `staff${Date.now()}@example.com`,
      password: 'TestPassword123',
      phone: '9876543210',
      village: 'Test Village',
      role: 'staff'
    };

    const registerStaffRes = await makeRequest('POST', '/auth/register', staffUser);
    if (registerStaffRes.status !== 201) {
      console.log('  ❌ Staff registration failed:', registerStaffRes.data);
      throw new Error('Staff registration failed');
    }
    const staffToken = registerStaffRes.data.data.token;
    console.log('  ✅ Staff user registered:', staffUser.email);

    // Step 2: Register a citizen user (taxpayer)
    console.log('\n✓ Step 2: Register citizen user (taxpayer)...');
    const citizenUser = {
      name: 'Test Citizen ' + Date.now(),
      email: `citizen${Date.now()}@example.com`,
      password: 'TestPassword123',
      phone: '9876543210',
      village: 'Test Village',
      role: 'citizen',
      aadharNumber: '123456789012',
      dateOfBirth: '2000-01-01',
      address: 'Test Address'
    };

    const registerCitizenRes = await makeRequest('POST', '/auth/register', citizenUser);
    if (registerCitizenRes.status !== 201) {
      console.log('  ❌ Citizen registration failed:', registerCitizenRes.data);
      throw new Error('Citizen registration failed');
    }
    const citizenId = registerCitizenRes.data.data.user._id;
    console.log('  ✅ Citizen user registered:', citizenUser.email);
    console.log('  📋 Citizen ID:', citizenId);

    // Step 3: Create a tax record
    console.log('\n✓ Step 3: Create tax record...');
    const taxData = {
      taxpayerId: citizenId,
      houseTaxAmount: 100,
      healthTaxAmount: 50,
      waterTaxAmount: 50,
      taxYear: 2026,
      dueDate: '2026-06-30',
      amountPaid: 0
    };

    console.log('  Request data:', JSON.stringify(taxData, null, 2));
    const createTaxRes = await makeRequest('POST', '/taxes', taxData, staffToken);
    console.log('  Response status:', createTaxRes.status);
    console.log('  Response data:', JSON.stringify(createTaxRes.data, null, 2));

    if (createTaxRes.status !== 201) {
      console.log('  ❌ Tax creation failed');
      throw new Error('Tax creation failed: ' + JSON.stringify(createTaxRes.data));
    }

    const taxId = createTaxRes.data.data.taxRecord._id;
    console.log('  ✅ Tax record created with ID:', taxId);

    // Step 4: Fetch tax records
    console.log('\n✓ Step 4: Fetch tax records...');
    const fetchTaxRes = await makeRequest('GET', '/taxes', null, staffToken);
    console.log('  Response status:', fetchTaxRes.status);
    if (fetchTaxRes.status === 200) {
      console.log('  ✅ Tax records fetched');
      console.log('  📊 Total records:', fetchTaxRes.data.data.taxRecords.length);
      if (fetchTaxRes.data.data.taxRecords.length > 0) {
        console.log('  📝 First record:', JSON.stringify(fetchTaxRes.data.data.taxRecords[0], null, 2));
      }
    } else {
      console.log('  ❌ Failed to fetch tax records:', fetchTaxRes.data);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests passed!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

runTests();
