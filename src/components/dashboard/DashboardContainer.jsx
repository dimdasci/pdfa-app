import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useDocuments } from '../../hooks/useApi';

const DashboardContainer = () => {
  const intl = useIntl();
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Fetch documents from API - without status filter
  const { documents, loading, error, refetch } = useDocuments();
  
  // Placeholder for upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Filter documents based on search term and status
  const filteredDocuments = documents ? documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  }) : [];
  
  // Calculate file size in human-readable format
  const getHumanFileSize = (pageCount, status) => {
    // Only completed documents have page count
    if (status.toLowerCase() !== 'complete' || pageCount === undefined) {
      return 'N/A';
    }
    
    // This is a placeholder since API doesn't return file size
    // We're estimating based on page count (rough approximation)
    const estimatedSize = pageCount * 0.2; // Assume 200KB per page on average
    return estimatedSize > 1 ? `${estimatedSize.toFixed(1)} MB` : `${(estimatedSize * 1000).toFixed(0)} KB`;
  };

  // Format date to local date string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Get appropriate status badge class
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="flex flex-col p-4 md:p-6 overflow-auto h-full">
      {/* Document List Section */}
      <section>
        {/* Mobile-optimized header and search/filter section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 space-y-3 md:space-y-0">
          <h2 className="text-xl font-semibold">
            <FormattedMessage id="dashboard.your_documents" defaultMessage="Your Documents" />
          </h2>
          
          {/* Stack filters vertically on mobile, horizontally on desktop */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:items-center md:gap-3">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder={intl.formatMessage({ id: 'dashboard.search_documents', defaultMessage: 'Search documents...' })}
                className="border border-gray-300 rounded pl-10 pr-4 py-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="border border-gray-300 rounded p-2 w-full md:w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">
                {intl.formatMessage({ id: 'dashboard.all_statuses', defaultMessage: 'All statuses' })}
              </option>
              <option value="complete">
                {intl.formatMessage({ id: 'dashboard.complete', defaultMessage: 'Complete' })}
              </option>
              <option value="processing">
                {intl.formatMessage({ id: 'dashboard.processing', defaultMessage: 'Processing' })}
              </option>
              <option value="failed">
                {intl.formatMessage({ id: 'dashboard.failed', defaultMessage: 'Failed' })}
              </option>
            </select>
          </div>
        </div>
        
        {/* Document Table - Make responsive with horizontal scroll on mobile */}
        <div className="bg-white rounded-lg shadow overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FormattedMessage id="dashboard.document_name" defaultMessage="Document Name" />
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FormattedMessage id="dashboard.date_uploaded" defaultMessage="Date Uploaded" />
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FormattedMessage id="dashboard.pages" defaultMessage="Pages" />
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FormattedMessage id="dashboard.status" defaultMessage="Status" />
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FormattedMessage id="dashboard.actions" defaultMessage="Actions" />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 md:px-6 py-4 text-center text-gray-500">
                    <FormattedMessage id="dashboard.loading" defaultMessage="Loading documents..." />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-4 md:px-6 py-4 text-center text-red-500">
                    <FormattedMessage id="dashboard.error" defaultMessage="Error loading documents" />
                  </td>
                </tr>
              ) : filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <tr key={doc.document_id} className="hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 md:h-10 md:w-10 bg-red-100 rounded flex items-center justify-center mr-3">
                          <svg className="h-5 w-5 md:h-6 md:w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-sm md:text-base truncate max-w-[120px] md:max-w-xs">{doc.name}</div>
                          <div className="text-xs md:text-sm text-gray-500">{getHumanFileSize(doc.page_count, doc.status)}</div>
                          {/* Show date on mobile inline, hidden on desktop where it has its own column */}
                          <div className="text-xs text-gray-500 md:hidden">{formatDate(doc.uploaded)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(doc.uploaded)}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.status.toLowerCase() === 'complete' ? doc.page_count : 'N/A'}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(doc.status)}`}>
                        {intl.formatMessage({ id: `dashboard.${doc.status.toLowerCase()}`, defaultMessage: doc.status })}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {doc.status.toLowerCase() === 'complete' && (
                        <>
                          <Link to={`/documents/${doc.document_id}/analysis`} className="text-blue-600 hover:text-blue-900 mr-3">
                            <FormattedMessage id="dashboard.analyze" defaultMessage="Analyze" />
                          </Link>
                          <button className="text-gray-600 hover:text-gray-900">
                            <FormattedMessage id="dashboard.delete" defaultMessage="Delete" />
                          </button>
                        </>
                      )}
                      {(doc.status.toLowerCase() === 'processing' || doc.status.toLowerCase() === 'failed') && (
                        <>
                          <Link to={`/documents/${doc.document_id}/processing`} className="text-blue-600 hover:text-blue-900 mr-3">
                            <FormattedMessage id="dashboard.view" defaultMessage="View" />
                          </Link>
                          {doc.status.toLowerCase() === 'processing' && (
                            <button className="text-gray-600 hover:text-gray-900">
                              <FormattedMessage id="dashboard.cancel" defaultMessage="Cancel" />
                            </button>
                          )}
                          {doc.status.toLowerCase() === 'failed' && (
                            <button className="text-yellow-600 hover:text-yellow-900">
                              <FormattedMessage id="dashboard.retry" defaultMessage="Retry" />
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 md:px-6 py-4 text-center text-gray-500">
                    <FormattedMessage id="dashboard.no_documents_found" defaultMessage="No documents found" />
                  </td>
                </tr>
              )}
            </tbody>
            
            {/* Pagination - Simplified for mobile */}
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td colSpan="5" className="px-4 md:px-6 py-3">
                  <div className="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-2 md:space-y-0">
                    <p className="text-xs md:text-sm text-gray-700 text-center md:text-left">
                      <FormattedMessage 
                        id="dashboard.showing_records" 
                        defaultMessage="Showing {start} to {end} of {total} documents" 
                        values={{
                          start: filteredDocuments.length > 0 ? 1 : 0,
                          end: filteredDocuments.length,
                          total: filteredDocuments.length
                        }}
                      />
                    </p>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">
                          <FormattedMessage id="dashboard.previous" defaultMessage="Previous" />
                        </span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">
                          <FormattedMessage id="dashboard.next" defaultMessage="Next" />
                        </span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Empty State (Hidden if there are documents) */}
        {!loading && !error && documents && documents.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="h-20 w-20 mx-auto bg-gray-200 rounded-full mb-4 flex items-center justify-center">
              <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">
              <FormattedMessage id="dashboard.no_documents_yet" defaultMessage="No documents yet" />
            </h3>
            <p className="text-gray-500 mb-4">
              <FormattedMessage id="dashboard.upload_first_pdf" defaultMessage="Upload your first PDF document to start analyzing its structure" />
            </p>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              <FormattedMessage id="app.upload_pdf" defaultMessage="Upload PDF" />
            </button>
          </div>
        )}
      </section>
      
      {/* Upload Modal (hidden by default) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-3/4 max-w-3xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  <FormattedMessage id="dashboard.upload_pdf_document" defaultMessage="Upload PDF Document" />
                </h2>
                <button 
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <div className="mb-4">
                    <div className="h-16 w-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                  </div>
                  <p className="mb-4">
                    <FormattedMessage id="dashboard.drag_drop" defaultMessage="Drag & drop PDF file here" />
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    <FormattedMessage id="dashboard.select_file" defaultMessage="Select File" />
                  </button>
                </div>
                
                <div className="flex-1 border border-gray-300 rounded-lg p-8 bg-white">
                  <h3 className="font-medium mb-4">
                    <FormattedMessage id="dashboard.provide_url" defaultMessage="Or provide a URL" />
                  </h3>
                  <div className="flex mb-4">
                    <input 
                      type="text" 
                      placeholder="https://example.com/document.pdf" 
                      className="flex-1 border border-gray-300 rounded-l p-2" 
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-r">
                      <FormattedMessage id="dashboard.fetch" defaultMessage="Fetch" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    <FormattedMessage id="dashboard.supported_formats" defaultMessage="Supported formats: PDF only" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 mr-2"
              >
                <FormattedMessage id="dashboard.cancel" defaultMessage="Cancel" />
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled>
                <FormattedMessage id="dashboard.upload" defaultMessage="Upload" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContainer; 