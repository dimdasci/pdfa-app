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
   * Upload a PDF document via File or URL
   * @param {Object} options - Upload options
   * @param {string} options.documentName - The name for the document
   * @param {File} [options.file] - The PDF file to upload (if file upload)
   * @param {string} [options.url] - The URL of the PDF to upload (if URL upload)
   * @param {Function} [options.onProgress] - Callback for upload progress updates (percentage 0-100)
   * @returns {Promise<Object>} Upload response with document ID and status
   */
  uploadDocument({ documentName, file, url, onProgress }) {
    // Return a Promise to match the async/await pattern used elsewhere
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('documentName', documentName);
      
      if (file) {
        formData.append('file', file);
      } else if (url) {
        formData.append('url', url);
      } else {
        // Should not happen if validation is done in component, but good to check
        return reject(new Error('Either file or url must be provided.'));
      }
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        // Handle missing token early, similar to handleResponse
        window.location.href = 'https://dimosaic.dev'; 
        return reject(new Error('Authentication required'));
      }
      
      const xhr = new XMLHttpRequest();
      
      // Progress Listener
      if (onProgress && xhr.upload) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        };
      }
      
      // Error Handler
      xhr.onerror = () => {
         // Network errors
        reject(new Error('Upload failed due to network error.'));
      };

      // Success Handler
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const responseData = JSON.parse(xhr.responseText);
            resolve(responseData); // Successfully uploaded and parsed response
          } catch (e) {
            reject(new Error('Failed to parse upload response.'));
          }
        } else {
          // Handle API errors similar to handleResponse
          if (xhr.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = 'https://dimosaic.dev';
            reject(new Error('Authentication required'));
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(new Error(errorData.message || `API error: ${xhr.status}`));
            } catch (e) {
              reject(new Error(`API error: ${xhr.status}`));
            }
          }
        }
      };

      // Configure and Send Request
      xhr.open('POST', `${API_BASE_URL}/documents`, true); 
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      // Note: Do NOT set Content-Type when sending FormData, browser handles it
      xhr.send(formData);
    });
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