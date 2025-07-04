import { z } from 'zod';
import { validateRequiredField } from '@/shared/utils/validation.utils';

export const UpdateUserDto = z.object({
  name: z.string().min(2).transform(val => validateRequiredField('name', val)),
  email: z.string().email().transform(val => validateRequiredField('email', val)),
  password: z.string().min(6).transform(val => validateRequiredField('password', val)),
  photo: z.string().url().optional(),
});

export type UpdateUserDtoType = z.infer<typeof UpdateUserDto>;