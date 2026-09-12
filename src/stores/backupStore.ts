import { create } from 'zustand';
import axiosInstance from '../config/axios';
import { showSuccess } from '../lib/notifications';
import {
  parseDatabaseBackupResponse,
  BackupDownloadResult,
} from '../lib/backupDownload';

interface BackupState {
  isLoading: boolean;
  error: string | null;
  downloadDatabaseBackup: () => Promise<BackupDownloadResult>;
  clearError: () => void;
}

export const useBackupStore = create<BackupState>((set) => ({
  isLoading: false,
  error: null,

  downloadDatabaseBackup: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.post('/BackupDataBase/backup', {}, {
        responseType: 'blob',
        headers: {
          'X-Skip-Generic-Toast': 'true',
        },
      });
      const result = parseDatabaseBackupResponse(
        response.data,
        response.headers?.['content-disposition'],
        new Date().toISOString().slice(0, 10)
      );

      showSuccess('Backup download started successfully.');
      set({ isLoading: false });
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create database backup';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
