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

export interface Modal {
  onDone: () => Promise<void>;
  onClose: () => void;
}
