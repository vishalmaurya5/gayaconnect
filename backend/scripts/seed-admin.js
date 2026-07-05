/**
 * seed-admin.js
 * Run: node scripts/seed-admin.js
 * Creates or updates the super-admin account in MongoDB.
 * Uses collection.insertOne / updateOne to bypass pre-save hooks.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL    = 'vishalverma5359@gmail.com';
const ADMIN_PASSWORD = 'GayaConnect7004394@2026';
const ADMIN_NAME     = 'Vishal Verma (Admin)';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  MongoDB connected');

    // Hash password manually — bypass pre-save hook entirely
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Work directly on the raw collection to skip Mongoose middleware
    const col      = mongoose.connection.collection('users');
    const existing = await col.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      await col.updateOne(
        { email: ADMIN_EMAIL },
        {
          $set: {
            name            : ADMIN_NAME,
            password        : hashedPassword,
            role            : 'admin',
            isActive        : true,
            isEmailVerified : true,
            updatedAt       : new Date(),
          },
        }
      );
      console.log('🔄  Existing user updated to admin:', ADMIN_EMAIL);
    } else {
      await col.insertOne({
        name            : ADMIN_NAME,
        email           : ADMIN_EMAIL,
        password        : hashedPassword,
        role            : 'admin',
        isActive        : true,
        isEmailVerified : true,
        subscriptionActive: false,
        createdAt       : new Date(),
        updatedAt       : new Date(),
      });
      console.log('🆕  Admin user created:', ADMIN_EMAIL);
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Email    :', ADMIN_EMAIL);
    console.log('  Password :', ADMIN_PASSWORD);
    console.log('  Role     : admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅  Seed complete! Ab login karo.');
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
