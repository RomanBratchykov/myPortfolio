require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');

// New Cloudinary imports
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const PortfolioItem = require('./models/PortfolioItem');

const app = express();
app.use(cors());

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('Database connection failed:', err));

// 2. Configure Cloudinary with your secret keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 3. Set up the Cloudinary storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'my_portfolio_media', // Cloudinary will create this folder for you
    resource_type: 'auto'         // 'auto' is CRITICAL so it accepts video and audio, not just images
  },
});

const upload = multer({ storage: storage });

const verifyAdmin = (req, res, next) => {
  // Look for a custom password header sent by React
  const clientPassword = req.headers['x-admin-password'];

  // Check if it matches your hidden .env password
  if (clientPassword === process.env.ADMIN_PASSWORD) {
    next(); // It matches! Let them pass to the upload process.
  } else {
    // It failed. Reject the request.
    res.status(401).json({ error: "Unauthorized. Invalid admin password." });
  }
};

// 4. Update the Upload Route
app.post('/api/upload', verifyAdmin, upload.single('mediaFile'), async (req, res) => {
  try {
    const newItem = await PortfolioItem.create({
      title: req.body.title,
      category: req.body.category,
      fileUrl: req.file.path 
    });
    
    res.status(201).json({ message: "Successfully uploaded to Cloudinary & MongoDB!", item: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload and save item." });
  }
});

// 5. Get Route (Remains exactly the same)
app.get('/api/content', async (req, res) => {
  try {
    const items = await PortfolioItem.find().sort({ createdAt: -1 }); 
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));