import { useState } from 'react';
import { getAuthState } from '../../hooks/useAuth';
import { downloadBackup } from '../../services/backup';
import alert from '../../lib/alert';
import { IconDatabase } from '@tabler/icons-react';
import { Navigate } from 'react-router-dom';

const AdminDatabaseBackup = () => {
  const { roles } = getAuthState();
  const [loading, setLoading] = useState(false);

  if (!roles.includes('super_admin')) {
    return <Navigate to='/admin' replace />;
  }

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await downloadBackup();
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const now = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
      link.setAttribute('download', `cat-house-backup-${now}.sql`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      alert.success('Backup database berhasil diunduh');
    } catch (err) {
      alert.error(err.response?.data?.message || 'Gagal mengunduh backup database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-h2-section text-[28px] text-text-dark">Backup Database</h1>
        <p className="text-text-muted mt-1">Unduh cadangan database dalam format SQL</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-border-light shadow-sm p-6 max-w-lg">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0">
            <IconDatabase size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-h3-card text-text-dark mb-1">Backup Database</h3>
            <p className="text-body-small text-text-muted mb-4 leading-relaxed">
              Tombol ini akan mengunduh seluruh data database dalam format file SQL.
              Proses ini mungkin memakan waktu tergantung dari ukuran database.
            </p>
            <button
              onClick={handleDownload}
              disabled={loading}
              className="bg-primary hover:bg-on-primary-container disabled:bg-primary/60 text-white px-6 py-2.5 rounded-xl font-ui-label text-sm transition-colors"
            >
              {loading ? 'Memproses...' : 'Download Backup SQL'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDatabaseBackup;
