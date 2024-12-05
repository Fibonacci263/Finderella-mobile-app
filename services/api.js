const express = require('express');
const multer = require('multer');
const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// In-memory storage for simplicity
const items = [];

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Fetch items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// Report lost item
app.post('/api/lost', upload.single('image'), (req, res) => {
  const item = {
    _id: `${Date.now()}`,
    ...req.body,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
  };
  items.push(item);
  res.status(201).json(item);
});

// Report found item
app.post('/api/found', upload.single('image'), (req, res) => {
  const item = {
    _id: `${Date.now()}`,
    ...req.body,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
  };
  items.push(item);
  res.status(201).json(item);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
