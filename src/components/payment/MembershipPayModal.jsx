import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../../api/axiosClient';
import { formatPrice } from '../../utils/formatDate';
import Spinner from '../common/Spinner';
import toast from 'react-hot-toast';

const loadPayPalScript = (clientId) => new Promise((resolve, reject) => {
  const existing = document.getElementById('paypal-sdk');
  if (existing) existing.remove();
  const script   = document.createElement('script');
  script.id      = 'paypal-sdk';
  script.src     = 'https://www.paypal.com/sdk/js?client-id=' + clientId + '&currency=USD';
  script.onload  = () => resolve();
  script.onerror = () => reject(new Error('PayPal SDK failed to load'));
  document.body.appendChild(script);
});

const MembershipPayModal = ({ isOpen, pkg, onClose, onSuccess }) => {
  const [step, setStep]     = useState('summary'); // summary | paying | done
  const [orderId, setOrderId] = useState(null);
  const [sdkReady, setSdk]  = useState(false);
  const paypalRef           = useRef(null);
  const isFake              = !import.meta.env.VITE_PAYPAL_CLIENT_ID ||
                               import.meta.env.VITE_PAYPAL_CLIENT_ID.includes('FAKE');

  useEffect(() => {
    if (!isOpen) return;
    if (isFake) { setSdk(true); return; }
    loadPayPalScript(import.meta.env.VITE_PAYPAL_CLIENT_ID)
      .then(() => setSdk(true))
      .catch(() => toast.error('Could not load PayPal'));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) { setStep('summary'); setOrderId(null); }
  }, [isOpen]);

  const handleProceed = async () => {
    setStep('paying');
    try {
      const res = await axiosClient.post('/memberships/create-paypal-order', { membershipId: pkg._id });
      setOrderId(res.data.data.orderId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not initiate payment');
      setStep('summary');
    }
  };

  useEffect(() => {
    if (step !== 'paying' || !orderId || !sdkReady || !paypalRef.current) return;
    if (!window.paypal) return;
    paypalRef.current.innerHTML = '';
    window.paypal.Buttons({
      style: { layout:'vertical', color:'blue', shape:'rect', label:'pay', height:48 },
      createOrder: () => orderId,
      onApprove: async (data) => {
        setStep('capturing');
        try {
          await axiosClient.post('/memberships/capture-paypal', {
            orderId: data.orderID,
            membershipId: pkg._id,
          });
          setStep('done');
          setTimeout(() => onSuccess?.(), 1500);
        } catch (err) {
          toast.error(err.response?.data?.message || 'Payment capture failed');
          setStep('paying');
        }
      },
      onCancel: () => toast('Payment cancelled', { icon: 'i' }),
      onError:  (err) => { console.error(err); toast.error('PayPal error'); },
    }).render(paypalRef.current);
  }, [step, orderId, sdkReady]);

  if (!isOpen || !pkg) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-serif font-bold text-gray-800">
            {step === 'done' ? 'Membership Activated!' : 'Complete Purchase'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        {/* Summary */}
        {step === 'summary' && (
          <div className="space-y-5">
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
              <p className="font-semibold text-gray-800 mb-1">{pkg.name}</p>
              <p className="text-sm text-gray-500 mb-1">{pkg.description}</p>
              <p className="text-sm text-gray-500">
                {pkg.classCredits ? pkg.classCredits + ' class credits' : 'Unlimited classes'}
                {' · '}{pkg.durationDays} days
              </p>
              <p className="text-2xl font-bold text-primary mt-3">{formatPrice(pkg.price)}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleProceed}
                className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark">
                Continue to PayPal
              </button>
            </div>
            <p className="text-center text-xs text-gray-400">Payments secured by PayPal</p>
          </div>
        )}

        {/* PayPal buttons */}
        {step === 'paying' && (
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
              <p className="font-semibold text-gray-800">{pkg.name}</p>
              <p className="text-2xl font-bold text-primary mt-1">{formatPrice(pkg.price)}</p>
            </div>
            {isFake ? (
              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                  <p className="text-yellow-700 text-xs">Dev mode — PayPal not configured</p>
                </div>
                <button onClick={async () => {
                  setStep('capturing');
                  try {
                    await axiosClient.post('/memberships/capture-paypal', {
                      orderId: orderId, membershipId: pkg._id,
                    });
                    setStep('done');
                    setTimeout(() => onSuccess?.(), 1500);
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Error');
                    setStep('paying');
                  }
                }} className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold">
                  [DEV] Simulate PayPal Payment
                </button>
              </div>
            ) : (
              !sdkReady
                ? <div className="flex items-center justify-center py-8 gap-3"><Spinner /><span className="text-sm text-gray-500">Loading PayPal...</span></div>
                : <div ref={paypalRef} />
            )}
            <button onClick={onClose} className="w-full text-xs text-gray-400 hover:text-gray-600 py-1">
              Cancel
            </button>
          </div>
        )}

        {/* Capturing */}
        {step === 'capturing' && (
          <div className="text-center py-10">
            <Spinner size="lg" />
            <p className="text-gray-600 mt-4">Confirming payment...</p>
          </div>
        )}

        {/* Done */}
        {step === 'done' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl font-bold">+</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">
              {pkg.name} activated!
            </h3>
            <p className="text-gray-500 text-sm">Redirecting to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipPayModal;
