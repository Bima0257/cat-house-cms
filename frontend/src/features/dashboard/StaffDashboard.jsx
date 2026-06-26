import { useQuery } from '@tanstack/react-query';
import { getReservations } from '../../services/reservations';
import { getPayments } from '../../services/payments';
import { getCats } from '../../services/cats';
import DataTable from '../../components/ui/DataTable';
import { RESERVATION_STATUS_COLOR } from '../../constants/status';
import { Link } from 'react-router-dom';
import {
  IconCalendarMonth,
  IconHourglass,
  IconPaw,
  IconCash,
  IconArrowRight,
  IconEye,
  IconCheck,
  IconX,
  IconFileDescription,
  IconClipboardCheck,
  IconUsers,
  IconShoppingBag,
  IconUserPlus,
  IconAlertTriangle,
  IconMail,
} from '@tabler/icons-react';

const cardConfig = {
  calendar: { bg: 'bg-secondary-fixed', iconColor: 'text-secondary' },
  hourglass: { bg: 'bg-amber-50', iconColor: 'text-amber-accent' },
  paw: { bg: 'bg-primary-fixed', iconColor: 'text-primary' },
  group: { bg: 'bg-tertiary-fixed', iconColor: 'text-tertiary' },
};

const iconMap = {
  calendar: IconCalendarMonth,
  hourglass: IconHourglass,
  paw: IconPaw,
  group: IconUsers,
};

const activityConfig = {
  checkin: { bg: 'bg-primary', icon: IconShoppingBag },
  payment: { bg: 'bg-secondary', icon: IconCash },
  report: { bg: 'bg-amber-accent', icon: IconClipboardCheck },
  alert: { bg: 'bg-error', icon: IconAlertTriangle },
  support: { bg: 'bg-tertiary', icon: IconMail },
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const StaffDashboard = () => {
  const { data: reservationsData, isLoading: loadingRes } = useQuery({
    queryKey: ['staff-reservations'],
    queryFn: async () => {
      const res = await getReservations({ per_page: 50 });
      return res.data;
    },
  });

  const { data: paymentsData, isLoading: loadingPay } = useQuery({
    queryKey: ['staff-payments'],
    queryFn: async () => {
      const res = await getPayments({ status: 'pending', per_page: 50 });
      return res.data;
    },
  });

  const { data: catsData } = useQuery({
    queryKey: ['staff-cats'],
    queryFn: async () => {
      const res = await getCats({ per_page: 100 });
      return res.data;
    },
  });

  const reservations = reservationsData?.data || [];
  const pendingPayments = paymentsData?.data || [];
  const cats = catsData?.data || [];

  const activeReservations = reservations.filter((r) => ['checkin', 'konfirmasi'].includes(r.status)).length;
  const todayCheckins = reservations.filter((r) => r.status === 'checkin').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayReservations = reservations.filter((r) => r.check_in === todayStr);
  const todayRevenue = reservations
    .filter((r) => r.status === 'selesai')
    .reduce((sum, r) => sum + (Number(r.total_price) || 0), 0);

  const cards = [
    { label: 'Reservasi Aktif', value: activeReservations, icon: 'calendar' },
    { label: 'Pending Verifikasi', value: pendingPayments.length, icon: 'hourglass' },
    { label: 'Check-in Hari Ini', value: todayCheckins, icon: 'paw' },
    { label: 'Total Kucing', value: cats.length, icon: 'group' },
  ];

  const todayStats = [
    { label: 'Reservasi Hari Ini', value: todayReservations.length },
    { label: 'Pendapatan Selesai', value: `Rp ${todayRevenue.toLocaleString('id-ID')}` },
  ];

  const activities = [];
  reservations.slice(0, 3).forEach((r) => {
    const status = r.status;
    if (status === 'checkin') {
      activities.push({
        type: 'checkin',
        title: `Check-in: ${r.cat?.name || 'Kucing'}`,
        description: `${r.user?.name || 'Pelanggan'} — check-in hari ini`,
        time: timeAgo(r.updated_at),
      });
    }
  });
  pendingPayments.slice(0, 2).forEach((p) => {
    activities.push({
      type: 'payment',
      title: `Pembayaran ${p.reservation?.user?.name || 'Pelanggan'}`,
      description: `Rp ${Number(p.amount).toLocaleString('id-ID')} menunggu verifikasi`,
      time: timeAgo(p.created_at),
    });
  });
  if (activities.length === 0) {
    activities.push(
      { type: 'support', title: 'Selamat datang!', description: 'Dashboard staff siap digunakan. Pantau reservasi dan pembayaran di sini.', time: '' },
    );
  }

  const reservationColumns = [
    {
      key: 'cat',
      header: 'Kucing',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-fixed/20 flex items-center justify-center shrink-0">
            <IconPaw size={16} className="text-primary" />
          </div>
          <span className="font-medium text-text-dark">{row.cat?.name || '-'}</span>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'Pelanggan',
      accessor: (row) => row.user?.name || '-',
      render: (row) => <span className="text-text-muted">{row.user?.name || '-'}</span>,
    },
    {
      key: 'check_in',
      header: 'Check-in',
      accessor: (row) => row.check_in,
      render: (row) => <span className="text-text-muted">{row.check_in}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const color = RESERVATION_STATUS_COLOR[row.status] || RESERVATION_STATUS_COLOR.pending;
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${color.bg} ${color.text} border-current/20`}>
            {row.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row) => (
        <Link
          to={`/staff/reservations`}
          className="w-8 h-8 rounded-lg border border-border-light flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all"
        >
          <IconEye size={16} />
        </Link>
      ),
    },
  ];

  return (
    <div className="font-body-main space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-h2-section text-2xl text-text-dark">Dashboard Staff</h1>
        <p className="text-text-muted mt-1">Kelola reservasi dan laporan harian</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const IconComponent = iconMap[card.icon] || IconPaw;
          const config = cardConfig[card.icon] || cardConfig.paw;
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-border-light shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center`}>
                  <IconComponent size={20} className={config.iconColor} />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-sm text-text-muted mb-1">{card.label}</p>
              <h3 className="text-xl font-semibold text-text-dark">{card.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Reservations & Daily Summary */}
        <div className="lg:col-span-2 space-y-4">
          {/* Recent Reservations with DataTable */}
          <DataTable
            data={reservations.slice(0, 10)}
            loading={loadingRes}
            columns={reservationColumns}
            showSearch={true}
            showPagination={false}
            searchPlaceholder="Cari reservasi..."
            actions={
              <Link
                to="/staff/reservations"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Lihat Semua
                <IconArrowRight size={16} />
              </Link>
            }
          />

          {/* Daily Summary */}
          <div className="bg-white rounded-xl border border-border-light shadow-sm p-5">
            <h3 className="font-semibold text-text-dark mb-4">Ringkasan Hari Ini</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {todayStats.map((stat, i) => (
                <div key={i} className="bg-surface-container-low rounded-xl p-4">
                  <p className="text-sm text-text-muted mb-1">{stat.label}</p>
                  <p className="font-bold text-xl text-text-dark">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {todayReservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-fixed/30 flex items-center justify-center mb-3">
                    <IconCalendarMonth size={28} className="text-secondary" />
                  </div>
                  <p className="text-sm font-medium text-text-dark mb-0.5">Belum ada aktivitas hari ini</p>
                  <p className="text-xs text-text-muted">Reservasi yang masuk hari ini akan muncul di sini</p>
                </div>
              ) : (
                todayReservations.slice(0, 4).map((res, i) => {
                  const max = Math.max(...todayReservations.map((r) => Number(r.total_price) || 0), 1);
                  const width = ((Number(res.total_price) || 0) / max) * 100;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm text-text-muted w-24 shrink-0 truncate">{res.cat?.name || '-'}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500"
                          style={{ width: `${Math.min(width, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-text-dark w-28 text-right shrink-0">
                        Rp {(Number(res.total_price) || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Payments & Activity */}
        <div className="space-y-4">
          {/* Verifikasi Pembayaran */}
          <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
              <h3 className="font-semibold text-text-dark">Verifikasi Pembayaran</h3>
              {pendingPayments.length > 0 && (
                <span className="bg-amber-accent/10 text-amber-accent text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingPayments.length}
                </span>
              )}
            </div>
            <div className="p-4 space-y-3">
              {loadingPay ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg" />
                  ))}
                </div>
              ) : pendingPayments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-3">
                    <IconCheck size={28} className="text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-text-dark mb-0.5">Semua pembayaran terverifikasi</p>
                  <p className="text-xs text-text-muted">Tidak ada pembayaran yang menunggu verifikasi</p>
                </div>
              ) : (
                pendingPayments.slice(0, 4).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors border border-border-light"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                      <IconCash size={18} className="text-amber-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-dark truncate">
                        {payment.reservation?.user?.name || '-'}
                      </p>
                      <p className="text-xs text-text-muted">
                        Rp {Number(payment.amount).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <Link
                      to="/staff/payments"
                      className="shrink-0 text-xs font-bold text-primary hover:underline"
                    >
                      Verifikasi
                    </Link>
                  </div>
                ))
              )}
              {pendingPayments.length > 0 && (
                <Link
                  to="/staff/payments"
                  className="block w-full text-center py-2 border border-border-light rounded-lg text-xs text-text-muted hover:bg-gray-50 transition-colors"
                >
                  Lihat Semua Pembayaran
                </Link>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border-light">
              <h3 className="font-semibold text-text-dark">Aktivitas Terbaru</h3>
            </div>
            <div className="p-5">
              <div className="space-y-5 relative before:absolute before:left-2.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-border-light">
                {activities.map((activity, index) => {
                  const config = activityConfig[activity.type] || activityConfig.support;
                  const IconComponent = config.icon;
                  return (
                    <div key={index} className="flex gap-4 relative">
                      <div
                        className={`w-6 h-6 rounded-full ${config.bg} flex items-center justify-center z-10 border-2 border-white shrink-0`}
                      >
                        <IconComponent size={10} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-sm font-medium text-text-dark truncate">{activity.title}</p>
                          {activity.time && (
                            <span className="text-[10px] text-text-muted shrink-0">{activity.time}</span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{activity.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-text-dark p-6 rounded-xl text-white shadow-lg overflow-hidden relative group">
            <div className="absolute -bottom-4 -right-4 opacity-10">
              <IconPaw size={100} className="rotate-12" />
            </div>
            <h4 className="font-semibold text-lg mb-2 relative z-10">Buat Laporan Harian</h4>
            <p className="text-xs text-white/70 mb-4 leading-relaxed relative z-10">
              Catat aktivitas harian kucing, kondisi kesehatan, dan pemberian makan.
            </p>
            <Link
              to="/staff/daily-reports"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-full text-xs font-medium transition-colors relative z-10"
            >
              <IconFileDescription size={16} />
              Buat Laporan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
