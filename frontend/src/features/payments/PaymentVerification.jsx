import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPayments, verifyPayment, rejectPayment } from '../../services/payments';
import alert from '../../lib/alert';

const PaymentVerification = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['all-payments'],
    queryFn: async () => {
      const res = await getPayments({ per_page: 100 });
      return res.data;
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (id) => verifyPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-payments'] });
      alert.success('Pembayaran diverifikasi');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal memverifikasi pembayaran');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-payments'] });
      alert.success('Pembayaran ditolak');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal menolak pembayaran');
    },
  });

  const payments = data?.data || [];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    terverifikasi: 'bg-green-100 text-green-700',
    gagal: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Verifikasi Pembayaran</h1>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Memuat...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Pelanggan</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Reservasi</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Metode</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Jumlah</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="p-4 font-semibold text-gray-800">{payment.reservation?.user?.name}</td>
                    <td className="p-4 text-sm">
                      {payment.reservation?.cat?.name} | {payment.reservation?.check_in}
                    </td>
                    <td className="p-4">{payment.payment_method}</td>
                    <td className="p-4 font-semibold">
                      Rp {Number(payment.amount).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[payment.status] || ''}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {payment.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => verifyMutation.mutate(payment.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600 transition-colors"
                          >
                            Verifikasi
                          </button>
                          <button
                            onClick={() => rejectMutation.mutate(payment.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition-colors"
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;
