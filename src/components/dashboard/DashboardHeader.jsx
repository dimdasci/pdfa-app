import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const DashboardHeader = ({ searchTerm, statusFilter, onSearchChange, onFilterChange }) => {
  const intl = useIntl();

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 space-y-3 md:space-y-0">
      <h2 className="text-xl font-semibold">
        <FormattedMessage id="dashboard.your_documents" defaultMessage="Your Documents" />
      </h2>
      
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
            onChange={onSearchChange}
          />
        </div>
        <select 
          className="border border-gray-300 rounded p-2 w-full md:w-auto"
          value={statusFilter}
          onChange={onFilterChange}
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
  );
};

export default DashboardHeader; 