import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser, toggleUserActive, createUser, updateUser } from '../../services/users';
import alert from '../../lib/alert';
import DataTable from '../../components/ui/DataTable';
import {
  IconTrash,
  IconToggleLeft,
  IconToggleRight,
  IconPlus,
  IconEdit,
} from '@tabler/icons-react';
import { Button } from '../../components/ui/button';

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'user' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await getUsers({ per_page: 100 });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      alert.success('User berhasil ditambahkan');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menambahkan user');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      alert.success('User berhasil diupdate');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal mengupdate user');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => toggleUserActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      alert.success('Status user diubah');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal mengubah status user');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      alert.success('User dihapus');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menghapus user');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('email', form.email);
    if (form.phone) fd.append('phone', form.phone);
    fd.append('role', form.role);
    if (form.password) fd.append('password', form.password);
    if (editingId) {
      fd.append('_method', 'PUT');
      updateMutation.mutate({ id: editingId, data: fd });
    } else {
      createMutation.mutate(fd);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: '',
      role: user.roles?.[0]?.name || 'user',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: '', email: '', phone: '', password: '', role: 'user' });
  };

  const users = data?.data || [];

  const columns = [
    {
      key: 'name',
      accessor: 'name',
      header: 'Nama',
      enableSorting: true,
    },
    {
      key: 'email',
      accessor: 'email',
      header: 'Email',
      enableSorting: true,
    },
    {
      key: 'role',
      header: 'Role',
      enableSorting: false,
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {(user.roles || []).map((r) => (
            <span
              key={r.name}
              className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed capitalize"
            >
              {r.name}
            </span>
          ))}
          {(!user.roles || user.roles.length === 0) && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
              user
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'is_active',
      accessor: 'is_active',
      header: 'Status',
      enableSorting: true,
      render: (user) => (
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            user.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {user.is_active ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
    {
      key: 'created_at',
      accessor: 'created_at',
      header: 'Dibuat',
      enableSorting: true,
      render: (user) => (
        <span className="text-text-muted text-xs">
          {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      enableSorting: false,
      render: (user) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(user);
            }}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <IconEdit size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMutation.mutate(user.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              user.is_active
                ? 'text-blue-600 hover:bg-blue-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
          >
            {user.is_active ? (
              <IconToggleRight size={18} />
            ) : (
              <IconToggleLeft size={18} />
            )}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              alert.confirm('Hapus user ini?', { confirmLabel: 'Ya, Hapus', onConfirm: () => deleteMutation.mutate(user.id) });
            }}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus"
          >
            <IconTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-h2-section text-2xl text-text-dark">Kelola Pengguna</h1>
        <p className="text-text-muted mt-1">Kelola semua pengguna sistem</p>
      </div>

      {/* Create User Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border-light p-6">
          <h2 className="font-semibold text-lg text-text-dark mb-4">
            {editingId ? 'Edit User' : 'Tambah User Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Nomor HP</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="0812xxxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">
                Password {editingId ? '(kosongkan jika tidak diubah)' : '*'}
              </label>
              <input
                type="password"
                required={!editingId}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder={editingId ? 'Biarkan kosong jika tidak diubah' : 'Min. 8 karakter'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="user">User</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Menyimpan...'
                  : editingId ? 'Update' : 'Simpan'}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                className="bg-gray-100 hover:bg-gray-200 text-text-dark"
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      )}

      <DataTable
        columns={columns}
        data={users}
        loading={isLoading}
        searchPlaceholder="Cari nama atau email..."
        actions={
          !showForm && (
            <Button
              type="button"
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <IconPlus size={18} />
              Tambah User
            </Button>
          )
        }
      />
    </div>
  );
};

export default AdminUsers;
