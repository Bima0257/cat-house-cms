import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCages, createCage, updateCage, deleteCage } from '../../services/cages';
import alert from '../../lib/alert';
import DataTable from '../../components/ui/DataTable';
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconHome,
  IconHomeCheck,
  IconCheck,
} from '@tabler/icons-react';
import { Button } from '../../components/ui/button';

const AdminCages = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    code: '',
    category: 'standard',
    capacity: 1,
    status: 'tersedia'
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-cages'],
    queryFn: async () => {
      const res = await getCages({ per_page: 100 });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => createCage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cages'] });
      alert.success('Kandang berhasil ditambahkan');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menambahkan kandang');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cages'] });
      alert.success('Kandang berhasil diupdate');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal mengupdate kandang');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cages'] });
      alert.success('Kandang dihapus');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menghapus kandang');
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ code: '', category: 'standard', capacity: 1, status: 'tersedia' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (cage) => {
    setEditingId(cage.id);
    setForm({
      code: cage.code,
      category: cage.category,
      capacity: cage.capacity,
      status: cage.status,
    });
    setShowForm(true);
  };

  const cages = data?.data || [];

  const statusConfig = {
    tersedia: { bg: 'bg-green-100', text: 'text-green-700', label: 'Tersedia' },
    terisi: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Terisi' },
    perbaikan: { bg: 'bg-red-100', text: 'text-red-700', label: 'Perbaikan' },
  };

  const categoryConfig = {
    standard: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Standard' },
    premium: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Premium' },
    vip: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'VIP' },
  };

  const columns = [
    {
      key: 'code',
      accessor: 'code',
      header: 'Kode Kandang',
      enableSorting: true,
      render: (cage) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            cage.category === 'vip' ? 'bg-purple-100 text-purple-700' :
            cage.category === 'premium' ? 'bg-amber-100 text-amber-700' :
            'bg-primary-fixed/30 text-primary'
          }`}>
            {cage.category === 'vip' || cage.category === 'premium' ? (
              <IconHomeCheck size={20} />
            ) : (
              <IconHome size={20} />
            )}
          </div>
          <div>
            <p className="font-semibold text-text-dark">{cage.code}</p>
            <p className={`text-xs font-medium ${
              categoryConfig[cage.category]?.text || 'text-gray-700'
            }`}>
              {categoryConfig[cage.category]?.label || cage.category}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'capacity',
      accessor: 'capacity',
      header: 'Kapasitas',
      enableSorting: true,
      render: (cage) => (
        <div className="flex items-center gap-1">
          <span className="font-semibold text-text-dark">{cage.capacity}</span>
          <span className="text-text-muted text-sm">kucing</span>
        </div>
      ),
    },
    {
      key: 'status',
      accessor: 'status',
      header: 'Status',
      enableSorting: true,
      render: (cage) => {
        const config = statusConfig[cage.status] || statusConfig.tersedia;
        return (
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      key: 'created_at',
      accessor: 'created_at',
      header: 'Dibuat',
      enableSorting: true,
      render: (cage) => (
        <span className="text-text-muted text-xs">
          {cage.created_at ? new Date(cage.created_at).toLocaleDateString('id-ID', {
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
      render: (cage) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(cage);
            }}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <IconEdit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert.confirm('Hapus kandang ini?', { confirmLabel: 'Ya, Hapus', onConfirm: () => deleteMutation.mutate(cage.id) });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-h2-section text-2xl text-text-dark">Kelola Kandang</h1>
          <p className="text-text-muted mt-1">Kelola semua kandang penitipan kucing</p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {showForm ? (
            'Batal'
          ) : (
            <>
              <IconPlus size={18} className="mr-2" />
              Kandang Baru
            </>
          )}
        </Button>
      </div>

      {/* Cage Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border-light p-6">
          <h2 className="font-semibold text-lg text-text-dark mb-4">
            {editingId ? 'Edit Kandang' : 'Kandang Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Kode Kandang *</label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Contoh: A-01, B-02"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Kapasitas (kucing)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="tersedia">Tersedia</option>
                <option value="terisi">Terisi</option>
                <option value="perbaikan">Perbaikan</option>
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
        data={cages}
        loading={isLoading}
        searchPlaceholder="Cari kandang..."
      />
    </div>
  );
};

export default AdminCages;
