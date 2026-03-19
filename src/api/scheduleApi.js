import axiosClient from './axiosClient';

export const getSchedules = (params) => axiosClient.get('/schedules', { params });
export const getSchedule = (id) => axiosClient.get(`/schedules/${id}`);
export const createSchedule = (data) => axiosClient.post('/schedules', data);
export const updateSchedule = (id, data) => axiosClient.put(`/schedules/${id}`, data);
export const cancelSchedule = (id, reason) => axiosClient.patch(`/schedules/${id}/cancel`, { reason });