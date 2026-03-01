require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2; 
const PortfolioItem = require('./models/PortfolioItem');

const app = express();
app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

const uploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });

const verifyAdmin = (req, res, next) => {
  const clientPassword = req.headers['x-admin-password'];
  if (clientPassword === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized.' });
  }
};

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
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

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

    res.status(201).json({ message: 'Uploaded!', item: newItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed: ' + error.message });
  }
});

app.delete('/api/content/:id', verifyAdmin, async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found.' });

    if (item.publicId) await cloudinary.uploader.destroy(item.publicId);
    await item.deleteOne();
    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed.' });
  }
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('Database connection failed:', err));