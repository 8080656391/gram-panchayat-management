import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import User from '../models/User';
import TaxRecord from '../models/Tax';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!, { useNewUrlParser: true, useUnifiedTopology: true } as any);

  // Find a user to assign as taxpayer
  const user = await User.findOne();
  if (!user) {
    console.error('No users found. Please add a user first.');
    process.exit(1);
  }

  // Create a sample tax record for the user
  const record = await TaxRecord.create({
    taxpayerId: user._id,
    taxpayerName: user.name,
    houseTaxAmount: 2000,
    healthTaxAmount: 500,
    waterTaxAmount: 300,
    taxAmount: 2800,
    amountPaid: 0,
    status: 'pending',
    taxYear: new Date().getFullYear(),
    dueDate: new Date(new Date().getFullYear(), 2, 31),
  });

  console.log('Seeded tax record:', record);
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
