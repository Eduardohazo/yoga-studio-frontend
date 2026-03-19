import React from 'react';

// Wraps any table to make it horizontally scrollable on mobile
const ResponsiveTable = ({ children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      {children}
    </div>
  </div>
);

export default ResponsiveTable;
