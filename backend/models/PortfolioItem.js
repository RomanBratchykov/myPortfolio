const mongoose = require('mongoose');

// The Schema is the blueprint for your data
const portfolioItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['design', 'music', 'video'] // Restricts to only these options
  },
  fileUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export it so our server can use it
module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);