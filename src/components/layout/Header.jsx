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
    // Preserve search params when navigating back (for sorting, filtering, pagination)
    const urlParams = new URLSearchParams(location.search);
    
    // Keep only the necessary params
    const paramsToCopy = ['sortField', 'sortDir', 'search', 'status', 'page'];
    const returnParams = new URLSearchParams();
    
    paramsToCopy.forEach(param => {
      if (urlParams.has(param)) {
        returnParams.set(param, urlParams.get(param));
      }
    });
    
    const searchParamsString = returnParams.toString();
    navigate({
      pathname: '/',
      search: searchParamsString ? `?${searchParamsString}` : ''
    });
  };
  
  return (
    <header className="bg-white shadow">
      <div className="p-4 md:p-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Conditionally render Back button or Home icon placeholder */}
          {!isDashboard ? (
            <button 
              onClick={handleBackClick}
              className="mr-4 text-gray-600 hover:bg-gray-100 p-1 rounded" 
              title={intl.formatMessage({ id: "app.back_to_dashboard", defaultMessage: "Back to Documents" })}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            // Placeholder Home icon on Dashboard to maintain alignment
            <div className="mr-4 p-1" aria-hidden="true"> {/* Same spacing as button */} 
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
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
        
        <div className="flex items-center">
          {/* Logout Button */}
          <button 
            onClick={() => { console.log("Logout clicked"); /* TODO: Implement logout logic */ }}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FormattedMessage id="app.logout" defaultMessage="Logout" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 