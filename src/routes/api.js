const express = require('express');
const multer = require('multer');
const sizeOf = require('image-size');
const { recognizeClothing } = require('../services/imageRecognition');
const router = express.Router();

// Image validation constants
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MIN_DIMENSION = 50;
const MAX_DIMENSION = 16000;

// Configure multer with limits and file filter
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
            return cb(new Error('Only JPEG, JPG and PNG files are allowed'), false);
        }
        cb(null, true);
    }
}).single('image');

// Validate image dimensions
const validateImageDimensions = (buffer) => {
    try {
        const dimensions = sizeOf(buffer);
        
        if (dimensions.width < MIN_DIMENSION || dimensions.height < MIN_DIMENSION) {
            throw new Error(`Image dimensions must be at least ${MIN_DIMENSION}x${MIN_DIMENSION} pixels`);
        }
        
        if (dimensions.width > MAX_DIMENSION || dimensions.height > MAX_DIMENSION) {
            throw new Error(`Image dimensions must not exceed ${MAX_DIMENSION}x${MAX_DIMENSION} pixels`);
        }

        return true;
    } catch (error) {
        if (error.message.includes('dimensions')) {
            throw error;
        }
        throw new Error('Invalid image format or corrupted file');
    }
};

// Wrapper for handling multer errors
const handleUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Multer error handling
            switch (err.code) {
                case 'LIMIT_FILE_SIZE':
                    return res.status(400).json({
                        success: false,
                        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
                        details: {
                            maxSize: `${MAX_FILE_SIZE / (1024 * 1024)}MB`,
                            receivedSize: `${req.file ? req.file.size / (1024 * 1024) : 'unknown'}MB`
                        }
                    });
                case 'LIMIT_FILE_COUNT':
                    return res.status(400).json({
                        success: false,
                        error: 'Too many files. Only one file allowed'
                    });
                default:
                    return res.status(400).json({
                        success: false,
                        error: 'Error uploading file',
                        details: err.message
                    });
            }
        } else if (err) {
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }
        next();
    });
};

router.post('/recognize-image', handleUpload, async (req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided'
            });
        }

        // Validate image dimensions
        try {
            validateImageDimensions(req.file.buffer);
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message,
                details: {
                    allowedDimensions: {
                        min: `${MIN_DIMENSION}x${MIN_DIMENSION}`,
                        max: `${MAX_DIMENSION}x${MAX_DIMENSION}`
                    }
                }
            });
        }

        const result = await recognizeClothing(req.file.buffer);

        res.json({
            success: true,
            data: {
                items: result.items,
                description: result.description,
                confidence: result.confidence,
                details: result.details,
                materials: result.materials,
                scores: result.scores
            }
        });

    } catch (error) {
        console.error('Error processing image:', error);
        
        // Handle specific errors
        if (error.message === 'No scoreable clothing items detected in the image') {
            return res.status(400).json({
                success: false,
                error: 'No clothing items detected in the image',
                details: 'Please upload a clear image of clothing or try a different clothing item'
            });
        }

        if (error.message.includes('Azure')) {
            return res.status(503).json({
                success: false,
                error: 'Image analysis service temporarily unavailable',
                details: 'Please try again later'
            });
        }

        // Generic error response
        res.status(500).json({
            success: false,
            error: 'Failed to process image',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router; 