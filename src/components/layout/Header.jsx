import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

const Header = () => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're on the dashboard
  const isDashboard = location.pathname === '/';
  
  // Handle back button click
  const handleBackClick = () => {
    navigate('/');
  };
  
  return (
    <header className="bg-white shadow">
      <div className="p-4 md:p-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {!isDashboard && (
            <button 
              onClick={handleBackClick}
              className="mr-4 text-gray-600 hover:bg-gray-100 p-1 rounded" 
              title={intl.formatMessage({ id: "app.back_to_dashboard", defaultMessage: "Back to Documents" })}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <Link to="/" className="text-xl font-bold hidden md:block">
            <FormattedMessage 
              id="app.title" 
              defaultMessage="PDF Structure Analysis Tool" 
            />
          </Link>
          {/* Mobile short title */}
          <Link to="/" className="text-xl font-bold md:hidden">
            <FormattedMessage 
              id="app.name" 
              defaultMessage="PDF Analyser" 
            />
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/upload" 
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          >
            <span className="hidden md:inline">
              <FormattedMessage id="app.upload_pdf" defaultMessage="Upload PDF" />
            </span>
            <span className="md:hidden">
              <FormattedMessage id="app.upload" defaultMessage="Upload" />
            </span>
          </Link>
          
          <span className="text-gray-600 hidden md:inline">User Name</span>
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </header>
  );
};

export default Header; 