const store = require('../utils/memoryStore');

const MATERIAL_FACTORS = {
    'cotton': 1.0,
    'organic-cotton': 0.7,
    'polyester': 1.2,
    'recycled-polyester': 0.8,
    'wool': 1.3,
    'recycled-wool': 0.9,
    'leather': 1.5,
    'vegan-leather': 1.2,
    'denim': 1.2,
    'recycled-denim': 0.8,
    'linen': 0.8,
    'silk': 1.3,
    'nylon': 1.3,
    'recycled': 0.6,
    'canvas': 0.9,
    'bamboo': 0.7
};

const CONDITION_FACTORS = {
    'new': 1.0,
    'like-new': 0.95,
    'good': 0.9,
    'fair': 0.8,
    'poor': 0.7,
    'very-poor': 0.6
};

const AGE_FACTORS = {
    '0-6m': 1.0,
    '6-12m': 0.9,
    '12-24m': 0.8
};

const BASE_SCORES = {
    'T-shirt': 5,
    't-shirt': 5,
    'tshirt': 5,
    'Shirt': 7,
    'shirt': 7,
    'Jeans': 10,
    'jeans': 10,
    'jean': 10,
    'Pants': 10,
    'pants': 10,
    'Trousers': 10,
    'trousers': 10,
    'Jacket': 15,
    'jacket': 15,
    'Coat': 15,
    'coat': 15,
    'Blazer': 15,
    'blazer': 15,
    'Sweater': 8,
    'sweater': 8,
    'Pullover': 8,
    'pullover': 8,
    'Cardigan': 8,
    'cardigan': 8,
    'Shoes': 8,
    'shoes': 8,
    'shoe': 8,
    'Sneakers': 8,
    'sneakers': 8,
    'Boots': 10,
    'boots': 10,
    'Dress': 12,
    'dress': 12,
    'Skirt': 7,
    'skirt': 7,
    'Suit': 20,
    'suit': 20,
    'Tuxedo': 20,
    'tuxedo': 20,
    'Sportswear': 6,
    'sportswear': 6,
    'Athletic wear': 6,
    'athletic wear': 6,
    'Accessories': 2,
    'accessories': 2,
    'Belt': 2,
    'belt': 2,
    'Scarf': 2,
    'scarf': 2,
    'Swimwear': 4,
    'swimwear': 4,
    'Swimsuit': 4,
    'swimsuit': 4,
    'Bikini': 4,
    'bikini': 4,
    'Swimming trunks': 4,
    'swimming trunks': 4,
    'Bathing suit': 4,
    'bathing suit': 4,
    'Beach wear': 4,
    'beach wear': 4,
    'Swim brief': 4,
    'swim brief': 4
};

function calculateCarbonScore(item) {
    const itemNameLower = item.name.toLowerCase();
    const baseScore = Object.entries(BASE_SCORES).find(
        ([key]) => key.toLowerCase() === itemNameLower
    )?.[1] || 0;

    const materialFactor = MATERIAL_FACTORS[item.material] || 1.0;
    const conditionFactor = CONDITION_FACTORS[item.condition] || 1.0;
    const ageFactor = AGE_FACTORS[item.age] || 1.0;

    const finalScore = baseScore * materialFactor * conditionFactor * ageFactor;
    const ecoPoints = Math.floor(finalScore * 10);

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