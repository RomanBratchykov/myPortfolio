const mongoose = require('mongoose');

// The Schema is the blueprint for your data
const portfolioItemSchema = new mongoose.Schema({
  description: { type: String, required: false },
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

    publicId: {
      type: String,
      required: true // Storing this ensures we can delete the file from Cloudinary later
    }
  },
  
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  });

// Export it so our server can use it
module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);