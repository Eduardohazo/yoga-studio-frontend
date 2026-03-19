import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const token = localStorage.getItem('accessToken');
 if (token) {
 getMe()
 .then((res) => setUser(res.data.data))
 .catch(() => localStorage.removeItem('accessToken'))
 .finally(() => setLoading(false));
 } else {
 setLoading(false);
 }
 }, []);

 const loginUser = (token, userData) => {
 localStorage.setItem('accessToken', token);
 setUser(userData);
 };

 const logoutUser = () => {
 localStorage.removeItem('accessToken');
 setUser(null);
 };

 return (
 <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, setUser }}>
 {children}
 </AuthContext.Provider>
 );
};

export const useAuth = () => useContext(AuthContext);