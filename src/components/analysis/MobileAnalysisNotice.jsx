import React from 'react';
import { FormattedMessage } from 'react-intl';

/**
 * Mobile view notice for the analysis view
 */
const MobileAnalysisNotice = ({ onBackClick }) => {
  return (
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
          onClick={onBackClick}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FormattedMessage 
            id="app.back_to_dashboard" 
            defaultMessage="Back to Documents" 
          />
        </button>
      </div>
    </div>
  );
};

export default MobileAnalysisNotice;
