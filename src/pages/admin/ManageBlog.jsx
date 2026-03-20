import React from "react";
import Sidebar from "../../components/layout/Sidebar";

const ManageBlog = () => (
  <div className="flex min-h-screen flex-col md:flex-row">
    <Sidebar />
    <div className="flex-1 p-4 md:p-8">
      <h1 className="font-serif text-3xl font-bold text-gray-800 mb-4">
        Blog Manager
      </h1>
      <div className="card text-center py-16 text-gray-400">
        <p className="text-4xl mb-4">📝</p>
        <p className="px-4 md:px-0">
          Blog post editor — connect a rich text editor (e.g. React Quill) here.
        </p>
      </div>
    </div>
  </div>
);

export default ManageBlog;