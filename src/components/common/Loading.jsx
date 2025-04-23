import React from 'react';
import { FormattedMessage } from 'react-intl';

/**
 * Loading component displays a spinner with optional message
 * @param {Object} props - Component props
 * @param {string} props.message - Custom loading message (optional)
 * @param {boolean} props.fullScreen - Whether to display full screen
 */
const Loading = ({ message, fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600">
        {message ? (
          message
        ) : (
          <FormattedMessage id="common.loading" defaultMessage="Loading..." />
        )}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading; 