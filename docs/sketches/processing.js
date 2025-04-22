import React from 'react';

const ImprovedProcessingWireframe = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header - Consistent with dashboard */}
      <header className="bg-white shadow p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button className="mr-4 text-gray-600 hover:bg-gray-100 p-1 rounded" title="Back to Documents">
              <div className="h-6 w-6 bg-gray-400 rounded"></div>
            </button>
            <h1 className="text-xl font-bold">PDF Structure Analysis Tool</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
              <div className="h-4 w-4 bg-white rounded mr-2"></div>
              <span>Upload PDF</span>
            </button>
            <span className="text-gray-600">User Name</span>
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Document Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-red-100 rounded flex items-center justify-center mr-4">
              <div className="h-8 w-8 bg-red-400 rounded"></div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Contract_Agreement.pdf</h2>
              <div className="text-sm text-gray-500">Uploaded on Apr 17, 2025 • 5 pages • 1.8 MB</div>
            </div>
          </div>
        </div>
        
        {/* Processing Status Card - With infinite loading indicator */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Processing Document</h3>
              <span className="text-sm text-gray-500">Estimated time remaining: 2:35</span>
            </div>
            
            {/* Infinite Loading Indicator */}
            <div className="relative pt-1 mb-4">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div className="animate-pulse w-full h-full bg-blue-600 rounded"></div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              We're analyzing your PDF document structure. This might take a few minutes depending on the complexity of your document.
            </p>
            
            {/* Control moved into the panel */}
            <div className="flex justify-start">
              <button className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
                Cancel Processing
              </button>
            </div>
          </div>
        </div>
        
        {/* Error State Version (Hidden by default, would be shown if processing fails) */}
        <div className="hidden bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-4 text-red-600">
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <div className="h-5 w-5 bg-red-500 rounded-full"></div>
            </div>
            <h3 className="font-medium">Processing Failed</h3>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              We encountered an error while processing your document. This might be due to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mb-4 ml-2">
              <li>Corrupted PDF file</li>
              <li>Unsupported PDF structure</li>
              <li>Password protection or encryption</li>
            </ul>
            <div className="bg-gray-100 rounded p-4 font-mono text-xs text-gray-700 mb-4">
              Error: Unable to parse content stream at page 3. Invalid syntax at offset 1024.
            </div>
          </div>
          
          {/* Controls moved into the panel */}
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
              Back to Documents
            </button>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center">
              <div className="h-4 w-4 bg-white rounded mr-2"></div>
              <span>Retry Processing</span>
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white shadow-inner p-4 text-center text-sm text-gray-600">
        PDF Structure Analysis Tool - Beta Version
      </footer>
    </div>
  );
};

export default ImprovedProcessingWireframe;