import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDocument } from '../../hooks/useApi';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const ProcessingContainer = () => {
  const intl = useIntl();
  const { documentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Fetch document details from API
  const { document, loading, error, refetch } = useDocument(documentId);
  
  // Convert bytes to human-readable file size
  const getHumanFileSize = (bytes) => {
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
  
  // Format date to local date string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  const isProcessing = document?.status === 'processing';
  const hasFailed = document?.status === 'failed';
  
  // Handle back button click
  const handleBackClick = () => {
    // Preserve search params when navigating back (for sorting, filtering, pagination)
    const urlParams = new URLSearchParams(location.search);
    
    // Keep only the sort, filter, and pagination related params
    const sortParams = new URLSearchParams();
    ['sortField', 'sortDir', 'search', 'status', 'page'].forEach(param => {
      if (urlParams.has(param)) {
        sortParams.set(param, urlParams.get(param));
      }
    });
    
    const searchParamsString = sortParams.toString();
    navigate({
      pathname: '/',
      search: searchParamsString ? `?${searchParamsString}` : ''
    });
  };
  
  return (
    <div className="flex flex-col p-6 overflow-auto h-full">
      {/* Loading state */}
      {loading && (
        <Loading message={intl.formatMessage({
          id: "processing.loading",
          defaultMessage: "Loading document information..."
        })} />
      )}
      
      {/* Error state */}
      {error && !loading && (
        <ErrorMessage 
          message={error}
          onRetry={refetch}
        />
      )}
      
      {document && !loading && !error && (
        <>
          {/* Document Info Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold">{document.name}</h2>
              <div className="text-sm text-gray-600 mb-1">
                #{document.document_id}
              </div>
              <div className="text-sm text-gray-500">
                <FormattedMessage 
                  id="processing.document_info" 
                  defaultMessage="Uploaded on {date} • {size}"
                  values={{
                    date: formatDate(document.uploaded),
                    size: getHumanFileSize(document.size_in_bytes)
                  }}
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {document.source === 'file' ? (
                  <FormattedMessage
                    id="processing.document_source"
                    defaultMessage="Source: {source}"
                    values={{
                      source: intl.formatMessage({id: "processing.source_file", defaultMessage: "File upload"})
                    }}
                  />
                ) : document.source_url ? (
                  <>
                    <FormattedMessage
                      id="processing.document_source_url"
                      defaultMessage="Source: "
                    />
                    <a 
                      href={document.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {document.source_url}
                    </a>
                  </>
                ) : (
                  <FormattedMessage
                    id="processing.document_source"
                    defaultMessage="Source: {source}"
                    values={{
                      source: intl.formatMessage({id: "processing.source_unknown", defaultMessage: "Unknown"})
                    }}
                  />
                )}
              </div>
              
              {isProcessing && (
                <div className="mt-4 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  <span className="text-sm text-blue-600 font-medium">
                    <FormattedMessage 
                      id="processing.status_processing" 
                      defaultMessage="Processing document..."
                    />
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      
      {/* Error State */}
      {document && hasFailed && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-4 text-red-600">
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-medium">
              <FormattedMessage 
                id="processing.failed" 
                defaultMessage="Processing Failed"
              />
            </h3>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <FormattedMessage 
                id="processing.error_message" 
                defaultMessage="We encountered an error while processing your document. This might be due to:"
              />
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mb-4 ml-2">
              <li>
                <FormattedMessage 
                  id="processing.error_reason_1" 
                  defaultMessage="Corrupted PDF file"
                />
              </li>
              <li>
                <FormattedMessage 
                  id="processing.error_reason_2" 
                  defaultMessage="Unsupported PDF structure"
                />
              </li>
              <li>
                <FormattedMessage 
                  id="processing.error_reason_3" 
                  defaultMessage="Password protection or encryption"
                />
              </li>
            </ul>
            {document.info && (
              <div className="bg-gray-100 rounded p-4 font-mono text-xs text-gray-700 mb-4">
                {document.info}
              </div>
            )}
          </div>
          
          {/* Control buttons */}
          <div className="flex space-x-3">
            <button onClick={handleBackClick} className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
              <FormattedMessage 
                id="app.back_to_dashboard" 
                defaultMessage="Back to Documents"
              />
            </button>
            <button 
              onClick={refetch}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center"
            >
              <svg className="h-4 w-4 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <FormattedMessage 
                id="processing.retry" 
                defaultMessage="Retry Processing"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingContainer; 