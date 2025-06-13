import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

const AnalysisContainer = () => {
  const intl = useIntl();
  const { documentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Sample document data - would come from API
  const document = {
    id: documentId,
    name: 'Annual_Report_2024.pdf',
    dateUploaded: '2025-04-15',
    pages: 12,
    size: '2.4 MB',
    status: 'completed',
    currentPage: 1
  };
  
  // State for current page
  const [currentPage, setCurrentPage] = useState(1);
  
  // Handle page change
  const handlePageChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setCurrentPage(Math.max(1, Math.min(value, document.pages)));
  };
  
  // State for layer visibility
  const [layerVisibility, setLayerVisibility] = useState({
    allLayers: true,
    // Individual layers would be managed here
  });
  
  // Sample layer data
  const layers = [
    { zIndex: 1, type: 'path', objectCount: 1, visible: true, highlighted: false },
    { zIndex: 2, type: 'text', objectCount: 18, visible: true, highlighted: false },
    { zIndex: 3, type: 'image', objectCount: 1, visible: true, highlighted: false },
    { zIndex: 4, type: 'text', objectCount: 1, visible: true, highlighted: false },
    { zIndex: 5, type: 'path', objectCount: 3, visible: true, highlighted: false },
    { zIndex: 6, type: 'text', objectCount: 2, visible: true, highlighted: false },
    // More layers would be added here
  ];
  
  // Sample anomalies
  const anomalies = [
    { type: 'zero-area', count: 3 },
    { type: 'repeated-pattern', count: 1, description: 'Page header detected on 12 pages' }
  ];
  
  // Toggle visibility of all layers
  const toggleAllLayers = () => {
    const newVisibility = !layerVisibility.allLayers;
    setLayerVisibility({
      ...layerVisibility,
      allLayers: newVisibility,
      // In a real implementation, we would update individual layers here
    });
  };
  
  // Handle back button click
  const handleBackClick = () => {
    // Preserve search params when navigating back (for sorting, filtering, pagination)
    const urlParams = new URLSearchParams(location.search);
    
    // Keep only the sort, filter, and pagination related params
    const sortParams = new URLSearchParams();
    ['sortField', 'sortDir', 'search', 'status', 'page'].forEach(param => {
      if (urlParams.has(param)) {
        sortParams.set(param, urlParams.get(param));
      }
    });
    
    const searchParamsString = sortParams.toString();
    navigate({
      pathname: '/',
      search: searchParamsString ? `?${searchParamsString}` : ''
    });
  };
  
  return (
    <>
      {/* Mobile view - Only show limited functionality message */}
      <div className="flex flex-col items-center justify-center h-full p-6 md:hidden">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-8 rounded-lg text-center shadow-sm max-w-md mx-auto">
          <h2 className="text-xl font-medium mb-3">
            <FormattedMessage 
              id="app.desktop_only" 
              defaultMessage="Desktop Only Feature" 
            />
          </h2>
          <p className="mb-4">
            <FormattedMessage 
              id="app.mobile_limited" 
              defaultMessage="The app is designed for desktop. Limited functionality is available on mobile." 
            />
          </p>
          <p className="text-sm mb-6">
            <FormattedMessage 
              id="app.mobile_suggestion" 
              defaultMessage="Please use a desktop device to access the full PDF analysis features." 
            />
          </p>
          <button 
            onClick={handleBackClick}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FormattedMessage 
              id="app.back_to_dashboard" 
              defaultMessage="Back to Documents" 
            />
          </button>
        </div>
      </div>

      {/* Desktop view - Show full analysis UI */}
      <div className="hidden md:flex h-full overflow-hidden">
        {/* Left Sidebar - Layers Panel */}
        <div className="w-72 bg-white shadow-md overflow-y-auto flex flex-col">
          {/* Document Info */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium mb-2">
              <FormattedMessage id="analysis.document_info" defaultMessage="Document Info" />
            </h2>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <div className="mb-1"><strong>{document.name}</strong></div>
              <div className="text-gray-600">
                <FormattedMessage 
                  id="analysis.document_metadata" 
                  defaultMessage="{pages} pages • {size}"
                  values={{ pages: document.pages, size: document.size }}
                />
              </div>
              <div className="text-gray-600">
                <FormattedMessage 
                  id="analysis.upload_date" 
                  defaultMessage="Uploaded: {date}"
                  values={{ date: new Date(document.dateUploaded).toLocaleDateString() }}
                />
              </div>
            </div>
          </div>
          
          {/* Layer Controls */}
          <div className="p-4 border-b border-gray-200 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-medium">
                <FormattedMessage id="analysis.layers" defaultMessage="Layers" />
              </h2>
              <button className="text-sm text-blue-600">
                <FormattedMessage id="analysis.reset_all" defaultMessage="Reset All" />
              </button>
            </div>
            
            {/* Object Type Filters */}
            <div className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-500">
                <FormattedMessage id="analysis.types" defaultMessage="Types:" />
              </div>
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
                <span className="text-sm font-medium">
                  <FormattedMessage id="analysis.all_layers" defaultMessage="All Layers" />
                </span>
                <div className="flex space-x-2">
                  <button 
                    className={`h-6 w-6 ${layerVisibility.allLayers ? 'bg-blue-100' : 'bg-gray-100'} rounded flex items-center justify-center`}
                    onClick={toggleAllLayers}
                  >
                    <div className={`h-4 w-4 ${layerVisibility.allLayers ? 'bg-blue-500' : 'bg-gray-500'} rounded`}></div>
                  </button>
                  <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-500 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Individual layer toggles */}
              {layers.map(layer => (
                <div key={layer.zIndex} className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-6 text-center text-sm font-medium mr-2">{layer.zIndex}</div>
                    <div className={`h-6 w-6 
                      ${layer.type === 'text' ? 'bg-yellow-100' : 
                        layer.type === 'image' ? 'bg-green-100' : 
                        layer.type === 'path' ? 'bg-blue-100' : 
                        'bg-gray-100'} 
                      flex items-center justify-center rounded mr-2`}>
                      <span className={`text-sm font-medium 
                        ${layer.type === 'text' ? 'text-yellow-800' : 
                          layer.type === 'image' ? 'text-green-800' : 
                          layer.type === 'path' ? 'text-blue-800' : 
                          'text-gray-800'}`}>
                        {layer.type === 'text' ? 'T' : 
                          layer.type === 'image' ? 'I' : 
                          layer.type === 'path' ? 'P' : '?'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {layer.objectCount} {layer.objectCount === 1 ? 
                        intl.formatMessage({ id: 'analysis.object', defaultMessage: 'object' }) : 
                        intl.formatMessage({ id: 'analysis.objects', defaultMessage: 'objects' })}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className={`h-6 w-6 ${layer.visible ? 'bg-blue-100' : 'bg-gray-100'} rounded flex items-center justify-center`}>
                      <div className={`h-4 w-4 ${layer.visible ? 'bg-blue-500' : 'bg-gray-500'} rounded`}></div>
                    </button>
                    <button className={`h-6 w-6 ${layer.highlighted ? 'bg-blue-100' : 'bg-gray-100'} rounded flex items-center justify-center`}>
                      <div className={`h-4 w-4 ${layer.highlighted ? 'bg-blue-500' : 'bg-gray-500'} rounded`}></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Anomaly Detection Section */}
          <div className="p-4 border-t border-gray-200">
            <h2 className="font-medium mb-2">
              <FormattedMessage id="analysis.anomaly_detection" defaultMessage="Anomaly Detection" />
            </h2>
            <div className="space-y-2">
              {anomalies.map((anomaly, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium">
                      {anomaly.type === 'zero-area' ? 
                        intl.formatMessage({ id: 'analysis.zero_area', defaultMessage: 'Zero-Area Objects' }) : 
                        intl.formatMessage({ id: 'analysis.repeated_patterns', defaultMessage: 'Repeated Patterns' })}
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                      <FormattedMessage 
                        id="analysis.anomaly_count" 
                        defaultMessage="{count} found"
                        values={{ count: anomaly.count }}
                      />
                    </span>
                  </div>
                  {anomaly.description && (
                    <div className="text-xs text-gray-500 mb-1">{anomaly.description}</div>
                  )}
                  <button className="text-xs text-blue-600">
                    <FormattedMessage id="analysis.show_in_viewer" defaultMessage="Show in viewer" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Viewer Area - Placeholder for PDF rendering */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
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
                  <button className="px-2 py-1 hover:bg-gray-100">
                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <input 
                    type="text" 
                    value={currentPage} 
                    onChange={handlePageChange}
                    className="w-8 text-center text-sm border-x" 
                  />
                  <button className="px-2 py-1 hover:bg-gray-100">
                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  <FormattedMessage 
                    id="analysis.of_pages" 
                    defaultMessage="of {pages}"
                    values={{ pages: document.pages }}
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
          
          {/* PDF Viewer - Placeholder */}
          <div className="flex-1 overflow-auto bg-gray-200 flex items-center justify-center p-6">
            <div className="bg-white shadow-lg" style={{width: '612px', height: '792px', position: 'relative'}}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-400">
                  <FormattedMessage id="analysis.pdf_viewer_placeholder" defaultMessage="PDF viewer will be implemented here" />
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar - Object Inspector */}
        <div className="w-64 bg-white shadow-md overflow-y-auto border-l border-gray-200">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium">
                <FormattedMessage id="analysis.object_inspector" defaultMessage="Object Inspector" />
              </h2>
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Selected Object Info - Placeholder */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">
                <FormattedMessage id="analysis.selected_object" defaultMessage="Selected Object" />
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <div className="text-sm mb-1"><strong>
                  <FormattedMessage id="analysis.text_object" defaultMessage="Text Object" />
                </strong></div>
                <div className="text-xs text-gray-600 mb-2">
                  <FormattedMessage 
                    id="analysis.object_metadata" 
                    defaultMessage="z-index: {zIndex} | Layer: {layerType}"
                    values={{ zIndex: 2, layerType: 'Text' }}
                  />
                </div>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      <FormattedMessage id="analysis.position" defaultMessage="Position:" />
                    </span>
                    <span>x: 50, y: 130, w: 350, h: 20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      <FormattedMessage id="analysis.content" defaultMessage="Content:" />
                    </span>
                    <span className="italic">Sample text content...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      <FormattedMessage id="analysis.area" defaultMessage="Area:" />
                    </span>
                    <span>7000 px²</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Layer Statistics - Placeholder */}
            <div>
              <h3 className="text-sm font-medium mb-2">
                <FormattedMessage id="analysis.layer_statistics" defaultMessage="Layer Statistics" />
              </h3>
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm mb-2"><strong>
                  <FormattedMessage 
                    id="analysis.layer_zindex" 
                    defaultMessage="Layer z-index {zIndex} ({type})"
                    values={{ zIndex: 2, type: 'Text' }}
                  />
                </strong></div>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      <FormattedMessage id="analysis.objects" defaultMessage="Objects:" />
                    </span>
                    <span>18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      <FormattedMessage id="analysis.total_area" defaultMessage="Total Area:" />
                    </span>
                    <span>120,450 px²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      <FormattedMessage id="analysis.coverage" defaultMessage="Coverage:" />
                    </span>
                    <span>25%</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs mb-1">
                    <FormattedMessage id="analysis.area_distribution" defaultMessage="Area Distribution" />
                  </div>
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
      </div>
    </>
  );
};

export default AnalysisContainer; 