import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

const DocumentRow = ({ doc, formatDate, getHumanFileSize, getStatusBadgeClass }) => {
  const intl = useIntl();
  const status = doc.status.toLowerCase();
  const navigate = useNavigate();

  const handleRowClick = () => {
    const path = status === 'completed' ? 
      `/documents/${doc.document_id}/analysis` : 
      `/documents/${doc.document_id}/processing`;
    navigate(path);
  };

  return (
    <tr 
      className="hover:bg-gray-100 cursor-pointer transition-colors duration-150" 
      onClick={handleRowClick}
      role="button"
      tabIndex="0"
      aria-label={`Open ${doc.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRowClick();
        }
      }}
    >
      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
        <div>
          <div className="font-medium text-sm md:text-base truncate max-w-[180px] md:max-w-xs">{doc.name}</div>
          {/* Show date on mobile inline, hidden on desktop where it has its own column */}
          <div className="text-xs text-gray-500 md:hidden">{formatDate(doc.uploaded)}</div>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(doc.uploaded)}
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {getHumanFileSize(doc.size_in_bytes)}
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {status === 'completed' ? doc.page_count : 'N/A'}
      </td>
      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(doc.status)}`}>
          {intl.formatMessage({ id: `dashboard.${status}`, defaultMessage: doc.status })}
        </span>
      </td>
    </tr>
  );
};

export default DocumentRow; 