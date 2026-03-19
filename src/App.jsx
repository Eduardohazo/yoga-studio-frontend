import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar         from './components/layout/Navbar';
import Footer         from './components/layout/Footer';
import SessionWarning from './components/common/SessionWarning';
import ErrorBoundary  from './components/common/ErrorBoundary';

const App = () => (
  <ErrorBoundary>
    <ScrollRestoration />
    <Navbar />
    <main className="min-h-screen">
      <Outlet />
    </main>
    <Footer />
    <SessionWarning />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: { fontSize: '14px', borderRadius: '12px' },
        success: { iconTheme: { primary: '#5B7C4E', secondary: '#fff' } },
        error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
      }}
    />
  </ErrorBoundary>
);

export default App;
