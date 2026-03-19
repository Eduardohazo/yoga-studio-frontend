import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
 Elements,
 CardNumberElement,
 CardExpiryElement,
 CardCvcElement,
 useStripe,
 useElements,
} from '@stripe/react-stripe-js';
import { confirmBooking } from '../../api/bookingsApi';
import { formatPrice, formatDate } from '../../utils/formatDate';
import Button from '../common/Button';
import toast from 'react-hot-toast';

// Load Stripe once outside component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Card element style to match our design
const CARD_STYLE = {
 style: {
 base: {
 fontSize: '14px',
 color: '#374151',
 fontFamily: 'Inter, sans-serif',
 '::placeholder': { color: '#9CA3AF' },
 },
 invalid: { color: '#EF4444' },
 },
};

// ── Inner checkout form (needs Stripe context) ────────────────────────────────
const CheckoutForm = ({ bookingData, onSuccess, onClose }) => {
 const stripe = useStripe();
 const elements = useElements();
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [notes, setNotes] = useState('');

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!stripe || !elements) return;

 setLoading(true);
 setError('');

 try {
 // Step 1 — Confirm card payment with Stripe
 const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
 bookingData.clientSecret,
 {
 payment_method: {
 card: elements.getElement(CardNumberElement),
 billing_details: { email: bookingData.userEmail },
 },
 }
 );

 if (stripeError) {
 setError(stripeError.message);
 setLoading(false);
 return;
 }

 if (paymentIntent.status === 'succeeded') {
 // Step 2 — Confirm booking on our server
 await confirmBooking({
 scheduleId: bookingData.scheduleId,
 paymentIntentId: paymentIntent.id,
 notes,
 });

 toast.success('Payment successful! Class booked ���');
 onSuccess?.();
 onClose?.();
 }
 } catch (err) {
 setError(err.response?.data?.message || 'Booking failed. Please try again.');
 toast.error('Booking failed');
 } finally {
 setLoading(false);
 }
 };

 return (
 <form onSubmit={handleSubmit} className="space-y-5">
 {/* Class summary */}
 <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
 <h3 className="font-semibold text-gray-800 mb-1">{bookingData.className}</h3>
 <p className="text-sm text-gray-500">
 {bookingData.date ? formatDate(bookingData.date) : ''} · {bookingData.startTime} – {bookingData.endTime}
 </p>
 <p className="text-sm text-gray-500">��� {bookingData.room}</p>
 <p className="text-xl font-bold text-primary mt-2">{formatPrice(bookingData.amount)}</p>
 </div>

 {/* Card Number */}
 <div>
 <label className="label-base">Card Number</label>
 <div className="input-base py-3">
 <CardNumberElement options={CARD_STYLE} />
 </div>
 </div>

 {/* Expiry + CVC */}
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="label-base">Expiry Date</label>
 <div className="input-base py-3">
 <CardExpiryElement options={CARD_STYLE} />
 </div>
 </div>
 <div>
 <label className="label-base">CVC</label>
 <div className="input-base py-3">
 <CardCvcElement options={CARD_STYLE} />
 </div>
 </div>
 </div>

 {/* Notes */}
 <div>
 <label className="label-base">Notes for instructor (optional)</label>
 <textarea
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 rows={2}
 placeholder="Injuries, special requests..."
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
 />
 </div>

 {/* Error */}
 {error && (
 <div className="bg-red-50 border border-red-200 rounded-lg p-3">
 <p className="text-red-600 text-sm"> {error}</p>
 </div>
 )}

 {/* Test card hint (remove in production) */}
 {import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.includes('test') && (
 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
 <p className="text-yellow-700 text-xs font-medium mb-1">��� Test mode — use test card:</p>
 <p className="text-yellow-700 text-xs font-mono">4242 4242 4242 4242 · Any future date · Any CVC</p>
 </div>
 )}

 {/* Buttons */}
 <div className="flex gap-3 pt-1">
 <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
 Cancel
 </Button>
 <Button type="submit" loading={loading} className="flex-1">
 {loading ? 'Processing...' : `Pay ${formatPrice(bookingData.amount)}`}
 </Button>
 </div>

 <p className="text-center text-xs text-gray-400">
 ��� Secured by Stripe · Your card details are never stored on our servers
 </p>
 </form>
 );
};

// ── Main PaymentModal wrapper ─────────────────────────────────────────────────
const PaymentModal = ({ isOpen, onClose, bookingData, onSuccess }) => {
 if (!isOpen || !bookingData) return null;

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
 <div
 className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex items-center justify-between mb-5">
 <h2 className="text-xl font-serif font-bold text-gray-800">Complete Your Booking</h2>
 <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
 </div>

 <Elements stripe={stripePromise}>
 <CheckoutForm
 bookingData={bookingData}
 onSuccess={onSuccess}
 onClose={onClose}
 />
 </Elements>
 </div>
 </div>
 );
};

export default PaymentModal;