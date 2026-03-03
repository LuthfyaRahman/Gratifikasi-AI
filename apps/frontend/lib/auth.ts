import { User, UserRole } from '@/types';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  user_id?: number;
  id?: number;
  username?: string;
  email?: string;
  role?: string;
  exp?: number;
}

const TOKEN_KEY = 'gratifikasi_token';

export function decodeToken(token: string): User {
  const payload = jwtDecode<JwtPayload>(token);
  return {
    id: payload.user_id ?? payload.id ?? 0,
    username: payload.username ?? '',
    email: payload.email ?? '',
    role: (payload.role as UserRole) ?? UserRole.EMPLOYEE,
  };
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const token = getStoredToken();
  if (!token) return false;
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (exp && exp * 1000 < Date.now()) {
      removeStoredToken();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
