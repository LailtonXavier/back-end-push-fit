import { z } from 'zod';
import { ActivityIntensity } from '../../domain/types/intensity.type';
import { validateRequiredField } from '@/shared/utils/validation.utils';

export const UpdateActivityDto = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').transform(val => validateRequiredField('name', val)).optional(),
  duration: z.number().int().positive('Duração deve ser positiva').transform(val => validateRequiredField('duration', val)).optional(),
  intensity: z.enum(['low', 'medium', 'high'] as [ActivityIntensity, ...ActivityIntensity[]]).optional(),
  distance: z.number().positive('Distância deve ser positiva').optional(),
  photo: z.string().url('URL inválida').optional(),
  createdAt: z.date().optional(),
});

export type UpdateActivityDtoType = z.infer<typeof UpdateActivityDto>;