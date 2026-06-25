import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

export const LoginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    email: z.email(),
    firstName: z.string(),
    lastName: z.string().optional(),
    isTemporaryEmail: z.boolean(),
  }),
});
export type LoginResponseDTO = z.infer<typeof LoginResponseSchema>;
