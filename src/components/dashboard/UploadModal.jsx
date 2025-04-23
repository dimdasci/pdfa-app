import React from 'react';
import { FormattedMessage } from 'react-intl';

// TODO: Implement actual upload logic (state for file/URL, handlers)
const UploadModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-3/4 max-w-3xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              <FormattedMessage id="dashboard.upload_pdf_document" defaultMessage="Upload PDF Document" />
            </h2>
            <button 
              onClick={onClose} // Use the onClose prop
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
            onClick={onClose} // Use the onClose prop
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 mr-2"
          >
            <FormattedMessage id="dashboard.cancel" defaultMessage="Cancel" />
          </button>
          {/* TODO: Enable this button when a file/URL is ready */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled>
            <FormattedMessage id="dashboard.upload" defaultMessage="Upload" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal; 