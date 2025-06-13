// Common formatting utilities for the application

/**
 * Convert bytes to human-readable file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size with unit
 */
export const getHumanFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) {
    return 'N/A';
  }
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * Format date to local date string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};
