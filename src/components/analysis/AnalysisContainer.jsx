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
  
  // Get color for object type
  const getObjectTypeColor = (type) => {
    switch (type) {
      case 'text':
        return '#EAB308'; // yellow-500 (more contrast)
      case 'image':
        return '#22C55E'; // green-500 (more contrast)
      case 'path':
        return '#3B82F6'; // blue-500 (more contrast)
      case 'form':
        return '#EF4444'; // red-500 (more contrast)
      case 'annotation':
        return '#8B5CF6'; // purple-500 (more contrast)
      default:
        return '#6B7280'; // gray-500 (more contrast)
    }
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
  
  // State for object outlining
  const [outlineObjects, setOutlineObjects] = useState(false);
  
  // State for layer outlining - tracks which layers should have outlines
  const [layerOutlining, setLayerOutlining] = useState({
    allLayers: false, // Initially no layers are outlined
    // Individual layer outlining will be managed dynamically
  });
  
  // Use real page data if available, otherwise empty list
  const layers = pageBundle?.layers || [];
  
  // Transform API layer data to component format
  const processedLayers = pageBundle ? pageBundle.layers.map(layer => ({
    zIndex: layer.z_index,
    type: layer.type,
    objectCount: layer.object_count,
    url: layer.url,
    visible: layerVisibility[`layer_${layer.z_index}`] === undefined ? 
      layerVisibility.allLayers : layerVisibility[`layer_${layer.z_index}`],
    outlined: outlineObjects && (layerOutlining[`layer_${layer.z_index}`] === undefined ? 
      layerOutlining.allLayers : layerOutlining[`layer_${layer.z_index}`])
  })) : layers;
  
  // Initialize layer visibility and outlining states when pageBundle changes
  useEffect(() => {
    if (pageBundle?.layers) {
      const newVisibilityState = { ...layerVisibility };
      const newOutliningState = { ...layerOutlining };
      
      pageBundle.layers.forEach(layer => {
        const layerKey = `layer_${layer.z_index}`;
        
        // Initialize visibility state if not already set
        if (newVisibilityState[layerKey] === undefined) {
          newVisibilityState[layerKey] = layerVisibility.allLayers;
        }
        
        // Initialize outlining state if not already set
        if (newOutliningState[layerKey] === undefined) {
          newOutliningState[layerKey] = layerOutlining.allLayers;
        }
      });
      
      setLayerVisibility(newVisibilityState);
      setLayerOutlining(newOutliningState);
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
    
    // If hiding all layers, also turn off outlining for all layers
    if (!newAllLayersState && outlineObjects) {
      const newOutlining = { ...layerOutlining, allLayers: false };
      
      // Set all individual layer outlining states to false
      if (pageBundle?.layers) {
        pageBundle.layers.forEach(layer => {
          newOutlining[`layer_${layer.z_index}`] = false;
        });
      }
      
      setLayerOutlining(newOutlining);
    }
  };
  
  // Toggle visibility of a specific layer
  const toggleLayerVisibility = (zIndex) => {
    const layerKey = `layer_${zIndex}`;
    const currentVisibility = layerVisibility[layerKey] === undefined ? 
      layerVisibility.allLayers : layerVisibility[layerKey];
    
    // Create new visibility state with the toggled value for this layer
    const newVisibility = { 
      ...layerVisibility, 
      [layerKey]: !currentVisibility 
    };
    
    // Make sure all layers have explicit visibility states
    if (pageBundle?.layers) {
      pageBundle.layers.forEach(layer => {
        const otherLayerKey = `layer_${layer.z_index}`;
        if (otherLayerKey !== layerKey && newVisibility[otherLayerKey] === undefined) {
          newVisibility[otherLayerKey] = layerVisibility.allLayers;
        }
      });
      
      // Check if all layers are now visible
      const allVisible = pageBundle.layers.every(layer => {
        const layerKey = `layer_${layer.z_index}`;
        return newVisibility[layerKey] !== false;
      });
      newVisibility.allLayers = allVisible;
    }
    
    setLayerVisibility(newVisibility);
    
    // If we're hiding a layer, also turn off its outlining
    if (currentVisibility && layerOutlining[layerKey]) {
      const newOutlining = {
        ...layerOutlining,
        [layerKey]: false
      };
      
      // Make sure all other layers have explicit outlining states
      if (pageBundle?.layers) {
        pageBundle.layers.forEach(layer => {
          const otherLayerKey = `layer_${layer.z_index}`;
          if (otherLayerKey !== layerKey && newOutlining[otherLayerKey] === undefined) {
            newOutlining[otherLayerKey] = layerOutlining.allLayers;
          }
        });
        
        // Update the allLayers state for outlining - only consider visible layers
        const allOutlined = pageBundle.layers.every(layer => {
          const layerKey = `layer_${layer.z_index}`;
          const layerIsVisible = newVisibility[layerKey] === undefined
            ? newVisibility.allLayers
            : newVisibility[layerKey];
          
          if (!layerIsVisible) {
            return true; // Skip invisible layers in the "all" check
          }
          
          const isOutlined = newOutlining[layerKey] === undefined 
            ? newOutlining.allLayers 
            : newOutlining[layerKey];
            
          return isOutlined;
        });
        
        newOutlining.allLayers = allOutlined;
      }
      
      setLayerOutlining(newOutlining);
    }
  };
  
  // Toggle object outlining
  const toggleOutlining = () => {
    const newOutlineState = !outlineObjects;
    setOutlineObjects(newOutlineState);
    
    // If turning on outlines, set all visible layers to be outlined
    if (newOutlineState) {
      const newLayerOutlining = { ...layerOutlining, allLayers: true };
      
      // Set all individual layer outlining states based on their visibility
      if (pageBundle?.layers) {
        pageBundle.layers.forEach(layer => {
          const layerKey = `layer_${layer.z_index}`;
          const isVisible = layerVisibility[layerKey] === undefined 
            ? layerVisibility.allLayers 
            : layerVisibility[layerKey];
          
          // Only outline visible layers
          newLayerOutlining[layerKey] = isVisible;
        });
      }
      
      setLayerOutlining(newLayerOutlining);
    }
  };
  
  // Toggle outlining for a specific layer
  const toggleLayerOutlining = (zIndex) => {
    // First check if this layer is visible - can't outline invisible layers
    const layerKey = `layer_${zIndex}`;
    const isVisible = layerVisibility[layerKey] === undefined 
      ? layerVisibility.allLayers 
      : layerVisibility[layerKey];
    
    // Don't allow outlining invisible layers
    if (!isVisible) {
      return;
    }
    
    // If outlines are disabled globally, enable them first
    if (!outlineObjects) {
      setOutlineObjects(true);
    }
    
    // Toggle outlining for this specific layer
    const currentOutlining = layerOutlining[layerKey] === undefined 
      ? layerOutlining.allLayers 
      : layerOutlining[layerKey];
    
    // Create a new outlining state with the toggled value for this layer
    const newOutlining = { 
      ...layerOutlining, 
      [layerKey]: !currentOutlining 
    };
    
    // Make sure all other layers have explicit outlining states
    // This prevents issues when toggling visibility and outlining
    if (pageBundle?.layers) {
      pageBundle.layers.forEach(layer => {
        const otherLayerKey = `layer_${layer.z_index}`;
        if (otherLayerKey !== layerKey && newOutlining[otherLayerKey] === undefined) {
          newOutlining[otherLayerKey] = layerOutlining.allLayers;
        }
      });
      
      // Check if all visible layers are now outlined or not
      const allOutlined = pageBundle.layers.every(layer => {
        const layerIsVisible = layerVisibility[`layer_${layer.z_index}`] === undefined
          ? layerVisibility.allLayers
          : layerVisibility[`layer_${layer.z_index}`];
        
        if (!layerIsVisible) {
          return true; // Skip invisible layers in the "all" check
        }
        
        const layerKey = `layer_${layer.z_index}`;
        const isOutlined = newOutlining[layerKey] === undefined 
          ? newOutlining.allLayers 
          : newOutlining[layerKey];
          
        return isOutlined;
      });
      
      newOutlining.allLayers = allOutlined;
    }
    
    setLayerOutlining(newOutlining);
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
                    <svg className={`h-4 w-4 ${layerVisibility.allLayers ? 'text-blue-500' : 'text-gray-500'}`} viewBox="0 0 576 512" fill="currentColor">
                      {layerVisibility.allLayers ? (
                        <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
                      ) : (
                        <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z" />
                      )}
                    </svg>
                  </button>
                  <button 
                    className={`h-6 w-6 ${outlineObjects ? 'bg-blue-100' : 'bg-gray-100'} rounded flex items-center justify-center`}
                    onClick={toggleOutlining}
                    title={outlineObjects ? 'Hide object outlines' : 'Show object outlines'}
                  >
                    <svg className={`h-4 w-4 ${outlineObjects ? 'text-blue-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.5" strokeDasharray="2 2" />
                    </svg>
                  </button>
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
                      <svg className={`h-4 w-4 ${layer.visible ? 'text-blue-500' : 'text-gray-500'}`} viewBox="0 0 576 512" fill="currentColor">
                        {layer.visible ? (
                          <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
                        ) : (
                          <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z" />
                        )}
                      </svg>
                    </button>
                    <button
                      className={`h-6 w-6 ${(outlineObjects && layer.outlined) ? 'bg-blue-100' : 'bg-gray-100'} rounded flex items-center justify-center`}
                      onClick={() => toggleLayerOutlining(layer.zIndex)}
                      title={(outlineObjects && layer.outlined) ? 'Hide object outlines' : 'Show object outlines'}
                      disabled={!layer.visible}
                    >
                      <svg className={`h-4 w-4 ${(outlineObjects && layer.outlined) ? 'text-blue-500' : layer.visible ? 'text-gray-500' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" strokeDasharray="3 2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Object outlining info */}
              {outlineObjects && (
                <div className="mt-3 p-2 bg-blue-50 text-blue-700 text-xs rounded">
                  <div className="mb-1 font-medium">
                    <FormattedMessage 
                      id="analysis.outline_info" 
                      defaultMessage="Object outlines are enabled." 
                    />
                  </div>
                  
                  {/* Show which layers are being outlined */}
                  {processedLayers.some(layer => layer.visible && layer.outlined) ? (
                    <div className="text-xs mb-2">
                      <FormattedMessage 
                        id="analysis.outlined_layers" 
                        defaultMessage="Outlined layers: " 
                      />
                      {processedLayers
                        .filter(layer => layer.visible && layer.outlined)
                        .map(layer => layer.zIndex)
                        .join(', ')}
                    </div>
                  ) : (
                    <div className="text-xs mb-2 text-amber-700">
                      <FormattedMessage 
                        id="analysis.no_outlined_layers" 
                        defaultMessage="No layers are currently outlined. Click the outline button for a layer to see its objects." 
                      />
                    </div>
                  )}
                  
                  <div className="text-xs mb-2">
                    <FormattedMessage 
                      id="analysis.outline_legend" 
                      defaultMessage="Color legend:" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-2 border border-gray-300" style={{backgroundColor: getObjectTypeColor('text')}}></div>
                      <span className="font-medium">Text</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-2 border border-gray-300" style={{backgroundColor: getObjectTypeColor('image')}}></div>
                      <span className="font-medium">Image</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-2 border border-gray-300" style={{backgroundColor: getObjectTypeColor('path')}}></div>
                      <span className="font-medium">Path</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-2 border border-gray-300" style={{backgroundColor: getObjectTypeColor('form')}}></div>
                      <span className="font-medium">Form</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-2 border border-gray-300" style={{backgroundColor: getObjectTypeColor('annotation')}}></div>
                      <span className="font-medium">Annotation</span>
                    </div>
                  </div>
                </div>
              )}
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
                  
                  {/* Object Outlines Overlay */}
                  {outlineObjects && pageBundle?.layers && (
                    <svg 
                      className="absolute inset-0 z-50" 
                      style={{
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none' // Allows clicking through to underlying elements
                      }}
                      viewBox={`0 0 ${pageBundle.size?.width || 612} ${pageBundle.size?.height || 792}`}
                      preserveAspectRatio="xMinYMin meet"
                    >
                      {pageBundle.layers.flatMap(layer => {
                        // Only show outlines for visible layers that have outlining enabled
                        const layerKey = `layer_${layer.z_index}`;
                        const isLayerVisible = layerVisibility[layerKey] === undefined
                          ? layerVisibility.allLayers
                          : layerVisibility[layerKey];
                        
                        // Check if this layer should be outlined
                        const isLayerOutlined = layerOutlining[layerKey] === undefined
                          ? layerOutlining.allLayers
                          : layerOutlining[layerKey];
                        
                        // Skip this layer if it's not visible, not outlined, or has no objects
                        if (!isLayerVisible || !isLayerOutlined || !layer.objects || layer.objects.length === 0) {
                          return [];
                        }
                        
                        // Sort objects by ID to maintain consistent drawing order
                        const sortedObjects = [...layer.objects].sort((a, b) => {
                          // Convert IDs to numbers if possible, otherwise use string comparison
                          const idA = parseInt(a.id) || a.id;
                          const idB = parseInt(b.id) || b.id;
                          return idA - idB;
                        });
                        
                        return sortedObjects.map(obj => {
                          if (!obj.bbox || obj.bbox.length !== 4) return null;
                          
                          const [x1, y1, x2, y2] = obj.bbox;
                          const width = x2 - x1;
                          const height = y2 - y1;
                          
                          // Skip zero-area objects
                          if (width <= 0 || height <= 0) return null;
                          
                          // Flip Y coordinates to account for PDF coordinate system
                          // In PDF, origin (0,0) is at bottom-left, Y increases upward
                          // In SVG, origin (0,0) is at top-left, Y increases downward
                          const pageHeight = pageBundle.size?.height || 792;
                          const flippedY1 = pageHeight - y2; // y2 becomes top position after flipping
                          
                          return (
                            <rect
                              key={`outline-${layer.z_index}-${obj.id}`}
                              x={x1}
                              y={flippedY1}
                              width={width}
                              height={height}
                              fill="none"
                              stroke={getObjectTypeColor(obj.type || layer.type)}
                              strokeWidth="2.5"
                              strokeDasharray="4 3"
                              style={{ opacity: 1.0 }}
                            />
                          );
                        });
                      })}
                    </svg>
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