import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuthState } from '../../hooks/useAuth';
import { getActivityLogs, getActivityActions } from '../../services/activityLogs';
import DataTable from '../../components/ui/DataTable';
import { Navigate } from 'react-router-dom';

const actionLabels = {
  'auth.login': { label: 'Login', color: 'bg-blue-100 text-blue-700' },
  'auth.logout': { label: 'Logout', color: 'bg-gray-100 text-gray-700' },
  'users.create': { label: 'Tambah User', color: 'bg-green-100 text-green-700' },
  'users.update': { label: 'Ubah User', color: 'bg-amber-100 text-amber-700' },
  'users.delete': { label: 'Hapus User', color: 'bg-red-100 text-red-700' },
  'users.toggle-active': { label: 'Aktif/Nonaktif User', color: 'bg-purple-100 text-purple-700' },
  'payments.verify': { label: 'Verif Pembayaran', color: 'bg-emerald-100 text-emerald-700' },
  'payments.reject': { label: 'Tolak Pembayaran', color: 'bg-red-100 text-red-700' },
  'reservations.update-status': { label: 'Ubah Status Reservasi', color: 'bg-teal-100 text-teal-700' },
  'backup.download': { label: 'Backup DB', color: 'bg-indigo-100 text-indigo-700' },
  'backup.restore': { label: 'Restore DB', color: 'bg-orange-100 text-orange-700' },
};

const getActionStyle = (action) => {
  const found = actionLabels[action];
  if (found) return found;
  const parts = action.split('.');
  const name = parts[0] ? parts[0].replace(/_/g, ' ') : action;
  return { label: `${name} ${parts[1] || ''}`, color: 'bg-gray-100 text-gray-700' };
};

const AdminAuditLogs = () => {
  const { roles } = getAuthState();
  const [actionFilter, setActionFilter] = useState('');

  if (!roles.includes('super_admin')) {
    return <Navigate to='/admin' replace />;
  }

  const { data: actionsData } = useQuery({
    queryKey: ['audit-log-actions'],
    queryFn: async () => {
      const res = await getActivityActions();
      return res.data?.data || [];
    },
    staleTime: 60000,
  });

  const actionsList = actionsData || [];

  const { data: logsData, isLoading } = useQuery({
    queryKey: ['audit-logs', actionFilter],
    queryFn: async () => {
      const params = { per_page: 500 };
      if (actionFilter) params.action = actionFilter;
      const res = await getActivityLogs(params);
      return res.data?.data || [];
    },
  });

  const logs = logsData || [];

  const columns = [
    {
      key: 'created_at',
      accessor: 'created_at',
      header: 'Waktu',
      enableSorting: true,
      render: (row) => {
        const d = new Date(row.created_at);
        return d.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      key: 'user',
      header: 'User',
      enableSorting: false,
      render: (row) => (
        <span className="text-sm">
          {row.user?.name || row.user?.email || (
            <span className="text-text-muted italic">System</span>
          )}
        </span>
      ),
    },
    {
      key: 'action',
      accessor: 'action',
      header: 'Aksi',
      enableSorting: true,
      render: (row) => {
        const { label, color } = getActionStyle(row.action);
        return (
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
            {label}
          </span>
        );
      },
    },
    {
      key: 'description',
      accessor: 'description',
      header: 'Deskripsi',
      enableSorting: false,
    },
    {
      key: 'ip_address',
      accessor: 'ip_address',
      header: 'IP',
      enableSorting: true,
      render: (row) => (
        <span className="text-text-muted text-xs font-mono">
          {row.ip_address || '-'}
        </span>
      ),
    },
  ];

  const filterActions = (
    <div className="flex items-center gap-3">
      <select
        value={actionFilter}
        onChange={(e) => setActionFilter(e.target.value)}
        className="px-3 py-2 border border-border-light rounded-xl bg-white text-sm text-text-dark focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
      >
        <option value="">Semua Aksi</option>
        {actionsList.map((act) => (
          <option key={act} value={act}>
            {getActionStyle(act).label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-h2-section text-[28px] text-text-dark">Audit Log</h1>
        <p className="text-text-muted mt-1">Catatan aktivitas seluruh pengguna sistem</p>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        loading={isLoading}
        searchPlaceholder="Cari deskripsi..."
        actions={filterActions}
      />
    </div>
  );
};

export default AdminAuditLogs;
