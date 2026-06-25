import * as z from 'zod';

export const UserSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100).optional(),
  password: z.string().min(6),
  email: z.email(),
});

export type UserDTO = z.infer<typeof UserSchema>;
