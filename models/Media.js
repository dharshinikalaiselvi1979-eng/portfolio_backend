const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number, default: 0 },
  mimetype: { type: String, default: 'image/webp' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Media', mediaSchema);
