import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { verifyCodeApi, resendCodeApi } from '../../services/auth';
import {
  IconPaw,
  IconMail,
  IconClock,
  IconAlertCircle,
  IconCheck,
  IconRefresh,
  IconHourglass,
} from '@tabler/icons-react';

const VerifyCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: location.state?.email || '', code: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [expiresAt, setExpiresAt] = useState(() => {
    const fromState = location.state?.verification_expires_at;
    return fromState ? new Date(fromState).getTime() : Date.now() + 120000;
  });
  const [expiryCountdown, setExpiryCountdown] = useState(120);
  const [isCodeExpired, setIsCodeExpired] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.ceil((expiresAt - Date.now()) / 1000);
      if (remaining <= 0) {
        setExpiryCountdown(0);
        setIsCodeExpired(true);
        clearInterval(interval);
      } else {
        setExpiryCountdown(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await verifyCodeApi(form);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Kode verifikasi tidak valid');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isCodeExpired || resending) return;
    setResending(true);
    setError('');

    try {
      const res = await resendCodeApi(form.email);
      const newExpiry = res.data?.data?.verification_expires_at;
      if (newExpiry) {
        setExpiresAt(new Date(newExpiry).getTime());
      } else {
        setExpiresAt(Date.now() + 120000);
      }
      setIsCodeExpired(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim ulang kode');
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex font-body-main bg-surface">
      <div className="hidden lg:flex w-1/2 bg-on-secondary-fixed items-center justify-center p-12">
        <div className="text-on-primary max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <IconPaw size={40} className="text-primary-fixed" stroke={1.5} />
            <h1 className="font-hero-display text-h3-card text-primary-fixed">Papfum</h1>
          </div>
          <h2 className="font-h2-section text-[32px] text-on-primary mb-6">Verifikasi Email Anda</h2>
          <p className="text-secondary-fixed text-body-main">
            Kami telah mengirimkan kode verifikasi ke email Anda. Masukkan kode tersebut untuk melanjutkan.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <IconPaw size={32} className="text-primary" stroke={1.5} />
            <h1 className="font-hero-display text-h3-card text-primary">Papfum</h1>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border-light">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-fixed/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <IconMail size={32} className="text-primary" stroke={1.5} />
              </div>
              <h2 className="font-h3-card text-[24px] text-text-dark mb-2">Verifikasi Kode</h2>
              <p className="text-text-muted text-body-small">
                Masukkan kode verifikasi yang telah dikirim ke email Anda
              </p>
            </div>

            {!isCodeExpired && expiryCountdown > 0 && (
              <div className="bg-amber-50 text-amber-700 p-3 rounded-xl mb-4 text-body-small flex items-center justify-center gap-2">
                <IconHourglass size={16} />
                Kode berlaku selama {formatTime(expiryCountdown)}
              </div>
            )}

            {isCodeExpired && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-body-small flex items-center justify-center gap-2">
                <IconClock size={16} />
                Kode sudah kadaluarsa, kirim ulang kode untuk mendapatkan kode baru
              </div>
            )}

            {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded-xl mb-4 text-body-small flex items-center gap-2">
                <IconAlertCircle size={18} />
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-body-small flex items-center gap-2 justify-center">
                <IconCheck size={18} />
                Verifikasi berhasil! Silakan login...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-ui-label text-sm text-text-dark mb-1.5 block">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark text-body-main focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
                  placeholder="nama@email.com"
                />
              </div>

              <div>
                <label className="font-ui-label text-sm text-text-dark mb-1.5 block">Kode Verifikasi</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark text-body-main text-center text-xl tracking-widest font-mono focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading || success || isCodeExpired}
                className="w-full bg-primary hover:bg-on-primary-container text-on-primary py-3 rounded-full font-ui-label text-ui-label transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Memproses...'
                ) : success ? (
                  <>
                    <IconCheck size={18} />
                    Berhasil
                  </>
                ) : (
                  <>
                    <IconCheck size={18} />
                    Verifikasi
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={handleResend}
                disabled={!isCodeExpired || resending}
                className={`font-ui-label text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 mx-auto ${
                  isCodeExpired
                    ? 'text-primary hover:text-on-primary-container'
                    : 'text-text-muted'
                }`}
              >
                <IconRefresh size={16} className={resending ? 'animate-spin' : ''} />
                {resending ? 'Mengirim...' : 'Kirim Ulang Kode'}
              </button>
            </div>

            <p className="text-center mt-4 text-text-muted text-body-small">
              <Link to="/login" className="text-primary font-semibold hover:text-on-primary-container transition-colors">
                Kembali ke Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
