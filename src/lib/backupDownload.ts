import axiosInstance from '../config/axios';
import { showSuccess } from './notifications';

type BackupDownloadResult = {
  blob: Blob;
  filename: string;
};

const BACKUP_ENDPOINT = '/BackupDataBase/backup';

const getFilenameFromDisposition = (contentDisposition?: string | null) => {
  if (!contentDisposition) return null;

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1].replace(/"/g, ''));
  }

  const quotedMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (quotedMatch?.[1]) {
    return quotedMatch[1].trim();
  }

  return null;
};

const getExtensionFromFilename = (filename: string) => {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex >= 0 ? filename.slice(lastDotIndex) : '';
};

const getFallbackFilename = (extension?: string) => {
  const date = new Date().toISOString().slice(0, 10);
  return `database-backup-${date}${extension || ''}`;
};

export const downloadDatabaseBackup = async (): Promise<BackupDownloadResult> => {
  const response = await axiosInstance.post(BACKUP_ENDPOINT, {}, {
    responseType: 'blob',
    headers: {
      'X-Skip-Error-Toast': 'true',
    },
  });

  const contentDisposition = response.headers?.['content-disposition'];
  const filenameFromHeader = getFilenameFromDisposition(contentDisposition);
  const extensionFromHeader = filenameFromHeader ? getExtensionFromFilename(filenameFromHeader) : '';
  const fallbackFilename = getFallbackFilename(extensionFromHeader);
  const filename = filenameFromHeader || fallbackFilename;

  showSuccess('Backup download started successfully.');

  return {
    blob: response.data,
    filename,
  };
};
