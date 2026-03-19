import React from 'react';
import Sidebar from './Sidebar';

// Wraps all admin and teacher pages.
// pt-14 = 56px space for the mobile fixed top bar
// md:pt-0 = no extra space on desktop (sidebar is on the left, not top)
const PanelLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 overflow-auto min-w-0 pt-14 md:pt-0">
      <div className="p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  </div>
);

export default PanelLayout;
