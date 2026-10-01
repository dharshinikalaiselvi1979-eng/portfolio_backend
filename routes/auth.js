const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Register (first time setup)
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    // Only the very first admin can be created through the API.
    // After that, registration is closed so nobody else can become an admin.
    if ((await User.countDocuments()) > 0) {
      return res.status(403).json({ error: 'Registration is closed' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.json({ message: 'Admin created', user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || '7d'
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.json({ token, refreshToken, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Refresh: exchange a valid refresh token for a new access token
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, async (err, payload) => {
    if (err) return res.status(403).json({ error: 'Invalid refresh token' });
    try {
      const user = await User.findById(payload.id);
      if (!user) return res.status(403).json({ error: 'User not found' });
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION || '7d'
      });
      res.json({ token });
    } catch (e) {
      res.status(500).json({ error: 'Refresh failed' });
    }
  });
});

// Verify token
router.get('/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
