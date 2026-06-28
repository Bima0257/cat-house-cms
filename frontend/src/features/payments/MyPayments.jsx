import { useQuery } from '@tanstack/react-query';
import { getPayments } from '../../services/payments';
import { IconReceipt } from '@tabler/icons-react';

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
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-surface-container-lowest border border-border-light rounded-[2rem] py-14 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-fixed/30 flex items-center justify-center mx-auto mb-5">
            <IconReceipt size={32} className="text-primary" />
          </div>
          <h4 className="text-base font-semibold text-text-dark mb-1">Belum ada pembayaran</h4>
          <p className="text-sm text-text-muted max-w-xs mx-auto">Pembayaran akan muncul setelah Anda membuat reservasi</p>
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
