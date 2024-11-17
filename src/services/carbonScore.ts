import { CARBON_SCORES, MATERIAL_MULTIPLIERS, CONDITION_MULTIPLIERS } from '../config/constants';
import { CarbonScoreRequest, ClothingItem } from '../types';

export const calculateCarbonScore = (request: CarbonScoreRequest): {
  items: ClothingItem[];
  totalScore: number;
  ecoPoints: number;
} => {
  const items = request.items.map(item => {
    const baseScore = CARBON_SCORES[item.name as keyof typeof CARBON_SCORES] || 0;
    const materialMultiplier = item.material ? MATERIAL_MULTIPLIERS[item.material as keyof typeof MATERIAL_MULTIPLIERS] || 1 : 1;
    const conditionMultiplier = item.condition ? CONDITION_MULTIPLIERS[item.condition as keyof typeof CONDITION_MULTIPLIERS] || 1 : 1;

    const carbonScore = baseScore * materialMultiplier * conditionMultiplier;

    return {
      name: item.name,
      carbonScore: Number(carbonScore.toFixed(2))
    };
  });

  const totalScore = Number(items.reduce((sum, item) => sum + item.carbonScore, 0).toFixed(2));
  const ecoPoints = Math.floor(totalScore * 10); // Convert carbon score to points

  return { items, totalScore, ecoPoints };
}; 