import { AVAILABLE_OFFERS } from '../config/constants';
import { Offer } from '../types';

export const getAvailableOffers = (points: number): Offer[] => {
  return AVAILABLE_OFFERS.filter(offer => offer.pointsRequired <= points);
}; 