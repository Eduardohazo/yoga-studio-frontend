import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import useFetch from '../../hooks/useFetch';
import { getMyPayments } from '../../api/paymentsApi';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { formatDate, formatPrice } from '../../utils/formatDate';

const statusColor = { succeeded: 'green', pending: 'yellow', failed: 'red', refunded: 'gray' };

const ManagePayments = () => {
 const { data: payments, loading } = useFetch(getMyPayments);
 return (
 <div className="flex min-h-screen">
 <Sidebar />
 <div className="flex-1 p-8">
 <h1 className="font-serif text-3xl font-bold text-gray-800 mb-6">Payments</h1>
 {loading ? <Spinner size="lg" /> : (
 <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
 <table className="w-full text-sm">
 <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
 <tr>{['Amount','Type','Status','Date','Stripe ID'].map((h) => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
 </thead>
 <tbody className="divide-y divide-gray-50">
 {(payments || []).map((p) => (
 <tr key={p._id} className="hover:bg-gray-50/50">
 <td className="px-4 py-3 font-medium text-gray-800">{formatPrice(p.amount)}</td>
 <td className="px-4 py-3 text-gray-600 capitalize">{p.type}</td>
 <td className="px-4 py-3"><Badge label={p.status} variant={statusColor[p.status]} /></td>
 <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(p.createdAt)}</td>
 <td className="px-4 py-3 text-gray-400 text-xs font-mono truncate max-w-[120px]">{p.stripePaymentIntentId || '—'}</td>
 </tr>
 ))}
 {!(payments || []).length && <tr><td colSpan={5} className="text-center py-10 text-gray-400">No payments yet.</td></tr>}
 </tbody>
 </table>
 </div>
 )}
 </div>
 </div>
 );
};
export default ManagePayments;