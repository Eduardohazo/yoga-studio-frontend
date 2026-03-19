import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { getSchedules, createSchedule, updateSchedule, cancelSchedule } from '../../api/scheduleApi';
import { getClasses } from '../../api/classesApi';
import { getInstructors } from '../../api/instructorsApi';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const EMPTY = { class: '', instructor: '', date: '', startTime: '', endTime: '', room: 'Main Studio', capacity: 10, isRecurring: false };
const S = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
const statusColor = { scheduled: 'green', cancelled: 'red', completed: 'blue' };

const ManageSchedule = () => {
 const [schedules, setSchedules] = useState([]);
 const [classes, setClasses] = useState([]);
 const [instructors, setIns] = useState([]);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [showModal, setModal] = useState(false);
 const [cancelModal, setCancelModal] = useState(null);
 const [cancelReason, setCancelReason] = useState('');
 const [editing, setEditing] = useState(null);
 const [form, setForm] = useState(EMPTY);
 const [statusFilter, setStatusFilter] = useState('all');

 const load = async () => {
 setLoading(true);
 try {
 const [sR, cR, iR] = await Promise.all([getSchedules(), getClasses({ limit: 100 }), getInstructors()]);
 setSchedules(sR.data.data || []);
 setClasses(cR.data.data.classes || []);
 setIns(iR.data.data || []);
 } catch { toast.error('Failed to load data'); }
 finally { setLoading(false); }
 };
 useEffect(() => { load(); }, []);

 const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
 const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
 const openEdit = (s) => {
 setEditing(s._id);
 setForm({ class: s.class?._id || '', instructor: s.instructor?._id || '', date: s.date?.slice(0, 10) || '', startTime: s.startTime, endTime: s.endTime, room: s.room, capacity: s.capacity, isRecurring: s.isRecurring || false });
 setModal(true);
 };

 const handleSave = async (e) => {
 e.preventDefault(); setSaving(true);
 try {
 if (editing) { await updateSchedule(editing, form); toast.success('Schedule updated '); }
 else { await createSchedule(form); toast.success('Session created '); }
 setModal(false); load();
 } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
 finally { setSaving(false); }
 };

 const handleCancel = async () => {
 if (!cancelReason.trim()) return toast.error('Please enter a cancellation reason');
 try {
 await cancelSchedule(cancelModal._id, cancelReason);
 toast.success('Session cancelled & students notified ���');
 setCancelModal(null); setCancelReason(''); load();
 } catch (err) { toast.error(err.response?.data?.message || 'Error cancelling'); }
 };

 const filtered = statusFilter === 'all' ? schedules : schedules.filter(s => s.status === statusFilter);

 return (
 <div className="flex min-h-screen bg-gray-50">
 <Sidebar />
 <div className="flex-1 p-8 overflow-auto">
 <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
 <div>
 <h1 className="font-serif text-3xl font-bold text-gray-800">Schedule Management</h1>
 <p className="text-gray-500 text-sm mt-1">{schedules.length} sessions total</p>
 </div>
 <Button onClick={openNew}>+ New Session</Button>
 </div>

 {/* Status filter */}
 <div className="flex gap-2 mb-6 flex-wrap">
 {['all', 'scheduled', 'cancelled', 'completed'].map(s => (
 <button key={s} onClick={() => setStatusFilter(s)}
 className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${statusFilter === s ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary'}`}>
 {s}
 </button>
 ))}
 </div>

 {loading ? <Spinner size="lg" /> : (
 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
 <table className="w-full text-sm">
 <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
 <tr>
 {['Class', 'Instructor', 'Date', 'Time', 'Room', 'Enrolled', 'Status', 'Actions'].map(h => (
 <th key={h} className="px-4 py-3 text-left font-semibold whitespace-nowrap">{h}</th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50">
 {filtered.map((s) => (
 <tr key={s._id} className="hover:bg-gray-50/70 transition-colors">
 <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{s.class?.title}</td>
 <td className="px-4 py-3 text-gray-600">{s.instructor?.user?.name}</td>
 <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.date ? formatDate(s.date) : '—'}</td>
 <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.startTime} – {s.endTime}</td>
 <td className="px-4 py-3 text-gray-500">{s.room}</td>
 <td className="px-4 py-3">
 <div className="flex items-center gap-1">
 <span className={`font-medium ${s.enrolled >= s.capacity ? 'text-red-600' : 'text-gray-600'}`}>{s.enrolled}</span>
 <span className="text-gray-400">/ {s.capacity}</span>
 {s.enrolled >= s.capacity && <span className="text-xs text-red-500 font-medium ml-1">FULL</span>}
 </div>
 </td>
 <td className="px-4 py-3"><Badge label={s.status} variant={statusColor[s.status]} /></td>
 <td className="px-4 py-3">
 <div className="flex gap-2">
 {s.status === 'scheduled' && (
 <>
 <button onClick={() => openEdit(s)} className="text-xs text-blue-600 hover:underline font-medium">Edit</button>
 <button onClick={() => { setCancelModal(s); setCancelReason(''); }} className="text-xs text-red-500 hover:underline font-medium">Cancel</button>
 </>
 )}
 {s.status !== 'scheduled' && <span className="text-xs text-gray-300">—</span>}
 </div>
 </td>
 </tr>
 ))}
 {!filtered.length && (
 <tr><td colSpan={8} className="text-center py-12 text-gray-400">No sessions found.</td></tr>
 )}
 </tbody>
 </table>
 </div>
 )}

 {/* Create / Edit Modal */}
 <Modal isOpen={showModal} onClose={() => setModal(false)} title={editing ? 'Edit Session' : 'New Session'}>
 <form onSubmit={handleSave} className="space-y-4">
 <div>
 <label className="label-base">Class *</label>
 <select value={form.class} onChange={e => set('class', e.target.value)} required className={S}>
 <option value="">Select class</option>
 {classes.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
 </select>
 </div>
 <div>
 <label className="label-base">Instructor *</label>
 <select value={form.instructor} onChange={e => set('instructor', e.target.value)} required className={S}>
 <option value="">Select instructor</option>
 {instructors.map(i => <option key={i._id} value={i._id}>{i.user?.name}</option>)}
 </select>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="label-base">Date *</label>
 <input type="date" value={form.date} onChange={e => set('date', e.target.value)} required className={S} />
 </div>
 <div>
 <label className="label-base">Room</label>
 <input value={form.room} onChange={e => set('room', e.target.value)} className={S} />
 </div>
 </div>
 <div className="grid grid-cols-3 gap-3">
 <div>
 <label className="label-base">Start *</label>
 <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} required className={S} />
 </div>
 <div>
 <label className="label-base">End *</label>
 <input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} required className={S} />
 </div>
 <div>
 <label className="label-base">Capacity *</label>
 <input type="number" min="1" value={form.capacity} onChange={e => set('capacity', e.target.value)} required className={S} />
 </div>
 </div>
 <div className="flex gap-3 pt-2">
 <Button type="button" variant="secondary" onClick={() => setModal(false)} className="flex-1">Cancel</Button>
 <Button type="submit" loading={saving} className="flex-1">{editing ? 'Update' : 'Create'}</Button>
 </div>
 </form>
 </Modal>

 {/* Cancel Session Modal */}
 <Modal isOpen={!!cancelModal} onClose={() => setCancelModal(null)} title="Cancel Session">
 <div className="space-y-4">
 <div className="p-4 bg-red-50 rounded-xl border border-red-100">
 <p className="font-medium text-gray-800">{cancelModal?.class?.title}</p>
 <p className="text-sm text-gray-500 mt-1">{cancelModal?.date ? formatDate(cancelModal.date) : ''} · {cancelModal?.startTime}</p>
 <p className="text-sm text-gray-500">{cancelModal?.enrolled} student(s) enrolled — they will be notified by email</p>
 </div>
 <div>
 <label className="label-base">Cancellation Reason *</label>
 <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} rows={3} required
 placeholder="e.g. Instructor unavailable, studio maintenance..."
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
 </div>
 <div className="flex gap-3">
 <Button variant="secondary" onClick={() => setCancelModal(null)} className="flex-1">Back</Button>
 <Button variant="danger" onClick={handleCancel} className="flex-1">Cancel Session & Notify Students</Button>
 </div>
 </div>
 </Modal>
 </div>
 </div>
 );
};
export default ManageSchedule;