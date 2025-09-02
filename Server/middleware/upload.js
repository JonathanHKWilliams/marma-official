import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads/photos';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `photo-${uniqueSuffix}${ext}`);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Middleware for single photo upload
export const uploadPhoto = upload.single('photo');

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.',
        errors: ['File size exceeded']
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name. Use "photo" as the field name.',
        errors: ['Invalid field name']
      });
    }
  }
  
  if (error.message.includes('Only image files')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only image files are allowed.',
      errors: ['Invalid file type']
    });
  }

  next(error);
};

// Helper function to save base64 image as file
export const saveBase64AsFile = (base64Data, filename) => {
  try {
    if (!base64Data?.startsWith('data:')) return null;
    
    const [meta, base64] = base64Data.split(',');
    const mime = /data:(.*);base64/.exec(meta)?.[1] || 'image/png';
    const ext = mime.split('/')[1] || 'png';
    
    const buffer = Buffer.from(base64, 'base64');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = `photo-${uniqueSuffix}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);
    
    fs.writeFileSync(filePath, buffer);
    return filePath;
  } catch (error) {
    console.error('Error saving base64 as file:', error);
    return null;
  }
};

// Helper function to delete uploaded file
export const deleteUploadedFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};
