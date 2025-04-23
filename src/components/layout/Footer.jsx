import React from 'react';
import { FormattedMessage } from 'react-intl';

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner p-4 text-center text-sm text-gray-600">
      <FormattedMessage 
        id="app.footer" 
        defaultMessage="PDF Structure Analysis Tool - Beta Version" 
      />
    </footer>
  );
};

export default Footer; 