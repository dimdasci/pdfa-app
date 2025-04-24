import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useUploadDocument } from '../../hooks/useApi';
import { Progress } from '@/components/ui/progress';
import ErrorMessage from '../common/ErrorMessage';

// TODO: Implement actual upload logic (API call, progress, error handling)
// TODO: Add onUploadSuccess prop to call after successful upload
const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const intl = useIntl();
  const [documentName, setDocumentName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentUrl, setDocumentUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);

  const { upload, loading: isUploading, error: uploadError, progress: uploadProgress, result: uploadResult, resetUploadState } = useUploadDocument();

  const resetForm = () => {
    setDocumentName('');
    setSelectedFile(null);
    setDocumentUrl('');
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (uploadResult && !uploadError && !isUploading) {
      console.log('Upload successful, calling onUploadSuccess, handleClose, and resetUploadState');
      onUploadSuccess(uploadResult); 
      handleClose();
      resetUploadState();
    }
  }, [uploadResult, uploadError, isUploading, onUploadSuccess, handleClose, resetUploadState]);

  useEffect(() => {
    if (isOpen) {
      resetForm();
      resetUploadState();
    } else {
      resetForm(); 
    }
  }, [isOpen, resetUploadState]);

  const handleFileSelect = (file) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setDocumentUrl('');
      if (!documentName && file.name) {
        setDocumentName(file.name.replace(/\.pdf$/i, ''));
      }
    } else {
      console.error("Invalid file type. Please select a PDF.");
      setSelectedFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };
  
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUrlChange = (e) => {
    setDocumentUrl(e.target.value);
    setSelectedFile(null);
  };
  
  const handleNameChange = (e) => {
    setDocumentName(e.target.value);
  };

  const handleUpload = async () => {
    if (isUploading) return;
    
    await upload({ documentName, file: selectedFile, url: documentUrl });
  };

  const isFormValid = documentName && (selectedFile || documentUrl);
  const isUploadDisabled = !isFormValid || isUploading;

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl flex flex-col">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-semibold">
              <FormattedMessage id="dashboard.upload_pdf_document" defaultMessage="Upload PDF Document" />
            </h2>
            <button 
              onClick={handleClose} 
              disabled={isUploading}
              className={`p-1 -mr-1 ${isUploading ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4 md:p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {uploadError && !isUploading && (
            <ErrorMessage message={uploadError} />
          )}

          {!isUploading && (
            <>
              <div>
                <label htmlFor="documentName" className="block text-sm font-medium text-gray-700 mb-1">
                  <FormattedMessage id="dashboard.document_name" defaultMessage="Document Name" />
                </label>
                <input
                  type="text"
                  id="documentName"
                  value={documentName}
                  onChange={handleNameChange}
                  placeholder={intl.formatMessage({ id: 'dashboard.document_name_placeholder', defaultMessage: 'Enter document name...' })}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  required
                  disabled={isUploading}
                />
              </div>

              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isUploading ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'} ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
                onDragOver={isUploading ? undefined : handleDragOver}
                onDragLeave={isUploading ? undefined : handleDragLeave}
                onDrop={isUploading ? undefined : handleDrop}
                onClick={isUploading ? undefined : triggerFileInput}
              >
                <div className="mb-3">
                  <div className="h-12 w-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                </div>
                <p className="mb-3 text-sm text-gray-600">
                  <FormattedMessage id="dashboard.drag_drop_or" defaultMessage="Drag & drop PDF file here, or" />
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileInputChange} 
                  className="hidden" 
                  accept="application/pdf"
                  disabled={isUploading}
                />
                <button 
                  type="button"
                  className={`font-medium ${isUploading ? 'text-gray-500 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                  disabled={isUploading}
                >
                  <FormattedMessage id="dashboard.select_file_link" defaultMessage="Select File" />
                </button>
                {selectedFile && (
                  <p className="mt-3 text-sm text-green-700 font-medium truncate">
                    {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="flex items-center my-4">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-4 text-sm text-gray-500">
                  <FormattedMessage id="common.or" defaultMessage="Or" />
                </span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>
                
              <div className="space-y-1">
                 <label htmlFor="documentUrl" className="block text-sm font-medium text-gray-700">
                  <FormattedMessage id="dashboard.provide_url" defaultMessage="Provide a URL" />
                </label>
                <input 
                  id="documentUrl"
                  type="url"
                  value={documentUrl}
                  onChange={handleUrlChange}
                  placeholder="https://example.com/document.pdf" 
                  className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" 
                  disabled={isUploading}
                />
                <div className="text-xs text-gray-500 pt-1">
                  <FormattedMessage id="dashboard.supported_formats" defaultMessage="Supported formats: PDF only" />
                </div>
              </div>
            </>
          )}
          
          {isUploading && (
            <div className="space-y-2 pt-4 pb-4">
              <p className="text-sm font-medium text-center text-gray-700">
                <FormattedMessage id="upload.uploading" defaultMessage="Uploading..." />
              </p>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center text-gray-500">{uploadProgress}%</p>
            </div>
          )}
        </div>
        
        <div className="p-4 md:p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            onClick={handleClose} 
            disabled={isUploading}
            className={`px-4 py-2 border rounded ${isUploading ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            <FormattedMessage id="dashboard.cancel" defaultMessage="Cancel" />
          </button>
          <button 
            onClick={handleUpload}
            className={`px-4 py-2 rounded text-white flex items-center justify-center min-w-[80px] ${isUploadDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`} 
            disabled={isUploadDisabled}
          >
            {isUploading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
              <FormattedMessage id="dashboard.upload" defaultMessage="Upload" />
            )}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default UploadModal; 