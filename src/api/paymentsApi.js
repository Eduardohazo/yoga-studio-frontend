import axiosClient from './axiosClient';

export const createPaymentIntent = (data) => axiosClient.post('/payments/create-intent', data);
export const getMyPayments = () => axiosClient.get('/payments/my');