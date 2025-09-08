import { api } from './api'

export async function createVisit(noteId: string) {
  const { data } = await api.post(`visit/${noteId}`)

  return data
}

export async function getVisits() {
  const { data } = await api.get('/visit')

  return data
}