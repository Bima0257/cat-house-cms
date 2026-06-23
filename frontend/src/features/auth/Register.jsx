import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../../services/auth';
import PasswordStrength from '../../components/ui/PasswordStrength';
import {
  IconPaw,
  IconUser,
  IconMail,
  IconPhone,
  IconLock,
  IconLockAccess,
  IconAlertCircle,
  IconUserPlus,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react';

const steps = [
  { icon: 'user', label: 'Data Diri' },
  { icon: 'mail', label: 'Verifikasi' },
  { icon: 'lock', label: 'Password' },
];

const iconMap = {
  user: IconUser,
  mail: IconMail,
  lock: IconLock,
};

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await registerApi(form);
      const email = res.data.data?.email || form.email;
      const verification_expires_at = res.data.data?.verification_expires_at;

      navigate('/verify-code', { state: { email, verification_expires_at } });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-body-main">
      <div className="hidden lg:flex w-1/2 bg-on-secondary-fixed items-center justify-center p-12">
        <div className="text-on-primary max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <IconPaw size={40} className="text-primary-fixed" stroke={1.5} />
            <h1 className="font-hero-display text-h3-card text-primary-fixed">Papfum</h1>
          </div>
          <h2 className="font-h2-section text-[32px] text-on-primary mb-6">Bergabung dengan Keluarga Papfum!</h2>
          <p className="text-secondary-fixed text-body-main mb-8">
            Daftar sekarang dan dapatkan akses ke layanan penitipan kucing premium.
          </p>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const IconComponent = iconMap[step.icon] || IconUser;
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <IconComponent size={20} className="text-primary-fixed" stroke={1.5} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{step.label}</p>
                    <p className="text-xs text-secondary-fixed opacity-80">
                      {index === 0 && 'Lengkapi data diri Anda'}
                      {index === 1 && 'Verifikasi email Anda'}
                      {index === 2 && 'Buat password yang kuat'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <IconPaw size={32} className="text-primary" stroke={1.5} />
            <h1 className="font-hero-display text-h3-card text-primary">Papfum</h1>
          </div>

          <h2 className="font-h3-card text-[24px] text-text-dark mb-2">Daftar</h2>
          <p className="text-text-muted text-body-main mb-8">Buat akun baru di Papfum</p>

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-xl mb-4 text-body-small flex items-center gap-2">
              <IconAlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-ui-label text-sm text-text-dark mb-1.5 block">Nama Lengkap</label>
              <div className="relative">
                <IconUser size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark text-body-main focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
            </div>

            <div>
              <label className="font-ui-label text-sm text-text-dark mb-1.5 block">Email</label>
              <div className="relative">
                <IconMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark text-body-main focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div>
              <label className="font-ui-label text-sm text-text-dark mb-1.5 block">No. WhatsApp</label>
              <div className="relative">
                <IconPhone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark text-body-main focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
                  placeholder="+62 xxx xxxx xxxx"
                />
              </div>
            </div>

            <div>
              <label className="font-ui-label text-sm text-text-dark mb-1.5 block">Password</label>
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
              <label className="font-ui-label text-sm text-text-dark mb-1.5 block">Konfirmasi Password</label>
              <div className="relative">
                <IconLockAccess size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  className="w-full pl-12 pr-10 py-2.5 border border-border-light rounded-xl bg-white text-text-dark text-body-main focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
                  placeholder="Ulangi password"
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
              {loading ? (
                'Memproses...'
              ) : (
                <>
                  <IconUserPlus size={18} />
                  Daftar
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-text-muted text-body-main">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-on-primary-container transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
