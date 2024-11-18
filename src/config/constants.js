const CARBON_SCORES = {
    'Sweater': 8,
    'T-shirt': 5,
    'Jeans': 10,
    'Jacket': 15,
    'Shoes': 8,
    'Dress': 12,
    'Skirt': 7,
    'Suit': 20,
    'Sportswear': 6,
    'Underwear': 3,
    'Accessories': 2,
    'Swimwear': 4
}; 

// Material impact multipliers
const MATERIAL_MULTIPLIERS = {
    'wool': 1.3,
    'cotton': 1.0,
    'organic-cotton': 0.7,
    'polyester': 1.2,
    'synthetic': 1.2,
    'leather': 1.5,
    'denim': 1.2,
    'silk': 1.1,
    'nylon': 1.3,
    'linen': 0.8,
    'canvas': 0.9
};

module.exports = {
    CARBON_SCORES,
    MATERIAL_MULTIPLIERS
}; 