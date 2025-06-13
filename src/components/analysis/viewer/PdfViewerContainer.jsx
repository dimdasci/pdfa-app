import React from 'react';
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
  processedLayers
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
        />
      </div>
    </div>
  );
};

export default PdfViewerContainer;
