const express = require('express');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const Message = require('../models/Message');

const escapeHtml = (v = '') =>
  String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Auth middleware for admin endpoints
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    next();
  });
};

// Stricter limit on the public contact form to stop spam
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many messages, please try again later.' }
});

const router = express.Router();

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Admin: Get all messages
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete a message
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: Send a contact message
router.post('/', contactLimiter, [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('message').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, message, phone } = req.body;

  try {
    // Save to database
    const newMessage = new Message({ name, email, phone, message });
    await newMessage.save();

    // Send email to admin. A mail failure must not lose the saved message.
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.SMTP_USER,
          to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
          replyTo: email,
          subject: `New message from ${String(name).replace(/[\r\n]/g, ' ')}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(phone) || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(message)}</p>
          `
        });
      } catch (mailErr) {
        console.error('Contact email failed (message was saved):', mailErr.message);
      }
    }

    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

