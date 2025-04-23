import React from 'react';
import { useIntl } from 'react-intl';
import { useApiVersion } from '../../hooks/useApi';

const Footer = () => {
  const intl = useIntl();
  const { version, loading, error } = useApiVersion();
  
  // Create the footer text with the API version
  const footerText = intl.formatMessage(
    { id: "app.footer", defaultMessage: "PDF Structure Analysis Tool - {version}" },
    { version: loading ? 'Beta' : error ? 'Beta' : `v${version}` }
  );
  
  return (
    <footer className="bg-white shadow-inner p-4 text-center text-sm text-gray-600">
      {footerText}
    </footer>
  );
};

export default Footer; 