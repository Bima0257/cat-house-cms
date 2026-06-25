import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthState } from '../../hooks/useAuth';
import { updateProfileApi } from '../../services/auth';
import alert from '../../lib/alert';
import { IconUser, IconCamera } from '@tabler/icons-react';

const Profile = () => {
  const authState = getAuthState();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  // Use ref to track user ID instead of full object reference
  const userIdRef = useRef(authState.user?.id);

  // Memoize user data to prevent unnecessary re-renders
  const user = useMemo(() => authState.user, [authState.user?.id, authState.user?.updated_at]);

  useEffect(() => {
    if (user) {
      // Only update form if user ID changed (new user data from server)
      if (userIdRef.current !== user.id) {
        userIdRef.current = user.id;
        setForm({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          password: '',
        });
        setPreview(user.avatar ? `/storage/${user.avatar}` : null);
        setAvatar(null);
      }
    }
  }, [user]);

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
      if (form.password) fd.append('password', form.password);
      if (avatar) fd.append('avatar', avatar);
      fd.append('_method', 'PUT');
      await updateProfileApi(fd);
      alert.success('Profil berhasil diupdate');
      // Reset form state without full page reload
      setForm((prev) => ({ ...prev, password: '' }));
      setAvatar(null);
      // Navigate to refresh current route data
      navigate(0);
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
              <p className="font-semibold text-text-dark">{user?.name || 'User'}</p>
              <p className="text-sm text-text-muted">{user?.email}</p>
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
              <label className="block text-sm font-medium text-text-dark mb-1.5">
                Password Baru <span className="text-text-muted font-normal">(kosongkan jika tidak diubah)</span>
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
                placeholder="Min. 6 karakter"
                minLength={6}
              />
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
