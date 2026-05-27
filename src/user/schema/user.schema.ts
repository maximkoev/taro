import * as z from 'zod';

export const UserSchema = z.object({
  name: z.string().min(2).max(100),
  password: z.string().min(6),
});

export type UserDTO = z.infer<typeof UserSchema>;
