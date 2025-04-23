/**
 * API Service Layer
 * Handles all communication with the backend API
 */

// Read the base URL from environment variables
// Provide a fallback in case the variable is somehow not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; // Default to /api for safety in dev if .env missing
console.log(`[API Service] Using API Base URL: ${API_BASE_URL}`); // Log for verification

/**
 * Get authentication headers including the JWT token
 * @returns {Object} Headers object with Authorization and Content-Type
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Process API responses and handle errors
 * @param {Response} response - Fetch API response object
 * @returns {Promise} Resolved with JSON data or rejected with error
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    // Handle common error status codes
    if (response.status === 401) {
      // Clear token and redirect to main site for re-authentication
      localStorage.removeItem('authToken');
      window.location.href = 'https://dimosaic.dev';
      throw new Error('Authentication required');
    }
    
    // Try to parse error message from response if possible
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    } catch (e) {
      throw new Error(`API error: ${response.status}`);
    }
  }
  
  return response.json();
};

/**
 * API client with methods for all endpoints
 */
const api = {
  /**
   * Fetch documents list with optional filters
   * @param {string} status - Filter by document status (processing, completed, failed)
   * @param {number} limit - Maximum number of documents to retrieve
   * @returns {Promise<Array>} List of documents
   */
  async fetchDocuments(status, limit = 20) {
    const queryParams = new URLSearchParams();
    if (status && status !== 'all') {
      queryParams.append('status', status);
    }
    queryParams.append('limit', limit);
    
    const response = await fetch(`${API_BASE_URL}/documents?${queryParams}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
  
  /**
   * Upload a PDF document
   * @param {File} file - The PDF file to upload
   * @returns {Promise<Object>} Upload response with document ID and status
   */
  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Content-Type is automatically set by the browser for FormData
      },
      body: formData
    });
    
    return handleResponse(response);
  },
  
  /**
   * Get document details
   * @param {string} docId - Document ID
   * @returns {Promise<Object>} Document summary with pages information
   */
  async getDocumentDetails(docId) {
    const response = await fetch(`${API_BASE_URL}/documents/${docId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
  
  /**
   * Get page bundle with all layer and object information
   * @param {string} docId - Document ID
   * @param {number} pageNumber - Page number (1-based)
   * @returns {Promise<Object>} Page bundle with layers and objects
   */
  async getPageBundle(docId, pageNumber) {
    const response = await fetch(`${API_BASE_URL}/documents/${docId}/pages/${pageNumber}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
  
  /**
   * Get API version
   * @returns {Promise<Object>} API version information
   */
  async getVersion() {
    const response = await fetch(`${API_BASE_URL}/version`, {
      method: 'GET',
    });
    
    return handleResponse(response);
  }
};

export default api; 