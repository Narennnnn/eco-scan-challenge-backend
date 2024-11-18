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

// Define clothing categories for matching
const CLOTHING_TYPES = {
    'Sweater': {
        terms: ['sweater', 'pullover', 'jumper', 'knitwear', 'cardigan', 'turtleneck'],
        baseScore: 8
    },
    'T-shirt': {
        terms: ['shirt', 't-shirt', 'tshirt', 'top', 'blouse', 'polo'],
        baseScore: 5
    },
    'Jeans': {
        terms: ['jeans', 'pants', 'trousers', 'denim', 'leggings'],
        baseScore: 10
    },
    'Jacket': {
        terms: ['jacket', 'coat', 'blazer', 'outerwear', 'windbreaker'],
        baseScore: 15
    },
    'Dress': {
        terms: ['dress', 'gown', 'frock', 'sundress'],
        baseScore: 12
    },
    'Shoes': {
        terms: ['shoes', 'boots', 'sneakers', 'sandals', 'heels'],
        baseScore: 10
    }
};

// Material types for additional context
const MATERIALS = {
    'cotton': { factor: 1.0 },
    'wool': { factor: 1.3 },
    'polyester': { factor: 1.2 },
    'leather': { factor: 1.5 },
    'denim': { factor: 1.2 }
};

async function recognizeClothing(imageBuffer) {
    try {
        // Analyze image using Azure Vision
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
        console.log('Azure Vision Response:', analysis);

        // Initialize results
        const detectedItems = new Set();
        const detectedMaterials = new Set();
        const details = [];

        // Process caption
        if (analysis.captionResult) {
            const caption = analysis.captionResult.text.toLowerCase();
            console.log('Caption:', caption);

            // Check caption for clothing items
            Object.entries(CLOTHING_TYPES).forEach(([type, data]) => {
                if (data.terms.some(term => caption.includes(term))) {
                    detectedItems.add(type);
                }
            });
        }

        // Process tags
        if (analysis.tagsResult) {
            analysis.tagsResult.values.forEach(tag => {
                if (tag.confidence > 0.6) {
                    const tagName = tag.name.toLowerCase();
                    details.push({
                        name: tag.name,
                        confidence: tag.confidence
                    });

                    // Check for clothing items
                    Object.entries(CLOTHING_TYPES).forEach(([type, data]) => {
                        if (data.terms.some(term => tagName.includes(term))) {
                            detectedItems.add(type);
                        }
                    });

                    // Check for materials
                    Object.keys(MATERIALS).forEach(material => {
                        if (tagName.includes(material)) {
                            detectedMaterials.add(material);
                        }
                    });
                }
            });
        }

        // Convert sets to arrays
        const items = Array.from(detectedItems);
        const materials = Array.from(detectedMaterials);

        if (items.length === 0) {
            throw new Error('No clothing items detected in the image');
        }

        // Calculate scores
        const scores = items.map(item => {
            const baseScore = CLOTHING_TYPES[item].baseScore;
            const materialFactor = materials.length > 0 
                ? Math.max(...materials.map(m => MATERIALS[m]?.factor || 1))
                : 1;

            return {
                name: item,
                baseScore,
                materialFactor,
                finalScore: baseScore * materialFactor
            };
        });

        return {
            success: true,
            data: {
                items,
                materials,
                details,
                caption: analysis.captionResult?.text,
                confidence: analysis.captionResult?.confidence,
                scores
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