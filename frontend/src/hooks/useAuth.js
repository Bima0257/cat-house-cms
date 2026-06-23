import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';

export const getAuthState = () => {
  try {
    const isAuth = localStorage.getItem('isAuth') === 'true';
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    return { isAuth: isAuth && !!token, roles, user, permissions };
  } catch {
    return { isAuth: false, roles: [], user: null, permissions: [] };
  }
};

export const setAuthState = (data) => {
  localStorage.setItem('isAuth', 'true');
  localStorage.setItem('token', data.token);
  localStorage.setItem('roles', JSON.stringify(data.roles));
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('permissions', JSON.stringify(data.permissions || []));
  window.dispatchEvent(new Event('authChanged'));
};

export const clearAuthState = () => {
  localStorage.removeItem('isAuth');
  localStorage.removeItem('token');
  localStorage.removeItem('roles');
  localStorage.removeItem('user');
  localStorage.removeItem('permissions');
  window.dispatchEvent(new Event('authChanged'));
};

export function useAuth() {
  const [auth, setAuth] = useState(getAuthState());

  useEffect(() => {
    const handleAuthChange = () => setAuth(getAuthState());
    window.addEventListener('authChanged', handleAuthChange);
    return () => window.removeEventListener('authChanged', handleAuthChange);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/api/me');
      const { user, roles, permissions } = res.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('roles', JSON.stringify(roles));
      localStorage.setItem('permissions', JSON.stringify(permissions || []));
      setAuth(getAuthState());
    } catch {
      clearAuthState();
    }
  }, []);

  return { ...auth, refreshUser };
}
