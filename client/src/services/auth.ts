import { api } from './api';

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth', { email, password });

  localStorage.setItem('token', data.access_token);

  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  } else {
    localStorage.removeItem('user');
  }

  return data.user;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    console.error('Invalid Token in localStorage:', raw);
    logout();
    return null;
  }
}

export async function forgotPassword(email: string) {
  const { data } = await api.post('/auth/forgot', { email })

  return data
}

export async function resetPassword(token: string, password: string) {
  const { data } = await api.post('/auth/reset', { token, password })

  return data
}