import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCats, createCat, deleteCat } from '../../services/cats';
import alert from '../../lib/alert';
import { Link } from 'react-router-dom';

const MyCats = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', breed: '', gender: '', birth_date: '', weight: '', color: '', vaccination_status: 'belum', medical_note: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['my-cats'],
    queryFn: async () => {
      const res = await getCats({ per_page: 100 });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (formData) => createCat(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-cats'] });
      alert.success('Kucing berhasil ditambahkan');
      setShowForm(false);
      setForm({ name: '', breed: '', gender: '', birth_date: '', weight: '', color: '', vaccination_status: 'belum', medical_note: '' });
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menambahkan kucing');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const cats = data?.data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kucing Saya</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold"
        >
          {showForm ? 'Batal' : '+ Tambah Kucing'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Tambah Kucing Baru</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
              <input type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
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
            <div className="md:col-span-2">
              <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold">
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Memuat...</div>
      ) : cats.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">😿</div>
          <p className="mb-2">Belum ada kucing terdaftar</p>
          <p className="text-sm">Tambahkan kucing Anda untuk mulai reservasi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">😺</span>
                  <div>
                    <h3 className="font-bold text-gray-800">{cat.name}</h3>
                    <p className="text-sm text-gray-500">{cat.breed || 'Kucing'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>Gender: {cat.gender || '-'}</p>
                <p>Warna: {cat.color || '-'}</p>
                <p>Berat: {cat.weight ? `${cat.weight} kg` : '-'}</p>
                <p>Vaksinasi: {cat.vaccination_status}</p>
              </div>
              <button
                onClick={() => alert.confirm('Hapus kucing ini?', { confirmLabel: 'Ya, Hapus', onConfirm: () => deleteMutation.mutate(cat.id) })}
                className="text-red-500 text-sm hover:underline"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCats;
