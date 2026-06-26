import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordApi } from '../../services/auth';
import { IconMail, IconAlertCircle, IconArrowLeft, IconSend, IconMailCheck } from '@tabler/icons-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await forgotPasswordApi(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Gagal mengirim email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex font-body-main">
        <div className="hidden lg:flex w-1/2 bg-on-secondary-fixed items-center justify-center p-12">
          <div className="text-on-primary max-w-md">
            <div className="flex items-center">
              <img src="/images/logo.png" alt="Cat House" className="h-40 w-auto ml-3" />
            </div>
            <h2 className="font-h2-section text-[32px] text-on-primary mb-6">Cek Email Anda!</h2>
            <p className="text-secondary-fixed text-body-main">
              Tautan reset password telah dikirim. Periksa kotak masuk atau spam email Anda.
            </p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface">
          <div className="w-full max-w-md text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center">
                <IconMailCheck size={40} className="text-primary" />
              </div>
            </div>
            <h2 className="font-h3-card text-[24px] text-text-dark mb-2">Cek Email Anda</h2>
            <p className="text-text-muted text-body-main mb-8">
              Jika email <strong className="text-text-dark">{email}</strong> terdaftar di sistem kami,
              Anda akan menerima tautan reset password dalam beberapa menit.
            </p>
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
    );
  }

  return (
    <div className="min-h-screen flex font-body-main">
      <div className="hidden lg:flex w-1/2 bg-on-secondary-fixed items-center justify-center p-12">
        <div className="text-on-primary max-w-md">
          <div className="flex items-center">
            <img src="/images/logo.png" alt="Cat House" className="h-40 w-auto ml-3" />
          </div>
          <h2 className="font-h2-section text-[32px] text-on-primary mb-6">Lupa Password?</h2>
          <p className="text-secondary-fixed text-body-main">
            Jangan khawatir! Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center mb-8 justify-center">
            <img src="/images/logo.png" alt="Cat House" className="h-10 w-auto" />
          </div>

          <h2 className="font-h3-card text-[24px] text-text-dark mb-2">Lupa Password</h2>
          <p className="text-text-muted text-body-main mb-8">
            Masukkan email terdaftar untuk menerima tautan reset password
          </p>

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-xl mb-4 text-body-small flex items-center gap-2">
              <IconAlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-ui-label text-sm text-text-dark mb-1.5 block">Email</label>
              <div className="relative">
                <IconMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark text-body-main focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
                  placeholder="nama@email.com"
                />
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
                  <IconSend size={18} />
                  Kirim Tautan Reset
                </>
              )}
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

export default ForgotPassword;
