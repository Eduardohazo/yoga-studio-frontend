import React, { useState } from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import PaymentModal from '../payment/PaymentModal';
import { formatPrice } from '../../utils/formatDate';
import { createBookingIntent } from '../../api/bookingsApi';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const levelColor = { beginner:'green', intermediate:'yellow', advanced:'red', all:'blue' };

const ClassDetail = ({ cls, schedules = [], onRefresh }) => {
 const { user } = useAuth();
 const [paymentData, setPaymentData] = useState(null);
 const [loadingSlot, setLoadingSlot] = useState(null);

 const handleBook = async (scheduleId) => {
 setLoadingSlot(scheduleId);
 try {
 const res = await createBookingIntent({ scheduleId });
 setPaymentData({ ...res.data.data, scheduleId });
 } catch (err) {
 toast.error(err.response?.data?.message || 'Could not initiate booking');
 } finally {
 setLoadingSlot(null);
 }
 };

 return (
 <div className="space-y-6">
 {/* Class info */}
 <div className="card">
 {cls.image && (
 <img src={cls.image} alt={cls.title} className="w-full h-64 object-cover rounded-xl mb-6" />
 )}
 <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
 <h1 className="font-serif text-3xl font-bold text-gray-800">{cls.title}</h1>
 <span className="text-2xl font-bold text-primary">{formatPrice(cls.price)}</span>
 </div>
 <div className="flex gap-2 mb-4">
 <Badge label={cls.type} variant="gray" />
 <Badge label={cls.level} variant={levelColor[cls.level]} />
 <span className="text-sm text-gray-500">{cls.duration} min</span>
 </div>
 <p className="text-gray-600 leading-relaxed">{cls.description}</p>
 </div>

 {/* Available sessions */}
 {schedules.length > 0 && (
 <div className="card">
 <h2 className="font-serif text-xl font-semibold mb-4">Available Sessions</h2>
 <div className="space-y-3">
 {schedules.map((slot) => {
 const spots = slot.capacity - slot.enrolled;
 return (
 <div key={slot._id} className="flex items-center justify-between border border-gray-100 rounded-xl p-4 relative">
 {loadingSlot === slot._id && (
 <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center z-10">
 <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
 </div>
 )}
 <div>
 <p className="font-medium text-gray-700">{new Date(slot.date).toDateString()}</p>
 <p className="text-sm text-gray-500">{slot.startTime} – {slot.endTime} · {slot.room}</p>
 </div>
 <div className="text-right">
 <p className="text-xs text-gray-400 mb-1">{spots} spots left</p>
 {!user ? (
 <Link to="/login" className="text-sm text-primary hover:underline">Login to book</Link>
 ) : spots === 0 || slot.status !== 'scheduled' ? (
 <span className="text-sm text-gray-400">{spots === 0 ? 'Full' : 'Unavailable'}</span>
 ) : (
 <Button size="sm" onClick={() => handleBook(slot._id)}>
 Book · {formatPrice(cls.price)}
 </Button>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* Payment Modal */}
 <PaymentModal
 isOpen={!!paymentData}
 bookingData={paymentData}
 onClose={() => setPaymentData(null)}
 onSuccess={() => { setPaymentData(null); onRefresh?.(); }}
 />
 </div>
 );
};

export default ClassDetail;