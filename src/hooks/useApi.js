import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for making API calls with loading and error states
 * @param {Function} apiMethod - API method to call (from api service)
 * @param {Array} params - Parameters to pass to the API method
 * @param {boolean} immediate - Whether to call the API immediately
 * @returns {Object} Object with data, loading, error, and execute function
 */
export function useApi(apiMethod, params = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  
  // Memoize the execute function to avoid unnecessary re-renders
  const execute = useCallback(async (...callParams) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use provided params or the ones passed to execute
      const paramsToUse = callParams.length > 0 ? callParams : params;
      const result = await apiMethod(...paramsToUse);
      
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiMethod, ...params]);
  
  // Call the API immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  
  return { data, loading, error, execute };
}

/**
 * Hook for fetching documents list
 * @param {string} status - Filter by status
 * @param {number} limit - Maximum number of documents
 * @returns {Object} Object with documents, loading, error, and refetch function
 */
export function useDocuments(status = 'all', limit = 20) {
  const { 
    data: documents, 
    loading, 
    error, 
    execute: refetch 
  } = useApi(api.fetchDocuments, [status, limit]);
  
  return { documents, loading, error, refetch };
}

/**
 * Hook for fetching document details
 * @param {string} docId - Document ID
 * @returns {Object} Object with document, loading, error, and refetch function
 */
export function useDocument(docId) {
  const { 
    data: document, 
    loading, 
    error, 
    execute: refetch 
  } = useApi(api.getDocumentDetails, [docId], docId !== undefined);
  
  return { document, loading, error, refetch };
}

/**
 * Hook for fetching page bundle
 * @param {string} docId - Document ID
 * @param {number} pageNumber - Page number
 * @returns {Object} Object with pageBundle, loading, error, and refetch function
 */
export function usePageBundle(docId, pageNumber) {
  const { 
    data: pageBundle, 
    loading, 
    error, 
    execute: refetch 
  } = useApi(api.getPageBundle, [docId, pageNumber], docId !== undefined && pageNumber !== undefined);
  
  return { pageBundle, loading, error, refetch };
}

/**
 * Hook for uploading a document (file or URL)
 * Manages loading, error, and progress state internally.
 * @returns {Object} Object with upload function, loading, error, progress, and result states
 */
export function useUploadDocument() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // Not immediate, starts on call
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0); // Track upload progress

  // Function to reset the hook's state
  const resetUploadState = useCallback(() => {
    setResult(null);
    setLoading(false);
    setError(null);
    setProgress(0);
  }, []); // No dependencies, setters are stable

  // The function components will call to initiate the upload
  const upload = useCallback(async ({ documentName, file, url }) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setResult(null);

    // Define the progress handler to update state
    const handleProgress = (percentComplete) => {
      setProgress(percentComplete);
    };

    try {
      // Call the updated service function, passing the progress handler
      const uploadResult = await api.uploadDocument({ 
        documentName, 
        file, 
        url, 
        onProgress: handleProgress 
      });
      setResult(uploadResult);
      setProgress(100); // Ensure progress hits 100 on success
      return uploadResult; // Return result on success
    } catch (err) {
      setError(err.message || 'Upload failed');
      setProgress(0); // Reset progress on error
      return null; // Return null on error
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed for useCallback as it uses state setters

  // Return the reset function along with others
  return { upload, loading, error, progress, result, resetUploadState };
}

/**
 * Hook for fetching API version
 * @returns {Object} Object with version info, loading and error states
 */
export function useApiVersion() {
  const { 
    data, 
    loading, 
    error 
  } = useApi(api.getVersion);
  
  return { 
    version: data?.version || 'Beta', 
    loading, 
    error 
  };
} 