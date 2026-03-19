import axiosClient from './axiosClient';

export const getClasses = (params) => axiosClient.get('/classes', { params });
export const getClass = (id) => axiosClient.get(`/classes/${id}`);
export const createClass = (data) => axiosClient.post('/classes', data);
export const updateClass = (id, data) => axiosClient.put(`/classes/${id}`, data);
export const deleteClass = (id) => axiosClient.delete(`/classes/${id}`);