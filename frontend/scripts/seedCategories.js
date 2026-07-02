import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import Category from '../lib/db/models/Category.js';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

const defaultCategories = [
  'Car',
  'Bike',
  'Bus',
  'Truck',
  'Pickup',
  'Tractor',
  'Auto Rickshaw',
  'Van',
  'Taxi',
  'Ambulance',
  'Tempo',
  'Construction Equipment',
  'Others'
];

async function seedCategories() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const name of defaultCategories) {
      const existing = await Category.findOne({ name: new RegExp('^' + name + '$', 'i') });
      if (!existing) {
        await Category.create({
          name,
          is_default: true,
          approved: true,
          created_by_role: 'admin'
        });
        console.log(`Created default category: ${name}`);
      } else {
        console.log(`Category already exists: ${name}`);
      }
    }

    console.log('Seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
