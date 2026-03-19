import React, { useState } from 'react';
import { createBooking } from '../../api/bookingsApi';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const BookingForm = ({ scheduleId, onSuccess, onClose }) => {
 const [notes, setNotes] = useState('');
 const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
 e.preventDefault();
 setLoading(true);
 try {
 await createBooking({ scheduleId, notes });
 toast.success('Class booked successfully! ���');
 onSuccess?.();
 onClose?.();
 } catch (err) {
 toast.error(err.response?.data?.message || 'Booking failed');
 } finally {
 setLoading(false);
 }
 };

 return (
 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Notes (optional)</label>
 <textarea
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 rows={3}
 placeholder="Any injuries, special requests..."
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
 />
 </div>
 <div className="flex gap-3">
 <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
 <Button type="submit" loading={loading} className="flex-1">Confirm Booking</Button>
 </div>
 </form>
 );
};

export default BookingForm;