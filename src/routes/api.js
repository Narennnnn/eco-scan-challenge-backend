const express = require('express');
const multer = require('multer');
const sizeOf = require('image-size');
const { recognizeClothing } = require('../services/imageRecognition');
const { calculateCarbonScore, MATERIAL_FACTORS, CONDITION_FACTORS, AGE_FACTORS } = require('../services/carbonScore');
const { getAvailableOffers } = require('../services/offers');
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

// Endpoint 1: Image Recognition (Simplified)
router.post('/recognize-image', handleUpload, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided'
            });
        }

        validateImageDimensions(req.file.buffer);
        const result = await recognizeClothing(req.file.buffer);
        res.json(result);  // result already has the success and data structure

    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to process image'
        });
    }
});

// Endpoint 2: Carbon Score Calculation
router.post('/calculate-carbon-score', express.json(), (req, res) => {
    try {
        const { name, material, condition, age } = req.body;

        // Validate inputs
        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'Item name is required'
            });
        }

        if (material && !MATERIAL_FACTORS[material]) {
            return res.status(400).json({
                success: false,
                error: 'Invalid material type',
                validMaterials: Object.keys(MATERIAL_FACTORS)
            });
        }

        if (condition && !CONDITION_FACTORS[condition]) {
            return res.status(400).json({
                success: false,
                error: 'Invalid condition',
                validConditions: Object.keys(CONDITION_FACTORS)
            });
        }

        if (age && !AGE_FACTORS[age]) {
            return res.status(400).json({
                success: false,
                error: 'Invalid age range',
                validAges: Object.keys(AGE_FACTORS)
            });
        }

        const result = calculateCarbonScore({ name, material, condition, age });

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Error calculating carbon score:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to calculate carbon score'
        });
    }
});

// Endpoint 3: Get Available Offers
router.get('/offers', (req, res) => {
    try {
        const result = getAvailableOffers();
        
        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Error retrieving offers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve offers'
        });
    }
});

module.exports = router; 