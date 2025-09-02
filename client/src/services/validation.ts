import { z } from 'zod'

export const UserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(4, { message: 'Username must be at least 4 characters.' })
    .max(32, { message: 'Username must be no more than 32 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 4 characters.' })
    .max(32, { message: 'Password must be no more than 32 characters.' }),
});

export const UserModal = UserSchema.pick({ email: true, password: true });
