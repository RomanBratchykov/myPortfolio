const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve files publicly

// Multer storage engine configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Database mock (In a real app, use MongoDB or PostgreSQL)
let portfolioItems = [];

// Route: Upload new content
app.post('/api/upload', upload.single('mediaFile'), (req, res) => {
  const newItem = {
    id: Date.now(),
    title: req.body.title,
    category: req.body.category,
    fileUrl: `http://localhost:5000/uploads/${req.file.filename}`
  };
  
  portfolioItems.push(newItem);
  res.status(201).json({ message: "Upload successful!", item: newItem });
});

// Route: Get all content
app.get('/api/content', (req, res) => {
  res.json(portfolioItems);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));