
import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  userType?: 'buyer' | 'vendor' | 'driver' | null;
  hideFooter?: boolean;
  hideHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  userType = null, 
  hideFooter = false, 
  hideHeader = false 
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header userType={userType} />}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {!hideFooter && <Footer minimal={userType !== null} />}
    </div>
  );
};

export default Layout;
