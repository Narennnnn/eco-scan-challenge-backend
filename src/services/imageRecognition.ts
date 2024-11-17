import { PredictionAPIClient } from '@azure/cognitiveservices-customvision-prediction';
import { ApiKeyCredentials } from '@azure/ms-rest-js';
import { AppError } from '../types/errors';
import { CARBON_SCORES } from '../config/constants';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Custom Vision Prediction client
const predictionClient = new PredictionAPIClient(
  new ApiKeyCredentials({ 
    inHeader: { 'Prediction-Key': process.env.AZURE_VISION_PREDICTION_API_KEY || '' } 
  }),
  process.env.AZURE_VISION_PREDICTION_ENDPOINT || ''
);

// Project ID from your .env
const PROJECT_ID = process.env.AZURE_PROJECT_ID || '';

export const recognizeClothing = async (imageBuffer: Buffer): Promise<string[]> => {
  try {
    console.log('Sending image to Custom Vision API...');
    console.log('Project ID:', PROJECT_ID);
    console.log('Endpoint:', process.env.AZURE_VISION_PREDICTION_ENDPOINT);
    
    // Use the classify image method for Custom Vision
    const results = await predictionClient.classifyImage(
      PROJECT_ID,
      'Production', // Use your published iteration name (usually 'Production')
      imageBuffer
    );

    console.log('Custom Vision API Response:', JSON.stringify(results, null, 2));

    const clothingItems = new Set<string>();
    
    // Process predictions
    if (results.predictions) {
      results.predictions.forEach(prediction => {
        // Lower threshold to 0.3 (30%) for testing, adjust based on accuracy
        if (prediction.probability !== undefined && prediction.probability > 0.3) {
          console.log(`Detected ${prediction.tagName} with probability ${prediction.probability}`);
          
          // Direct mapping of tag names to carbon score categories
          switch(prediction.tagName && prediction.tagName.toLowerCase()) {
            case 't-shirt':
            case 'shirt':
              clothingItems.add('T-shirt');
              break;
            case 'jeans':
            case 'pants':
            case 'trousers':
              clothingItems.add('Jeans');
              break;
            case 'jacket':
            case 'coat':
              clothingItems.add('Jacket');
              break;
            case 'shoes':
            case 'sneakers':
              clothingItems.add('Shoes');
              break;
          }
        }
      });
    }

    const recognizedItems = Array.from(clothingItems)
      .filter(item => item in CARBON_SCORES);

    if (recognizedItems.length === 0) {
      throw new AppError(400, 'No clothing items detected in the image');
    }

    return recognizedItems;
  } catch (error) {
    console.error('Custom Vision API Error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError(500, 'Failed to analyze image');
  }
}; 