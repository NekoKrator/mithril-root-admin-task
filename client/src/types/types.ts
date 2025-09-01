import { z } from 'zod'
import { UserSchema } from '../services/validation';

export interface User {
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface UserId extends User {
  id: string;
  createdAt: string;
  createdBy?: {
    id: string;
    email: string;
  } | null;
}

export type Role = 'admin' | 'user';

export interface Modal {
  onDone: () => Promise<void>
  onClose: () => void
}

export interface EditModal extends Modal {
  user?: UserId;
}

export type UserFormData = z.infer<typeof UserSchema>;