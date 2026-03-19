import { format, parseISO } from 'date-fns';

export const formatDate = (date) => format(parseISO(date), 'MMM dd, yyyy');
export const formatTime = (time) => time; // already "09:00"
export const formatPrice = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);