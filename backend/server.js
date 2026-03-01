require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const PortfolioItem = require('./models/PortfolioItem');

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());

// Debugging: Verify Render is reading the variables
console.log("Checking Environment Variables:");
console.log("MONGO_URI exists?", !!process.env.MONGO_URI);
console.log("Cloudinary Key exists?", !!process.env.CLOUDINARY_API_KEY);

// 2. Configure Cloudinary v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 3. Multer with memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Helper: upload a buffer to Cloudinary and return the result
const uploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });

// 4. Admin auth middleware
const verifyAdmin = (req, res, next) => {
  const clientPassword = req.headers['x-admin-password'];
  if (clientPassword === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized. Invalid admin password.' });
  }
};

// 5. Routes
app.get('/', (req, res) => {
  res.send('Portfolio API is live and running!');
});

app.get('/api/content', async (req, res) => {
  try {
    const items = await PortfolioItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items.' });
  }
});

app.post('/api/upload', verifyAdmin, upload.single('mediaFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file was uploaded.' });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'my_portfolio_media',
      resource_type: 'auto'
    });

    const newItem = await PortfolioItem.create({
      title: req.body.title,
      category: req.body.category,
      fileUrl: result.secure_url,
      publicId: result.public_id 
    });

    res.status(201).json({ message: 'Successfully uploaded!', item: newItem });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to save item: ' + error.message });
  }
});

app.delete('/api/content/:id', verifyAdmin, async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    if (item.publicId) {
        await cloudinary.uploader.destroy(item.publicId);
    }

    await item.deleteOne();
    res.json({ message: 'Item and media deleted successfully.' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete item.' });
  }
});

// 6. Start server FIRST, then connect to DB to satisfy Render's port binding timeout
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  
  // Once the port is open and Render is happy, connect to MongoDB Atlas
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB Atlas!');
    })
    .catch((err) => {
      console.error('Database connection failed:', err.message);
    });
});