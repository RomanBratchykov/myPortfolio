require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const PortfolioItem = require('./models/PortfolioItem');

const app = express();

// 1. Middleware first — before any routes
app.use(cors());
app.use(express.json());

// 2. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 3. Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'my_portfolio_media',
    resource_type: 'auto'
  },
});

const upload = multer({ storage: storage });

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

app.post('/api/upload', verifyAdmin, (req, res, next) => {
  upload.single('mediaFile')(req, res, (err) => {
    if (err) {
      console.error('Multer/Cloudinary error:', err);
      return res.status(500).json({ error: 'File upload failed: ' + err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file was uploaded.' });
    }

    const newItem = await PortfolioItem.create({
      title: req.body.title,
      category: req.body.category,
      fileUrl: req.file.path
    });

    res.status(201).json({ message: 'Successfully uploaded!', item: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save item: ' + error.message });
  }
});

app.delete('/api/content/:id', verifyAdmin, async (req, res) => {
  try {
    const item = await PortfolioItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }
    res.json({ message: 'Item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item.' });
  }
});

// 6. Start server only after DB connects
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
