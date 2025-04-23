import React from 'react';
import { FormattedMessage } from 'react-intl';
import DocumentRow from './DocumentRow'; // Will be created next

const DocumentTable = ({ loading, error, filteredDocuments, formatDate, getHumanFileSize, getStatusBadgeClass }) => {
  return (
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
                      start: filteredDocuments.length > 0 ? 1 : 0,
                      end: filteredDocuments.length,
                      total: filteredDocuments.length // Note: This assumes no real pagination yet
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
  );
};

export default DocumentTable; 