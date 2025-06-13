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
        
        {/* Metadata section */}
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

        {/* Table of Contents */}
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
  );
};

export default DocumentInfo;
