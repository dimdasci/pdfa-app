import React from 'react';
import { FormattedMessage } from 'react-intl';

/**
 * Selected object info panel
 */
const SelectedObjectInfo = ({ selectedObject }) => {
  return (
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
  );
};

/**
 * Layer statistics panel
 */
const LayerStatistics = ({ processedLayers, pageBundle }) => {
  if (!processedLayers || processedLayers.length === 0) {
    return (
      <div className="bg-gray-50 rounded p-3 text-sm text-gray-500 text-center">
        <FormattedMessage id="analysis.no_layers" defaultMessage="No layer data available" />
      </div>
    );
  }

  return (
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
  );
};

/**
 * Object Inspector component for the right sidebar
 */
const ObjectInspector = ({ processedLayers, pageBundle, selectedObject, onClose }) => {
  return (
    <div className="w-64 bg-white shadow-md overflow-y-auto border-l border-gray-200">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium">
            <FormattedMessage id="analysis.object_inspector" defaultMessage="Object Inspector" />
          </h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Selected Object Info */}
        <SelectedObjectInfo selectedObject={selectedObject} />
        
        {/* Layer Statistics */}
        <div>
          <h3 className="text-sm font-medium mb-2">
            <FormattedMessage id="analysis.layer_statistics" defaultMessage="Layer Statistics" />
          </h3>
          <LayerStatistics processedLayers={processedLayers} pageBundle={pageBundle} />
        </div>
      </div>
    </div>
  );
};

export default ObjectInspector;
