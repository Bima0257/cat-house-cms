import { useState } from 'react';
import { getAuthState } from '../../hooks/useAuth';
import { downloadBackup, restoreBackup } from '../../services/backup';
import alert from '../../lib/alert';
import {
  IconDatabase,
  IconUpload,
  IconAlertTriangle,
  IconDownload,
  IconServer,
} from '@tabler/icons-react';
import { Navigate } from 'react-router-dom';

const AdminDatabaseBackup = () => {
  const { roles } = getAuthState();
  const [backingUp, setBackingUp] = useState(false);
  const [file, setFile] = useState(null);
  const [restoring, setRestoring] = useState(false);

  if (!roles.includes('super_admin')) {
    return <Navigate to='/admin' replace />;
  }

  const handleDownload = async () => {
    setBackingUp(true);
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
      setBackingUp(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleRestore = () => {
    if (!file) return;

    alert.confirm('Apakah kamu yakin?', {
      description:
        'Restore akan menimpa seluruh data yang ada dengan data dari file backup. Tindakan ini tidak bisa dibatalkan.',
      confirmLabel: 'Ya, Restore',
      cancelLabel: 'Batal',
      onConfirm: async () => {
        setRestoring(true);
        try {
          await restoreBackup(file);
          alert.success('Database berhasil direstore');
          setFile(null);
        } catch (err) {
          alert.error(err.response?.data?.message || 'Gagal merestore database');
        } finally {
          setRestoring(false);
        }
      },
    });
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <IconServer size={28} className="text-primary" />
          <h1 className="font-h2-section text-[28px] text-text-dark">Database</h1>
        </div>
        <p className="text-text-muted mt-1">Backup dan restore database MySQL</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="bg-surface-container-lowest rounded-xl border border-border-light shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
              <IconDownload size={22} />
            </div>
            <div>
              <h3 className="font-h3-card text-text-dark">Backup Database</h3>
              <p className="text-xs text-text-muted">Unduh seluruh data dalam format SQL</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <p className="text-body-small text-text-muted leading-relaxed mb-4">
              Proses ini akan mengexport seluruh tabel, data, serta struktur database
              ke dalam satu file SQL yang siap diunduh.
            </p>
            <button
              onClick={handleDownload}
              disabled={backingUp}
              className="w-full bg-primary hover:bg-on-primary-container disabled:bg-primary/60 text-white px-6 py-3 rounded-xl font-ui-label text-sm transition-colors flex items-center justify-center gap-2"
            >
              <IconDatabase size={18} />
              {backingUp ? 'Memproses backup...' : 'Download Backup SQL'}
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-border-light shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <IconUpload size={22} />
            </div>
            <div>
              <h3 className="font-h3-card text-text-dark">Restore Database</h3>
              <p className="text-xs text-text-muted">Kembalikan data dari file SQL</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <p className="text-body-small text-text-muted leading-relaxed mb-4">
              Pilih file SQL hasil backup untuk mengembalikan database ke kondisi
              sebelumnya. <span className="font-semibold text-red-600">Seluruh data yang ada akan ditimpa.</span>
            </p>
            <div className="space-y-3">
              <label className="block">
                <input
                  type="file"
                  accept=".sql,.txt"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-text-muted file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-ui-label file:bg-secondary-container file:text-secondary hover:file:bg-secondary-container/80 transition-colors cursor-pointer"
                />
              </label>
              <button
                onClick={handleRestore}
                disabled={!file || restoring}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/60 text-white px-6 py-3 rounded-xl font-ui-label text-sm transition-colors flex items-center justify-center gap-2"
              >
                <IconAlertTriangle size={18} />
                {restoring ? 'Merestore database...' : 'Restore Database'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDatabaseBackup;
