const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shopco_products',
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
  },
});

const upload = multer({ storage: storage });

router.post('/', protect, admin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.json({ url: req.file.path });
});

module.exports = router;
