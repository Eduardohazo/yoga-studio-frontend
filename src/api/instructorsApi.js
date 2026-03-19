import axiosClient from './axiosClient';

export const getInstructors = () => axiosClient.get('/instructors');
export const getInstructor = (id) => axiosClient.get(`/instructors/${id}`);
export const updateMyProfile = (data) => axiosClient.put('/instructors/me', data);