import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { getClasses, createClass, updateClass, deleteClass } from '../../api/classesApi';
import { getInstructors } from '../../api/instructorsApi';
import { formatPrice } from '../../utils/formatDate';
import { CLASS_TYPES, CLASS_LEVELS } from '../../utils/constants';
import toast from 'react-hot-toast';

const EMPTY = { title: '', description: '', type: 'hatha', level: 'all', duration: 60, capacity: 15, price: 0, image: '', instructor: '', tags: '' };
const S = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
const levelColor = { beginner: 'green', intermediate: 'yellow', advanced: 'red', all: 'blue' };

const ManageClasses = () => {
 const [classes, setClasses] = useState([]);
 const [instructors, setIns] = useState([]);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [showModal, setModal] = useState(false);
 const [deleteModal, setDeleteModal] = useState(null);
 const [editing, setEditing] = useState(null);
 const [form, setForm] = useState(EMPTY);
 const [search, setSearch] = useState('');

 const load = async () => {
 setLoading(true);
 try {
 const [cR, iR] = await Promise.all([getClasses({ limit: 100 }), getInstructors()]);
 setClasses(cR.data.data.classes || []);
 setIns(iR.data.data || []);
 } catch { toast.error('Failed to load data'); }
 finally { setLoading(false); }
 };
 useEffect(() => { load(); }, []);

 const h = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
 const openEdit = (c) => {
 setEditing(c._id);
 setForm({ title: c.title, description: c.description || '', type: c.type, level: c.level, duration: c.duration, capacity: c.capacity, price: c.price, image: c.image || '', instructor: c.instructor?._id || '', tags: (c.tags || []).join(', ') });
 setModal(true);
 };

 const handleSave = async (e) => {
 e.preventDefault(); setSaving(true);
 const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
 try {
 if (editing) { await updateClass(editing, payload); toast.success('Class updated '); }
 else { await createClass(payload); toast.success('Class created '); }
 setModal(false); load();
 } catch (err) { toast.error(err.response?.data?.message || 'Error saving class'); }
 finally { setSaving(false); }
 };

 const handleDelete = async (id) => {
 try { await deleteClass(id); toast.success('Class deactivated'); setDeleteModal(null); load(); }
 catch { toast.error('Error deleting class'); }
 };

 const filtered = classes.filter(c =>
 c.title.toLowerCase().includes(search.toLowerCase()) ||
 c.type.toLowerCase().includes(search.toLowerCase())
 );

 return (
 <div className="flex min-h-screen bg-gray-50">
 <Sidebar />
 <div className="flex-1 p-8 overflow-auto">
 {/* Header */}
 <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
 <div>
 <h1 className="font-serif text-3xl font-bold text-gray-800">Manage Classes</h1>
 <p className="text-gray-500 text-sm mt-1">{classes.length} classes total</p>
 </div>
 <Button onClick={openNew}>+ Add Class</Button>
 </div>

 {/* Search */}
 <div className="mb-6">
 <input value={search} onChange={e => setSearch(e.target.value)} placeholder="��� Search classes by name or type..."
 className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white" />
 </div>

 {loading ? <Spinner size="lg" /> : (
 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
 <table className="w-full text-sm">
 <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
 <tr>
 {['Class', 'Type', 'Level', 'Duration', 'Capacity', 'Price', 'Instructor', 'Status', 'Actions'].map(h => (
 <th key={h} className="px-4 py-3 text-left font-semibold whitespace-nowrap">{h}</th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50">
 {filtered.map((c) => (
 <tr key={c._id} className="hover:bg-gray-50/70 transition-colors">
 <td className="px-4 py-3">
 <div className="flex items-center gap-3">
 {c.image && <img src={c.image} alt="" className="h-9 w-9 rounded-lg object-cover shrink-0" />}
 <div>
 <p className="font-semibold text-gray-800">{c.title}</p>
 {c.tags?.length > 0 && <p className="text-xs text-gray-400">{c.tags.join(', ')}</p>}
 </div>
 </div>
 </td>
 <td className="px-4 py-3"><Badge label={c.type} variant="gray" /></td>
 <td className="px-4 py-3"><Badge label={c.level} variant={levelColor[c.level]} /></td>
 <td className="px-4 py-3 text-gray-600">{c.duration} min</td>
 <td className="px-4 py-3 text-gray-600">{c.capacity}</td>
 <td className="px-4 py-3 font-semibold text-primary">{formatPrice(c.price)}</td>
 <td className="px-4 py-3 text-gray-600">{c.instructor?.user?.name || '—'}</td>
 <td className="px-4 py-3">
 <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
 {c.isActive ? 'Active' : 'Inactive'}
 </span>
 </td>
 <td className="px-4 py-3">
 <div className="flex gap-2">
 <button onClick={() => openEdit(c)} className="text-xs text-blue-600 hover:underline font-medium">Edit</button>
 <button onClick={() => setDeleteModal(c)} className="text-xs text-red-500 hover:underline font-medium">Delete</button>
 </div>
 </td>
 </tr>
 ))}
 {!filtered.length && (
 <tr><td colSpan={9} className="text-center py-12 text-gray-400">No classes found.</td></tr>
 )}
 </tbody>
 </table>
 </div>
 )}

 {/* Create / Edit Modal */}
 <Modal isOpen={showModal} onClose={() => setModal(false)} title={editing ? 'Edit Class' : 'New Class'}>
 <form onSubmit={handleSave} className="space-y-4">
 <div className="grid grid-cols-2 gap-3">
 <div className="col-span-2">
 <label className="label-base">Title *</label>
 <input name="title" value={form.title} onChange={h} required className={S} placeholder="e.g. Vinyasa Flow" />
 </div>
 <div className="col-span-2">
 <label className="label-base">Description</label>
 <textarea name="description" value={form.description} onChange={h} rows={3}
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
 placeholder="What will students experience?" />
 </div>
 <div>
 <label className="label-base">Type *</label>
 <select name="type" value={form.type} onChange={h} className={S}>
 {CLASS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
 </select>
 </div>
 <div>
 <label className="label-base">Level *</label>
 <select name="level" value={form.level} onChange={h} className={S}>
 {CLASS_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
 </select>
 </div>
 <div>
 <label className="label-base">Duration (min) *</label>
 <input type="number" name="duration" value={form.duration} onChange={h} required min="15" step="5" className={S} />
 </div>
 <div>
 <label className="label-base">Capacity *</label>
 <input type="number" name="capacity" value={form.capacity} onChange={h} required min="1" className={S} />
 </div>
 <div>
 <label className="label-base">Price (USD) *</label>
 <input type="number" name="price" value={form.price} onChange={h} required min="0" step="0.01" className={S} />
 </div>
 <div>
 <label className="label-base">Instructor *</label>
 <select name="instructor" value={form.instructor} onChange={h} required className={S}>
 <option value="">Select instructor</option>
 {instructors.map(i => <option key={i._id} value={i._id}>{i.user?.name}</option>)}
 </select>
 </div>
 <div className="col-span-2">
 <label className="label-base">Image URL</label>
 <input name="image" value={form.image} onChange={h} className={S} placeholder="https://..." />
 </div>
 <div className="col-span-2">
 <label className="label-base">Tags (comma separated)</label>
 <input name="tags" value={form.tags} onChange={h} className={S} placeholder="morning, flow, stretch" />
 </div>
 </div>
 <div className="flex gap-3 pt-2">
 <Button type="button" variant="secondary" onClick={() => setModal(false)} className="flex-1">Cancel</Button>
 <Button type="submit" loading={saving} className="flex-1">{editing ? 'Update Class' : 'Create Class'}</Button>
 </div>
 </form>
 </Modal>

 {/* Delete Confirm Modal */}
 <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Class">
 <div className="text-center py-4">
 <p className="text-4xl mb-4"></p>
 <p className="text-gray-700 font-medium mb-1">Delete <span className="text-primary">"{deleteModal?.title}"</span>?</p>
 <p className="text-gray-500 text-sm mb-6">This will deactivate the class. Existing bookings are not affected.</p>
 <div className="flex gap-3">
 <Button variant="secondary" onClick={() => setDeleteModal(null)} className="flex-1">Cancel</Button>
 <Button variant="danger" onClick={() => handleDelete(deleteModal?._id)} className="flex-1">Yes, Delete</Button>
 </div>
 </div>
 </Modal>
 </div>
 </div>
 );
};
export default ManageClasses;