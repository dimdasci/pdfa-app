import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileNotice from './MobileNotice';

const MainLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile (viewport width less than 768px)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      
      {/* Show mobile notice for mobile devices */}
      {isMobile && <MobileNotice />}
      
      {/* Main content area */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout; 