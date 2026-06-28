import { useState, useEffect } from 'react';
import { getAuthState, setAuthState } from '../../hooks/useAuth';
import { getUser, updateProfileApi } from '../../services/auth';
import PasswordStrength from '../../components/ui/PasswordStrength';
import alert from '../../lib/alert';
import { IconUser, IconCamera, IconEye, IconEyeOff } from '@tabler/icons-react';

const Profile = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', current_password: '', password: '', password_confirmation: '' });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        const u = res.data.data.user;
        setForm({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          current_password: '',
          password: '',
          password_confirmation: '',
        });
        setPreview(u.avatar ? `/storage/${u.avatar}` : null);
      } catch {
        const authState = getAuthState();
        if (authState.user) {
          setForm({
            name: authState.user.name || '',
            email: authState.user.email || '',
            phone: authState.user.phone || '',
            current_password: '',
            password: '',
            password_confirmation: '',
          });
          setPreview(authState.user.avatar ? `/storage/${authState.user.avatar}` : null);
        }
      }
    };
    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      if (form.phone) fd.append('phone', form.phone);
      if (form.current_password) fd.append('current_password', form.current_password);
      if (form.password) fd.append('password', form.password);
      if (form.password_confirmation) fd.append('password_confirmation', form.password_confirmation);
      if (avatar) fd.append('avatar', avatar);
      const res = await updateProfileApi(fd);
      const u = res.data.data.user;
      setAuthState({
        token: getAuthState().token,
        roles: getAuthState().roles,
        user: u,
        permissions: getAuthState().permissions,
      });
      setForm((prev) => ({ ...prev, current_password: '', password: '', password_confirmation: '' }));
      setPreview(u.avatar ? `/storage/${u.avatar}` : null);
      setAvatar(null);
      alert.success('Profil berhasil diupdate');
    } catch (err) {
      alert.error(err.response?.data?.message || 'Gagal mengupdate profil');
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = preview || null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-h2-section text-[28px] text-text-dark">Profil Saya</h1>
        <p className="text-text-muted mt-1">Kelola data profil akun Anda</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-border-light shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-4 pb-5 mb-5 border-b border-border-light">
            <label className="relative cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <IconUser size={28} className="text-secondary" />
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <IconCamera size={20} className="text-white" />
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            <div>
              <p className="font-semibold text-text-dark">{form.name || 'User'}</p>
              <p className="text-sm text-text-muted">{form.email}</p>
              <p className="text-xs text-text-muted mt-0.5">Klik foto untuk mengganti</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
                placeholder="Nama lengkap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Nomor HP</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
                placeholder="0812xxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Password Saat Ini</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={form.current_password}
                  onChange={(e) => setForm({ ...form, current_password: e.target.value })}
                  className="w-full px-4 py-2.5 pr-10 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
                  placeholder="Password saat ini"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark transition-colors"
                  tabIndex={-1}
                >
                  {showCurrentPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">
                Password Baru <span className="text-text-muted font-normal">(kosongkan jika tidak diubah)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2.5 pr-10 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
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
              <label className="block text-sm font-medium text-text-dark mb-1.5">Konfirmasi Password Baru</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  className="w-full px-4 py-2.5 pr-10 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
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
          </div>

          <div className="flex gap-2 pt-5 mt-5 border-t border-border-light">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-on-primary-container disabled:bg-primary/60 text-white px-6 py-2.5 rounded-xl font-ui-label text-sm transition-colors"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
