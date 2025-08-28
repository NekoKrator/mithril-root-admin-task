import { api } from './api'
import type { User } from '../types/types'

export async function fetchUsers() {
  const { data } = await api.get('/users');

  return data
}

export async function createUser(payload: User) {
  const { data } = await api.post('/users', payload);

  return data;
}

export async function updateUser(id: string, payload: User) {
  const { data } = await api.patch(`/users/${id}`, payload);

  return data;
}