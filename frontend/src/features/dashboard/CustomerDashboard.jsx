import { useApi } from '../../hooks/useApi';
import { getReservations } from '../../services/reservations';
import { getCats } from '../../services/cats';
import { Link } from 'react-router-dom';
import {
  IconPaw,
  IconCalendarMonth,
  IconArrowRight,
  IconEye,
} from '@tabler/icons-react';

const statusColor = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  konfirmasi: { bg: 'bg-blue-50', text: 'text-blue-700' },
  checkin: { bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed' },
  checkout: { bg: 'bg-secondary-fixed', text: 'text-on-secondary-fixed' },
  selesai: { bg: 'bg-green-50', text: 'text-green-700' },
  batal: { bg: 'bg-error-container', text: 'text-on-error-container' },
};

const CustomerDashboard = () => {
  const { data: catsData } = useApi('my-cats', () => getCats({ per_page: 5 }));
  const { data: reservationsData } = useApi('my-reservations', () => getReservations({ per_page: 5 }));
  const { user } = JSON.parse(localStorage.getItem('user') || '{}');

  const cats = catsData?.data || [];
  const reservations = reservationsData?.data || [];

  const activeReservations = reservations.filter((r) => ['pending', 'konfirmasi', 'checkin'].includes(r.status)).length;

  const cards = [
    { label: 'Total Kucing', value: cats.length, icon: IconPaw, bg: 'bg-primary-fixed', iconColor: 'text-primary' },
    { label: 'Reservasi Aktif', value: activeReservations, icon: IconCalendarMonth, bg: 'bg-secondary-fixed', iconColor: 'text-secondary' },
  ];

  return (
    <div className="font-body-main space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-h2-section text-2xl text-text-dark">
          Halo, {user?.name || 'Pengunjung'}! 👋
        </h1>
        <p className="text-text-muted mt-1">Selamat datang di dashboard Cat House Anda</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card, i) => {
          const IconComponent = card.icon;
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-border-light shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}>
                  <IconComponent size={20} className={card.iconColor} />
                </div>
              </div>
              <p className="text-sm text-text-muted mb-1">{card.label}</p>
              <h3 className="text-xl font-semibold text-text-dark">{card.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kucing Saya */}
        <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
            <h2 className="font-semibold text-text-dark flex items-center gap-2">
              <IconPaw size={20} className="text-primary" />
              Kucing Saya
            </h2>
            <Link to="/customer/cats" className="text-sm text-primary hover:underline flex items-center gap-1">
              Lihat Semua
              <IconArrowRight size={16} />
            </Link>
          </div>
          {cats.length === 0 ? (
            <div className="text-center py-8">
              <IconPaw size={48} className="text-text-muted/30 mx-auto mb-3" />
              <p className="text-text-muted text-sm">Belum ada kucing</p>
              <Link to="/customer/cats" className="text-primary hover:underline text-sm mt-2 inline-block">
                Tambah Kucing
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-border-light">
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Nama</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Ras</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {cats.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-fixed/20 flex items-center justify-center">
                            <span className="text-lg">😺</span>
                          </div>
                          <span className="font-medium text-text-dark">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted">{cat.breed || 'Kucing'}</td>
                      <td className="px-5 py-4">
                        <button className="w-8 h-8 rounded-lg border border-border-light flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all">
                          <IconEye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reservasi Terbaru */}
        <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
            <h2 className="font-semibold text-text-dark flex items-center gap-2">
              <IconCalendarMonth size={20} className="text-primary" />
              Reservasi Terbaru
            </h2>
            <Link to="/customer/reservations" className="text-sm text-primary hover:underline flex items-center gap-1">
              Lihat Semua
              <IconArrowRight size={16} />
            </Link>
          </div>
          {reservations.length === 0 ? (
            <div className="text-center py-8">
              <IconCalendarMonth size={48} className="text-text-muted/30 mx-auto mb-3" />
              <p className="text-text-muted text-sm">Belum ada reservasi</p>
              <Link to="/customer/reservations" className="text-primary hover:underline text-sm mt-2 inline-block">
                Buat Reservasi
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-border-light">
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Kucing</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Tanggal</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {reservations.slice(0, 3).map((res) => (
                    <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-fixed/20 flex items-center justify-center">
                            <IconPaw size={18} className="text-primary" />
                          </div>
                          <span className="font-medium text-text-dark">{res.cat?.name || 'Kucing'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted">{res.check_in} - {res.check_out}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${(statusColor[res.status] || statusColor.pending).bg} ${(statusColor[res.status] || statusColor.pending).text}`}>
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
