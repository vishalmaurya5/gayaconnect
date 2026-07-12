// Create (or promote) an admin user in your MongoDB.
// Usage from the backend folder:
//   node scripts/seedAdmin.js <email> <password> [name]
// Example:
//   node scripts/seedAdmin.js admin@gayaconnect.in "MyStrongPass#1" "Gaya Admin"
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../src/models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const [, , emailArg, passwordArg, ...nameParts] = process.argv;
const email = emailArg;
const password = passwordArg;
const name = nameParts.join(' ') || 'Admin';

if (!email || !password) {
  console.error('Usage: node scripts/seedAdmin.js <email> <password> [name]');
  process.exit(1);
}
if (password.length < 6) {
  console.error('Password must be at least 6 characters.');
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI missing in .env');
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB.');

  let user = await User.findOne({ email });
  if (user) {
    user.role = 'admin';
    user.isActive = true;
    user.isEmailVerified = true;
    user.password = password; // re-hashed by the model's pre-save hook
    await user.save();
    console.log(`Existing user promoted to admin ✅  (${email})`);
  } else {
    user = await User.create({
      name,
      email,
      password, // hashed by pre-save hook
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
      phone: `+9100${Math.floor(10000000 + Math.random() * 90000000)}` // Add random phone
    });
    console.log(`New admin created ✅  (${email})`);
  }

  console.log('   id   :', String(user._id));
  console.log('   name :', user.name);
  console.log('   role :', user.role);
  console.log('\nYou can now log in at /login and open /admin/dashboard.');
} catch (e) {
  console.error('Seed failed ❌', e.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
