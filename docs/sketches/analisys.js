import React from 'react';

const FinalAnalysisWireframe = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
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
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-72 bg-white shadow-md overflow-y-auto flex flex-col">
          {/* Document Info */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium mb-2">Document Info</h2>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <div className="mb-1"><strong>Annual_Report_2024.pdf</strong></div>
              <div className="text-gray-600">12 pages • 2.4 MB</div>
              <div className="text-gray-600">Uploaded: Apr 15, 2025</div>
            </div>
          </div>
          
          {/* Layer Controls with Type Filters */}
          <div className="p-4 border-b border-gray-200 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-medium">Layers</h2>
              <button className="text-sm text-blue-600">Reset All</button>
            </div>
            
            {/* Object Type Filters - Compact with single letters */}
            <div className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">Types:</div>
              <div className="flex space-x-1">
                <button className="h-8 w-8 bg-yellow-50 border border-yellow-200 rounded flex items-center justify-center text-sm font-medium text-yellow-700 hover:bg-yellow-100">
                  T
                </button>
                <button className="h-8 w-8 bg-green-50 border border-green-200 rounded flex items-center justify-center text-sm font-medium text-green-700 hover:bg-green-100">
                  I
                </button>
                <button className="h-8 w-8 bg-blue-50 border border-blue-200 rounded flex items-center justify-center text-sm font-medium text-blue-700 hover:bg-blue-100">
                  P
                </button>
                <button className="h-8 w-8 bg-purple-50 border border-purple-200 rounded flex items-center justify-center text-sm font-medium text-purple-700 hover:bg-purple-100">
                  A
                </button>
                <button className="h-8 w-8 bg-red-50 border border-red-200 rounded flex items-center justify-center text-sm font-medium text-red-700 hover:bg-red-100">
                  F
                </button>
              </div>
            </div>
            
            {/* Layer List */}
            <div className="space-y-1">
              {/* All Layers toggle */}
              <div className="flex items-center justify-between p-2.5 bg-gray-100 rounded">
                <span className="text-sm font-medium">All Layers</span>
                <div className="flex space-x-2">
                  <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-500 rounded"></div>
                  </div>
                  <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-500 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Z-index 1 - Path */}
              <div className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer">
                <div className="flex items-center">
                  <div className="w-6 text-center text-sm font-medium mr-2">1</div>
                  <div className="h-6 w-6 bg-blue-100 flex items-center justify-center rounded mr-2">
                    <span className="text-sm font-medium text-blue-800">P</span>
                  </div>
                  <span className="text-sm text-gray-600">1 object</span>
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-500 rounded"></div>
                  </div>
                  <div className="h-6 w-6 bg-gray-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-gray-500 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Z-index 2 - Text */}
              <div className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer">
                <div className="flex items-center">
                  <div className="w-6 text-center text-sm font-medium mr-2">2</div>
                  <div className="h-6 w-6 bg-yellow-100 flex items-center justify-center rounded mr-2">
                    <span className="text-sm font-medium text-yellow-800">T</span>
                  </div>
                  <span className="text-sm text-gray-600">18 objects</span>
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-500 rounded"></div>
                  </div>
                  <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-500 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Z-index 3 - Image */}
              <div className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer">
                <div className="flex items-center">
                  <div className="w-6 text-center text-sm font-medium mr-2">3</div>
                  <div className="h-6 w-6 bg-green-100 flex items-center justify-center rounded mr-2">
                    <span className="text-sm font-medium text-green-800">I</span>
                  </div>
                  <span className="text-sm text-gray-600">1 object</span>
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-500 rounded"></div>
                  </div>
                  <div className="h-6 w-6 bg-gray-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-gray-500 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Z-index 4 - Text */}
              <div className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer">
                <div className="flex items-center">
                  <div className="w-6 text-center text-sm font-medium mr-2">4</div>
                  <div className="h-6 w-6 bg-yellow-100 flex items-center justify-center rounded mr-2">
                    <span className="text-sm font-medium text-yellow-800">T</span>
                  </div>
                  <span className="text-sm text-gray-600">1 object</span>
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-500 rounded"></div>
                  </div>
                  <div className="h-6 w-6 bg-gray-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-gray-500 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Z-index 5 - Path */}
              <div className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer">
                <div className="flex items-center">
                  <div className="w-6 text-center text-sm font-medium mr-2">5</div>
                  <div className="h-6 w-6 bg-blue-100 flex items-center justify-center rounded mr-2">
                    <span className="text-sm font-medium text-blue-800">P</span>
                  </div>
                  <span className="text-sm text-gray-600">3 objects</span>
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-500 rounded"></div>
                  </div>
                  <div className="h-6 w-6 bg-gray-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-gray-500 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Z-index 6 - Text */}
              <div className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer">
                <div className="flex items-center">
                  <div className="w-6 text-center text-sm font-medium mr-2">6</div>
                  <div className="h-6 w-6 bg-yellow-100 flex items-center justify-center rounded mr-2">
                    <span className="text-sm font-medium text-yellow-800">T</span>
                  </div>
                  <span className="text-sm text-gray-600">2 objects</span>
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-500 rounded"></div>
                  </div>
                  <div className="h-6 w-6 bg-gray-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-gray-500 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* More layers indicator */}
              <div className="text-center text-gray-400 py-1">• • •</div>
              
              {/* Z-index 16 - Image */}
              <div className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer">
                <div className="flex items-center">
                  <div className="w-6 text-center text-sm font-medium mr-2">16</div>
                  <div className="h-6 w-6 bg-green-100 flex items-center justify-center rounded mr-2">
                    <span className="text-sm font-medium text-green-800">I</span>
                  </div>
                  <span className="text-sm text-gray-600">1 object</span>
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-500 rounded"></div>
                  </div>
                  <div className="h-6 w-6 bg-gray-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-gray-500 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Anomaly Detection Section */}
          <div className="p-4 border-t border-gray-200">
            <h2 className="font-medium mb-2">Anomaly Detection</h2>
            <div className="space-y-2">
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium">Zero-Area Objects</div>
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">3 found</span>
                </div>
                <button className="text-xs text-blue-600">Show in viewer</button>
              </div>
              
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium">Repeated Patterns</div>
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">1 found</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">Page header detected on 12 pages</div>
                <button className="text-xs text-blue-600">Show in viewer</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Viewer Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white shadow-sm p-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100">
                  <div className="h-5 w-5 bg-gray-400 rounded"></div>
                </button>
                <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100">
                  <div className="h-5 w-5 bg-gray-400 rounded"></div>
                </button>
              </div>
              
              <div className="flex items-center space-x-1 border-l pl-4">
                <span className="text-sm">Page</span>
                <div className="flex items-center border rounded overflow-hidden">
                  <button className="px-2 py-1 hover:bg-gray-100">
                    <div className="h-3 w-3 bg-gray-400 rounded"></div>
                  </button>
                  <input type="text" value="1" className="w-8 text-center text-sm border-x" />
                  <button className="px-2 py-1 hover:bg-gray-100">
                    <div className="h-3 w-3 bg-gray-400 rounded"></div>
                  </button>
                </div>
                <span className="text-sm text-gray-500">of 12</span>
              </div>
              
              <div className="flex items-center space-x-1 border-l pl-4">
                <button className="px-2 py-1 text-sm border rounded hover:bg-gray-100">Fit Width</button>
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
          
          {/* PDF Viewer */}
          <div className="flex-1 overflow-auto bg-gray-200 flex items-center justify-center p-6">
            <div className="bg-white shadow-lg" style={{width: '612px', height: '792px', position: 'relative'}}>
              {/* Base PDF Layer (shown faded) */}
              <div className="absolute inset-0 bg-gray-50 opacity-20"></div>
              
              {/* Text Layer 2 (active, with outlines) */}
              <div className="absolute inset-0">
                {/* Sample text objects with bounding boxes */}
                <div className="absolute border-2 border-yellow-500 bg-yellow-100 bg-opacity-20" style={{top: '100px', left: '50px', width: '250px', height: '20px'}}></div>
                <div className="absolute border-2 border-yellow-500 bg-yellow-100 bg-opacity-20" style={{top: '130px', left: '50px', width: '350px', height: '20px'}}></div>
                <div className="absolute border-2 border-yellow-500 bg-yellow-100 bg-opacity-20" style={{top: '160px', left: '50px', width: '300px', height: '20px'}}></div>
                <div className="absolute border-2 border-yellow-500 bg-yellow-100 bg-opacity-20" style={{top: '300px', left: '50px', width: '400px', height: '20px'}}></div>
                <div className="absolute border-2 border-yellow-500 bg-yellow-100 bg-opacity-20" style={{top: '330px', left: '50px', width: '350px', height: '20px'}}></div>
              </div>
              
              {/* Image Layer 3 (active) */}
              <div className="absolute inset-0">
                {/* Sample image object */}
                <div className="absolute bg-green-100 bg-opacity-40" style={{top: '400px', left: '100px', width: '200px', height: '150px'}}>
                  <div className="h-full w-full flex items-center justify-center border-2 border-green-500">
                    <span className="text-xs text-green-800">Image Object</span>
                  </div>
                </div>
              </div>
              
              {/* Highlighted Anomaly (zero-area object) */}
              <div className="absolute" style={{top: '600px', left: '50px'}}>
                <div className="border-2 border-red-500 bg-red-100 bg-opacity-30" style={{width: '100px', height: '2px'}}>
                  <div className="absolute top-0 right-0 transform translate-x-full -translate-y-full bg-red-100 text-red-800 text-xs px-1 rounded">
                    Zero-area object
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar - Object Inspector */}
        <div className="w-64 bg-white shadow-md overflow-y-auto border-l border-gray-200">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium">Object Inspector</h2>
              <button className="text-gray-500 hover:text-gray-700">
                <div className="h-4 w-4 bg-gray-400 rounded"></div>
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Selected Object</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <div className="text-sm mb-1"><strong>Text Object</strong></div>
                <div className="text-xs text-gray-600 mb-2">z-index: 2 | Layer: Text</div>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Position:</span>
                    <span>x: 50, y: 130, w: 350, h: 20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Content:</span>
                    <span className="italic">Sample text content...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Area:</span>
                    <span>7000 px²</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Layer Statistics</h3>
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm mb-2"><strong>Layer z-index 2 (Text)</strong></div>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Objects:</span>
                    <span>18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Area:</span>
                    <span>120,450 px²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Coverage:</span>
                    <span>25%</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs mb-1">Area Distribution</div>
                  <div className="h-16 bg-gray-200 rounded overflow-hidden">
                    <div className="bg-blue-500 h-3" style={{width: '80%'}}></div>
                    <div className="bg-blue-400 h-3" style={{width: '60%'}}></div>
                    <div className="bg-blue-300 h-3" style={{width: '40%'}}></div>
                    <div className="bg-blue-200 h-3" style={{width: '20%'}}></div>
                    <div className="bg-blue-100 h-3" style={{width: '10%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer - Consistent with other screens */}
      <footer className="bg-white shadow-inner p-4 text-center text-sm text-gray-600">
        PDF Structure Analysis Tool - Beta Version
      </footer>
    </div>
  );
};

export default FinalAnalysisWireframe;