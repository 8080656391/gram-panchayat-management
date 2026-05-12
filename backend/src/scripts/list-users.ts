import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import User from '../models/User';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!, { useNewUrlParser: true, useUnifiedTopology: true } as any);
  const users = await User.find();
  console.log('Users in DB:');
  users.forEach(u => {
    console.log({ name: u.name, email: u.email, phone: u.phone, village: u.village });
  });
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
