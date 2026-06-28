import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReservations,
  createReservation,
  cancelReservation,
} from '../../services/reservations';
import { getDailyReportsByReservation } from '../../services/dailyReports';
import { getCats } from '../../services/cats';
import { getServices } from '../../services/services';
import { getCages } from '../../services/cages';
import alert from '../../lib/alert';
import { Link } from 'react-router-dom';

const MyReservations = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    cat_id: '',
    service_id: '',
    cage_id: '',
    check_in: '',
    check_out: '',
    note: '',
  });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: reservationsData } = useQuery({
    queryKey: ['my-reservations', { search: debouncedSearch }],
    queryFn: async () => {
      const res = await getReservations({ search: debouncedSearch, per_page: 100 });
      return res.data;
    },
  });

  const { data: catsData } = useQuery({
    queryKey: ['my-cats'],
    queryFn: async () => {
      const res = await getCats({ per_page: 100 });
      return res.data;
    },
  });

  const { data: servicesData } = useQuery({
    queryKey: ['services-list'],
    queryFn: async () => {
      const res = await getServices({ per_page: 100 });
      return res.data;
    },
  });

  const { data: cagesData } = useQuery({
    queryKey: ['cages-list'],
    queryFn: async () => {
      const res = await getCages({ status: 'tersedia', per_page: 100 });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => createReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] });
      alert.success('Reservasi berhasil dibuat! Silakan lakukan pembayaran.');
      setShowForm(false);
      setForm({
        cat_id: '',
        service_id: '',
        cage_id: '',
        check_in: '',
        check_out: '',
        note: '',
      });
    },
    onError: (err) => {
      const messages = err.response?.data?.errors;
      if (messages) {
        const first = Object.values(messages)[0]?.[0];
        alert.error(first || 'Gagal membuat reservasi');
      } else {
        alert.error(err.response?.data?.message || 'Gagal membuat reservasi');
      }
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] });
      alert.success('Reservasi berhasil dibatalkan');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal membatalkan reservasi');
    },
  });

  const [expandedId, setExpandedId] = useState(null);
  const [reportsMap, setReportsMap] = useState({});
  const [loadingReport, setLoadingReport] = useState({});

  const handleToggleReports = async (reservationId) => {
    if (expandedId === reservationId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(reservationId);
    if (!reportsMap[reservationId]) {
      setLoadingReport((prev) => ({ ...prev, [reservationId]: true }));
      try {
        const res = await getDailyReportsByReservation(reservationId);
        setReportsMap((prev) => ({
          ...prev,
          [reservationId]: res.data?.data || [],
        }));
      } catch {
        alert.error('Gagal memuat laporan harian');
      } finally {
        setLoadingReport((prev) => ({ ...prev, [reservationId]: false }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const reservations = reservationsData?.data || [];

  const conditionColors = {
    sehat: 'bg-green-100 text-green-700',
    sakit: 'bg-yellow-100 text-yellow-700',
    cedera: 'bg-red-100 text-red-700',
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    konfirmasi: 'bg-blue-100 text-blue-700',
    checkin: 'bg-green-100 text-green-700',
    checkout: 'bg-gray-100 text-gray-700',
    batal: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-2xl font-bold text-gray-800'>Reservasi Saya</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className='bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold'
          >
            {showForm ? 'Batal' : '+ Reservasi Baru'}
          </button>
        </div>
        <div className="relative">
          <input type="search" placeholder="Cari reservasi..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
        </div>
      </div>

      {showForm && (
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6'>
          <h2 className='text-lg font-bold text-gray-800 mb-4'>
            Buat Reservasi Baru
          </h2>
          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 md:grid-cols-2 gap-4'
          >
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Kucing *
              </label>
              <select
                required
                value={form.cat_id}
                onChange={(e) => setForm({ ...form, cat_id: e.target.value })}
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400'
              >
                <option value=''>Pilih Kucing</option>
                {(catsData?.data || []).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Layanan *
              </label>
              <select
                required
                value={form.service_id}
                onChange={(e) =>
                  setForm({ ...form, service_id: e.target.value })
                }
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400'
              >
                <option value=''>Pilih Layanan</option>
                {(servicesData?.data || []).map((svc) => (
                  <option key={svc.id} value={svc.id}>
                    {svc.name} - Rp{' '}
                    {Number(svc.price_per_day).toLocaleString('id-ID')}/hari
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Check-In *
              </label>
              <input
                type='date'
                required
                value={form.check_in}
                onChange={(e) => setForm({ ...form, check_in: e.target.value })}
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Kandang *
              </label>
              <select
                required
                value={form.cage_id}
                onChange={(e) => setForm({ ...form, cage_id: e.target.value })}
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400'
              >
                <option value=''>Pilih Kandang</option>
                {(cagesData?.data || []).map((cage) => (
                  <option key={cage.id} value={cage.id}>
                    {cage.code} - {cage.category}{cage.price != null ? ` - Rp ${Number(cage.price).toLocaleString('id-ID')}/hari` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Check-Out *
              </label>
              <input
                type='date'
                required
                value={form.check_out}
                onChange={(e) =>
                  setForm({ ...form, check_out: e.target.value })
                }
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
            </div>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Catatan
              </label>
              <textarea
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400'
                rows={2}
              />
            </div>
            <div className='md:col-span-2'>
              <button
                type='submit'
                disabled={createMutation.isPending}
                className='bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:opacity-60 disabled:cursor-not-allowed'
              >
                {createMutation.isPending ? 'Menyimpan...' : 'Buat Reservasi'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className='space-y-4'>
        {reservations.map((res) => (
          <div
            key={res.id}
            className='bg-white rounded-xl shadow-sm p-5 border border-gray-100'
          >
            <div className='flex items-center justify-between mb-3'>
              <div>
                <h3 className='font-bold text-gray-800'>
                  {res.cat?.name || 'Kucing'}
                </h3>
                <p className='text-sm text-gray-500'>{res.service?.name}</p>
              </div>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[res.status] || 'bg-gray-100 text-gray-700'}`}
              >
                {res.status}
              </span>
            </div>
            <div className='grid grid-cols-2 gap-2 text-sm text-gray-600'>
              <p>Check-In: {res.check_in}</p>
              <p>Check-Out: {res.check_out}</p>
              <p>Kandang: {res.cage?.code}</p>
              <p>Total: Rp {Number(res.subtotal).toLocaleString('id-ID')}</p>
            </div>
            {res.status === 'pending' && !res.payment && (
              <div className='mt-3 flex items-center gap-2'>
                <Link
                  to={`/customer/payments/upload/${res.id}`}
                  className='inline-block bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition-colors'
                >
                  Bayar Sekarang
                </Link>
                <button
                  onClick={() =>
                    alert.confirm('Batalkan reservasi ini?', {
                      confirmLabel: 'Ya, Batalkan',
                      cancelLabel: 'Tidak',
                      onConfirm: () => cancelMutation.mutate(res.id),
                    })
                  }
                  disabled={cancelMutation.isPending}
                  className='bg-red-100 text-red-600 px-4 py-1.5 rounded-lg text-sm hover:bg-red-200 transition-colors disabled:opacity-60'
                >
                  {cancelMutation.isPending ? 'Membatalkan...' : 'Batalkan'}
                </button>
              </div>
            )}

            {(res.status === 'checkin' || res.status === 'checkout') && (
              <div className='mt-3'>
                <button
                  onClick={() => handleToggleReports(res.id)}
                  className='inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors'
                >
                  <span className={expandedId === res.id ? 'rotate-90 inline-block transition-transform' : 'inline-block transition-transform'}>▶</span>
                  {loadingReport[res.id]
                    ? 'Memuat laporan...'
                    : `Lihat Laporan (${(reportsMap[res.id] || []).length})`}
                </button>

                {expandedId === res.id && reportsMap[res.id] && (
                  <div className='mt-3 space-y-2'>
                    {reportsMap[res.id].length === 0 && !loadingReport[res.id] && (
                      <p className='text-sm text-gray-400 italic'>Belum ada laporan harian</p>
                    )}
                    {reportsMap[res.id].map((report) => (
                      <div
                        key={report.id}
                        className='bg-gray-50 rounded-lg p-3 border border-gray-100'
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-xs font-semibold text-gray-500'>
                            {report.report_date}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${conditionColors[report.condition] || 'bg-gray-100 text-gray-700'}`}
                          >
                            {report.condition}
                          </span>
                        </div>
                        <div className='grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600'>
                          <p>Makan: {report.food || '-'}</p>
                          <p>Minum: {report.drink || '-'}</p>
                          <p>Berat: {report.weight ? `${report.weight} kg` : '-'}</p>
                          <p>Aktivitas: {report.activity || '-'}</p>
                          {report.medicine && <p className='col-span-2'>Obat: {report.medicine}</p>}
                          {report.note && <p className='col-span-2 text-gray-400 italic'>{report.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {reservations.length === 0 && (
          <div className='text-center py-12 text-gray-400'>
            <div className='text-4xl mb-4'>{debouncedSearch ? '🔍' : '📅'}</div>
            <p>{debouncedSearch ? `Tidak ada hasil untuk "${debouncedSearch}"` : 'Belum ada reservasi'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
