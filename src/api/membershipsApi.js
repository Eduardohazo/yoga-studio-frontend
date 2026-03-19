import axiosClient from './axiosClient';

export const getPackages = () => axiosClient.get('/memberships');
export const getMyMembership= () => axiosClient.get('/memberships/my');
export const getPackage = (id) => axiosClient.get(`/memberships/${id}`);
export const createPackage = (data) => axiosClient.post('/memberships', data);
export const updatePackage = (id, d) => axiosClient.put(`/memberships/${id}`, d);
export const deletePackage = (id) => axiosClient.delete(`/memberships/${id}`);