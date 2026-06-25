import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getKategoriProduk, createKategoriProduk, updateKategoriProduk, deleteKategoriProduk, toggleKategoriProdukActive, reorderKategoriProduk } from '../../services/kategoriProduk';
import alert from '../../lib/alert';
import DataTable from '../../components/ui/DataTable';
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconGripVertical,
  IconToggleRight,
  IconToggleLeft,
  IconPhoto,
} from '@tabler/icons-react';
import { Button } from '../../components/ui/button';

const AdminKategoriProduk = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ nama: '', deskripsi: '', gambar: null, is_active: true });
  const [preview, setPreview] = useState(null);
  const [dragId, setDragId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-kategori-produk'],
    queryFn: async () => {
      const res = await getKategoriProduk({ per_page: 100 });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => createKategoriProduk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-kategori-produk'] });
      alert.success('Kategori produk berhasil ditambahkan');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menambahkan kategori');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateKategoriProduk(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-kategori-produk'] });
      alert.success('Kategori produk berhasil diupdate');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal mengupdate kategori');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteKategoriProduk(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-kategori-produk'] });
      alert.success('Kategori produk dihapus');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menghapus kategori');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => toggleKategoriProdukActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-kategori-produk'] });
      alert.success('Status kategori diubah');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal mengubah status kategori');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (items) => reorderKategoriProduk(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-kategori-produk'] });
      alert.success('Urutan berhasil disimpan');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menyimpan urutan');
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ nama: '', deskripsi: '', gambar: null, is_active: true });
    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('nama', form.nama);
    if (form.deskripsi) fd.append('deskripsi', form.deskripsi);
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
      nama: item.nama,
      deskripsi: item.deskripsi || '',
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

  const handleDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const kategori = data?.data || [];

  const handleDrop = useCallback((e, targetId) => {
    e.preventDefault();
    const sourceId = Number(e.dataTransfer.getData('text/plain'));
    if (sourceId === targetId) return;

    const items = [...kategori];
    const sourceIdx = items.findIndex((i) => i.id === sourceId);
    const targetIdx = items.findIndex((i) => i.id === targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const reordered = [...items];
    const [moved] = reordered.splice(sourceIdx, 1);
    reordered.splice(targetIdx, 0, moved);

    const payload = reordered.map((item, idx) => ({
      id: item.id,
      sort_order: idx,
    }));

    reorderMutation.mutate(payload);
    setDragId(null);
  }, [kategori, reorderMutation]);

  const columns = [
    {
      key: 'drag_handle',
      header: '',
      enableSorting: false,
      width: 40,
      render: (item) => (
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item.id)}
          className={`cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 transition-colors ${
            dragId === item.id ? 'opacity-50' : ''
          }`}
        >
          <IconGripVertical size={16} className="text-text-muted" />
        </div>
      ),
    },
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
      header: 'Nama Kategori',
      enableSorting: true,
      render: (item) => (
        <span className="font-semibold text-text-dark">{item.nama}</span>
      ),
    },
    {
      key: 'deskripsi',
      accessor: 'deskripsi',
      header: 'Deskripsi',
      enableSorting: true,
      render: (item) => (
        <span className="text-text-muted text-sm line-clamp-1 max-w-[250px] truncate">{item.deskripsi || '-'}</span>
      ),
    },
    {
      key: 'sort_order',
      accessor: 'sort_order',
      header: 'Urutan',
      enableSorting: true,
      render: (item) => (
        <span className="text-text-muted text-sm font-mono">{item.sort_order}</span>
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
              alert.confirm('Hapus kategori produk ini?', { confirmLabel: 'Ya, Hapus', onConfirm: () => deleteMutation.mutate(item.id) });
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
          <h1 className="font-h2-section text-2xl text-text-dark">Kelola Kategori Produk</h1>
          <p className="text-text-muted mt-1">Kelola kategori untuk produk toko</p>
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
              Kategori Baru
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-border-light p-6">
          <h2 className="font-semibold text-lg text-text-dark mb-4">
            {editingId ? 'Edit Kategori Produk' : 'Kategori Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Nama Kategori *</label>
              <input
                type="text"
                required
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Contoh: Makanan, Aksesoris"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Gambar</label>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-dark mb-1.5">Deskripsi</label>
              <textarea
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                rows={3}
                placeholder="Deskripsi kategori..."
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

      <div className="text-xs text-text-muted mb-2 flex items-center gap-2">
        <IconGripVertical size={14} />
        <span>Seret baris untuk mengubah urutan</span>
      </div>

      <DataTable
        columns={columns}
        data={kategori}
        loading={isLoading}
        searchPlaceholder="Cari kategori..."
      />
    </div>
  );
};

export default AdminKategoriProduk;
