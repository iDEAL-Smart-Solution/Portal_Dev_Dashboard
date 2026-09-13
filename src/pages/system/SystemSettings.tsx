import { Download, ShieldAlert } from 'lucide-react';
import { showError } from '../../lib/notifications';
import { useBackupStore } from '../../stores/backupStore';

export default function SystemSettings() {
  const downloadDatabaseBackup = useBackupStore((state) => state.downloadDatabaseBackup);
  const backingUp = useBackupStore((state) => state.isLoading);

  const triggerBrowserDownload = (blob: Blob, filename: string) => {
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  };

  const handleBackupDatabase = async () => {
    if (backingUp) return;

    try {
      const { blob, filename } = await downloadDatabaseBackup();
      triggerBrowserDownload(blob, filename);
    } catch (error: any) {
      const message = error?.response?.status === 401
        ? 'Your session expired. Please sign in again to download the backup.'
        : error?.response?.data?.message || error?.message || 'Failed to create database backup';

      showError(message);
      console.error('Database backup download failed:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage platform data and system operations
        </p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Database Backup</h2>
              <p className="mt-1 text-sm text-gray-600">
                Download a full database backup from the portal API.
              </p>
            </div>
          </div>

          <button
            onClick={handleBackupDatabase}
            disabled={backingUp}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            <Download className="h-4 w-4" />
            <span>{backingUp ? 'Downloading Backup...' : 'Backup Database'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}