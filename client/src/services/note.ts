import type { Note } from '../types/types';
import { api } from './api'

export async function createNote(payload: Note) {
  const { data } = await api.post('/notes', payload);

  return data;
}

export async function getNotes(id: string) {
  const { data } = await api.get(`/notes/user/${id}`)

  return data
}

export async function updateNote(id: string, payload: Note) {
  const { data } = await api.patch(`/notes/${id}`, payload);

  return data;
}

export async function deleteNote(id: string) {
  return api.delete(`/notes/${id}`)
}