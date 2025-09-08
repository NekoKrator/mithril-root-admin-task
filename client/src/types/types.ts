import { z } from 'zod'
import { UserSchema } from '../services/validation';

export interface User {
  email: string;
  password: string;
  name: string;
  role: Role;
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

export type AllRoles = Role | 'root_admin';

export interface Note {
  title: string,
  content: string,
  reminderDate: Date | null,
}

export interface NoteId extends Note {
  id: string,
  authorId: string,
  isSent: boolean
}

export interface DataType {
  email: string,
  name: string
}

export type DataIndex = keyof DataType;


export type UserFormData = z.infer<typeof UserSchema>;

export interface CreateModal {
  onDone: () => Promise<void>
}

export interface EditModal extends CreateModal {
  user?: UserId;
}

export interface BaseModalProps {
  onDone: () => void;
}

export interface CreateModalProps extends BaseModalProps {
  mode: 'create'
}

export interface EditModalProps extends BaseModalProps {
  mode: 'edit'
  user: UserId
}

export interface NoteEditModalProps extends BaseModalProps {
  mode: 'edit'
  note: NoteId
}

export type UserModalProps = (CreateModalProps | EditModalProps) & {
  triggerText?: string
};


export type NoteModalProps = (CreateModalProps | NoteEditModalProps) & {
  triggerText?: string
}

export interface DashboardTableProps {
  currentUser: UserId
  loading: boolean
}

export interface Visit {
  note: NoteId
  noteId: string
  visitId: string
}