import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { getSchedules, createSchedule, updateSchedule, cancelSchedule } from '../../api/scheduleApi';
import { getClasses } from '../../api/classesApi';
import { getInstructors } from '../../api/instructorsApi';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const EMPTY = { class: '', instructor: '', date: '', startTime: '', endTime: '', room: 'Main Studio', capacity: 10 };

const TeacherSchedule = () => {
 const [schedules, setSchedules] = useState([]);
 const [classes, setClasses] = useState([]);
 const [instructors, setInstructors] = useState([]);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [showModal, setShowModal] = useState(false);
 const [editing, setEditing] = useState(null);
 const [form, setForm] = useState(EMPTY);

 const load = async () => {
 setLoading(true);
 try {
 const [sRes, cRes, iRes] = await Promise.all([getSchedules(), getClasses(), getInstructors()]);
 setSchedules(sRes.data.data);
 setClasses(cRes.data.data.classes || []);
 setInstructors(iRes.data.data || []);
 } finally { setLoading(false); }
 };
 useEffect(() => { load(); }, []);

 const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
 const openEdit = (s) => {
 setEditing(s._id);
 setForm({ class: s.class?._id || '', instructor: s.instructor?._id || '', date: s.date?.slice(0, 10) || '', startTime: s.startTime, endTime: s.endTime, room: s.room, capacity: s.capacity });
 setShowModal(true);
 };

 const handleSave = async (e) => {
 e.preventDefault();
 setSaving(true);
 try {
 if (editing) { await updateSchedule(editing, form); toast.success('Schedule updated'); }
 else { await createSchedule(form); toast.success('Schedule created'); }
 setShowModal(false);
 load();
 } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
 finally { setSaving(false); }
 };

 const handleCancel = async (id) => {
 const reason = window.prompt('Reason for cancellation?');
 if (reason === null) return;
 try { await cancelSchedule(id, reason); toast.success('Cancelled & students notified'); load(); }
 catch (err) { toast.error(err.response?.data?.message || 'Error'); }
 };

 const statusColor = { scheduled: 'green', cancelled: 'red', completed: 'blue' };

 return (
 <div className="flex min-h-screen">
 <Sidebar />
 <div className="flex-1 p-8">
 <div className="flex items-center justify-between mb-6">
 <h1 className="font-serif text-3xl font-bold text-gray-800">Schedule Management</h1>
 <Button onClick={openNew}>+ New Session</Button>
 </div>

 {loading ? <Spinner size="lg" /> : (
 <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
 <table className="w-full text-sm">
 <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
 <tr>
 {['Class', 'Instructor', 'Date', 'Time', 'Room', 'Enrolled', 'Status', ''].map((h) => (
 <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50">
 {schedules.map((s) => (
 <tr key={s._id} className="hover:bg-gray-50/50 transition-colors">
 <td className="px-4 py-3 font-medium text-gray-800">{s.class?.title}</td>
 <td className="px-4 py-3 text-gray-600">{s.instructor?.user?.name}</td>
 <td className="px-4 py-3 text-gray-600">{s.date ? formatDate(s.date) : '—'}</td>
 <td className="px-4 py-3 text-gray-600">{s.startTime} – {s.endTime}</td>
 <td className="px-4 py-3 text-gray-500">{s.room}</td>
 <td className="px-4 py-3 text-gray-600">{s.enrolled}/{s.capacity}</td>
 <td className="px-4 py-3"><Badge label={s.status} variant={statusColor[s.status]} /></td>
 <td className="px-4 py-3">
 <div className="flex gap-2">
 <button onClick={() => openEdit(s)} className="text-xs text-primary hover:underline">Edit</button>
 {s.status === 'scheduled' && (
 <button onClick={() => handleCancel(s._id)} className="text-xs text-red-500 hover:underline">Cancel</button>
 )}
 </div>
 </td>
 </tr>
 ))}
 {!schedules.length && (
 <tr><td colSpan={8} className="text-center py-10 text-gray-400">No schedules yet.</td></tr>
 )}
 </tbody>
 </table>
 </div>
 )}

 <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Session' : 'New Session'}>
 <form onSubmit={handleSave} className="space-y-3">
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Class</label>
 <select value={form.class} onChange={(e) => setForm({...form, class: e.target.value})} required
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
 <option value="">Select class</option>
 {classes.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
 </select>
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Instructor</label>
 <select value={form.instructor} onChange={(e) => setForm({...form, instructor: e.target.value})} required
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
 <option value="">Select instructor</option>
 {instructors.map((i) => <option key={i._id} value={i._id}>{i.user?.name}</option>)}
 </select>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Date</label>
 <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} required
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Room</label>
 <input value={form.room} onChange={(e) => setForm({...form, room: e.target.value})}
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
 </div>
 </div>
 <div className="grid grid-cols-3 gap-3">
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Start</label>
 <input type="time" value={form.startTime} onChange={(e) => setForm({...form, startTime: e.target.value})} required
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">End</label>
 <input type="time" value={form.endTime} onChange={(e) => setForm({...form, endTime: e.target.value})} required
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Capacity</label>
 <input type="number" min="1" value={form.capacity} onChange={(e) => setForm({...form, capacity: e.target.value})} required
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
 </div>
 </div>
 <div className="flex gap-3 pt-2">
 <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
 <Button type="submit" loading={saving} className="flex-1">{editing ? 'Update' : 'Create'}</Button>
 </div>
 </form>
 </Modal>
 </div>
 </div>
 );
};

export default TeacherSchedule;