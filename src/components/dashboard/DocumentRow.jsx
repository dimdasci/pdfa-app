import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

const DocumentRow = ({ doc, formatDate, getHumanFileSize, getStatusBadgeClass }) => {
  const intl = useIntl();
  const status = doc.status.toLowerCase();

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-8 w-8 md:h-10 md:w-10 bg-red-100 rounded flex items-center justify-center mr-3">
            {/* TODO: Maybe use a dynamic icon based on file type or status? */}
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
        {status === 'complete' ? doc.page_count : 'N/A'}
      </td>
      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(doc.status)}`}>
          {intl.formatMessage({ id: `dashboard.${status}`, defaultMessage: doc.status })}
        </span>
      </td>
      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
        {status === 'complete' && (
          <>
            <Link to={`/documents/${doc.document_id}/analysis`} className="text-blue-600 hover:text-blue-900 mr-3">
              <FormattedMessage id="dashboard.analyze" defaultMessage="Analyze" />
            </Link>
            <button className="text-gray-600 hover:text-gray-900">
              <FormattedMessage id="dashboard.delete" defaultMessage="Delete" />
            </button>
          </>
        )}
        {(status === 'processing' || status === 'failed') && (
          <>
            <Link to={`/documents/${doc.document_id}/processing`} className="text-blue-600 hover:text-blue-900 mr-3">
              <FormattedMessage id="dashboard.view" defaultMessage="View" />
            </Link>
            {status === 'processing' && (
              <button className="text-gray-600 hover:text-gray-900">
                <FormattedMessage id="dashboard.cancel" defaultMessage="Cancel" />
              </button>
            )}
            {status === 'failed' && (
              <button className="text-yellow-600 hover:text-yellow-900">
                <FormattedMessage id="dashboard.retry" defaultMessage="Retry" />
              </button>
            )}
          </>
        )}
      </td>
    </tr>
  );
};

export default DocumentRow; 