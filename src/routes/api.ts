import express from 'express';
import upload from '../middleware/upload';
import { validate } from '../middleware/validate';
import { carbonScoreSchema, offersSchema } from '../schemas';
import { ValidationError } from '../types/errors';
import { recognizeClothing } from '../services/imageRecognition';
import { calculateCarbonScore } from '../services/carbonScore';
import { getAvailableOffers } from '../services/offers';

const router = express.Router();

router.post('/recognize-image', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ValidationError('No image file provided');
    }

    const recognizedItems = await recognizeClothing(req.file.buffer);
    res.json({
      success: true,
      items: recognizedItems
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/calculate-carbon-score',
  validate(carbonScoreSchema),
  async (req, res, next) => {
    try {
      const result = calculateCarbonScore(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/offers/:points',
  validate(offersSchema),
  async (req, res, next) => {
    try {
      const points = Number(req.params.points);
      const offers = getAvailableOffers(points);
      res.json({ offers });
    } catch (error) {
      next(error);
    }
  }
);

export default router; 