import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import Loading from '../../common/Loading';
import { getObjectTypeColor } from '../../../lib/analysisUtils';

/**
 * Component to render the PDF page content, including layers and object outlines
 */
const PdfViewer = ({ 
  pageBundle, 
  currentPage,
  pageLoading, 
  pageError, 
  layerVisibility, 
  outlineObjects, 
  layerOutlining,
  processedLayers,
  showZeroAreaMarkers,
  zeroAreaObjects
}) => {
  
  if (pageLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
        <Loading message="Loading page..." />
      </div>
    );
  }

  if (pageError && !pageLoading) {
    return (
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
    );
  }

  if (!pageBundle) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-gray-400">
          <FormattedMessage 
            id="analysis.pdf_viewer_placeholder" 
            defaultMessage="PDF viewer will be implemented here" 
          />
        </span>
      </div>
    );
  }

  return (
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
              
              // Skip zero-area objects (they'll be handled separately)
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

      {/* Zero-area objects overlay - completely independent of the outlines overlay */}
      {pageBundle && showZeroAreaMarkers && (
        <svg 
          className="absolute inset-0 z-60" 
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: 'auto' // Enable pointer events for tooltips
          }}
          viewBox={`0 0 ${pageBundle.size?.width || 612} ${pageBundle.size?.height || 792}`}
          preserveAspectRatio="xMinYMin meet"
        >
          
          {/* Render markers */}
          {zeroAreaObjects.map((obj, index) => {
            if (!obj.bbox || obj.bbox.length !== 4) return null;
            
            const [x1, y1, x2, y2] = obj.bbox;
            
            // For zero-area objects, we may need to handle various cases:
            // 1. Point (x1=x2, y1=y2)
            // 2. Horizontal line (y1=y2, x1≠x2)
            // 3. Vertical line (x1=x2, y1≠y2)
            // 4. Zero-area rect (misconfigured coords)
            
            // Flip Y coordinates (PDF has origin at bottom-left, SVG at top-left)
            const pageHeight = pageBundle.size?.height || 792;
            const pageWidth = pageBundle.size?.width || 612;
            
            // For consistency, always use x1,y1 for point positioning
            const flippedY = pageHeight - y1;
                
            // Calculate if position is outside page boundaries
            const isOutsidePage = 
              x1 < 0 || x1 > pageWidth || 
              flippedY < 0 || flippedY > pageHeight;
            
            // Use clipped coordinates for display but indicate out-of-bounds status
            const displayX = Math.max(24, Math.min(pageWidth - 24, x1));
            const displayY = Math.max(24, Math.min(pageHeight - 24, flippedY));
            
            // Create type indicator for the marker
            const objType = obj.type || 'unknown';
            const typeIndicator = objType.charAt(0).toUpperCase();
            
            // Create an identifier for the tooltip
            const tooltipId = `tooltip-${index}-${obj.id}`;
            
            return (
              <g 
                key={`zero-marker-${index}-${obj.id}`}
                className="zero-area-marker"
              >
                {/* Simple background for the marker */}
                <rect
                  x={displayX - 10}
                  y={displayY - 10}
                  width={20}
                  height={20}
                  fill={isOutsidePage ? "#9C4221" : "#4B5563"} // brown for outside page, dark gray for inside
                  stroke={isOutsidePage ? "#7B341E" : "#1F2937"} // darker border
                  strokeWidth="1"
                  rx="3" // rounded corners
                />
                
                {/* Type letter centered properly */}
                <text
                  x={displayX}
                  y={displayY}
                  fill="white"
                  fontSize="12"
                  fontWeight="normal"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {typeIndicator}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </>
  );
};

/**
 * Wrapper component for the PDF viewer area
 */
const PdfViewerContainer = ({
  pageBundle,
  currentPage,
  pageLoading,
  pageError,
  layerVisibility,
  outlineObjects,
  layerOutlining,
  processedLayers
}) => {
  // Move state to container level so it persists between renders
  const [showZeroAreaMarkers, setShowZeroAreaMarkers] = useState(false);
  const [zeroAreaObjects, setZeroAreaObjects] = useState([]);
  
  // Listen for the custom event from AnomalyPanel at the container level
  useEffect(() => {
    const handleToggleZeroAreaMarkers = (event) => {
      setShowZeroAreaMarkers(event.detail.visible);
      if (event.detail.objects) {
        setZeroAreaObjects(event.detail.objects);
      }
    };
    
    window.addEventListener('toggle-zero-area-markers', handleToggleZeroAreaMarkers);
    
    return () => {
      window.removeEventListener('toggle-zero-area-markers', handleToggleZeroAreaMarkers);
    };
  }, []);
  
  // No additional monitoring needed for zero-area objects

  return (
    <div className="flex-1 overflow-auto bg-gray-200 flex items-center justify-center p-6">
      <div 
        className="bg-white shadow-lg" 
        style={{
          width: pageBundle?.size?.width ? `${pageBundle.size.width}px` : '612px',
          height: pageBundle?.size?.height ? `${pageBundle.size.height}px` : '792px', 
          position: 'relative'
        }}
      >
        <PdfViewer 
          pageBundle={pageBundle}
          currentPage={currentPage}
          pageLoading={pageLoading}
          pageError={pageError}
          layerVisibility={layerVisibility}
          outlineObjects={outlineObjects}
          layerOutlining={layerOutlining}
          processedLayers={processedLayers}
          showZeroAreaMarkers={showZeroAreaMarkers}
          zeroAreaObjects={zeroAreaObjects}
        />
      </div>
    </div>
  );
};

export default PdfViewerContainer;
