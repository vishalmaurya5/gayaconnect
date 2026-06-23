const fetch = require('node-fetch');

async function test() {
  const token = process.env.JWT_SECRET || 'gaya-connect-jwt-secret-key-2024'; // Needs to be whatever is in .env
  
  // I can just read the DB directly
  const mongoose = require('mongoose');
  await mongoose.connect('mongodb+srv://user:pass@cluster... // No I dont have connection string easily.
}
test();
