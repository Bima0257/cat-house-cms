import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProduk, createProduk, updateProduk, deleteProduk, toggleProdukActive } from '../../services/produk';
import { getKategoriProduk } from '../../services/kategoriProduk';
import alert from '../../lib/alert';
import DataTable from '../../components/ui/DataTable';
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconToggleRight,
  IconToggleLeft,
  IconCurrency,
  IconPhoto,
  IconPackage,
} from '@tabler/icons-react';
import { Button } from '../../components/ui/button';

const AdminProduk = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    kategori_produk_id: '',
    nama: '',
    deskripsi: '',
    harga: '',
    stok: '',
    gambar: null,
    is_active: true,
  });
  const [preview, setPreview] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-produk'],
    queryFn: async () => {
      const res = await getProduk({ per_page: 100 });
      return res.data;
    },
  });

  const { data: kategoriData } = useQuery({
    queryKey: ['admin-kategori-produk-options'],
    queryFn: async () => {
      const res = await getKategoriProduk({ per_page: 100, is_active: true });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => createProduk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-produk'] });
      alert.success('Produk berhasil ditambahkan');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menambahkan produk');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduk(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-produk'] });
      alert.success('Produk berhasil diupdate');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal mengupdate produk');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduk(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-produk'] });
      alert.success('Produk dihapus');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menghapus produk');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => toggleProdukActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-produk'] });
      alert.success('Status produk diubah');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal mengubah status produk');
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      kategori_produk_id: '',
      nama: '',
      deskripsi: '',
      harga: '',
      stok: '',
      gambar: null,
      is_active: true,
    });
    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('kategori_produk_id', form.kategori_produk_id);
    fd.append('nama', form.nama);
    if (form.deskripsi) fd.append('deskripsi', form.deskripsi);
    fd.append('harga', form.harga);
    if (form.stok !== '') fd.append('stok', form.stok);
    if (form.gambar) fd.append('gambar', form.gambar);
    fd.append('is_active', form.is_active ? '1' : '0');
    if (editingId) fd.append('_method', 'PUT');

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: fd });
    } else {
      createMutation.mutate(fd);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      kategori_produk_id: item.kategori_produk_id,
      nama: item.nama,
      deskripsi: item.deskripsi || '',
      harga: item.harga,
      stok: item.stok ?? '',
      gambar: null,
      is_active: item.is_active,
    });
    setPreview(item.gambar ? `/storage/${item.gambar}` : null);
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, gambar: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const produk = data?.data || [];
  const kategoriList = kategoriData?.data || [];

  const columns = [
    {
      key: 'gambar',
      header: 'Gambar',
      enableSorting: false,
      render: (item) => (
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {item.gambar ? (
            <img src={`/storage/${item.gambar}`} alt={item.nama} className="w-full h-full object-cover" />
          ) : (
            <IconPhoto size={18} className="text-text-muted" />
          )}
        </div>
      ),
    },
    {
      key: 'nama',
      accessor: 'nama',
      header: 'Nama Produk',
      enableSorting: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-fixed/30 flex items-center justify-center text-primary flex-shrink-0">
            <IconPackage size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-text-dark">{item.nama}</p>
            <p className="text-xs text-text-muted line-clamp-1 max-w-[200px] truncate" title={item.deskripsi}>{item.deskripsi || '-'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'kategori',
      header: 'Kategori',
      enableSorting: false,
      render: (item) => (
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary-fixed/30 text-on-secondary-fixed">
          {item.kategori?.nama || '-'}
        </span>
      ),
    },
    {
      key: 'harga',
      accessor: 'harga',
      header: 'Harga',
      enableSorting: true,
      render: (item) => (
        <div className="flex items-center gap-1 font-semibold text-primary">
          <IconCurrency size={16} />
          {Number(item.harga).toLocaleString('id-ID')}
        </div>
      ),
    },
    {
      key: 'stok',
      accessor: 'stok',
      header: 'Stok',
      enableSorting: true,
      render: (item) => (
        <span className="font-semibold text-text-dark">{item.stok}</span>
      ),
    },
    {
      key: 'is_active',
      accessor: 'is_active',
      header: 'Status',
      enableSorting: true,
      render: (item) => (
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {item.is_active ? 'Aktif' : 'Nonaktif'}
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
            onClick={(e) => {
              e.stopPropagation();
              toggleMutation.mutate(item.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              item.is_active
                ? 'text-blue-600 hover:bg-blue-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
          >
            {item.is_active ? <IconToggleRight size={18} /> : <IconToggleLeft size={18} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(item);
            }}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <IconEdit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert.confirm('Hapus produk ini?', { confirmLabel: 'Ya, Hapus', onConfirm: () => deleteMutation.mutate(item.id) });
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
          <h1 className="font-h2-section text-2xl text-text-dark">Kelola Produk</h1>
          <p className="text-text-muted mt-1">Kelola semua produk toko</p>
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
              Produk Baru
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-border-light p-6">
          <h2 className="font-semibold text-lg text-text-dark mb-4">
            {editingId ? 'Edit Produk' : 'Produk Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Kategori *</label>
              <select
                required
                value={form.kategori_produk_id}
                onChange={(e) => setForm({ ...form, kategori_produk_id: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">Pilih kategori</option>
                {kategoriList.map((k) => (
                  <option key={k.id} value={k.id}>{k.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Nama Produk *</label>
              <input
                type="text"
                required
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Contoh: Whiskas Adult"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Harga *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">Rp</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.harga}
                  onChange={(e) => setForm({ ...form, harga: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="50000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Stok</label>
              <input
                type="number"
                min="0"
                value={form.stok}
                onChange={(e) => setForm({ ...form, stok: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="0"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-dark mb-1.5">Deskripsi</label>
              <textarea
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                rows={3}
                placeholder="Deskripsi produk..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-dark mb-1.5">Gambar Produk</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary-fixed/20 file:text-primary file:font-semibold file:text-xs"
                />
                {preview && (
                  <img src={preview} alt="preview" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                )}
              </div>
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
        data={produk}
        loading={isLoading}
        searchPlaceholder="Cari produk..."
      />
    </div>
  );
};

export default AdminProduk;
