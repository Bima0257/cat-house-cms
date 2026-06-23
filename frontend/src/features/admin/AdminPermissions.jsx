import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPermissions, createPermission, updatePermission, deletePermission } from '../../services/permissions';
import { getPermissionCategories, assignPermissionToCategory } from '../../services/permissionCategories';
import alert from '../../lib/alert';
import DynamicIcon from '../../components/ui/DynamicIcon';
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconShield,
  IconEye,
  IconSearch,
  IconX,
  IconCheck,
} from '@tabler/icons-react';
import { Button } from '../../components/ui/button';

const iconColors = [
  'bg-blue-100 text-blue-700',
  'bg-amber-100 text-amber-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-rose-100 text-rose-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
  'bg-cyan-100 text-cyan-700',
  'bg-violet-100 text-violet-700',
  'bg-pink-100 text-pink-700',
  'bg-lime-100 text-lime-700',
];

const AdminPermissions = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', category_id: '' });
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [assignPermId, setAssignPermId] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-permissions'],
    queryFn: async () => {
      const res = await getPermissions({ per_page: 100 });
      return res.data;
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['admin-permission-categories-list'],
    queryFn: async () => {
      const res = await getPermissionCategories();
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
      alert.success('Permission berhasil ditambahkan');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || err.response?.data?.errors?.name?.[0] || 'Gagal menambahkan permission');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePermission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
      alert.success('Permission berhasil diupdate');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || err.response?.data?.errors?.name?.[0] || 'Gagal mengupdate permission');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
      alert.success('Permission dihapus');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menghapus permission');
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ catId, permId }) => assignPermissionToCategory(catId, permId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
      alert.success('Permission ditambahkan ke kategori');
      setAssignPermId('');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menambahkan permission');
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: '', category_id: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name: form.name };
    if (form.category_id) payload.category_id = Number(form.category_id);
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (perm) => {
    setEditingId(perm.id);
    setForm({ name: perm.name, category_id: perm.category_id ? String(perm.category_id) : '' });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const permissions = data?.data || [];
  const categories = categoriesData?.data || [];

  const filtered = useMemo(() => {
    if (!search) return permissions;
    const q = search.toLowerCase();
    return permissions.filter((p) => p.name.toLowerCase().includes(q));
  }, [permissions, search]);

  const grouped = useMemo(() => {
    const catMap = {};
    for (const cat of categories) {
      catMap[cat.id] = { ...cat, permissions: [] };
    }
    for (const perm of filtered) {
      const catId = perm.category_id;
      if (catId && catMap[catId]) {
        catMap[catId].permissions.push(perm);
      } else {
        if (!catMap['_ungrouped']) catMap['_ungrouped'] = { id: null, name: 'Other', icon_key: null, permissions: [] };
        catMap['_ungrouped'].permissions.push(perm);
      }
    }
    return Object.values(catMap).filter((g) => g.permissions.length > 0 || g.id === null);
  }, [filtered, categories]);

  const unassignedPerms = useMemo(
    () => permissions.filter((p) => !p.category_id),
    [permissions]
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-h2-section text-2xl text-text-dark">Kelola Permissions</h1>
            <p className="text-text-muted mt-1">Daftar permission yang tersedia dalam sistem</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-border-light p-6">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-10 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-h2-section text-2xl text-text-dark">Kelola Permissions</h1>
          <p className="text-text-muted mt-1">Daftar permission yang tersedia dalam sistem</p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(!showForm); if (!showForm) window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {showForm ? (
            'Batal'
          ) : (
            <>
              <IconPlus size={18} className="mr-2" />
              Permission Baru
            </>
          )}
        </Button>
      </div>

      {/* Permission Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border-light p-6">
          <h2 className="font-semibold text-lg text-text-dark mb-4">
            {editingId ? 'Edit Permission' : 'Permission Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">
                Nama Permission <span className="text-xs text-text-muted font-normal">(format: module.action)</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="contoh: users.view"
              />
              <p className="text-xs text-text-muted mt-1.5">
                Gunakan format <strong>module.action</strong>. Contoh: users.view, reservations.create, services.delete
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Kategori</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">-- Tanpa Kategori --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
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

      {/* Search */}
      <div className="relative max-w-md">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari permission..."
          className="w-full pl-10 pr-10 py-2.5 border border-border-light rounded-xl text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark transition-colors"
          >
            <IconX size={16} />
          </button>
        )}
      </div>

      {/* Grouped Permissions */}
      {grouped.length === 0 && (
        <div className="bg-white rounded-xl border border-border-light p-12 text-center">
          <IconShield size={40} className="mx-auto text-text-muted/30 mb-3" />
          <p className="text-text-muted">
            {search ? 'Tidak ada permission yang cocok' : 'Belum ada permission'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {grouped.map((group) => {
          const groupId = group.id ?? '__ungrouped__';
          const name = group.name || 'Other';
          const colorIdx = categories.findIndex((c) => c.id === group.id) % iconColors.length;
          const colorClass = group.id ? iconColors[colorIdx] : 'bg-gray-100 text-gray-700';

          return (
            <div key={groupId} className="bg-white rounded-xl border border-border-light overflow-hidden">
              <button
                onClick={() => setSelectedGroup(group)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <DynamicIcon name={group.icon_key} size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-text-dark">{name}</p>
                    <p className="text-xs text-text-muted">{group.permissions.length} permission{group.permissions.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                    {group.permissions.length}
                  </span>
                  <IconEye size={18} className="text-text-muted" />
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedGroup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                onClick={() => { setSelectedGroup(null); setAssignPermId(''); }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                  <DynamicIcon name={selectedGroup.icon_key} size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-text-dark capitalize">
                    {selectedGroup.name || 'Other'}
                  </h3>
                  <p className="text-xs text-text-muted">{selectedGroup.permissions.length} permission{selectedGroup.permissions.length > 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
          onClick={() => { setSelectedGroup(null); setAssignPermId(''); }}
                className="p-2 rounded-lg hover:bg-gray-100 text-text-muted hover:text-text-dark transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {selectedGroup.permissions.length === 0 ? (
                <p className="text-center py-4 text-text-muted text-sm">
                  Tidak ada permission dalam kategori ini
                </p>
              ) : (
                <div className="divide-y divide-border-light mb-4">
                  {selectedGroup.permissions.map((perm) => (
                    <div
                      key={perm.id}
                      className="flex items-center justify-between py-2.5"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary shrink-0">
                          <IconShield size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-sm font-medium text-text-dark truncate">{perm.name}</p>
                          <p className="text-xs text-text-muted">{perm.guard_name || 'web'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(perm); setSelectedGroup(null); }}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <IconEdit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert.confirm('Hapus permission ' + perm.name + '?', {
                              confirmLabel: 'Ya, Hapus',
                              onConfirm: () => deleteMutation.mutate(perm.id),
                            });
                          }}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus"
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {unassignedPerms.length > 0 && selectedGroup.id && (
                <div className="border-t border-border-light pt-4">
                  <h4 className="font-semibold text-sm text-text-dark mb-3 flex items-center gap-2">
                    <IconPlus size={16} />
                    Tambah Permission
                  </h4>
                  <div className="flex items-center gap-2">
                    <select
                      value={assignPermId}
                      onChange={(e) => setAssignPermId(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border-light rounded-xl bg-white text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="">-- Pilih permission --</option>
                      {unassignedPerms.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <Button
                      onClick={() => {
                        if (assignPermId && selectedGroup) {
                          assignMutation.mutate({ catId: selectedGroup.id, permId: Number(assignPermId) });
                        }
                      }}
                      disabled={!assignPermId || assignMutation.isPending}
                      className="bg-primary hover:bg-primary/90 text-white shrink-0"
                    >
                      <IconCheck size={18} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPermissions;
