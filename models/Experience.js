const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: String,
  position: String,
  description: String,
  start_date: String,
  end_date: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Experience', experienceSchema);
