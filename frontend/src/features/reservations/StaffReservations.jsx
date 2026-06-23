import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReservations, updateReservationStatus } from '../../services/reservations';
import alert from '../../lib/alert';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  konfirmasi: 'bg-blue-100 text-blue-700',
  checkin: 'bg-green-100 text-green-700',
  checkout: 'bg-gray-100 text-gray-700',
  batal: 'bg-red-100 text-red-700',
};

const StaffReservations = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['staff-reservations-all'],
    queryFn: async () => {
      const res = await getReservations({ per_page: 100 });
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateReservationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-reservations-all'] });
      alert.success('Status reservasi berhasil diupdate');
    },
  });

  const reservations = data?.data || [];

  const nextStatus = {
    pending: 'konfirmasi',
    konfirmasi: 'checkin',
    checkin: 'checkout',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Kelola Reservasi</h1>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Memuat...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Pelanggan</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Kucing</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Layanan</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Tanggal</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">{res.user?.name}</p>
                      <p className="text-sm text-gray-500">{res.user?.email}</p>
                    </td>
                    <td className="p-4">{res.cat?.name || '-'}</td>
                    <td className="p-4">{res.service?.name || '-'}</td>
                    <td className="p-4 text-sm">
                      {res.check_in} - {res.check_out}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[res.status] || ''}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {nextStatus[res.status] && (
                        <button
                          onClick={() => updateMutation.mutate({ id: res.id, status: nextStatus[res.status] })}
                          className="bg-orange-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-orange-600 transition-colors"
                        >
                          {nextStatus[res.status] === 'konfirmasi' ? 'Konfirmasi' :
                           nextStatus[res.status] === 'checkin' ? 'Check-In' : 'Check-Out'}
                        </button>
                      )}
                      {res.status !== 'batal' && res.status !== 'checkout' && (
                        <button
                          onClick={() => updateMutation.mutate({ id: res.id, status: 'batal' })}
                          className="ml-2 bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs hover:bg-red-200 transition-colors"
                        >
                          Batal
                        </button>
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

export default StaffReservations;
