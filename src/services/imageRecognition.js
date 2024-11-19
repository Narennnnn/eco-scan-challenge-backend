const { ImageAnalysisClient } = require('@azure-rest/ai-vision-image-analysis');
const createClient = require('@azure-rest/ai-vision-image-analysis').default;
const { AzureKeyCredential } = require('@azure/core-auth');
const dotenv = require('dotenv');

dotenv.config();

// Azure Vision setup
const endpoint = process.env.VISION_ENDPOINT;
const key = process.env.VISION_KEY;
const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);

// Improve clothing categories mapping
// higher priority means it will override lower priority items
const CLOTHING_TYPES = {
    'T-shirt': {
        terms: ['t-shirt', 'tshirt', 'tee', 'active shirt', 'casual shirt'],
        baseScore: 5,
        priority: 2
    },
    'Shirt': {
        terms: ['formal shirt', 'dress shirt', 'button shirt', 'button-up', 'collared shirt', 'button down'],
        baseScore: 7,
        priority: 2
    },
    'Sweater': {
        terms: ['sweater', 'pullover', 'jumper', 'knitwear', 'cardigan', 'turtleneck', 'wool sweater'],
        baseScore: 8,
        priority: 2
    },
    'Jeans': {
        terms: ['jeans', 'pants', 'trousers', 'denim', 'leggings'],
        baseScore: 10,
        priority: 2
    },
    'Jacket': {
        terms: ['jacket', 'coat', 'blazer', 'outerwear', 'windbreaker'],
        baseScore: 15,
        priority: 2
    },
    'Dress': {
        terms: ['dress', 'gown', 'frock'],
        baseScore: 12,
        priority: 1
    },
    'Shoes': {
        terms: ['shoes', 'sneakers', 'footwear', 'boots', 'sandals', 'trainers', 'athletic shoes'],
        baseScore: 8,
        priority: 2
    },
    'Accessory': {
        terms: ['accessory', 'bag', 'belt', 'hat', 'scarf', 'sunglasses', 'watch'],
        baseScore: 4,
        priority: 1
    },
    'Undergarment': {
        terms: ['undergarment', 'underwear', 'bra', 'panties', 'briefs', 'stockings', 'socks','bikini'],
        baseScore: 2,
        priority: 2
    }
};

async function recognizeClothing(imageBuffer) {
    try {
        const result = await client.path('/imageanalysis:analyze').post({
            body: imageBuffer,
            queryParameters: {
                features: ['Caption', 'Tags'],
                language: 'en',
                'gender-neutral-caption': true,
                modelVersion: 'latest'
            },
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });

        const analysis = result.body;
        
        // Detailed logging of the response
        console.log('Azure Vision API Full Response:', JSON.stringify({
            modelVersion: analysis.modelVersion,
            metadata: analysis.metadata,
            caption: analysis.captionResult,
            tags: analysis.tagsResult?.values.map(tag => ({
                name: tag.name,
                confidence: tag.confidence
            }))
        }, null, 2));

        // Store detected items with their priorities
        const detectedItems = new Map(); // Using Map to store item with its priority

        // Process tags first (they're more specific)
        if (analysis.tagsResult?.values) {
            analysis.tagsResult.values
                .filter(tag => tag.confidence > 0.7) // Increased confidence threshold
                .forEach(tag => {
                    const tagName = tag.name.toLowerCase();
                    
                    Object.entries(CLOTHING_TYPES).forEach(([type, data]) => {
                        if (data.terms.some(term => tagName.includes(term))) {
                            // Only add if priority is higher than existing
                            if (!detectedItems.has(type) || 
                                data.priority > detectedItems.get(type).priority) {
                                detectedItems.set(type, {
                                    priority: data.priority,
                                    confidence: tag.confidence
                                });
                            }
                        }
                    });
                });
        }

        // Convert Map to array and sort by priority
        const items = Array.from(detectedItems.entries())
            .sort((a, b) => b[1].priority - a[1].priority)
            .map(([type]) => type);

        // If no items detected, try to extract from caption
        if (items.length === 0 && analysis.captionResult) {
            const caption = analysis.captionResult.text.toLowerCase();
            Object.entries(CLOTHING_TYPES).forEach(([type, data]) => {
                if (data.terms.some(term => caption.includes(term))) {
                    items.push(type);
                }
            });
        }

        if (items.length === 0) {
            throw new Error('No clothing items detected in the image');
        }

        // Simplified response
        return {
            success: true,
            data: {
                items: items.slice(0, 1), // Return only the highest priority item
                confidence: analysis.captionResult?.confidence || 0.0
            }
        };

    } catch (error) {
        console.error('Error analyzing image:', error);
        throw error;
    }
}

module.exports = {
    recognizeClothing
}; 