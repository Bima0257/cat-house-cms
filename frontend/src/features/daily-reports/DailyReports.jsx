import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReservations } from '../../services/reservations';
import { createDailyReport, getDailyReports } from '../../services/dailyReports';
import alert from '../../lib/alert';

const DailyReports = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    reservation_id: '', food: '', drink: '', weight: '',
    activity: '', medicine: '', condition: 'sehat', note: '', report_date: new Date().toISOString().split('T')[0],
  });

  const { data: reservationsData } = useQuery({
    queryKey: ['checkin-reservations'],
    queryFn: async () => {
      const res = await getReservations({ status: 'checkin', per_page: 100 });
      return res.data;
    },
  });

  const { data: reportsData } = useQuery({
    queryKey: ['daily-reports'],
    queryFn: async () => {
      const res = await getDailyReports({ per_page: 100 });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (formData) => createDailyReport(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-reports'] });
      alert.success('Laporan harian berhasil dibuat');
      setShowForm(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const activeReservations = reservationsData?.data || [];
  const reports = reportsData?.data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Laporan Harian</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold"
        >
          {showForm ? 'Batal' : '+ Laporan Baru'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Buat Laporan Harian</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reservasi *</label>
              <select required value={form.reservation_id} onChange={(e) => setForm({ ...form, reservation_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">Pilih Reservasi</option>
                {activeReservations.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.cat?.name} - {res.user?.name} ({res.check_in} - {res.check_out})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input type="date" required value={form.report_date} onChange={(e) => setForm({ ...form, report_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Makanan</label>
              <input type="text" value={form.food} onChange={(e) => setForm({ ...form, food: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minuman</label>
              <input type="text" value={form.drink} onChange={(e) => setForm({ ...form, drink: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Berat (kg)</label>
              <input type="number" step="0.01" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi</label>
              <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="sehat">Sehat</option>
                <option value="sakit">Sakit</option>
                <option value="cedera">Cedera</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Aktivitas</label>
              <textarea value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" rows={2} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Obat</label>
              <textarea value={form.medicine} onChange={(e) => setForm({ ...form, medicine: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" rows={2} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
              <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" rows={2} />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold">
                Simpan Laporan
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-bold text-gray-800">{report.reservation?.cat?.name || 'Kucing'}</p>
                <p className="text-sm text-gray-500">Tanggal: {report.report_date}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                report.condition === 'sehat' ? 'bg-green-100 text-green-700' :
                report.condition === 'sakit' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>
                {report.condition}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
              <p>Makan: {report.food || '-'}</p>
              <p>Minum: {report.drink || '-'}</p>
              <p>Berat: {report.weight ? `${report.weight} kg` : '-'}</p>
            </div>
          </div>
        ))}
        {reports.length === 0 && !showForm && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-4">📝</div>
            <p>Belum ada laporan harian</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReports;
