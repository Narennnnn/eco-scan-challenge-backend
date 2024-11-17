import { z } from 'zod';
import { CARBON_SCORES, MATERIAL_MULTIPLIERS, CONDITION_MULTIPLIERS } from '../config/constants';

export const carbonScoreSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      name: z.enum(Object.keys(CARBON_SCORES) as [string, ...string[]]),
      material: z.enum(Object.keys(MATERIAL_MULTIPLIERS) as [string, ...string[]]).optional(),
      condition: z.enum(Object.keys(CONDITION_MULTIPLIERS) as [string, ...string[]]).optional(),
    })).min(1, 'At least one item is required'),
  }),
});

export const offersSchema = z.object({
  params: z.object({
    points: z.string().regex(/^\d+$/).transform(Number),
  }),
}); 