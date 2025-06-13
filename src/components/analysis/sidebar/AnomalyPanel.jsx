import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

/**
 * Individual anomaly item component
 */
const AnomalyItem = ({ anomaly, zeroAreaObjects }) => {
  const intl = useIntl();
  
  return (
    <div className="bg-gray-50 p-3 rounded text-sm">
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
      {anomaly.type === 'zero-area' && zeroAreaObjects?.length > 0 && (
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
  );
};

/**
 * Anomaly Detection panel for the analysis sidebar
 */
const AnomalyPanel = ({ anomalies, zeroAreaObjects }) => {
  return (
    <div className="p-4 border-t border-gray-200">
      <h2 className="font-medium mb-2">
        <FormattedMessage id="analysis.anomaly_detection" defaultMessage="Anomaly Detection" />
      </h2>
      <div className="space-y-2">
        {anomalies.map((anomaly, index) => (
          <AnomalyItem 
            key={index} 
            anomaly={anomaly} 
            zeroAreaObjects={anomaly.type === 'zero-area' ? zeroAreaObjects : []}
          />
        ))}
      </div>
    </div>
  );
};

export default AnomalyPanel;
