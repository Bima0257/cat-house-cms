import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCats, createCat, updateCat, deleteCat } from '../../services/cats';
import alert from '../../lib/alert';
import { IconCamera, IconPhoto, IconPaw, IconSearch } from '@tabler/icons-react';

const MyCats = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [gambar, setGambar] = useState(null);
  const [form, setForm] = useState({ name: '', breed: '', gender: '', age: '', weight: '', color: '', vaccination_status: 'belum', medical_note: '' });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ['my-cats', { search: debouncedSearch }],
    queryFn: async () => {
      const res = await getCats({ search: debouncedSearch, per_page: 100 });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (formData) => createCat(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-cats'] });
      alert.success('Kucing berhasil ditambahkan');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menambahkan kucing');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCat(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-cats'] });
      alert.success('Kucing berhasil diupdate');
      resetForm();
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal mengupdate kucing');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCat(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-cats'] });
      alert.success('Kucing berhasil dihapus');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menghapus kucing');
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setPreview(null);
    setGambar(null);
    setForm({ name: '', breed: '', gender: '', age: '', weight: '', color: '', vaccination_status: 'belum', medical_note: '' });
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      breed: cat.breed || '',
      gender: cat.gender || '',
      age: cat.age || '',
      weight: cat.weight || '',
      color: cat.color || '',
      vaccination_status: cat.vaccination_status,
      medical_note: cat.medical_note || '',
    });
    setPreview(cat.photo ? `/storage/${cat.photo}` : null);
    setGambar(null);
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    if (form.breed) fd.append('breed', form.breed);
    if (form.gender) fd.append('gender', form.gender);
    if (form.age) fd.append('age', form.age);
    if (form.weight) fd.append('weight', form.weight);
    if (form.color) fd.append('color', form.color);
    fd.append('vaccination_status', form.vaccination_status);
    if (form.medical_note) fd.append('medical_note', form.medical_note);
    if (gambar) fd.append('photo', gambar);
    if (editingId) fd.append('_method', 'PUT');

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: fd });
    } else {
      createMutation.mutate(fd);
    }
  };

  const cats = data?.data || [];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Kucing Saya</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold"
          >
            {showForm ? 'Batal' : '+ Tambah Kucing'}
          </button>
        </div>
        <div className="relative">
          <input type="search" placeholder="Cari kucing..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {editingId ? 'Edit Kucing' : 'Tambah Kucing Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto Kucing</label>
              <label className="relative inline-block cursor-pointer group">
                <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <IconPhoto size={32} className="text-gray-400" />
                  )}
                </div>
                <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconCamera size={24} className="text-white" />
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ras</label>
              <input type="text" value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">Pilih</option>
                <option value="jantan">Jantan</option>
                <option value="betina">Betina</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Umur (bulan)</label>
              <input type="number" min="0" max="240" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Berat (kg)</label>
              <input type="number" step="0.01" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warna</label>
              <input type="text" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vaksinasi</label>
              <select value={form.vaccination_status} onChange={(e) => setForm({ ...form, vaccination_status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="belum">Belum</option>
                <option value="sebagian">Sebagian</option>
                <option value="lengkap">Lengkap</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Medis</label>
              <textarea value={form.medical_note} onChange={(e) => setForm({ ...form, medical_note: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" rows={2} />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
                {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : editingId ? 'Update' : 'Simpan'}
              </button>
              <button type="button" onClick={resetForm}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : cats.length === 0 ? (
        <div className="bg-surface-container-lowest border border-border-light rounded-[2rem] py-14 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-fixed/30 flex items-center justify-center mx-auto mb-5">
            {debouncedSearch ? <IconSearch size={32} className="text-primary" /> : <IconPaw size={32} className="text-primary" />}
          </div>
          <h4 className="text-base font-semibold text-text-dark mb-1">
            {debouncedSearch ? 'Tidak ditemukan' : 'Belum ada kucing'}
          </h4>
          <p className="text-sm text-text-muted mb-6 max-w-xs mx-auto">
            {debouncedSearch ? `Tidak ada hasil untuk "${debouncedSearch}"` : 'Tambahkan kucing pertama Anda untuk mulai menggunakan layanan kami'}
          </p>
          {!debouncedSearch && (
            <button onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform shadow-sm text-sm"
            >
              <IconPaw size={18} />
              Tambah Kucing
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {cat.photo ? (
                      <img src={`/storage/${cat.photo}`} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <IconPhoto size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{cat.name}</h3>
                    <p className="text-sm text-gray-500">{cat.breed || 'Kucing'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>Gender: {cat.gender || '-'}</p>
                <p>Umur: {cat.age ? `${cat.age} bulan` : '-'}</p>
                <p>Warna: {cat.color || '-'}</p>
                <p>Berat: {cat.weight ? `${cat.weight} kg` : '-'}</p>
                <p>Vaksinasi: {cat.vaccination_status}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-blue-500 text-sm hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => alert.confirm('Hapus kucing ini?', { confirmLabel: 'Ya, Hapus', onConfirm: () => deleteMutation.mutate(cat.id) })}
                  className="text-red-500 text-sm hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCats;
