import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPermissionCategories, createPermissionCategory, updatePermissionCategory, deletePermissionCategory, getPermissionCategory, assignPermissionToCategory, removePermissionFromCategory } from '../../services/permissionCategories';
import alert from '../../lib/alert';
import DataTable from '../../components/ui/DataTable';
import DynamicIcon from '../../components/ui/DynamicIcon';
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconShield,
  IconX,
  IconCheck,
  IconEye,
} from '@tabler/icons-react';
import { Button } from '../../components/ui/button';

const AdminPermissionCategories = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', icon_key: '' });
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedPermId, setSelectedPermId] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-permission-categories'],
    queryFn: async () => {
      const res = await getPermissionCategories();
      return res.data;
    },
  });

  const { data: categoryDetail, isLoading: detailLoading } = useQuery({
    queryKey: ['admin-permission-category-detail', selectedCategoryId],
    queryFn: async () => {
      const res = await getPermissionCategory(selectedCategoryId);
      return res.data;
    },
    enabled: !!selectedCategoryId,
  });

  const createMutation = useMutation({
    mutationFn: (data) => createPermissionCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permission-categories'] });
      alert.success('Kategori berhasil ditambahkan');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menambahkan kategori');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePermissionCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permission-categories'] });
      alert.success('Kategori berhasil diupdate');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal mengupdate kategori');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePermissionCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permission-categories'] });
      alert.success('Kategori dihapus');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menghapus kategori');
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ catId, permId }) => assignPermissionToCategory(catId, permId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permission-category-detail', selectedCategoryId] });
      queryClient.invalidateQueries({ queryKey: ['admin-permission-categories'] });
      alert.success('Permission ditambahkan ke kategori');
      setSelectedPermId('');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menambahkan permission');
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ catId, permId }) => removePermissionFromCategory(catId, permId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permission-category-detail', selectedCategoryId] });
      queryClient.invalidateQueries({ queryKey: ['admin-permission-categories'] });
      alert.success('Permission dihapus dari kategori');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menghapus permission');
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: '', icon_key: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name, icon_key: item.icon_key || '' });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = data?.data || [];
  const detail = categoryDetail?.data || {};
  const assignedPerms = detail?.category?.permissions || [];
  const unassignedPerms = detail?.unassigned_permissions || [];

  const columns = useMemo(() => [
    {
      key: 'name',
      accessor: 'name',
      header: 'Nama Kategori',
      enableSorting: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
            <DynamicIcon name={item.icon_key} size={20} />
          </div>
          <div>
            <p className="font-semibold text-text-dark">{item.name}</p>
            {item.icon_key && (
              <p className="text-xs text-text-muted font-mono">{item.icon_key}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'permissions_count',
      accessor: 'permissions_count',
      header: 'Jumlah Permission',
      enableSorting: true,
      render: (item) => (
        <span className="font-semibold text-text-dark">{item.permissions_count}</span>
      ),
    },
    {
      key: 'created_at',
      accessor: 'created_at',
      header: 'Dibuat',
      enableSorting: true,
      render: (item) => (
        <span className="text-text-muted text-xs">
          {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', {
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
      render: (item) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedCategoryId(item.id); }}
            className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
            title="Atur Permission"
          >
            <IconEye size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <IconEdit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert.confirm('Hapus kategori ' + item.name + '?', { confirmLabel: 'Ya, Hapus', onConfirm: () => deleteMutation.mutate(item.id) });
            }}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus"
          >
            <IconTrash size={18} />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-h2-section text-2xl text-text-dark">Kategori Permission</h1>
          <p className="text-text-muted mt-1">Kelola kategori untuk mengelompokkan permission</p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(!showForm); if (!showForm) window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {showForm ? 'Batal' : (
            <>
              <IconPlus size={18} className="mr-2" />
              Kategori Baru
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-border-light p-6">
          <h2 className="font-semibold text-lg text-text-dark mb-4">
            {editingId ? 'Edit Kategori' : 'Kategori Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Nama Kategori *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="contoh: Users"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Icon Key</label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                  <DynamicIcon name={form.icon_key} size={20} />
                </div>
                <input
                  type="text"
                  value={form.icon_key}
                  onChange={(e) => setForm({ ...form, icon_key: e.target.value })}
                  className="flex-1 px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="contoh: IconUsers"
                />
              </div>
              <p className="text-xs text-text-muted mt-1.5">Nama icon dari <strong>@tabler/icons-react</strong> — <a href="https://tabler.io/icons" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">tabler.io/icons</a></p>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-white">
                {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : editingId ? 'Update' : 'Simpan'}
              </Button>
              <Button type="button" onClick={resetForm} className="bg-gray-100 hover:bg-gray-200 text-text-dark">
                Batal
              </Button>
            </div>
          </form>
        </div>
      )}

      <DataTable
        columns={columns}
        data={categories}
        loading={isLoading}
        searchPlaceholder="Cari kategori..."
        onRowClick={(item) => setSelectedCategoryId(item.id)}
      />

      {/* Modal */}
      {selectedCategoryId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => { setSelectedCategoryId(null); setSelectedPermId(''); }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                  <DynamicIcon name={detail?.category?.icon_key} size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-text-dark">{detail?.category?.name || 'Loading...'}</h3>
                  <p className="text-xs text-text-muted">{assignedPerms.length} permission terassign</p>
                </div>
              </div>
              <button
                onClick={() => { setSelectedCategoryId(null); setSelectedPermId(''); }}
                className="p-2 rounded-lg hover:bg-gray-100 text-text-muted hover:text-text-dark transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {detailLoading ? (
                <div className="text-center py-8 text-text-muted text-sm">Memuat...</div>
              ) : (
                <>
                  {/* Assigned Permissions */}
                  <div>
                    <h4 className="font-semibold text-sm text-text-dark mb-3 flex items-center gap-2">
                      <IconShield size={16} />
                      Assigned Permissions
                    </h4>
                    {assignedPerms.length === 0 ? (
                      <p className="text-sm text-text-muted">Belum ada permission di kategori ini</p>
                    ) : (
                      <div className="divide-y divide-border-light border border-border-light rounded-xl overflow-hidden">
                        {assignedPerms.map((perm) => (
                          <div key={perm.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/30">
                            <div className="min-w-0">
                              <p className="font-mono text-sm font-medium text-text-dark truncate">{perm.name}</p>
                              <p className="text-xs text-text-muted">{perm.guard_name || 'web'}</p>
                            </div>
                            <button
                              onClick={() => removeMutation.mutate({ catId: selectedCategoryId, permId: perm.id })}
                              disabled={removeMutation.isPending}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors shrink-0"
                              title="Hapus dari kategori"
                            >
                              <IconTrash size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Assign New Permission */}
                  {unassignedPerms.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-text-dark mb-3 flex items-center gap-2">
                        <IconPlus size={16} />
                        Tambah Permission
                      </h4>
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedPermId}
                          onChange={(e) => setSelectedPermId(e.target.value)}
                          className="flex-1 px-3 py-2 border border-border-light rounded-xl bg-white text-sm focus:outline-none focus:border-primary"
                        >
                          <option value="">-- Pilih permission --</option>
                          {unassignedPerms.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <Button
                          onClick={() => {
                            if (selectedPermId) assignMutation.mutate({ catId: selectedCategoryId, permId: Number(selectedPermId) });
                          }}
                          disabled={!selectedPermId || assignMutation.isPending}
                          className="bg-primary hover:bg-primary/90 text-white shrink-0"
                        >
                          <IconCheck size={18} />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPermissionCategories;
