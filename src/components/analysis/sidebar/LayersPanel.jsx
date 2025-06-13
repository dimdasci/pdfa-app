import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getObjectTypeColor } from '../../../lib/analysisUtils';

/**
 * Layer toggle component for controlling layer visibility and outlining
 */
const LayerToggle = ({ 
  layer, 
  visible, 
  outlined, 
  outlineObjects,
  onToggleVisibility, 
  onToggleOutlining 
}) => {
  const intl = useIntl();
  
  return (
    <div className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer">
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
          className={`h-6 w-6 ${visible ? 'bg-blue-100' : 'bg-gray-100'} rounded flex items-center justify-center`}
          onClick={() => onToggleVisibility(layer.zIndex)}
          title={visible ? 'Hide layer' : 'Show layer'}
        >
          <svg className={`h-4 w-4 ${visible ? 'text-blue-500' : 'text-gray-500'}`} viewBox="0 0 576 512" fill="currentColor">
            {visible ? (
              <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
            ) : (
              <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z" />
            )}
          </svg>
        </button>
        <button
          className={`h-6 w-6 ${(outlineObjects && outlined) ? 'bg-blue-100' : 'bg-gray-100'} rounded flex items-center justify-center`}
          onClick={() => onToggleOutlining(layer.zIndex)}
          title={(outlineObjects && outlined) ? 'Hide object outlines' : 'Show object outlines'}
          disabled={!visible}
        >
          <svg className={`h-4 w-4 ${(outlineObjects && outlined) ? 'text-blue-500' : visible ? 'text-gray-500' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" strokeDasharray="3 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

/**
 * Outlining Legend component
 */
const OutliningLegend = () => {
  return (
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
  );
};

/**
 * Layers panel component for controlling layer visibility and outlining
 */
const LayersPanel = ({ 
  layers, 
  layerVisibility, 
  layerOutlining,
  outlineObjects,
  onToggleAllLayers, 
  onToggleOutlining, 
  onToggleLayerVisibility, 
  onToggleLayerOutlining 
}) => {
  const intl = useIntl();
  
  return (
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
              onClick={onToggleAllLayers}
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
              onClick={onToggleOutlining}
              title={outlineObjects ? 'Hide object outlines' : 'Show object outlines'}
            >
              <svg className={`h-4 w-4 ${outlineObjects ? 'text-blue-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.5" strokeDasharray="2 2" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Individual layer toggles */}
        {layers.map(layer => (
          <LayerToggle 
            key={layer.zIndex} 
            layer={layer} 
            visible={layer.visible}
            outlined={layer.outlined}
            outlineObjects={outlineObjects}
            onToggleVisibility={onToggleLayerVisibility}
            onToggleOutlining={onToggleLayerOutlining}
          />
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
            {layers.some(layer => layer.visible && layer.outlined) ? (
              <div className="text-xs mb-2">
                <FormattedMessage 
                  id="analysis.outlined_layers" 
                  defaultMessage="Outlined layers: " 
                />
                {layers
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
            <OutliningLegend />
          </div>
        )}
      </div>
    </div>
  );
};

export default LayersPanel;
