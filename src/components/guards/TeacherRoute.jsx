import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';

const TeacherRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (!['teacher','admin'].includes(user.role)) return <Navigate to="/" replace />;
  return children;
};
export default TeacherRoute;
