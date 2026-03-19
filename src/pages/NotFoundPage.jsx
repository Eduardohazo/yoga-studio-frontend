import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-12 max-w-md w-full text-center">
        <h1 className="font-serif text-7xl font-bold text-primary mb-2">404</h1>
        <h2 className="font-serif text-2xl font-semibold text-gray-800 mb-3">Page not found</h2>
        <p className="text-gray-500 mb-8">The page you are looking for does not exist.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate(-1)} className="btn-secondary px-6 py-2">Go back</button>
          <Link to="/" className="btn-primary px-6 py-2">Go home</Link>
        </div>
      </div>
    </div>
  );
};
export default NotFoundPage;
