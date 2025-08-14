import React from 'react';
import EcoHeader from './EcoHeader';
import EcoFooter from './EcoFooter';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <EcoHeader />
      <main className={`flex-grow ${className}`}>
        {children}
      </main>
      <EcoFooter />
    </div>
  );
};

export default Layout;