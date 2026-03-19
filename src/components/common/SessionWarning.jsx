import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getToken } from '../../utils/tokenStorage';

const SessionWarning = () => {
 const { user } = useAuth();
 const [show, setShow] = useState(false);
 const [seconds, setSeconds] = useState(0);

 useEffect(() => {
 if (!user) return;
 const check = () => {
 const token = getToken();
 if (!token) return;
 try {
 const payload = JSON.parse(atob(token.split('.')[1]));
 const msLeft = payload.exp * 1000 - Date.now();
 if (msLeft > 0 && msLeft <= 120000) {
 setShow(true);
 setSeconds(Math.floor(msLeft / 1000));
 } else { setShow(false); }
 } catch { setShow(false); }
 };
 const interval = setInterval(check, 10000);
 check();
 return () => clearInterval(interval);
 }, [user]);

 useEffect(() => {
 if (!show) return;
 const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
 return () => clearInterval(t);
 }, [show]);

 if (!show || !user) return null;
 return (
 <div className="fixed bottom-4 right-4 z-50 bg-yellow-50 border border-yellow-300 rounded-2xl p-4 shadow-lg max-w-xs">
 <p className="font-semibold text-yellow-800 text-sm mb-1">Session expiring in {seconds}s</p>
 <p className="text-yellow-700 text-xs mb-3">Your token will refresh automatically.</p>
 <button onClick={() => setShow(false)}
 className="text-xs text-yellow-700 border border-yellow-300 rounded-lg px-3 py-1.5">
 Dismiss
 </button>
 </div>
 );
};
export default SessionWarning;