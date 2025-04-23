import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

const ProcessingContainer = () => {
  const intl = useIntl();
  const { documentId } = useParams();
  const navigate = useNavigate();
  
  // Sample data - would come from API
  const document = {
    id: documentId,
    name: 'Contract_Agreement.pdf',
    dateUploaded: '2025-04-17',
    pages: 5,
    size: '1.8 MB',
    status: 'processing',
    // For demonstration, can be switched to 'failed' to show error state
    // status: 'failed',
    estimatedTimeRemaining: '2:35',
    errorMessage: 'Unable to parse content stream at page 3. Invalid syntax at offset 1024.'
  };
  
  const isProcessing = document.status === 'processing';
  const hasFailed = document.status === 'failed';
  
  // Handle back button click
  const handleBackClick = () => {
    navigate('/');
  };
  
  return (
    <div className="flex flex-col p-6 overflow-auto h-full">
      {/* Document Info Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-red-100 rounded flex items-center justify-center mr-4">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{document.name}</h2>
            <div className="text-sm text-gray-500">
              <FormattedMessage 
                id="processing.document_info" 
                defaultMessage="Uploaded on {date} • {pages} pages • {size}"
                values={{
                  date: new Date(document.dateUploaded).toLocaleDateString(),
                  pages: document.pages,
                  size: document.size
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Processing Status Card */}
      {isProcessing && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">
                <FormattedMessage 
                  id="processing.processing_document" 
                  defaultMessage="Processing Document" 
                />
              </h3>
              <span className="text-sm text-gray-500">
                <FormattedMessage 
                  id="processing.time_remaining" 
                  defaultMessage="Estimated time remaining: {time}"
                  values={{ time: document.estimatedTimeRemaining }}
                />
              </span>
            </div>
            
            {/* Infinite Loading Indicator */}
            <div className="relative pt-1 mb-4">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div className="animate-pulse w-full h-full bg-blue-600 rounded"></div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              <FormattedMessage 
                id="processing.analyzing_message" 
                defaultMessage="We're analyzing your PDF document structure. This might take a few minutes depending on the complexity of your document."
              />
            </p>
            
            {/* Control button */}
            <div className="flex justify-start">
              <button className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
                <FormattedMessage 
                  id="processing.cancel" 
                  defaultMessage="Cancel Processing"
                />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {hasFailed && (
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
            <div className="bg-gray-100 rounded p-4 font-mono text-xs text-gray-700 mb-4">
              {document.errorMessage}
            </div>
          </div>
          
          {/* Control buttons */}
          <div className="flex space-x-3">
            <button onClick={handleBackClick} className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
              <FormattedMessage 
                id="app.back_to_dashboard" 
                defaultMessage="Back to Documents"
              />
            </button>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center">
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