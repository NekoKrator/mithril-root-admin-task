export interface User {
  email: string,
  password: string,
  name: string,
  role: string
}

export interface UserId extends User {
  id: string,
  createdAt: string,
}

export type Role = 'admin' | 'user';

export interface Modal {
  onDone: () => Promise<void>;
  onClose: () => void;
}

export interface EditModal extends Modal {
  user?: UserId;
}