import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { STORAGE_KEYS } from '../constants/storage';

const getItem = (key) => localStorage.getItem(key);
const setItem = (key, value) => localStorage.setItem(key, value);
const removeItem = (key) => localStorage.removeItem(key);

export const getAuthState = () => {
  try {
    const isAuth = getItem(STORAGE_KEYS.IS_AUTH) === 'true';
    const roles = JSON.parse(getItem(STORAGE_KEYS.ROLES) || '[]');
    const token = getItem(STORAGE_KEYS.TOKEN);
    const user = JSON.parse(getItem(STORAGE_KEYS.USER) || 'null');
    const permissions = JSON.parse(getItem(STORAGE_KEYS.PERMISSIONS) || '[]');
    return { isAuth: isAuth && !!token, roles, user, permissions };
  } catch {
    return { isAuth: false, roles: [], user: null, permissions: [] };
  }
};

export const setAuthState = (data) => {
  setItem(STORAGE_KEYS.IS_AUTH, 'true');
  setItem(STORAGE_KEYS.TOKEN, data.token);
  setItem(STORAGE_KEYS.ROLES, JSON.stringify(data.roles));
  setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
  setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(data.permissions || []));
  window.dispatchEvent(new Event('authChanged'));
};

export const clearAuthState = () => {
  removeItem(STORAGE_KEYS.IS_AUTH);
  removeItem(STORAGE_KEYS.TOKEN);
  removeItem(STORAGE_KEYS.ROLES);
  removeItem(STORAGE_KEYS.USER);
  removeItem(STORAGE_KEYS.PERMISSIONS);
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
      setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
      setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(permissions || []));
      setAuth(getAuthState());
    } catch {
      clearAuthState();
    }
  }, []);

  return { ...auth, refreshUser };
}
