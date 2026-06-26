import { useApi } from '../../hooks/useApi';
import { getReservations } from '../../services/reservations';
import { getCats } from '../../services/cats';
import { Link } from 'react-router-dom';
import {
  IconPaw,
  IconCalendarMonth,
  IconReceipt,
  IconAward,
  IconRefresh,
  IconClock,
  IconCirclePlus,
  IconArrowRight,
  IconEye,
  IconShoppingCart,
  IconPlus,
  IconThumbUp,
} from '@tabler/icons-react';
import { RESERVATION_STATUS_COLOR } from '../../constants/status';

const pawPatternSvg = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-9 6c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z' fill='%23ffffff' fill-opacity='0.15'/%3E%3C/svg%3E")`;

const catPlaceholder = (
  <div className="w-full h-full flex items-center justify-center bg-primary-fixed/20">
    <IconPaw size={32} className="text-primary/40" />
  </div>
);

const CustomerDashboard = () => {
  const { data: catsData } = useApi('my-cats', () => getCats({ per_page: 100 }));
  const { data: reservationsData } = useApi('my-reservations', () => getReservations({ per_page: 100 }));
  const { user } = JSON.parse(localStorage.getItem('user') || '{}');

  const cats = catsData?.data || [];
  const reservations = reservationsData?.data || [];

  const activeReservations = reservations.filter(
    (r) => ['pending', 'konfirmasi', 'checkin'].includes(r.status)
  ).length;

  const getInitials = (name) =>
    (name || 'U').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-8 font-body-main">

      {/* Welcome Hero */}
      <section className="relative bg-primary overflow-hidden rounded-[2rem] p-8 md:p-12 text-white shadow-xl">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ backgroundImage: pawPatternSvg }}
        />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-container rounded-full blur-3xl opacity-30" />
        <div className="relative z-10 md:flex justify-between items-center">
          <div className="max-w-xl">
            <h1 className="font-hero-display text-h2-section md:text-5xl mb-4 leading-tight">
              Halo, {user?.name?.split(' ')[0] || 'Pengunjung'}! Kucing Anda menunggu perawatan terbaik.
            </h1>
            <p className="text-lg opacity-90 mb-8">
              Kami siap merawat kucing kesayangan Anda dengan penuh kasih sayang. Buat reservasi sekarang!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/customer/reservations"
                className="bg-white text-primary font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
              >
                <IconCalendarMonth size={22} />
                Buat Reservasi
              </Link>
              <Link
                to="/customer/cats"
                className="bg-primary-container text-white font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform flex items-center gap-2 border border-white/20"
              >
                <IconPaw size={22} />
                Kelola Kucing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest border border-border-light p-6 rounded-3xl flex items-center gap-4 hover:shadow-md transition-shadow group">
          <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
            <IconReceipt size={32} />
          </div>
          <div>
            <p className="text-text-muted font-ui-label text-sm">Total Reservasi</p>
            <p className="font-price-lg text-3xl">{reservations.length}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-border-light p-6 rounded-3xl flex items-center gap-4 hover:shadow-md transition-shadow group">
          <div className="w-14 h-14 bg-amber-accent/10 rounded-2xl flex items-center justify-center text-amber-accent group-hover:scale-110 transition-transform">
            <IconAward size={32} />
          </div>
          <div>
            <p className="text-text-muted font-ui-label text-sm">Total Kucing</p>
            <p className="font-price-lg text-3xl">{cats.length}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-border-light p-6 rounded-3xl flex items-center gap-4 hover:shadow-md transition-shadow group">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <IconRefresh size={32} />
          </div>
          <div>
            <p className="text-text-muted font-ui-label text-sm">Reservasi Aktif</p>
            <p className="font-price-lg text-3xl">{activeReservations}</p>
          </div>
        </div>
      </section>

      {/* Main bento grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: 8/12 */}
        <div className="xl:col-span-8 space-y-8">

          {/* Your Cats */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-hero-display text-h2-section text-secondary">Kucing Saya</h2>
              <Link
                to="/customer/cats"
                className="text-primary font-bold hover:underline flex items-center gap-1"
              >
                Tambah Kucing
                <IconCirclePlus size={18} />
              </Link>
            </div>
            {cats.length === 0 ? (
              <div className="bg-surface-container-lowest border border-border-light rounded-[2rem] py-14 px-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-fixed/30 flex items-center justify-center mx-auto mb-5">
                  <IconPaw size={32} className="text-primary" />
                </div>
                <h4 className="text-base font-semibold text-text-dark mb-1">Belum ada kucing</h4>
                <p className="text-sm text-text-muted mb-6 max-w-xs mx-auto">
                  Tambahkan kucing pertama Anda untuk mulai menggunakan layanan kami
                </p>
                <Link
                  to="/customer/cats"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform shadow-sm"
                >
                  <IconCirclePlus size={18} />
                  Tambah Kucing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {cats.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white border border-border-light rounded-[2rem] p-6 flex items-center gap-6 group hover:border-primary transition-all shadow-sm hover:shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform" />
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-border-light bg-surface-container-low">
                      {cat.avatar ? (
                        <img src={cat.avatar} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        catPlaceholder
                      )}
                    </div>
                    <div className="relative z-10 flex-1 min-w-0">
                      <h3 className="font-h3-card text-secondary mb-1 truncate">{cat.name}</h3>
                      <p className="text-xs text-text-muted mb-3 truncate">{cat.breed || 'Kucing'}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs font-semibold text-green-600">Sehat</span>
                      </div>
                      <Link
                        to="/customer/cats"
                        className="text-xs bg-surface-container px-3 py-1.5 rounded-full font-bold text-on-surface-variant hover:bg-primary hover:text-white transition-colors inline-block"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Reservations */}
          <section>
            <h2 className="font-hero-display text-h2-section text-secondary mb-6">
              Reservasi Terbaru
            </h2>
            {reservations.length === 0 ? (
              <div className="bg-surface-container-lowest border border-border-light rounded-[2rem] py-14 px-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary-fixed/30 flex items-center justify-center mx-auto mb-5">
                  <IconCalendarMonth size={32} className="text-secondary" />
                </div>
                <h4 className="text-base font-semibold text-text-dark mb-1">Belum ada reservasi</h4>
                <p className="text-sm text-text-muted mb-6 max-w-xs mx-auto">
                  Buat reservasi pertama Anda untuk menitipkan kucing kesayangan
                </p>
                <Link
                  to="/customer/reservations"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform shadow-sm"
                >
                  <IconCalendarMonth size={18} />
                  Buat Reservasi
                </Link>
              </div>
            ) : (
              <div className="bg-white border border-border-light rounded-[2rem] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low border-b border-border-light">
                    <tr>
                      <th className="px-6 py-4 font-ui-label text-on-surface-variant">Kucing</th>
                      <th className="px-6 py-4 font-ui-label text-on-surface-variant">Tanggal</th>
                      <th className="px-6 py-4 font-ui-label text-on-surface-variant">Status</th>
                      <th className="px-6 py-4 font-ui-label text-on-surface-variant" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {reservations.slice(0, 5).map((res) => {
                      const color = RESERVATION_STATUS_COLOR[res.status] || RESERVATION_STATUS_COLOR.pending;
                      return (
                        <tr key={res.id} className="hover:bg-surface-container-lowest transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary-fixed/20 flex items-center justify-center">
                                <IconPaw size={18} className="text-primary" />
                              </div>
                              <span className="font-bold text-primary">{res.cat?.name || 'Kucing'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-text-muted">
                            {res.check_in} &mdash; {res.check_out}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${color.bg} ${color.text} border-current/20`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/customer/reservations`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-text-muted hover:text-primary transition-colors"
                            >
                              Detail
                              <IconArrowRight size={14} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="p-4 text-center border-t border-border-light">
                  <Link
                    to="/customer/reservations"
                    className="text-sm font-bold text-text-muted hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    Lihat Semua Reservasi
                    <IconArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: 4/12 */}
        <div className="xl:col-span-4 space-y-8">
          <section className="bg-secondary p-8 rounded-[2rem] text-white relative overflow-hidden">
            <div className="absolute bottom-0 right-0 opacity-10 translate-x-1/4 translate-y-1/4">
              <IconThumbUp size={200} />
            </div>
            <h2 className="font-hero-display text-h2-section mb-6 relative z-10">
              Rekomendasi untuk Anda
            </h2>
            <div className="space-y-6 relative z-10">
              {/* Service 1 */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl flex gap-4 hover:bg-white/20 transition-all cursor-pointer group">
                <div className="w-20 h-20 bg-white rounded-xl flex-shrink-0 p-3 overflow-hidden border border-white/10 flex items-center justify-center">
                  <IconPaw size={36} className="text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-accent mb-1">
                    Populer
                  </p>
                  <h4 className="font-bold text-sm mb-2 truncate">Grooming & Spa</h4>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Mulai Rp50K</span>
                    <Link
                      to="/customer/reservations"
                      className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-container transition-colors"
                    >
                      <IconPlus size={16} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Service 2 */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl flex gap-4 hover:bg-white/20 transition-all cursor-pointer group">
                <div className="w-20 h-20 bg-white rounded-xl flex-shrink-0 p-3 overflow-hidden border border-white/10 flex items-center justify-center">
                  <IconShoppingCart size={36} className="text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-accent mb-1">
                    Best Seller
                  </p>
                  <h4 className="font-bold text-sm mb-2 truncate">Cat Hotel Menginap</h4>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Mulai Rp100K</span>
                    <Link
                      to="/customer/reservations"
                      className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-container transition-colors"
                    >
                      <IconPlus size={16} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Promo */}
              <div className="pt-6 border-t border-white/10">
                <p className="text-sm italic opacity-80 mb-4">
                  Dapatkan diskon 15% untuk reservasi pertama Anda! Rawat kucing kesayangan dengan layanan premium Cat House.
                </p>
                <div className="bg-primary-container p-4 rounded-2xl text-center">
                  <p className="font-bold mb-1">Gabung Membership</p>
                  <p className="text-xs opacity-90 mb-3">Nikmati berbagai keuntungan eksklusif</p>
                  <Link
                    to="/customer/reservations"
                    className="block w-full bg-white text-primary py-2 rounded-xl text-xs font-bold hover:shadow-lg transition-all"
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
