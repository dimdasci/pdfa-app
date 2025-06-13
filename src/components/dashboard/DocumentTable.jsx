import React from 'react';
import { FormattedMessage } from 'react-intl';
import DocumentRow from './DocumentRow';

const DocumentTable = ({ 
  loading, 
  error, 
  filteredDocuments, 
  formatDate, 
  getHumanFileSize, 
  getStatusBadgeClass,
  sortField,
  sortDirection,
  onSortChange,
  currentPage,
  onPageChange,
  itemsPerPage,
  totalItems
}) => {
  
  // Helper to render sort indicators
  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    
    return (
      <span className="ml-1 inline-block">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };
  
  // Calculate pagination values
  const lastIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const firstIndex = totalItems > 0 ? Math.min((currentPage - 1) * itemsPerPage + 1, totalItems) : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Get the current page of documents
  const currentDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto mb-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSortChange('name')}
            >
              <div className="flex items-center">
                <FormattedMessage id="dashboard.document_name" defaultMessage="Document Name" />
                {getSortIndicator('name')}
              </div>
            </th>
            <th 
              className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSortChange('uploaded')}
            >
              <div className="flex items-center">
                <FormattedMessage id="dashboard.date_uploaded" defaultMessage="Uploaded" />
                {getSortIndicator('uploaded')}
              </div>
            </th>
            <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                <FormattedMessage id="dashboard.size" defaultMessage="Size" />
              </div>
            </th>
            <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                <FormattedMessage id="dashboard.pages" defaultMessage="Pages" />
              </div>
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                <FormattedMessage id="dashboard.status" defaultMessage="Status" />
              </div>
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
            currentDocuments.map((doc) => (
              <DocumentRow 
                key={doc.document_id}
                doc={doc}
                formatDate={formatDate}
                getHumanFileSize={getHumanFileSize}
                getStatusBadgeClass={getStatusBadgeClass}
              />
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
                      start: totalItems > 0 ? firstIndex : 0,
                      end: lastIndex,
                      total: totalItems
                    }}
                  />
                </p>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  {/* First page button */}
                  <button 
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    aria-label="First page"
                  >
                    <span className="sr-only">
                      <FormattedMessage id="dashboard.first" defaultMessage="First" />
                    </span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M8.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L4.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Previous page button */}
                  <button 
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">
                      <FormattedMessage id="dashboard.previous" defaultMessage="Previous" />
                    </span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Current page indicator */}
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-50">
                    {currentPage} / {totalPages || 1}
                  </button>
                  
                  {/* Next page button */}
                  <button 
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    <span className="sr-only">
                      <FormattedMessage id="dashboard.next" defaultMessage="Next" />
                    </span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Last page button */}
                  <button 
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage >= totalPages}
                    aria-label="Last page"
                  >
                    <span className="sr-only">
                      <FormattedMessage id="dashboard.last" defaultMessage="Last" />
                    </span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M11.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L15.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default DocumentTable; 