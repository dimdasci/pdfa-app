// Analysis-specific utility functions

/**
 * Get color for PDF object type
 * @param {string} type - The object type
 * @returns {string} Color code for the specified type
 */
export const getObjectTypeColor = (type) => {
  switch (type) {
    case 'text':
      return '#EAB308'; // yellow-500 (more contrast)
    case 'image':
      return '#22C55E'; // green-500 (more contrast)
    case 'path':
      return '#3B82F6'; // blue-500 (more contrast)
    case 'form':
      return '#EF4444'; // red-500 (more contrast)
    case 'annotation':
      return '#8B5CF6'; // purple-500 (more contrast)
    default:
      return '#6B7280'; // gray-500 (more contrast)
  }
};

/**
 * Gets the CSS class for a status badge
 * @param {string} status - The status string
 * @returns {string} CSS class for the badge
 */
export const getStatusBadgeClass = (status) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
