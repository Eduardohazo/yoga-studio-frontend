import axiosClient from './axiosClient';

export const getMyBookings = () => axiosClient.get('/bookings/my');
export const getAllBookings = () => axiosClient.get('/bookings/all');
export const createPaypalOrder = (data) => axiosClient.post('/bookings/create-paypal-order', data);
export const capturePaypalOrder = (data) => axiosClient.post('/bookings/capture-paypal', data);
export const bookFree = (data) => axiosClient.post('/bookings/free', data);
export const cancelBooking = (id) => axiosClient.patch(`/bookings/${id}/cancel`);