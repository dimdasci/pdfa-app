import React from 'react';
import { FormattedMessage } from 'react-intl';

/**
 * Toolbar component for the PDF viewer with zoom controls and page navigation
 */
const ViewerToolbar = ({ 
  currentPage,
  totalPages,
  onPageChange,
  onPageNavigation
}) => {
  return (
    <div className="bg-white shadow-sm p-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Zoom controls */}
        <div className="flex items-center space-x-1">
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
        </div>
        
        {/* Page navigation */}
        <div className="flex items-center space-x-1 border-l pl-4">
          <span className="text-sm">
            <FormattedMessage id="analysis.page" defaultMessage="Page" />
          </span>
          <div className="flex items-center border rounded overflow-hidden">
            <button 
              className="px-2 py-1 hover:bg-gray-100"
              onClick={() => onPageNavigation('prev')}
              disabled={currentPage <= 1}
              title="Previous page"
            >
              <svg className={`h-3 w-3 ${currentPage <= 1 ? 'text-gray-300' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <input 
              type="text" 
              value={currentPage} 
              onChange={onPageChange}
              className="w-8 text-center text-sm border-x" 
            />
            <button 
              className="px-2 py-1 hover:bg-gray-100"
              onClick={() => onPageNavigation('next')}
              disabled={currentPage >= totalPages}
              title="Next page"
            >
              <svg className={`h-3 w-3 ${currentPage >= totalPages ? 'text-gray-300' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <span className="text-sm text-gray-500">
            <FormattedMessage 
              id="analysis.of_pages" 
              defaultMessage="of {pages}"
              values={{ pages: totalPages || 0 }}
            />
          </span>
        </div>
        
        {/* Zoom presets */}
        <div className="flex items-center space-x-1 border-l pl-4">
          <button className="px-2 py-1 text-sm border rounded hover:bg-gray-100">
            <FormattedMessage id="analysis.fit_width" defaultMessage="Fit Width" />
          </button>
          <select className="text-sm border rounded px-2 py-1">
            <option>100%</option>
            <option>150%</option>
            <option>200%</option>
            <option>75%</option>
            <option>50%</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ViewerToolbar;
