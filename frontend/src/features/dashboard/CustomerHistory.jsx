import { useQuery } from '@tanstack/react-query';
import { getReservations } from '../../services/reservations';
import { IconHistory } from '@tabler/icons-react';

const CustomerHistory = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-reservations-history'],
    queryFn: async () => {
      const res = await getReservations({ per_page: 100 });
      return res.data;
    },
  });

  const reservations = data?.data || [];
  const history = reservations.filter((r) => ['checkout', 'batal'].includes(r.status));

  const statusColors = {
    checkout: 'bg-gray-100 text-gray-700',
    batal: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Reservasi</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="bg-surface-container-lowest border border-border-light rounded-[2rem] py-14 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-fixed/30 flex items-center justify-center mx-auto mb-5">
            <IconHistory size={32} className="text-primary" />
          </div>
          <h4 className="text-base font-semibold text-text-dark mb-1">Belum ada riwayat</h4>
          <p className="text-sm text-text-muted max-w-xs mx-auto">Riwayat reservasi yang selesai akan muncul di sini</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((res) => (
            <div key={res.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">{res.cat?.name || 'Kucing'}</h3>
                  <p className="text-sm text-gray-500">{res.service?.name}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[res.status] || ''}`}>
                  {res.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <p>Check-In: {res.check_in}</p>
                <p>Check-Out: {res.check_out}</p>
                <p>Total: Rp {Number(res.subtotal).toLocaleString('id-ID')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerHistory;
