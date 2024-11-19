export const CARBON_SCORES = {
  'T-shirt': 5,
  'Jeans': 10,
  'Jacket': 15,
  'Shoes': 8,
};

// Material multipliers for more accurate scoring
export const MATERIAL_MULTIPLIERS = {
  'cotton': 1,
  'organic-cotton': 0.7,
  'polyester': 1.2,
  'recycled-polyester': 0.8,
  'wool': 1.3,
  'leather': 1.5,
};

// Condition multipliers
export const CONDITION_MULTIPLIERS = {
  'new': 1,
  'good': 0.9,
  'fair': 0.8,
  'poor': 0.7,
};

// Points conversion rate
export const CARBON_TO_POINTS_RATE = 10; // 1 kg CO2 saved = 10 points

export const AVAILABLE_OFFERS = [
  {
    id: '1',
    title: '10% Off Eco-friendly Products',
    description: 'Get 10% off on any eco-friendly product',
    pointsRequired: 100,
  },
  {
    id: '2',
    title: 'Free Recycling Kit',
    description: 'Get a free clothing recycling kit',
    pointsRequired: 200,
  },
  {
    id: '3',
    title: '10% Off Your Next Purchase',
    description: 'Get 10% off on your next purchase',
    pointsRequired: 300,
  },
  {
    id: '4',
    title: '10% Off Your Next Purchase',
    description: 'Get 10% off on your next purchase',
    pointsRequired: 400,
  },
  {
    id: '5',
    title: '10% Off Your Next Purchase',
    description: 'Get 10% off on your next purchase',
    pointsRequired: 500,
  },
]; 