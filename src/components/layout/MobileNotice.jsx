import React from 'react';
import { FormattedMessage } from 'react-intl';

const MobileNotice = () => {
  return (
    <div className="bg-yellow-50 border-y border-yellow-200 p-3 text-center">
      <p className="text-sm text-yellow-800">
        <FormattedMessage 
          id="app.mobile_notice" 
          defaultMessage="The app is designed for desktop. Limited functionality is available on mobile." 
        />
      </p>
    </div>
  );
};

export default MobileNotice; 