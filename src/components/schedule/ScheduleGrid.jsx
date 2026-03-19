import React, { useState } from 'react';
import ScheduleSlot from './ScheduleSlot';
import PayPalModal from '../payment/PayPalModal';
import Spinner from '../common/Spinner';

const ScheduleGrid = ({ schedules, loading, onRefresh }) => {
 const [selectedSlot, setSelectedSlot] = useState(null);

 if (loading) return <Spinner size="lg" />;

 // Group by date
 const grouped = {};
 schedules.forEach((s) => {
 const key = new Date(s.date).toDateString();
 if (!grouped[key]) grouped[key] = [];
 grouped[key].push(s);
 });
 const days = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));

 if (!days.length) {
 return (
 <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
 <p className="text-4xl mb-3">���</p>
 <p className="text-gray-500">No classes scheduled for this period.</p>
 </div>
 );
 }

 return (
 <>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
 {days.map((day) => (
 <div key={day} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
 <div className="bg-primary/5 px-4 py-3 border-b border-gray-100">
 <p className="font-semibold text-primary text-sm">{day}</p>
 <p className="text-xs text-gray-400">{grouped[day].length} class{grouped[day].length !== 1 ? 'es' : ''}</p>
 </div>
 <div className="p-3 space-y-2">
 {grouped[day].map((slot) => (
 <ScheduleSlot key={slot._id} slot={slot} onBook={setSelectedSlot} />
 ))}
 </div>
 </div>
 ))}
 </div>

 {/* PayPal Payment Modal */}
 <PayPalModal
 isOpen={!!selectedSlot}
 scheduleId={selectedSlot}
 onClose={() => setSelectedSlot(null)}
 onSuccess={() => { setSelectedSlot(null); onRefresh?.(); }}
 />
 </>
 );
};

export default ScheduleGrid;