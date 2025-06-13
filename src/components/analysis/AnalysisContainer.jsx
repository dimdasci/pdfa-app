import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDocument, usePageBundle } from '../../hooks/useApi';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const AnalysisContainer = () => {
  const intl = useIntl();
  const { documentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
   // Fetch document details from API
  const { document, loading, error, refetch } = useDocument(documentId);

  // State for current page
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch page metadata using the usePageBundle hook
  const { 
    pageBundle, 
    loading: pageLoading, 
    error: pageError 
  } = usePageBundle(documentId, currentPage);
  
  // Set initial page to 1 when document loads
  useEffect(() => {
    if (document) {
      setCurrentPage(1);
    }
  }, [document]);
  
  // Convert bytes to human-readable file size
  const getHumanFileSize = (bytes) => {
    if (bytes === undefined || bytes === null) {
      return 'N/A';
    }
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };
  
  // Format date to local date string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Handle page change
  const handlePageChange = (e) => {
    if (!document || !document.page_count) return;
    const value = parseInt(e.target.value) || 1;
    setCurrentPage(Math.max(1, Math.min(value, document.page_count)));
  };
  
  // Handle page navigation buttons
  const handlePageNavigation = (direction) => {
    if (!document || !document.page_count) return;
    
    if (direction === 'prev') {
      setCurrentPage(prev => Math.max(1, prev - 1));
    } else if (direction === 'next') {
      setCurrentPage(prev => Math.min(document.page_count, prev + 1));
    }
  };
  
  // State for layer visibility
  const [layerVisibility, setLayerVisibility] = useState({
    allLayers: true,
    // Individual layers will be managed dynamically
  });
  
  // Use real page data if available, otherwise use sample data
  const layers = pageBundle?.layers || [
    { zIndex: 1, type: 'path', objectCount: 1, visible: true, highlighted: false },
    { zIndex: 2, type: 'text', objectCount: 18, visible: true, highlighted: false },
    { zIndex: 3, type: 'image', objectCount: 1, visible: true, highlighted: false },
    { zIndex: 4, type: 'text', objectCount: 1, visible: true, highlighted: false },
    { zIndex: 5, type: 'path', objectCount: 3, visible: true, highlighted: false },
    { zIndex: 6, type: 'text', objectCount: 2, visible: true, highlighted: false },
    // More layers would be added here
  ];
  
  // Transform API layer data to component format
  const processedLayers = pageBundle ? pageBundle.layers.map(layer => ({
    zIndex: layer.z_index,
    type: layer.type,
    objectCount: layer.object_count,
    url: layer.url,
    visible: layerVisibility[`layer_${layer.z_index}`] === undefined ? 
      layerVisibility.allLayers : layerVisibility[`layer_${layer.z_index}`],
    highlighted: false
  })) : layers;
  
  // Initialize layer visibility state when pageBundle changes
  useEffect(() => {
    if (pageBundle?.layers) {
      const newVisibilityState = { ...layerVisibility };
      pageBundle.layers.forEach(layer => {
        if (newVisibilityState[`layer_${layer.z_index}`] === undefined) {
          newVisibilityState[`layer_${layer.z_index}`] = layerVisibility.allLayers;
        }
      });
      setLayerVisibility(newVisibilityState);
    }
  }, [pageBundle?.layers]);
  
  // Get zero-area objects from the page bundle
  const zeroAreaObjects = pageBundle?.zero_objects || [];
  
  // Sample anomalies with real zero-area object count if available
  const anomalies = [
    { 
      type: 'zero-area', 
      count: zeroAreaObjects.length || 3 
    },
    { 
      type: 'repeated-pattern', 
      count: 1, 
      description: 'Page header detected on 12 pages' 
    }
  ];
  
  // Toggle visibility of all layers
  const toggleAllLayers = () => {
    const newAllLayersState = !layerVisibility.allLayers;
    const newVisibility = { ...layerVisibility, allLayers: newAllLayersState };
    
    // Update all individual layer visibilities to match the "all layers" state
    if (pageBundle?.layers) {
      pageBundle.layers.forEach(layer => {
        newVisibility[`layer_${layer.z_index}`] = newAllLayersState;
      });
    }
    
    setLayerVisibility(newVisibility);
  };
  
  // Toggle visibility of a specific layer
  const toggleLayerVisibility = (zIndex) => {
    const layerKey = `layer_${zIndex}`;
    const currentVisibility = layerVisibility[layerKey] === undefined ? 
      layerVisibility.allLayers : layerVisibility[layerKey];
    
    const newVisibility = { 
      ...layerVisibility, 
      [layerKey]: !currentVisibility 
    };
    
    // Check if all layers are now visible or not
    if (pageBundle?.layers) {
      const allVisible = pageBundle.layers.every(layer => 
        newVisibility[`layer_${layer.z_index}`] !== false
      );
      newVisibility.allLayers = allVisible;
    }
    
    setLayerVisibility(newVisibility);
  };
  
  // Toggle highlight of a specific layer
  const toggleLayerHighlight = (zIndex) => {
    const updatedLayers = processedLayers.map(layer => {
      if (layer.zIndex === zIndex) {
        return { ...layer, highlighted: !layer.highlighted };
      }
      return layer;
    });
    
    // In a real implementation, we would update state here
    console.log('Toggled highlight for layer:', zIndex);
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
    <div className="flex flex-col h-full">
      {/* Loading state */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <Loading message={intl.formatMessage({
            id: "analysis.loading",
            defaultMessage: "Loading document analysis..."
          })} />
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="flex-1 p-6">
          <ErrorMessage 
            message={error}
            onRetry={refetch}
          />
        </div>
      )}
      
      {document && !loading && !error && (
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
              <div className="text-sm text-gray-600 mb-1">
                #{document.document_id}
              </div>
              <div className="text-gray-600">
                <FormattedMessage 
                  id="analysis.document_metadata" 
                  defaultMessage="{pages} pages • {size}"
                  values={{ 
                    pages: document.page_count || 'N/A', 
                    size: getHumanFileSize(document.size_in_bytes)
                  }}
                />
              </div>
              <div className="text-gray-600">
                <FormattedMessage 
                  id="analysis.upload_date" 
                  defaultMessage="Uploaded: {date}"
                  values={{ date: formatDate(document.uploaded) }}
                />
              </div>
              <div className="text-gray-600 mt-1">
                {document.source === 'file' ? (
                  <FormattedMessage
                    id="analysis.document_source"
                    defaultMessage="Source: {source}"
                    values={{
                      source: intl.formatMessage({id: "analysis.source_file", defaultMessage: "File upload"})
                    }}
                  />
                ) : document.source_url ? (
                  <>
                    <FormattedMessage
                      id="analysis.document_source_url"
                      defaultMessage="Source: "
                    />
                    <a 
                      href={document.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {document.source_url}
                    </a>
                  </>
                ) : (
                  <FormattedMessage
                    id="analysis.document_source"
                    defaultMessage="Source: {source}"
                    values={{
                      source: intl.formatMessage({id: "analysis.source_unknown", defaultMessage: "Unknown"})
                    }}
                  />
                )}
              </div>
              {document.info?.meta && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="font-medium mb-1">
                    <FormattedMessage id="analysis.document_meta" defaultMessage="PDF Metadata" />
                  </div>
                  {document.info.meta.Author && (
                    <div className="text-xs">
                      <span className="text-gray-500">
                        <FormattedMessage id="analysis.author" defaultMessage="Author:" />
                      </span> {document.info.meta.Author}
                    </div>
                  )}
                  {document.info.meta.Producer && (
                    <div className="text-xs">
                      <span className="text-gray-500">
                        <FormattedMessage id="analysis.producer" defaultMessage="Producer:" />
                      </span> {document.info.meta.Producer}
                    </div>
                  )}
                  {document.info.meta.Creator && (
                    <div className="text-xs">
                      <span className="text-gray-500">
                        <FormattedMessage id="analysis.creator" defaultMessage="Creator:" />
                      </span> {document.info.meta.Creator}
                    </div>
                  )}
                  {document.info.meta.CreationDate && (
                    <div className="text-xs">
                      <span className="text-gray-500">
                        <FormattedMessage id="analysis.creation_date" defaultMessage="Created:" />
                      </span> {document.info.meta.CreationDate.replace('D:', '')}
                    </div>
                  )}
                </div>
              )}
              {document.info?.is_tagged !== undefined && (
                <div className="text-xs mt-1">
                  <span className="text-gray-500">
                    <FormattedMessage id="analysis.tagged_pdf" defaultMessage="Tagged PDF:" />
                  </span> {document.info.is_tagged ? 
                    intl.formatMessage({id: "analysis.yes", defaultMessage: "Yes"}) : 
                    intl.formatMessage({id: "analysis.no", defaultMessage: "No"})}
                </div>
              )}

              {/* Table of Contents - Show if available */}
              {document.info?.toc && document.info.toc.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">
                      <FormattedMessage id="analysis.table_of_contents" defaultMessage="Table of Contents" />
                    </div>
                    <span className="text-xs text-gray-500">
                      {document.info.toc.length} {intl.formatMessage({id: "analysis.entries", defaultMessage: "entries"})}
                    </span>
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {document.info.toc.slice(0, 5).map((tocItem, index) => (
                      <div 
                        key={index}
                        className="text-xs py-1 hover:bg-gray-100 cursor-pointer"
                        style={{ paddingLeft: `${tocItem.level * 12}px` }}
                      >
                        <span className="text-blue-600">{tocItem.title}</span>
                        <span className="text-gray-500 ml-1">
                          (p.{tocItem.page + 1})
                        </span>
                      </div>
                    ))}
                    {document.info.toc.length > 5 && (
                      <div className="text-xs text-center text-gray-500 py-1 italic">
                        <FormattedMessage 
                          id="analysis.more_toc_entries" 
                          defaultMessage="{count} more entries..." 
                          values={{ count: document.info.toc.length - 5 }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">
                    <FormattedMessage id="analysis.all_layers" defaultMessage="All Layers" />
                  </span>
                  {!layerVisibility.allLayers && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      <FormattedMessage id="analysis.custom_view" defaultMessage="Custom View" />
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button 
                    className={`h-6 w-6 ${layerVisibility.allLayers ? 'bg-blue-100' : 'bg-gray-100'} rounded flex items-center justify-center`}
                    onClick={toggleAllLayers}
                    title={layerVisibility.allLayers ? 'Hide all layers' : 'Show all layers'}
                  >
                    <div className={`h-4 w-4 ${layerVisibility.allLayers ? 'bg-blue-500' : 'bg-gray-500'} rounded`}></div>
                  </button>
                  <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-500 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Individual layer toggles */}
              {processedLayers.map(layer => (
                <div key={layer.zIndex} className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-6 text-center text-sm font-medium mr-2">{layer.zIndex}</div>
                    <div className={`h-6 w-6 
                      ${layer.type === 'text' ? 'bg-yellow-100' : 
                        layer.type === 'image' ? 'bg-green-100' : 
                        layer.type === 'path' ? 'bg-blue-100' : 
                        layer.type === 'form' ? 'bg-red-100' :
                        layer.type === 'annotation' ? 'bg-purple-100' :
                        'bg-gray-100'} 
                      flex items-center justify-center rounded mr-2`}>
                      <span className={`text-sm font-medium 
                        ${layer.type === 'text' ? 'text-yellow-800' : 
                          layer.type === 'image' ? 'text-green-800' : 
                          layer.type === 'path' ? 'text-blue-800' : 
                          layer.type === 'form' ? 'text-red-800' :
                          layer.type === 'annotation' ? 'text-purple-800' :
                          'text-gray-800'}`}>
                        {layer.type === 'text' ? 'T' : 
                          layer.type === 'image' ? 'I' : 
                          layer.type === 'path' ? 'P' : 
                          layer.type === 'form' ? 'F' :
                          layer.type === 'annotation' ? 'A' :
                          '?'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {layer.objectCount} {layer.objectCount === 1 ? 
                        intl.formatMessage({ id: 'analysis.object', defaultMessage: 'object' }) : 
                        intl.formatMessage({ id: 'analysis.objects', defaultMessage: 'objects' })}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className={`h-6 w-6 ${layer.visible ? 'bg-blue-100' : 'bg-gray-100'} rounded flex items-center justify-center`}
                      onClick={() => toggleLayerVisibility(layer.zIndex)}
                      title={layer.visible ? 'Hide layer' : 'Show layer'}
                    >
                      <div className={`h-4 w-4 ${layer.visible ? 'bg-blue-500' : 'bg-gray-500'} rounded`}></div>
                    </button>
                    <button 
                      className={`h-6 w-6 ${layer.highlighted ? 'bg-blue-100' : 'bg-gray-100'} rounded flex items-center justify-center`}
                      onClick={() => toggleLayerHighlight(layer.zIndex)}
                      title={layer.highlighted ? 'Remove highlight' : 'Highlight layer'}
                    >
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
                  {anomaly.type === 'zero-area' && zeroAreaObjects.length > 0 && (
                    <div className="text-xs text-gray-600 mb-1">
                      <FormattedMessage 
                        id="analysis.zero_area_examples" 
                        defaultMessage="Examples: {examples}"
                        values={{ 
                          examples: zeroAreaObjects.slice(0, 2).map(obj => `ID: ${obj.id}`).join(', ') + 
                            (zeroAreaObjects.length > 2 ? '...' : '')
                        }}
                      />
                    </div>
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
                  <button 
                    className="px-2 py-1 hover:bg-gray-100"
                    onClick={() => handlePageNavigation('prev')}
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
                    onChange={handlePageChange}
                    className="w-8 text-center text-sm border-x" 
                  />
                  <button 
                    className="px-2 py-1 hover:bg-gray-100"
                    onClick={() => handlePageNavigation('next')}
                    disabled={document && currentPage >= document.page_count}
                    title="Next page"
                  >
                    <svg className={`h-3 w-3 ${document && currentPage >= document.page_count ? 'text-gray-300' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  <FormattedMessage 
                    id="analysis.of_pages" 
                    defaultMessage="of {pages}"
                    values={{ pages: document.page_count || 0 }}
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
          
          {/* PDF Viewer */}
          <div className="flex-1 overflow-auto bg-gray-200 flex items-center justify-center p-6">
            <div 
              className="bg-white shadow-lg" 
              style={{
                width: pageBundle?.size?.width ? `${pageBundle.size.width}px` : '612px', 
                height: pageBundle?.size?.height ? `${pageBundle.size.height}px` : '792px', 
                position: 'relative'
              }}
            >
              {pageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
                  <Loading message={intl.formatMessage({
                    id: "analysis.loading_page",
                    defaultMessage: "Loading page..."
                  })} />
                </div>
              )}
              
              {pageError && !pageLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                  <div className="text-red-500 text-center p-4">
                    <div className="mb-2">
                      <FormattedMessage 
                        id="analysis.page_load_error" 
                        defaultMessage="Error loading page data" 
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      {pageError}
                    </div>
                  </div>
                </div>
              )}
              
              {!pageLoading && !pageError && !pageBundle && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400">
                    <FormattedMessage 
                      id="analysis.pdf_viewer_placeholder" 
                      defaultMessage="PDF viewer will be implemented here" 
                    />
                  </span>
                </div>
              )}
              
              {!pageLoading && !pageError && pageBundle && (
                <>
                  {/* Show full raster when all layers are visible */}
                  {layerVisibility.allLayers && pageBundle.full_raster_url && (
                    <img 
                      src={pageBundle.full_raster_url} 
                      alt={`Full page ${currentPage}`}
                      style={{
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  )}
                  
                  {/* Show individual layers when not all layers are visible */}
                  {(!layerVisibility.allLayers || !pageBundle.full_raster_url) && (
                    <div className="absolute inset-0">
                      {/* Stack visible layers in z-index order */}
                      {processedLayers
                        .filter(layer => layer.visible && layer.url)
                        .sort((a, b) => a.zIndex - b.zIndex)
                        .map(layer => (
                          <img 
                            key={`layer-${layer.zIndex}`}
                            src={layer.url} 
                            alt={`Layer ${layer.zIndex} (${layer.type})`}
                            style={{
                              position: 'absolute', 
                              top: 0, 
                              left: 0, 
                              width: '100%', 
                              height: '100%',
                              objectFit: 'contain',
                              opacity: layer.highlighted ? 0.8 : 1,
                              border: layer.highlighted ? '2px solid rgba(59, 130, 246, 0.5)' : 'none',
                              zIndex: layer.zIndex
                            }}
                          />
                        ))
                      }
                      
                      {/* Show message when no visible layers */}
                      {processedLayers.filter(layer => layer.visible && layer.url).length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-gray-500 bg-gray-100 px-4 py-2 rounded">
                            <FormattedMessage 
                              id="analysis.no_visible_layers" 
                              defaultMessage="No visible layers. Enable at least one layer to view content." 
                            />
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Info overlay */}
                  <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 p-2 rounded shadow-sm text-xs z-50">
                    <FormattedMessage 
                      id="analysis.page_loaded" 
                      defaultMessage="Page {pageNumber} loaded ({width}×{height})" 
                      values={{
                        pageNumber: currentPage,
                        width: pageBundle.size.width,
                        height: pageBundle.size.height
                      }}
                    />
                  </div>
                </>
              )}
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
            
            {/* Layer Statistics */}
            <div>
              <h3 className="text-sm font-medium mb-2">
                <FormattedMessage id="analysis.layer_statistics" defaultMessage="Layer Statistics" />
              </h3>
              {processedLayers.length > 0 ? (
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-sm mb-2"><strong>
                    <FormattedMessage 
                      id="analysis.layer_zindex" 
                      defaultMessage="Layer z-index {zIndex} ({type})"
                      values={{ 
                        zIndex: processedLayers[0].zIndex, 
                        type: processedLayers[0].type 
                      }}
                    />
                  </strong></div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        <FormattedMessage id="analysis.objects" defaultMessage="Objects:" />
                      </span>
                      <span>{processedLayers[0].objectCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        <FormattedMessage id="analysis.total_area" defaultMessage="Total Area:" />
                      </span>
                      <span>{pageBundle ? "Based on actual data" : "120,450 px²"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        <FormattedMessage id="analysis.coverage" defaultMessage="Coverage:" />
                      </span>
                      <span>{pageBundle ? "Calculated from data" : "25%"}</span>
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
              ) : (
                <div className="bg-gray-50 rounded p-3 text-sm text-gray-500 text-center">
                  <FormattedMessage id="analysis.no_layers" defaultMessage="No layer data available" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
      )}
    </div>
  );
};

export default AnalysisContainer; 