const { analyzeImage } = require('./testVision');
const { CARBON_SCORES, MATERIAL_MULTIPLIERS } = require('../config/constants');

// Define clothing categories and their variations
const CLOTHING_CATEGORIES = {
    'Sweater': [
        'sweater', 'pullover', 'jumper', 'knitwear', 'cardigan', 
        'turtleneck', 'wool sweater', 'knit', 'woolen', 'jersey'
    ],
    'T-shirt': [
        'shirt', 't-shirt', 'tshirt', 'top', 'blouse', 'polo'
    ],
    'Jeans': [
        'jeans', 'pants', 'trousers', 'slacks', 'leggings', 
        'shorts', 'denim', 'cargo', 'khakis', 'chinos'
    ],
    'Jacket': [
        'jacket', 'coat', 'blazer', 'outerwear', 'windbreaker', 
        'cardigan', 'parka', 'bomber', 'raincoat', 'overcoat'
    ],
    'Shoes': [
        'shoes', 'sneakers', 'boots', 'footwear', 'sandals', 
        'trainers', 'heels', 'loafers', 'flats', 'athletic shoes'
    ],
    'Skirt': [
        'skirt', 'midi skirt', 'mini skirt', 'maxi skirt',
        'pleated skirt', 'a-line skirt'
    ],
    'Suit': [
        'suit', 'tuxedo', 'blazer suit', 'business suit',
        'formal wear', 'two-piece suit'
    ],
    'Sportswear': [
        'sportswear', 'athletic wear', 'gym clothes', 'workout gear',
        'activewear', 'fitness wear', 'sports uniform'
    ],
    'Underwear': [
        'underwear', 'lingerie', 'undergarment', 'bra',
        'briefs', 'boxers', 'panties'
    ],
    'Accessories': [
        'scarf', 'hat', 'cap', 'beanie', 'gloves', 'mittens',
        'belt', 'tie', 'bowtie', 'socks', 'stockings'
    ],
    'Swimwear': [
        'swimsuit', 'swimming trunks', 'bikini', 'swimwear',
        'bathing suit', 'beach wear'
    ]
};

async function recognizeClothing(imageBuffer) {
    try {
        const analysis = await analyzeImage(imageBuffer);
        
        const result = {
            items: new Set(),
            description: analysis.caption,
            confidence: analysis.confidence,
            details: [],
            materials: new Set()
        };

        // First, check the caption for initial context
        if (analysis.caption) {
            const caption = analysis.caption.toLowerCase();
            for (const [category, variations] of Object.entries(CLOTHING_CATEGORIES)) {
                if (variations.some(variation => caption.includes(variation.toLowerCase()))) {
                    result.items.add(category);
                }
            }
        }

        // Process tags with high confidence (above 0.6)
        if (analysis.tags) {
            analysis.tags.forEach(tag => {
                if (tag.confidence > 0.6) {
                    result.details.push({
                        name: tag.name,
                        confidence: tag.confidence
                    });

                    const tagName = tag.name.toLowerCase();
                    
                    // Check for materials first
                    if (tagName.includes('wool') || tagName.includes('woolen')) {
                        result.materials.add('wool');
                    }
                    if (tagName.includes('cotton')) {
                        result.materials.add('cotton');
                    }
                    // Add more material checks as needed

                    // Special handling for sweaters and knitwear
                    if (tagName.includes('sweater') || 
                        tagName.includes('pullover') || 
                        tagName.includes('turtleneck') ||
                        tagName.includes('knit')) {
                        result.items.delete('T-shirt'); // Remove T-shirt if it was added
                        result.items.add('Sweater');
                    }

                    // Check other categories
                    for (const [category, variations] of Object.entries(CLOTHING_CATEGORIES)) {
                        if (variations.some(variation => tagName.includes(variation.toLowerCase()))) {
                            result.items.add(category);
                        }
                    }
                }
            });
        }

        // Convert Sets to Arrays
        let detectedItems = Array.from(result.items);
        const detectedMaterials = Array.from(result.materials);

        // Filter for items we can score
        detectedItems = detectedItems.filter(item => CARBON_SCORES.hasOwnProperty(item));

        if (detectedItems.length === 0) {
            throw new Error('No scoreable clothing items detected in the image');
        }

        // Calculate carbon scores with materials
        const scoredItems = detectedItems.map(item => ({
            name: item,
            baseScore: CARBON_SCORES[item],
            materials: detectedMaterials,
            materialMultiplier: detectedMaterials.length > 0 
                ? Math.max(...detectedMaterials.map(m => MATERIAL_MULTIPLIERS[m] || 1))
                : 1,
            finalScore: CARBON_SCORES[item] * (detectedMaterials.length > 0 
                ? Math.max(...detectedMaterials.map(m => MATERIAL_MULTIPLIERS[m] || 1))
                : 1)
        }));

        return {
            items: detectedItems,
            description: analysis.caption,
            confidence: analysis.confidence,
            details: result.details,
            materials: detectedMaterials,
            scores: scoredItems
        };

    } catch (error) {
        console.error('Error in recognizeClothing:', error);
        throw error;
    }
}

// Helper function to detect materials
function detectMaterials(tags) {
    const materials = new Set();
    
    tags?.forEach(tag => {
        const tagName = tag.name.toLowerCase();
        Object.keys(MATERIAL_MULTIPLIERS).forEach(material => {
            if (tagName.includes(material)) {
                materials.add(material);
            }
        });
    });

    return Array.from(materials);
}

module.exports = {
    recognizeClothing
}; 