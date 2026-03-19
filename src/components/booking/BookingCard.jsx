import React, { useState } from 'react';
import { cancelBooking } from '../../api/bookingsApi';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatDate, formatPrice } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const statusColor = { confirmed:'green', cancelled:'red', attended:'blue', 'no-show':'gray' };
const paymentColor = { paid:'green', pending:'yellow', refunded:'blue', free:'gray' };

const BookingCard = ({ booking, onCancelled }) => {
 const [loading, setLoading] = useState(false);
 const { schedule } = booking;

 const handleCancel = async () => {
 const msg = booking.paymentStatus === 'paid'
 ? 'Cancel this booking? Your payment will be refunded automatically.'
 : 'Cancel this booking?';
 if (!window.confirm(msg)) return;
 setLoading(true);
 try {
 const res = await cancelBooking(booking._id);
 const wasRefunded = res.data.data?.paymentStatus === 'refunded';
 toast.success(wasRefunded ? 'Booking cancelled and payment refunded ���' : 'Booking cancelled');
 onCancelled?.();
 } catch (err) {
 toast.error(err.response?.data?.message || 'Cancel failed');
 } finally { setLoading(false); }
 };

 return (
 <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-1 flex-wrap">
 <h3 className="font-semibold text-gray-800">{schedule?.class?.title || 'Class'}</h3>
 <Badge label={booking.status} variant={statusColor[booking.status]} />
 <Badge label={booking.paymentStatus} variant={paymentColor[booking.paymentStatus]} />
 </div>
 <p className="text-sm text-gray-500">
 {schedule?.date ? formatDate(schedule.date) : '—'} · {schedule?.startTime} – {schedule?.endTime}
 </p>
 <p className="text-xs text-gray-400 mt-1">
 Instructor: {schedule?.instructor?.user?.name || '—'} · ��� {schedule?.room || 'Main Studio'}
 </p>
 {booking.paymentStatus === 'paid' && (
 <p className="text-xs text-green-600 mt-1 font-medium"> Paid · {formatPrice(schedule?.class?.price || 0)}</p>
 )}
 {booking.paymentStatus === 'refunded' && (
 <p className="text-xs text-blue-600 mt-1 font-medium">��� Refunded</p>
 )}
 {booking.notes && (
 <p className="text-xs text-gray-400 mt-1 italic">"{booking.notes}"</p>
 )}
 </div>
 {booking.status === 'confirmed' && (
 <Button variant="danger" size="sm" loading={loading} onClick={handleCancel}>
 Cancel{booking.paymentStatus === 'paid' ? ' & Refund' : ''}
 </Button>
 )}
 </div>
 );
};

export default BookingCard;