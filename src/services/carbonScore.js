const store = require('../utils/memoryStore');

const MATERIAL_FACTORS = {
    'cotton': 1.0,
    'organic-cotton': 0.7,
    'polyester': 1.2,
    'wool': 1.3,
    'recycled': 0.6
};

const CONDITION_FACTORS = {
    'new': 1.0,
    'good': 0.9,
    'fair': 0.8,
    'poor': 0.7
};

const AGE_FACTORS = {
    '0-6m': 1.0,
    '6-12m': 0.9,
    '>1yr': 0.8
};

const BASE_SCORES = {
    'T-shirt': 5,
    'Jeans': 10,
    'Sweater': 8,
    'Jacket': 15,
    'Shoes': 8,
    'shoes': 8,
    'shoe': 8,
    'Shirt': 7,
    'Dress': 12,
    // Add more items as needed
};

function calculateCarbonScore(item) {
    const itemName = item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase();
    
    const baseScore = BASE_SCORES[itemName] || BASE_SCORES[item.name.toLowerCase()] || 0;
    const materialFactor = MATERIAL_FACTORS[item.material] || 1.0;
    const conditionFactor = CONDITION_FACTORS[item.condition] || 1.0;
    const ageFactor = AGE_FACTORS[item.age] || 1.0;

    const finalScore = baseScore * materialFactor * conditionFactor * ageFactor;
    const ecoPoints = Math.floor(finalScore * 10); // Convert to points

    // Store points for the default user
    store.addPoints(store.DEFAULT_USER, ecoPoints);

    return {
        baseScore,
        adjustments: {
            material: materialFactor,
            condition: conditionFactor,
            age: ageFactor
        },
        finalScore: Number(finalScore.toFixed(2)),
        ecoPoints
    };
}

module.exports = {
    calculateCarbonScore,
    MATERIAL_FACTORS,
    CONDITION_FACTORS,
    AGE_FACTORS
}; 