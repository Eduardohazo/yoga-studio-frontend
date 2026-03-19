import React, { useState, useEffect, useRef } from 'react';
import { createPaypalOrder, capturePaypalOrder } from '../../api/bookingsApi';
import { formatPrice, formatDate } from '../../utils/formatDate';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import toast from 'react-hot-toast';

// ── Load PayPal SDK dynamically ───────────────────────────────────────────────
const loadPayPalScript = (clientId) => {
 return new Promise((resolve, reject) => {
 // Remove existing PayPal script if any
 const existing = document.getElementById('paypal-sdk');
 if (existing) existing.remove();

 const script = document.createElement('script');
 script.id = 'paypal-sdk';
 script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
 script.onload = () => resolve();
 script.onerror = () => reject(new Error('PayPal SDK failed to load'));
 document.body.appendChild(script);
 });
};

// ── Main PayPal Modal ─────────────────────────────────────────────────────────
const PayPalModal = ({ isOpen, onClose, scheduleId, onSuccess }) => {
 const [step, setStep] = useState('summary'); // summary → paying → done
 const [orderData, setOrderData] = useState(null);
 const [loading, setLoading] = useState(false);
 const [sdkReady, setSdkReady] = useState(false);
 const [notes, setNotes] = useState('');
 const paypalRef = useRef(null);

 // Load PayPal SDK when modal opens
 useEffect(() => {
 if (!isOpen) return;
 const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
 if (!clientId || clientId === 'FAKE_PAYPAL_CLIENT_ID') {
 setSdkReady(true); // still show UI in dev mode
 return;
 }
 loadPayPalScript(clientId)
 .then(() => setSdkReady(true))
 .catch(() => toast.error('Could not load PayPal. Check your internet connection.'));
 }, [isOpen]);

 // Step 1 — Create PayPal order on server when user clicks "Proceed to PayPal"
 const handleProceed = async () => {
 setLoading(true);
 try {
 const res = await createPaypalOrder({ scheduleId });
 setOrderData(res.data.data);
 setStep('paying');
 } catch (err) {
 toast.error(err.response?.data?.message || 'Could not initiate payment');
 } finally {
 setLoading(false);
 }
 };

 // Step 2 — Render PayPal buttons after order is created
 useEffect(() => {
 if (step !== 'paying' || !orderData || !sdkReady || !paypalRef.current) return;
 if (!window.paypal) return;

 // Clear previous render
 paypalRef.current.innerHTML = '';

 window.paypal.Buttons({
 style: {
 layout: 'vertical',
 color: 'blue',
 shape: 'rect',
 label: 'pay',
 height: 50,
 },

 // Called when PayPal button is clicked — returns the existing order ID
 createOrder: () => orderData.orderId,

 // Called when user approves the payment in PayPal popup
 onApprove: async (data) => {
 setStep('capturing');
 try {
 await capturePaypalOrder({
 orderId: data.orderID,
 scheduleId: scheduleId,
 notes,
 });
 setStep('done');
 toast.success('Payment successful! Class booked ���');
 setTimeout(() => { onSuccess?.(); onClose?.(); }, 2000);
 } catch (err) {
 toast.error(err.response?.data?.message || 'Payment capture failed');
 setStep('paying');
 }
 },

 // Called if user cancels in the PayPal popup
 onCancel: () => {
 toast('Payment cancelled. You can try again.', { icon: 'ℹ' });
 },

 // Called if there is an error
 onError: (err) => {
 console.error('PayPal error:', err);
 toast.error('PayPal encountered an error. Please try again.');
 },
 }).render(paypalRef.current);
 }, [step, orderData, sdkReady]);

 // Reset when modal closes
 useEffect(() => {
 if (!isOpen) {
 setStep('summary');
 setOrderData(null);
 setNotes('');
 }
 }, [isOpen]);

 if (!isOpen) return null;

 const isFakeKey = !import.meta.env.VITE_PAYPAL_CLIENT_ID ||
 import.meta.env.VITE_PAYPAL_CLIENT_ID === 'FAKE_PAYPAL_CLIENT_ID';

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
 <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
 onClick={e => e.stopPropagation()}>

 {/* Header */}
 <div className="flex items-center justify-between mb-5">
 <h2 className="text-xl font-serif font-bold text-gray-800">
 {step === 'done' ? 'Booking Confirmed! ���' : 'Complete Your Booking'}
 </h2>
 <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
 </div>

 {/* ── STEP: Summary ── */}
 {step === 'summary' && orderData === null && (
 <div className="space-y-5">
 {/* Dev warning */}
 {isFakeKey && (
 <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
 <p className="text-yellow-800 text-sm font-semibold mb-1"> Development Mode</p>
 <p className="text-yellow-700 text-xs">
 PayPal is not configured yet. To test payments, add your PayPal Sandbox credentials to:
 </p>
 <p className="text-yellow-700 text-xs font-mono mt-1">
 server/.env → PAYPAL_CLIENT_ID<br/>
 client/.env → VITE_PAYPAL_CLIENT_ID
 </p>
 <p className="text-yellow-700 text-xs mt-1">
 Get them free at: <a href="https://developer.paypal.com" target="_blank" rel="noreferrer" className="underline">developer.paypal.com</a>
 </p>
 </div>
 )}

 <p className="text-gray-500 text-sm">Click below to load your class details and proceed to PayPal checkout.</p>

 <div>
 <label className="label-base">Notes for instructor (optional)</label>
 <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
 placeholder="Injuries, special requests..."
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
 </div>

 <div className="flex gap-3">
 <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
 <Button onClick={handleProceed} loading={loading} className="flex-1">
 Continue to PayPal
 </Button>
 </div>

 <p className="text-center text-xs text-gray-400">��� Payments processed securely by PayPal</p>
 </div>
 )}

 {/* ── STEP: Show class details + PayPal buttons ── */}
 {step === 'paying' && orderData && (
 <div className="space-y-5">
 {/* Class summary card */}
 <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
 <h3 className="font-semibold text-gray-800 mb-1">{orderData.className}</h3>
 <p className="text-sm text-gray-500">
 {orderData.date ? formatDate(orderData.date) : ''} · {orderData.startTime} – {orderData.endTime}
 </p>
 <p className="text-sm text-gray-500">��� {orderData.room}</p>
 <p className="text-2xl font-bold text-primary mt-3">{formatPrice(orderData.amount)}</p>
 </div>

 {/* PayPal buttons render here */}
 {!isFakeKey ? (
 <div>
 {!sdkReady ? (
 <div className="flex items-center justify-center py-6">
 <Spinner size="md" />
 <span className="ml-3 text-sm text-gray-500">Loading PayPal...</span>
 </div>
 ) : (
 <div ref={paypalRef} />
 )}
 </div>
 ) : (
 /* Dev mode — simulate success */
 <div className="space-y-3">
 <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
 <p className="text-yellow-700 text-xs">PayPal not configured. In production this shows the real PayPal buttons.</p>
 </div>
 <button
 onClick={async () => {
 setStep('capturing');
 try {
 await capturePaypalOrder({ orderId: orderData.orderId, scheduleId, notes });
 setStep('done');
 toast.success('Simulated booking confirmed! ���');
 setTimeout(() => { onSuccess?.(); onClose?.(); }, 2000);
 } catch (err) {
 toast.error(err.response?.data?.message || 'Error');
 setStep('paying');
 }
 }}
 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
 >
 [DEV] Simulate PayPal Payment
 </button>
 </div>
 )}

 <button onClick={onClose} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1">
 Cancel and go back
 </button>
 </div>
 )}

 {/* ── STEP: Capturing payment ── */}
 {step === 'capturing' && (
 <div className="text-center py-10">
 <Spinner size="lg" />
 <p className="text-gray-600 mt-4 font-medium">Confirming your payment...</p>
 <p className="text-gray-400 text-sm mt-1">Please wait, do not close this window.</p>
 </div>
 )}

 {/* ── STEP: Done ── */}
 {step === 'done' && (
 <div className="text-center py-8 space-y-4">
 <div className="text-6xl">���</div>
 <h3 className="font-serif text-2xl font-bold text-gray-800">You're booked!</h3>
 <p className="text-gray-500">Your payment was received and your spot is confirmed.</p>
 <p className="text-sm text-gray-400">You can view your booking in <span className="text-primary font-medium">My Bookings</span>.</p>
 </div>
 )}
 </div>
 </div>
 );
};

export default PayPalModal;