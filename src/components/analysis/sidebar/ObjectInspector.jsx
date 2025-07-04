import React from 'react';
import { FormattedMessage } from 'react-intl';
import { getHumanFileSize, formatDate } from '../../../lib/formatters';

/**
 * Document information panel
 */
const DocumentInfoPanel = ({ document }) => {
  if (!document) return null;
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">
        <FormattedMessage id="analysis.document_info" defaultMessage="Document Info" />
      </h3>
      <div className="bg-gray-50 rounded p-3 text-sm">
        <div className="mb-1"><strong>{document.name}</strong></div>
        <div className="text-xs text-gray-600 mb-1">
          #{document.document_id}
        </div>
        <div className="text-xs text-gray-600">
          <FormattedMessage 
            id="analysis.document_metadata" 
            defaultMessage="{pages} pages • {size}"
            values={{ 
              pages: document.page_count || 'N/A', 
              size: getHumanFileSize(document.size_in_bytes)
            }}
          />
        </div>
        <div className="text-xs text-gray-600">
          <FormattedMessage 
            id="analysis.upload_date" 
            defaultMessage="Uploaded: {date}"
            values={{ date: formatDate(document.uploaded) }}
          />
        </div>
        
        {/* PDF Metadata collapsed section */}
        {document.info?.meta && (
          <div className="mt-2 text-xs">
            <details>
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                <FormattedMessage id="analysis.document_meta" defaultMessage="PDF Metadata" />
              </summary>
              <div className="mt-1 pl-1 space-y-1">
                {document.info.meta.Author && (
                  <div>
                    <span className="text-gray-500">
                      <FormattedMessage id="analysis.author" defaultMessage="Author:" />
                    </span> {document.info.meta.Author}
                  </div>
                )}
                {document.info.meta.Producer && (
                  <div>
                    <span className="text-gray-500">
                      <FormattedMessage id="analysis.producer" defaultMessage="Producer:" />
                    </span> {document.info.meta.Producer}
                  </div>
                )}
                {document.info.meta.Creator && (
                  <div>
                    <span className="text-gray-500">
                      <FormattedMessage id="analysis.creator" defaultMessage="Creator:" />
                    </span> {document.info.meta.Creator}
                  </div>
                )}
                {document.info.meta.CreationDate && (
                  <div>
                    <span className="text-gray-500">
                      <FormattedMessage id="analysis.creation_date" defaultMessage="Created:" />
                    </span> {document.info.meta.CreationDate.replace('D:', '')}
                  </div>
                )}
              </div>
            </details>
          </div>
        )}
        
        {document.info?.is_tagged !== undefined && (
          <div className="text-xs mt-1">
            <span className="text-gray-500">
              <FormattedMessage id="analysis.tagged_pdf" defaultMessage="Tagged PDF:" />
            </span> {document.info.is_tagged ? 
              <FormattedMessage id="analysis.yes" defaultMessage="Yes" /> : 
              <FormattedMessage id="analysis.no" defaultMessage="No" />}
          </div>
        )}
        
        {/* Table of Contents collapsed section */}
        {document.info?.toc && document.info.toc.length > 0 && (
          <div className="mt-2 text-xs">
            <details>
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                <FormattedMessage id="analysis.table_of_contents" defaultMessage="Table of Contents" />
                <span className="text-gray-500 ml-1">
                  ({document.info.toc.length})
                </span>
              </summary>
              <div className="mt-1 pl-1 max-h-40 overflow-y-auto">
                {document.info.toc.map((tocItem, index) => (
                  <div 
                    key={index}
                    className="py-1 hover:bg-gray-100 cursor-pointer"
                    style={{ paddingLeft: `${tocItem.level * 8}px` }}
                  >
                    <span className="text-blue-600">{tocItem.title}</span>
                    <span className="text-gray-500 ml-1">
                      (p.{tocItem.page + 1})
                    </span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

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
const ObjectInspector = ({ processedLayers, pageBundle, selectedObject, onClose, document }) => {
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
        
        {/* Document Info */}
        <DocumentInfoPanel document={document} />
        
        {/* Selected Object Info */}
        {selectedObject && <SelectedObjectInfo selectedObject={selectedObject} />}
        
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
