import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getHumanFileSize, formatDate } from '../../../lib/formatters';

/**
 * Component for displaying document information in the analysis sidebar
 */
const DocumentInfo = ({ document }) => {
  const intl = useIntl();
  
  if (!document) return null;
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h2 className="font-medium">
          <FormattedMessage id="analysis.document_info" defaultMessage="Document Info" />
        </h2>
      </div>
      
      <div className="px-4 flex-1 overflow-y-auto pb-2">
        <div className="mb-2 text-lg font-medium">{document.name}</div>
        <div className="text-sm text-gray-600 mb-2">
          #{document.document_id}
        </div>
        <div className="text-sm text-gray-700 mb-1">
          <FormattedMessage 
            id="analysis.document_metadata" 
            defaultMessage="{pages} pages • {size}"
            values={{ 
              pages: document.page_count || 'N/A', 
              size: getHumanFileSize(document.size_in_bytes)
            }}
          />
        </div>
        <div className="text-sm text-gray-700 mb-3">
          <FormattedMessage 
            id="analysis.upload_date" 
            defaultMessage="Uploaded: {date}"
            values={{ date: formatDate(document.uploaded) }}
          />
        </div>
        <div className="mb-3">
          {document.source === 'file' ? (
            <div className="text-sm text-gray-700">
              <FormattedMessage
                id="analysis.document_source"
                defaultMessage="Source: {source}"
                values={{
                  source: intl.formatMessage({id: "analysis.source_file", defaultMessage: "File upload"})
                }}
              />
            </div>
          ) : document.source_url ? (
            <div className="text-sm text-gray-700">
              <FormattedMessage
                id="analysis.document_source_url"
                defaultMessage="Source: "
              />
              <a 
                href={document.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                {document.source_url}
              </a>
            </div>
          ) : (
            <div className="text-sm text-gray-700">
              <FormattedMessage
                id="analysis.document_source"
                defaultMessage="Source: {source}"
                values={{
                  source: intl.formatMessage({id: "analysis.source_unknown", defaultMessage: "Unknown"})
                }}
              />
            </div>
          )}
        </div>
        
        {/* Metadata section */}
        {document.info?.meta && (
          <div className="mb-3">
            <h3 className="text-sm font-medium mb-1 text-gray-800 border-b border-gray-200 pb-1">
              <FormattedMessage id="analysis.document_meta" defaultMessage="PDF Metadata" />
            </h3>
            <div className="space-y-1">
              {document.info.meta.Author && (
                <div className="text-sm">
                  <span className="text-gray-600 mr-1">
                    <FormattedMessage id="analysis.author" defaultMessage="Author:" />
                  </span> 
                  <span className="text-gray-800">{document.info.meta.Author}</span>
                </div>
              )}
              {document.info.meta.Producer && (
                <div className="text-sm">
                  <span className="text-gray-600 mr-1">
                    <FormattedMessage id="analysis.producer" defaultMessage="Producer:" />
                  </span> 
                  <span className="text-gray-800">{document.info.meta.Producer}</span>
                </div>
              )}
              {document.info.meta.Creator && (
                <div className="text-sm">
                  <span className="text-gray-600 mr-1">
                    <FormattedMessage id="analysis.creator" defaultMessage="Creator:" />
                  </span> 
                  <span className="text-gray-800">{document.info.meta.Creator}</span>
                </div>
              )}
              {document.info.meta.CreationDate && (
                <div className="text-sm">
                  <span className="text-gray-600 mr-1">
                    <FormattedMessage id="analysis.creation_date" defaultMessage="Created:" />
                  </span> 
                  <span className="text-gray-800">{document.info.meta.CreationDate.replace('D:', '')}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {document.info?.is_tagged !== undefined && (
          <div className="mb-3">
            <div className="text-sm text-gray-700">
              <span className="text-gray-600 mr-1">
                <FormattedMessage id="analysis.tagged_pdf" defaultMessage="Tagged PDF:" />
              </span> 
              <span className="text-gray-800">
                {document.info.is_tagged ? 
                  intl.formatMessage({id: "analysis.yes", defaultMessage: "Yes"}) : 
                  intl.formatMessage({id: "analysis.no", defaultMessage: "No"})}
              </span>
            </div>
          </div>
        )}

        {/* Table of Contents */}
        {document.info?.toc && document.info.toc.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-1 text-gray-800 border-b border-gray-200 pb-1">
              <FormattedMessage id="analysis.table_of_contents" defaultMessage="Table of Contents" />
              <span className="text-gray-500 ml-1 text-xs">
                ({document.info.toc.length})
              </span>
            </h3>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 350px)', minHeight: '100px' }}>
              {document.info.toc.map((tocItem, index) => (
                <div 
                  key={index}
                  className="py-1 hover:bg-gray-100 cursor-pointer text-sm"
                  style={{ paddingLeft: `${tocItem.level * 8}px` }}
                >
                  <span className="text-blue-600">{tocItem.title}</span>
                  <span className="text-gray-500 ml-1 text-xs">
                    (p.{tocItem.page + 1})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentInfo;
