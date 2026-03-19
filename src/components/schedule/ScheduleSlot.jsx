import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { formatPrice } from '../../utils/formatDate';

const ScheduleSlot = ({ slot, onBook }) => {
  const { user }    = useAuth();
  const location    = useLocation();
  const spots       = slot.capacity - slot.enrolled;
  const isFull      = spots <= 0;
  const isCancelled = slot.status === 'cancelled';

  return (
    <div className={'border rounded-xl p-3 transition-colors ' +
      (isFull || isCancelled
        ? 'border-gray-100 bg-gray-50/50 opacity-60'
        : 'border-gray-100 hover:border-primary/30')}>

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm truncate">{slot.class?.title}</p>
          <p className="text-xs text-gray-500">{slot.startTime} - {slot.endTime} · {slot.room}</p>
          <p className="text-xs text-gray-400 truncate">{slot.instructor?.user?.name}</p>
          <p className="text-sm font-bold text-primary mt-1">{formatPrice(slot.class?.price || 0)}</p>
        </div>

        <div className="text-right shrink-0">
          <p className={'text-xs mb-1.5 ' + (isFull ? 'text-red-400 font-medium' : 'text-gray-400')}>
            {isFull ? 'Full' : spots + ' left'}
          </p>

          {isCancelled ? (
            <span className="text-xs text-red-400 font-medium">Cancelled</span>
          ) : isFull ? (
            <span className="text-xs text-gray-400">Fully booked</span>
          ) : !user ? (
            // Not logged in — send to login then back to schedule
            <Link
              to="/login"
              state={{ from: location }}
              className="text-xs bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded-lg transition-colors font-medium">
              Login to book
            </Link>
          ) : (
            // Logged in — pay directly
            <button
              onClick={() => onBook(slot._id)}
              className="text-xs bg-[#0070ba] hover:bg-[#003087] text-white px-3 py-1.5 rounded-lg transition-colors font-semibold">
              Pay with PayPal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleSlot;
