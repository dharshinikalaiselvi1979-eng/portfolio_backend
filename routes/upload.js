const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const sharp = require('sharp');
const Media = require('../models/Media');

const router = express.Router();

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    next();
  });
};

// Multer config
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  }
});

// Upload endpoint
router.post('/image', authMiddleware, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    // Resize (max 1600px wide) and compress to WebP to keep the site fast
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`;
    const targetPath = path.join('uploads', filename);
    const info = await sharp(req.file.buffer)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(targetPath);

    const fileUrl = `/uploads/${filename}`;
    const mediaRecord = new Media({
      filename,
      url: fileUrl,
      size: info.size,
      mimetype: 'image/webp'
    });
    await mediaRecord.save();

    res.json({ url: fileUrl, filename, media: mediaRecord });
  } catch (err) {
    res.status(400).json({ error: 'Could not process image' });
  }
});

// List all media items
router.get('/media', authMiddleware, async (req, res) => {
  try {
    const items = await Media.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete media item
router.delete('/media/:id', authMiddleware, async (req, res) => {
  try {
    const mediaRecord = await Media.findById(req.params.id);
    if (!mediaRecord) return res.status(404).json({ error: 'Media not found' });

    const filePath = path.join('uploads', mediaRecord.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: 'Media deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

