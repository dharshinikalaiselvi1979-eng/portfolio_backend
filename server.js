require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const uploadRoutes = require('./routes/upload');
const contactRoutes = require('./routes/contact');

const app = express();

// Connect to MongoDB
connectDB();

// Security Headers & Rate Limiting
app.use(helmet({ crossOriginResourcePolicy: false }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per 15 minutes
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes (support both /api/* and root /* for seamless deployment)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/content', '/content'], contentRoutes);
app.use(['/api/upload', '/upload'], uploadRoutes);
app.use(['/api/contact', '/contact'], contactRoutes);

// Health check & root status
app.get(['/', '/api', '/api/health', '/health'], (req, res) => {
  res.json({
    status: '✅ Portfolio CMS Backend Running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      content: '/api/content',
      skills: '/api/content/skills',
      projects: '/api/content/projects',
      health: '/api/health'
    }
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
