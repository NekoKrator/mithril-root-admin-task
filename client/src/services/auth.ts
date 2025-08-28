import { api } from './api';

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth', { email, password });

  console.log(data)

  localStorage.setItem('token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user_id));

  return data.user;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const raw = localStorage.getItem('user');

  return raw ? JSON.parse(raw) : null;
}