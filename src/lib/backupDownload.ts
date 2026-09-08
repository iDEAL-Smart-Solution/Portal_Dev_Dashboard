export type BackupDownloadResult = {
  blob: Blob;
  filename: string;
};

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

const getFallbackFilename = (extension: string | undefined, date: string) => {
  return `database-backup-${date}${extension || ''}`;
};

export const parseDatabaseBackupResponse = (
  blob: Blob,
  contentDisposition: string | null | undefined,
  fallbackDate: string
): BackupDownloadResult => {
  const filenameFromHeader = getFilenameFromDisposition(contentDisposition);
  const extensionFromHeader = filenameFromHeader ? getExtensionFromFilename(filenameFromHeader) : '';
  const fallbackFilename = getFallbackFilename(extensionFromHeader, fallbackDate);

  return {
    blob,
    filename: filenameFromHeader || fallbackFilename,
  };
};
