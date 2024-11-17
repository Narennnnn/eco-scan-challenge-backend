export interface ClothingItem {
  name: string;
  carbonScore: number;
}

export interface CarbonScoreRequest {
  items: {
    name: string;
    material?: string;
    brand?: string;
    condition?: 'new' | 'good' | 'fair' | 'poor';
  }[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
} 