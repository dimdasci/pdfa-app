import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDocument, usePageBundle } from '../../hooks/useApi';
import useLayerState from '../../hooks/useLayerState';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

// Import refactored components
import DocumentInfo from './sidebar/DocumentInfo';
import LayersPanel from './sidebar/LayersPanel';
import AnomalyPanel from './sidebar/AnomalyPanel';
import ViewerToolbar from './viewer/ViewerToolbar';
import PdfViewerContainer from './viewer/PdfViewerContainer';
import MobileAnalysisNotice from './MobileAnalysisNotice';

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
  
  // Use our custom hook to manage layer state
  const {
    layerVisibility,
    layerOutlining,
    outlineObjects,
    processedLayers,
    toggleAllLayers,
    toggleLayerVisibility,
    toggleOutlining,
    toggleLayerOutlining
  } = useLayerState(pageBundle?.layers || []);
  
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
  
  // Get zero-area objects from the page bundle
  const zeroAreaObjects = pageBundle?.zero_objects || [];
  
  // Sample anomalies with only zero-area objects count
  const anomalies = [
    { 
      type: 'zero-area', 
      count: zeroAreaObjects.length || 3 
    }
  ];
  
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
          <MobileAnalysisNotice onBackClick={handleBackClick} />

          {/* Desktop view - Show full analysis UI */}
          <div className="hidden md:flex h-full overflow-hidden">
            {/* Left Sidebar - Layers Panel and Anomaly Detection */}
            <div className="w-72 bg-white shadow-md overflow-y-auto flex flex-col">
              <LayersPanel 
                layers={processedLayers}
                layerVisibility={layerVisibility}
                layerOutlining={layerOutlining}
                outlineObjects={outlineObjects}
                onToggleAllLayers={toggleAllLayers}
                onToggleOutlining={toggleOutlining}
                onToggleLayerVisibility={toggleLayerVisibility}
                onToggleLayerOutlining={toggleLayerOutlining}
              />
              
              <AnomalyPanel 
                anomalies={anomalies}
                zeroAreaObjects={zeroAreaObjects}
              />
            </div>
            
            {/* Main Viewer Area */}
            <div className="flex-1 flex flex-col">
              {/* Toolbar */}
              <ViewerToolbar 
                currentPage={currentPage}
                totalPages={document.page_count}
                onPageChange={handlePageChange}
                onPageNavigation={handlePageNavigation}
              />
              
              {/* PDF Viewer */}
              <PdfViewerContainer 
                pageBundle={pageBundle}
                currentPage={currentPage}
                pageLoading={pageLoading}
                pageError={pageError}
                layerVisibility={layerVisibility}
                outlineObjects={outlineObjects}
                layerOutlining={layerOutlining}
                processedLayers={processedLayers}
              />
            </div>
            
            {/* Right Sidebar - Document Info */}
            <div className="w-64 bg-white shadow-md overflow-y-auto border-l border-gray-200">
              <DocumentInfo document={document} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalysisContainer;
