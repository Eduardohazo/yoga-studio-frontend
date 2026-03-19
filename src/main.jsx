import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store  from './redux/store';
import router from './router';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </Provider>
);
