import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthState, getAuthState } from '../../hooks/useAuth';
import { useIdleTimer } from '../../hooks/useIdleTimer';
import { SESSION_TIMEOUT_MS, SESSION_GRACE_PERIOD_MS } from '../../constants/config';
import { IconLock, IconClock } from '@tabler/icons-react';

const SessionTimeout = () => {
  const navigate = useNavigate();

  const handleExpired = useCallback(() => {
    clearAuthState();
    navigate('/login', { replace: true });
  }, [navigate]);

  const { isAuth } = getAuthState();
  const { showWarning, remaining, resetTimer } = useIdleTimer({
    timeout: SESSION_TIMEOUT_MS,
    gracePeriod: SESSION_GRACE_PERIOD_MS,
    onExpired: handleExpired,
  });

  if (!isAuth || !showWarning) return null;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full mx-4 text-center animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
          <IconLock size={40} className="text-amber-accent" />
        </div>

        <h2 className="font-h3-card text-2xl text-text-dark mb-2">
          Sesi Anda akan berakhir
        </h2>
        <p className="text-text-muted text-sm mb-6">
          Karena tidak ada aktivitas, sesi Anda akan otomatis berakhir demi keamanan akun Anda.
        </p>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex items-center justify-center gap-3">
          <IconClock size={24} className="text-amber-accent" />
          <div>
            <p className="text-sm font-semibold text-amber-accent">Sesi berakhir dalam</p>
            <p className="text-3xl font-bold text-amber-accent font-mono">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
          </div>
        </div>

        <button
          onClick={resetTimer}
          className="w-full bg-primary hover:bg-primary-container text-white py-3.5 rounded-full font-bold text-base transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          Tetap Login
        </button>

        <p className="text-xs text-text-muted mt-4">
         Jika Anda tidak merespon, Anda akan dialihkan ke halaman login secara otomatis.
        </p>
      </div>
    </div>
  );
};

export default SessionTimeout;
