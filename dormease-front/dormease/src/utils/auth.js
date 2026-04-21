import {jwtDecode} from 'jwt-decode';

export function getUserRole() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role; // замените на правильное имя поля, если у вас другое
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem('accessToken');
}
