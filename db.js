const mongoose = require('mongoose');
const { applyLocalFallback } = require('./localDb');
require('dotenv').config();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // If no URI or default dummy URI on cloud, immediately use built-in store
  if (!uri || (process.env.RENDER && uri.includes('localhost'))) {
    console.log('ℹ️ Running in standalone mode with built-in database (no MongoDB Atlas required).');
    applyLocalFallback();
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.warn('⚠️ MongoDB connection could not be established:', err.message);
    console.log('⚡ Activating built-in standalone database with portfolio content...');
    applyLocalFallback();
  }
};

module.exports = connectDB;

