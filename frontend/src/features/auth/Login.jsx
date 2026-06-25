import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { loginApi } from '../../services/auth';
import { setAuthState } from '../../hooks/useAuth';
import {
  IconDeviceMobile,
  IconCalendar,
  IconFileDescription,
  IconHeadset,
  IconAlertCircle,
  IconLogin,
  IconClock,
  IconRefresh,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react';

const iconMap = {
  monitoring: IconDeviceMobile,
  calendar_month: IconCalendar,
  description: IconFileDescription,
  support_agent: IconHeadset,
};

const COOLDOWN_DURATION = 120000; // 2 minutes

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const Login = () => {
  const navigate = useNavigate();
  const captchaRef = useRef(null);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldownUntil, setCooldownUntil] = useState(() => {
    const stored = localStorage.getItem('login_cooldown');
    return stored ? Number(stored) : 0;
  });
  const [countdown, setCountdown] = useState(0);

  const handleCaptchaVerify = useCallback((token) => {
    setCaptchaToken(token);
    setCaptchaError(false);
  }, []);

  const handleCaptchaError = useCallback(() => {
    setCaptchaError(true);
    setCaptchaToken(null);
  }, []);

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken(null);
  }, []);

  useEffect(() => {
    if (cooldownUntil > Date.now()) {
      setCountdown(Math.ceil((cooldownUntil - Date.now()) / 1000));
      const interval = setInterval(() => {
        const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          clearInterval(interval);
          setCooldownUntil(0);
          setCountdown(0);
          localStorage.removeItem('login_cooldown');
        } else {
          setCountdown(remaining);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldownUntil]);

  const isCooldown = cooldownUntil > Date.now();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCooldown) return;
    setLoading(true);
    setError('');

    try {
      const res = await loginApi({ ...form, 'g-recaptcha-response': captchaToken });
      const { token, user, roles } = res.data.data;

      setAuthState({ token, roles, user });
      localStorage.setItem('user', JSON.stringify(user));

      if (roles.includes('super_admin') || roles.includes('admin')) {
        navigate('/admin');
      } else if (roles.includes('staff')) {
        navigate('/staff');
      } else {
        navigate('/customer');
      }
    } catch (err) {
      captchaRef.current?.reset();
      setCaptchaToken(null);
      setCaptchaKey((k) => k + 1);
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 403 && data?.data?.email) {
        navigate('/verify-code', {
          state: {
            email: data.data.email,
            verification_expires_at: data.data.verification_expires_at,
          },
        });
        return;
      }
      if (status === 429) {
        const until = Date.now() + COOLDOWN_DURATION;
        setCooldownUntil(until);
        localStorage.setItem('login_cooldown', String(until));
        setError('Terlalu banyak percobaan login. Silakan coba lagi dalam 2 menit.');
      } else {
        setError(err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Login gagal');
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: 'monitoring', text: 'Pantau kucing Anda dari mana saja' },
    { icon: 'calendar_month', text: 'Kelola reservasi dengan mudah' },
    { icon: 'description', text: 'Update harian kondisi kucing' },
    { icon: 'support_agent', text: 'Konsultasi dengan staff profesional' },
  ];

  return (
    <div className="min-h-screen flex font-body-main">
      <div className="hidden lg:flex w-1/2 bg-on-secondary-fixed items-center justify-center p-12">
        <div className="text-on-primary max-w-md">
          <div className="flex items-center">
            <img
              src="/images/logo.png"
              alt="Cat House"
              className="h-40 w-auto ml-3"
            />
          </div>
          <h2 className="font-h2-section text-[32px] text-on-primary mb-6">Selamat Datang Kembali!</h2>
          <ul className="space-y-4">
            {features.map(({ icon, text }) => {
              const IconComponent = iconMap[icon] || IconDeviceMobile;
              return (
                <li key={icon} className="flex items-center gap-3">
                  <IconComponent size={24} className="text-primary-container" stroke={1.5} />
                  <span className="text-secondary-fixed text-body-main">{text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center mb-8 justify-center">
            <img
              src="/images/logo.png"
              alt="Cat House"
              className="h-10 w-auto"
            />
          </div>

          <h2 className="font-h3-card text-[24px] text-text-dark mb-2">Masuk</h2>
          <p className="text-text-muted text-body-main mb-8">Masuk ke akun Papfum Anda</p>

          {error && (
            <div className={`p-3 rounded-xl mb-4 text-body-small flex items-center gap-2 ${
              isCooldown
                ? 'bg-amber-50 text-amber-700'
                : 'bg-error-container text-on-error-container'
            }`}>
              {isCooldown ? <IconClock size={18} /> : <IconAlertCircle size={18} />}
              {isCooldown ? `Terlalu banyak percobaan. Coba lagi dalam ${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')} menit` : error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-ui-label text-sm text-text-dark mb-1.5 block">Email</label>
              <input
                type="email"
                required
                disabled={isCooldown}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl bg-white text-text-dark text-body-main placeholder:text-text-muted/60 transition ${
                  isCooldown
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-border-light focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)]'
                }`}
                placeholder="nama@email.com"
              />
            </div>
            <div>
              <label className="font-ui-label text-sm text-text-dark mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isCooldown}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`w-full px-4 py-2.5 border rounded-xl bg-white text-text-dark text-body-main placeholder:text-text-muted/60 transition ${
                    isCooldown
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-border-light focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)]'
                  }`}
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex justify-center min-h-[78px]">
              {captchaError && (
                <div className="flex flex-col items-center gap-2 text-sm text-text-muted">
                  <span>Gagal memuat captcha</span>
                  <button
                    type="button"
                    onClick={() => { setCaptchaError(false); setCaptchaKey((k) => k + 1); }}
                    className="text-primary hover:underline flex items-center gap-1 text-xs"
                  >
                    <IconRefresh size={14} /> Muat ulang
                  </button>
                </div>
              )}
              {!captchaError && (
                <ReCAPTCHA
                  key={captchaKey}
                  ref={captchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaVerify}
                  onErrored={handleCaptchaError}
                  onExpired={handleCaptchaExpire}
                />
              )}
            </div>
            <button
              type="submit"
              disabled={loading || isCooldown || !captchaToken}
              className="w-full bg-primary hover:bg-on-primary-container text-on-primary py-3 rounded-full font-ui-label text-ui-label transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Memproses...'
              ) : isCooldown ? (
                <>
                  <IconClock size={18} />
                  {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                </>
              ) : (
                <>
                  <IconLogin size={18} />
                  Masuk
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-text-muted text-body-main">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary font-semibold hover:text-on-primary-container transition-colors">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
