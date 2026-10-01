const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  author: String,
  position: String,
  text: String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
