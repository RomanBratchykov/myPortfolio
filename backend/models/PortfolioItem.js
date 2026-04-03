const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
  description: { type: String, required: false },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['design', 'music', 'video'] 
  },
  fileUrl: {
    type: String,
    required: true
  },

    publicId: {
      type: String,
      required: true 
    }
  },
  
  {
    timestamps: true
  });

module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);