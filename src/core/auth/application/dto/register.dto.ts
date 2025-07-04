import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  photo: z.string().url('Foto deve ser uma URL válida').optional()
});

export type RegisterDto = z.infer<typeof RegisterSchema>;