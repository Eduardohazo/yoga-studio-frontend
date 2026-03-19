import axiosClient from './axiosClient';
export const getDashboardStats = () => axiosClient.get('/admin/dashboard');
export const getRevenueReport = () => axiosClient.get('/admin/reports/revenue');