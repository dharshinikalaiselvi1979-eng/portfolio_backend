const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  social: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('About', aboutSchema);
