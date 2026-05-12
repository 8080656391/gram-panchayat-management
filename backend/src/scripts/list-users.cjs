// Usage: node backend/src/scripts/list-users.cjs
const mongoose = require('mongoose');
const tsNode = require('ts-node');
tsNode.register();
const User = require('../models/User').default;
require('dotenv').config({ path: '../../.env' });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const users = await User.find();
  console.log('Users in DB:');
  users.forEach(u => {
    console.log({ name: u.name, email: u.email, phone: u.phone, village: u.village });
  });
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
