import React from 'react';
import Sidebar from './Sidebar';

const AdminWrapper = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 overflow-auto min-w-0">
      {children}
    </div>
  </div>
);

export default AdminWrapper;
