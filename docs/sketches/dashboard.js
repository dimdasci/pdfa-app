import React from 'react';

const DashboardWireframeFinal = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">PDF Structure Analysis Tool</h1>
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
        {/* Document List Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Documents</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="h-4 w-4 bg-gray-400 rounded"></div>
                </div>
                <input 
                  type="text" 
                  placeholder="Search documents..." 
                  className="border border-gray-300 rounded pl-10 pr-4 py-2 w-64"
                />
              </div>
              <select className="border border-gray-300 rounded p-2">
                <option>All statuses</option>
                <option>Completed</option>
                <option>Processing</option>
                <option>Failed</option>
              </select>
            </div>
          </div>
          
          {/* Document List with integrated pagination */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pages</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Document Row - Completed */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-red-100 rounded flex items-center justify-center mr-3">
                        <div className="h-6 w-6 bg-red-400 rounded"></div>
                      </div>
                      <div>
                        <div className="font-medium">Annual_Report_2024.pdf</div>
                        <div className="text-sm text-gray-500">2.4 MB</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 15, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Analyze</button>
                    <button className="text-gray-600 hover:text-gray-900">Delete</button>
                  </td>
                </tr>
                
                {/* Document Row - Processing */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-red-100 rounded flex items-center justify-center mr-3">
                        <div className="h-6 w-6 bg-red-400 rounded"></div>
                      </div>
                      <div>
                        <div className="font-medium">Contract_Agreement.pdf</div>
                        <div className="text-sm text-gray-500">1.8 MB</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 17, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Processing
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View Progress</button>
                    <button className="text-gray-600 hover:text-gray-900">Cancel</button>
                  </td>
                </tr>
                
                {/* Document Row - Failed */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-red-100 rounded flex items-center justify-center mr-3">
                        <div className="h-6 w-6 bg-red-400 rounded"></div>
                      </div>
                      <div>
                        <div className="font-medium">Financial_Statement.pdf</div>
                        <div className="text-sm text-gray-500">3.2 MB</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 14, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Failed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View Error</button>
                    <button className="text-yellow-600 hover:text-yellow-900">Retry</button>
                  </td>
                </tr>
                
                {/* More document rows */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-red-100 rounded flex items-center justify-center mr-3">
                        <div className="h-6 w-6 bg-red-400 rounded"></div>
                      </div>
                      <div>
                        <div className="font-medium">Business_Plan_2025.pdf</div>
                        <div className="text-sm text-gray-500">5.1 MB</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 10, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">24</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Analyze</button>
                    <button className="text-gray-600 hover:text-gray-900">Delete</button>
                  </td>
                </tr>
                
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-red-100 rounded flex items-center justify-center mr-3">
                        <div className="h-6 w-6 bg-red-400 rounded"></div>
                      </div>
                      <div>
                        <div className="font-medium">Technical_Specifications.pdf</div>
                        <div className="text-sm text-gray-500">1.2 MB</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 8, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Analyze</button>
                    <button className="text-gray-600 hover:text-gray-900">Delete</button>
                  </td>
                </tr>
              </tbody>
              
              {/* Pagination Footer - Integrated with the table */}
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan="5" className="px-6 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">12</span> documents
                      </p>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Previous</span>
                          <div className="h-5 w-5 bg-gray-400 rounded"></div>
                        </button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-50">
                          1
                        </button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          2
                        </button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          3
                        </button>
                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Next</span>
                          <div className="h-5 w-5 bg-gray-400 rounded"></div>
                        </button>
                      </nav>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* Empty State (Hidden by default) */}
          <div className="hidden bg-white rounded-lg shadow p-12 text-center">
            <div className="h-20 w-20 mx-auto bg-gray-200 rounded-full mb-4"></div>
            <h3 className="text-lg font-medium mb-2">No documents yet</h3>
            <p className="text-gray-500 mb-4">Upload your first PDF document to start analyzing its structure</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Upload PDF</button>
          </div>
        </section>
      </main>
      
      {/* Upload Modal (Hidden by default, shown when Upload button is clicked) */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
        <div className="bg-white rounded-lg shadow-xl w-3/4 max-w-3xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Upload PDF Document</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <div className="h-5 w-5 bg-gray-400 rounded"></div>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <div className="mb-4">
                  <div className="h-16 w-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="h-8 w-8 bg-gray-400 rounded"></div>
                  </div>
                </div>
                <p className="mb-4">Drag & drop PDF file here</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Select File</button>
              </div>
              
              <div className="flex-1 border border-gray-300 rounded-lg p-8 bg-white">
                <h3 className="font-medium mb-4">Or provide a URL</h3>
                <div className="flex mb-4">
                  <input type="text" placeholder="https://example.com/document.pdf" className="flex-1 border border-gray-300 rounded-l p-2" />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-r">Fetch</button>
                </div>
                <div className="text-sm text-gray-500">
                  Supported formats: PDF only
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 mr-2">Cancel</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled>Upload</button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white shadow-inner p-4 text-center text-sm text-gray-600">
        PDF Structure Analysis Tool - Beta Version
      </footer>
    </div>
  );
};

export default DashboardWireframeFinal;