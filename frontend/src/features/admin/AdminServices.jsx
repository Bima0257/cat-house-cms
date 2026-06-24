import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, createService, updateService, deleteService, toggleServiceActive } from '../../services/services';
import alert from '../../lib/alert';
import DataTable from '../../components/ui/DataTable';
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconToggleRight,
  IconToggleLeft,
  IconToolsKitchen2,
  IconCurrency,
} from '@tabler/icons-react';
import { Button } from '../../components/ui/button';

const AdminServices = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price_per_day: '', is_active: true });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const res = await getServices({ per_page: 100 });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      alert.success('Layanan berhasil ditambahkan');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menambahkan layanan');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      alert.success('Layanan berhasil diupdate');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal mengupdate layanan');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      alert.success('Layanan dihapus');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menghapus layanan');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => toggleServiceActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      alert.success('Status layanan diubah');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal mengubah status layanan');
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: '', description: '', price_per_day: '', is_active: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description || '',
      price_per_day: service.price_per_day,
      is_active: service.is_active,
    });
    setShowForm(true);
  };

  const services = data?.data || [];

  const columns = [
    {
      key: 'name',
      accessor: 'name',
      header: 'Layanan',
      enableSorting: true,
      render: (service) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-fixed/30 flex items-center justify-center text-primary flex-shrink-0">
            <IconToolsKitchen2 size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-text-dark">{service.name}</p>
            <p className="text-xs text-text-muted line-clamp-1 max-w-[200px] truncate" title={service.description}>{service.description || '-'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'price_per_day',
      accessor: 'price_per_day',
      header: 'Harga/Hari',
      enableSorting: true,
      render: (service) => (
        <div className="flex items-center gap-1 font-semibold text-primary">
          <IconCurrency size={16} />
          {Number(service.price_per_day).toLocaleString('id-ID')}
        </div>
      ),
    },
    {
      key: 'is_active',
      accessor: 'is_active',
      header: 'Status',
      enableSorting: true,
      render: (service) => (
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            service.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {service.is_active ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
    {
      key: 'created_at',
      accessor: 'created_at',
      header: 'Dibuat',
      enableSorting: true,
      render: (service) => (
        <span className="text-text-muted text-xs">
          {service.created_at ? new Date(service.created_at).toLocaleDateString('id-ID', {
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
      render: (service) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMutation.mutate(service.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              service.is_active
                ? 'text-blue-600 hover:bg-blue-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={service.is_active ? 'Nonaktifkan' : 'Aktifkan'}
          >
            {service.is_active ? <IconToggleRight size={18} /> : <IconToggleLeft size={18} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(service);
            }}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <IconEdit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert.confirm('Hapus layanan ini?', { confirmLabel: 'Ya, Hapus', onConfirm: () => deleteMutation.mutate(service.id) });
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
          <h1 className="font-h2-section text-2xl text-text-dark">Kelola Layanan</h1>
          <p className="text-text-muted mt-1">Kelola semua layanan penitipan</p>
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
              Layanan Baru
            </>
          )}
        </Button>
      </div>

      {/* Service Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border-light p-6">
          <h2 className="font-semibold text-lg text-text-dark mb-4">
            {editingId ? 'Edit Layanan' : 'Layanan Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Nama Layanan *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Contoh: Premium Boarding"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Harga per Hari *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">Rp</span>
                <input
                  type="number"
                  required
                  value={form.price_per_day}
                  onChange={(e) => setForm({ ...form, price_per_day: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="150000"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-dark mb-1.5">Deskripsi</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                rows={3}
                placeholder="Deskripsi layanan..."
              />
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
        data={services}
        loading={isLoading}
        searchPlaceholder="Cari layanan..."
      />
    </div>
  );
};

export default AdminServices;
