import React from 'react';
import { FormattedMessage } from 'react-intl';

const EmptyState = ({ onUploadClick }) => {
  return (
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
        onClick={onUploadClick}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        <FormattedMessage id="app.upload_pdf" defaultMessage="Upload PDF" />
      </button>
    </div>
  );
};

export default EmptyState; 