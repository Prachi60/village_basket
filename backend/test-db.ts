
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import path from 'path';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGODB_URI;

console.log('Attempting to connect to MongoDB...');
console.log('URI:', uri?.replace(/\/\/.*@/, '//<credentials>@'));

if (!uri) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}

async function testConnection() {
  try {
    await mongoose.connect(uri!, { family: 4 });
    console.log('✅ Successfully connected to MongoDB!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Connection failed:');
    console.error(err.message || err);
    process.exit(1);
  }
}

testConnection();
