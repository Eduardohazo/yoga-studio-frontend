import axiosClient from './axiosClient';

export const getProfile = () => axiosClient.get('/users/profile');
export const updateProfile = (data) => axiosClient.put('/users/profile', data);
export const getAllUsers = () => axiosClient.get('/users/all');
export const updateUserRole = (id, role) => axiosClient.patch(`/users/${id}/role`, { role });