import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '../../services/auth';
import PasswordStrength from '../../components/ui/PasswordStrength';
import {
  IconLock,
  IconLockAccess,
  IconAlertCircle,
  IconEye,
  IconEyeOff,
  IconCheck,
  IconArrowLeft,
} from '@tabler/icons-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [form, setForm] = useState({
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (form.password !== form.password_confirmation) {
      setError('Konfirmasi password tidak cocok.');
      setLoading(false);
      return;
    }

    try {
      await resetPasswordApi({ token, email, ...form });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.token?.[0] || err.response?.data?.errors?.email?.[0] || 'Gagal mereset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-surface font-body-main">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-error-container flex items-center justify-center mx-auto mb-4">
            <IconAlertCircle size={40} className="text-on-error-container" />
          </div>
          <h2 className="font-h3-card text-[24px] text-text-dark mb-2">Tautan Tidak Valid</h2>
          <p className="text-text-muted text-body-main mb-6">
            Tautan reset password tidak valid atau rusak. Silakan kirim ulang permintaan reset password.
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-on-primary-container transition-colors"
          >
            <IconArrowLeft size={18} />
            Kirim Ulang
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-surface font-body-main">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <IconCheck size={40} className="text-green-600" />
          </div>
          <h2 className="font-h3-card text-[24px] text-text-dark mb-2">Password Berhasil Diubah!</h2>
          <p className="text-text-muted text-body-main mb-6">
            Password Anda telah berhasil direset. Anda akan dialihkan ke halaman login dalam beberapa detik.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-on-primary-container transition-colors"
          >
            <IconArrowLeft size={18} />
            Ke Halaman Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-body-main">
      <div className="hidden lg:flex w-1/2 bg-on-secondary-fixed items-center justify-center p-12">
        <div className="text-on-primary max-w-md">
          <div className="flex items-center">
            <img src="/images/logo.png" alt="Cat House" className="h-40 w-auto ml-3" />
          </div>
          <h2 className="font-h2-section text-[32px] text-on-primary mb-6">Buat Password Baru</h2>
          <p className="text-secondary-fixed text-body-main">
            Buat password baru yang kuat untuk akun Anda. Pastikan password berbeda dari yang sebelumnya.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center mb-8 justify-center">
            <img src="/images/logo.png" alt="Cat House" className="h-10 w-auto" />
          </div>

          <h2 className="font-h3-card text-[24px] text-text-dark mb-2">Reset Password</h2>
          <p className="text-text-muted text-body-main mb-2">
            Buat password baru untuk akun <strong className="text-text-dark">{email}</strong>
          </p>
          <p className="text-text-muted text-body-small mb-8">
            Minimal 8 karakter, mengandung huruf besar, huruf kecil, angka, dan karakter khusus (!@#$%^&*)
          </p>

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-xl mb-4 text-body-small flex items-center gap-2">
              <IconAlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-ui-label text-sm text-text-dark mb-1.5 block">Password Baru</label>
              <div className="relative">
                <IconLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-12 pr-10 py-2.5 border border-border-light rounded-xl bg-white text-text-dark text-body-main focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
                  placeholder="Min. 8 karakter"
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
              <PasswordStrength password={form.password} />
            </div>

            <div>
              <label className="font-ui-label text-sm text-text-dark mb-1.5 block">Konfirmasi Password Baru</label>
              <div className="relative">
                <IconLockAccess size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  className="w-full pl-12 pr-10 py-2.5 border border-border-light rounded-xl bg-white text-text-dark text-body-main focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
                  placeholder="Ulangi password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-on-primary-container text-on-primary py-3 rounded-full font-ui-label text-ui-label transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Memproses...' : 'Reset Password'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-on-primary-container transition-colors"
            >
              <IconArrowLeft size={18} />
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
