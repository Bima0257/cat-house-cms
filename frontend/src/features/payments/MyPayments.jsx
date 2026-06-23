import { useQuery } from '@tanstack/react-query';
import { getPayments } from '../../services/payments';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  terverifikasi: 'bg-green-100 text-green-700',
  gagal: 'bg-red-100 text-red-700',
};

const MyPayments = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-payments'],
    queryFn: async () => {
      const res = await getPayments({ per_page: 100 });
      return res.data;
    },
  });

  const payments = data?.data || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Pembayaran</h1>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Memuat...</div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">💰</div>
          <p>Belum ada pembayaran</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-800">
                    Rp {Number(payment.amount).toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-gray-500">{payment.payment_method}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[payment.status] || 'bg-gray-100'}`}>
                  {payment.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Reservasi: {payment.reservation?.cat?.name || '-'} | {payment.reservation?.check_in} - {payment.reservation?.check_out}
              </p>
              {payment.paid_at && (
                <p className="text-xs text-gray-400 mt-1">Dibayar: {new Date(payment.paid_at).toLocaleDateString('id-ID')}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPayments;
