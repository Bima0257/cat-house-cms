import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getRecentReservations, getRevenueChart } from '../../services/dashboard';
import {
  IconPaw,
  IconCalendarMonth,
  IconHourglass,
  IconUsers,
  IconCash,
  IconShoppingBag,
  IconUserPlus,
  IconAlertTriangle,
  IconMail,
  IconArrowRight,
  IconEye,
  IconDotsVertical,
  IconCircleDot,
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
  pets: { bg: 'bg-primary-fixed', iconColor: 'text-primary' },
  calendar_month: { bg: 'bg-secondary-fixed', iconColor: 'text-secondary' },
  hourglass: { bg: 'bg-amber-50', iconColor: 'text-amber-accent' },
  group: { bg: 'bg-tertiary-fixed', iconColor: 'text-tertiary' },
  payments: { bg: 'bg-green-50', iconColor: 'text-green-700' },
};

const activityConfig = {
  reservation: { bg: 'bg-primary', icon: IconShoppingBag },
  payment: { bg: 'bg-secondary', icon: IconCash },
  user: { bg: 'bg-amber-accent', icon: IconUserPlus },
  alert: { bg: 'bg-error', icon: IconAlertTriangle },
  support: { bg: 'bg-tertiary', icon: IconMail },
};

const AdminDashboard = () => {
  const { data: statsData } = useQuery({ queryKey: ['admin-stats'], queryFn: async () => { const res = await getDashboardStats(); return res.data; } });
  const { data: recentData } = useQuery({ queryKey: ['admin-recent'], queryFn: async () => { const res = await getRecentReservations(); return res.data; } });
  const { data: revenueData } = useQuery({ queryKey: ['admin-revenue'], queryFn: async () => { const res = await getRevenueChart(); return res.data; } });

  const stats = statsData?.data || {};
  const recent = recentData?.data || [];
  const revenue = revenueData?.data || [];

  const cards = [
    { label: 'Total Kucing', value: stats.total_cats || 0, icon: 'pets' },
    { label: 'Reservasi Aktif', value: stats.active_reservations || 0, icon: 'calendar_month' },
    { label: 'Pending Bayar', value: stats.pending_payments || 0, icon: 'hourglass' },
    { label: 'Total Pengguna', value: stats.total_users || 0, icon: 'group' },
    { label: 'Total Pendapatan', value: `Rp ${(stats.total_revenue || 0).toLocaleString('id-ID')}`, icon: 'payments' },
  ];

  const iconMap = {
    pets: IconPaw,
    calendar_month: IconCalendarMonth,
    hourglass: IconHourglass,
    group: IconUsers,
    payments: IconCash,
  };

  const activities = [
    { type: 'reservation', title: 'Reservasi Baru #' + (recent[0]?.id || '8492'), description: 'Mrs. Henderson memesan layanan untuk kucingnya', time: '2m ago' },
    { type: 'payment', title: 'Pembayaran Diterima', description: 'Pembayaran Rp 500.000 dari Leo the Bengal', time: '45m ago' },
    { type: 'user', title: 'Pengguna Baru', description: 'Leo the Bengal bergabung dengan keluarga Papfum', time: '1h ago' },
    { type: 'alert', title: 'Stok Rendah', description: '"Handcrafted Catnip Mice" hampir habis', time: '3h ago' },
    { type: 'support', title: 'Pesan Support', description: 'Pertanyaan baru dari customer mengenai layanan', time: '5h ago' },
  ];

  return (
    <div className="font-body-main space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-h2-section text-2xl text-text-dark">Dashboard Overview</h1>
        <p className="text-text-muted mt-1">Overview operasional Papfum</p>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card, i) => {
          const IconComponent = iconMap[card.icon] || IconPaw;
          const config = cardConfig[card.icon] || cardConfig.pets;
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
        {/* Left Column - Reservations Table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Recent Reservations */}
          <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
              <h3 className="font-semibold text-text-dark">Reservasi Terbaru</h3>
              <a href="/admin/reservations" className="text-sm text-primary hover:underline flex items-center gap-1">
                Lihat Semua
                <IconArrowRight size={16} />
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-border-light">
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Kucing</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Pelanggan</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Check-in</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {recent.slice(0, 5).map((res) => (
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
                      <td className="px-5 py-4">
                        <button className="w-8 h-8 rounded-lg border border-border-light flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all">
                          <IconEye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {recent.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-5 py-8 text-center text-text-muted text-sm">Belum ada reservasi</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-border-light shadow-sm p-5">
            <h3 className="font-semibold text-text-dark mb-4">Grafik Pendapatan</h3>
            <div className="space-y-4">
              {revenue.map((item, i) => {
                const maxRev = Math.max(...revenue.map(r => r.revenue), 1);
                const width = (item.revenue / maxRev) * 100;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm text-text-muted w-16 shrink-0">{item.month}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500"
                        style={{ width: `${Math.min(width, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-text-dark w-32 text-right shrink-0">
                      Rp {item.revenue.toLocaleString('id-ID')}
                    </span>
                  </div>
                );
              })}
              {revenue.length === 0 && (
                <p className="text-center py-6 text-text-muted text-sm">Belum ada data revenue</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Activity Feed & Help Card */}
        <div className="space-y-4">
          {/* Activity Feed */}
          <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
              <h3 className="font-semibold text-text-dark">Activity Feed</h3>
              <button className="text-text-muted hover:text-primary transition-colors">
                <IconDotsVertical size={18} />
              </button>
            </div>
            <div className="p-5">
              <div className="space-y-5 relative before:absolute before:left-2.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-border-light">
                {activities.map((activity, index) => {
                  const config = activityConfig[activity.type] || activityConfig.alert;
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
                          <span className="text-[10px] text-text-muted shrink-0">{activity.time}</span>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{activity.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="w-full mt-5 py-2 border border-border-light rounded-lg text-xs text-text-muted hover:bg-gray-50 transition-colors">
                Lihat Semua Aktivitas
              </button>
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-text-dark p-6 rounded-xl text-white shadow-lg overflow-hidden relative group">
            <div className="absolute -bottom-4 -right-4 opacity-10">
              <IconPaw size={100} className="rotate-12" />
            </div>
            <h4 className="text-lg font-semibold mb-2 relative z-10">Butuh Bantuan?</h4>
            <p className="text-xs text-white/70 mb-4 leading-relaxed relative z-10">
              Konsultan pet care kami tersedia 24/7 untuk optimasi akun Anda.
            </p>
            <button className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-full text-xs font-medium transition-colors relative z-10">
              Hubungi Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
