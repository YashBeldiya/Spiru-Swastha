const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { deleteMedia, getCategoryMedia, getMedia, getMedias, createMedia } = require('../controllers/media');

// Configure storage with proper error handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const folder = path.join(__dirname, '../media');
      cb(null, folder);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    try {
      // Sanitize filename to prevent errors
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
      cb(null, `${Date.now()}_${sanitizedName}`);
    } catch (err) {
      cb(err);
    }
  }
});

// File filter with proper extensions
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

// Error handling wrapper for upload
const handleUpload = (req, res, next) => {
  upload.array('media')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed'
      });
    }
    next();
  });
};

// GET routes with proper error handling
router.get('/get', async (req, res, next) => {
  try {
    await getMedias(req, res, next);
  } catch (err) {
    console.error('GET /get error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch media'
    });
  }
});

router.get('/get/:id', async (req, res, next) => {
  try {
    await getMedia(req, res, next);
  } catch (err) {
    console.error('GET /get/:id error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch media item'
    });
  }
});

router.get('/category-by-media/:category', async (req, res, next) => {
  try {
    await getCategoryMedia(req, res, next);
  } catch (err) {
    console.error('GET /category-by-media error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category media'
    });
  }
});

// POST route with upload handling
router.post('/create', handleUpload, async (req, res, next) => {
  try {
    await createMedia(req, res, next);
  } catch (err) {
    console.error('POST /create error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create media'
    });
  }
});

// DELETE route
router.delete('/delete/:id', async (req, res, next) => {
    try {
      const result = await deleteMedia(req, res, next);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Media not found'
        });
      }
      res.json({
        success: true,
        message: 'Media deleted successfully'
      });
    } catch (err) {
      console.error('DELETE /delete error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to delete media',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  });

// Global error handler to prevent infinite loops
router.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = router;