import { useQuery } from '@tanstack/react-query';
import { getReservations } from '../../services/reservations';
import { getPayments } from '../../services/payments';
import {
  IconCalendarMonth,
  IconHourglass,
  IconPaw,
  IconCash,
} from '@tabler/icons-react';

const statusColor = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  konfirmasi: { bg: 'bg-blue-50', text: 'text-blue-700' },
  checkin: { bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed' },
  checkout: { bg: 'bg-secondary-fixed', text: 'text-on-secondary-fixed' },
  selesai: { bg: 'bg-green-50', text: 'text-green-700' },
  batal: { bg: 'bg-error-container', text: 'text-on-error-container' },
};

const cardConfig = {
  calendar: { bg: 'bg-primary-fixed', iconColor: 'text-primary' },
  hourglass: { bg: 'bg-amber-50', iconColor: 'text-amber-accent' },
  paw: { bg: 'bg-tertiary-fixed', iconColor: 'text-tertiary' },
};

const StaffDashboard = () => {
  const { data: reservationsData } = useQuery({
    queryKey: ['staff-reservations'],
    queryFn: async () => {
      const res = await getReservations({ per_page: 5 });
      return res.data;
    },
  });

  const { data: paymentsData } = useQuery({
    queryKey: ['staff-payments'],
    queryFn: async () => {
      const res = await getPayments({ status: 'pending', per_page: 5 });
      return res.data;
    },
  });

  const reservations = reservationsData?.data || [];
  const pendingPayments = paymentsData?.data || [];

  const activeReservations = reservations.filter((r) => ['checkin', 'konfirmasi'].includes(r.status)).length;
  const todayCheckins = reservations.filter((r) => r.status === 'checkin').length;

  const cards = [
    { label: 'Reservasi Aktif', value: activeReservations, icon: IconCalendarMonth, config: 'calendar' },
    { label: 'Pending Verifikasi', value: pendingPayments.length, icon: IconHourglass, config: 'hourglass' },
    { label: 'Check-in Hari Ini', value: todayCheckins, icon: IconPaw, config: 'paw' },
  ];

  return (
    <div className="font-body-main space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-h2-section text-2xl text-text-dark">Dashboard Staff</h1>
        <p className="text-text-muted mt-1">Kelola reservasi dan laporan harian</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => {
          const IconComponent = card.icon;
          const config = cardConfig[card.config];
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-border-light shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center`}>
                  <IconComponent size={20} className={config.iconColor} />
                </div>
              </div>
              <p className="text-sm text-text-muted mb-1">{card.label}</p>
              <h3 className="text-xl font-semibold text-text-dark">{card.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservasi Terbaru */}
        <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border-light">
            <h2 className="font-semibold text-text-dark flex items-center gap-2">
              <IconCalendarMonth size={20} className="text-primary" />
              Reservasi Terbaru
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-border-light">
                  <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Kucing</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Pelanggan</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Check-in</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-5 py-8 text-center text-text-muted text-sm">Belum ada reservasi</td>
                  </tr>
                ) : (
                  reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-fixed/20 flex items-center justify-center">
                            <IconPaw size={18} className="text-primary" />
                          </div>
                          <span className="font-medium text-text-dark">{res.cat?.name || '-'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted">{res.user?.name || '-'}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">{res.check_in}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${(statusColor[res.status] || statusColor.pending).bg} ${(statusColor[res.status] || statusColor.pending).text}`}>
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verifikasi Pembayaran */}
        <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border-light">
            <h2 className="font-semibold text-text-dark flex items-center gap-2">
              <IconCash size={20} className="text-primary" />
              Verifikasi Pembayaran
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-border-light">
                  <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Pelanggan</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Jumlah</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {pendingPayments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-5 py-8 text-center text-text-muted text-sm">Tidak ada pembayaran pending</td>
                  </tr>
                ) : (
                  pendingPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <IconCash size={18} className="text-green-700" />
                          </div>
                          <span className="font-medium text-text-dark">{payment.reservation?.user?.name || '-'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-text-dark">
                        Rp {Number(payment.amount).toLocaleString('id-ID')}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700">
                          pending
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
