import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutApi } from '../services/auth';
import { clearAuthState } from './useAuth';

export function useLogout() {
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // ignore
    }
    clearAuthState();
    navigate('/login');
  }, [navigate]);

  return logout;
}
