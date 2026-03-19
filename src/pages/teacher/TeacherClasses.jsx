import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { getClasses, createClass, updateClass, deleteClass } from '../../api/classesApi';
import { getInstructors } from '../../api/instructorsApi';
import { formatPrice } from '../../utils/formatDate';
import { CLASS_TYPES, CLASS_LEVELS } from '../../utils/constants';
import toast from 'react-hot-toast';

const EMPTY = { title: '', description: '', type: 'hatha', level: 'all', duration: 60, capacity: 15, price: 0, instructor: '' };

const TeacherClasses = () => {
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
 const [cRes, iRes] = await Promise.all([getClasses(), getInstructors()]);
 setClasses(cRes.data.data.classes || []);
 setInstructors(iRes.data.data || []);
 } finally { setLoading(false); }
 };
 useEffect(() => { load(); }, []);

 const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
 const openEdit = (c) => { setEditing(c._id); setForm({ title: c.title, description: c.description, type: c.type, level: c.level, duration: c.duration, capacity: c.capacity, price: c.price, instructor: c.instructor?._id || '' }); setShowModal(true); };

 const handleSave = async (e) => {
 e.preventDefault();
 setSaving(true);
 try {
 if (editing) { await updateClass(editing, form); toast.success('Class updated'); }
 else { await createClass(form); toast.success('Class created'); }
 setShowModal(false); load();
 } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
 finally { setSaving(false); }
 };

 const handleDelete = async (id) => {
 if (!window.confirm('Deactivate this class?')) return;
 try { await deleteClass(id); toast.success('Class deactivated'); load(); }
 catch { toast.error('Error deactivating class'); }
 };

 return (
 <div className="flex min-h-screen">
 <Sidebar />
 <div className="flex-1 p-8">
 <div className="flex items-center justify-between mb-6">
 <h1 className="font-serif text-3xl font-bold text-gray-800">My Classes</h1>
 <Button onClick={openNew}>+ New Class</Button>
 </div>
 {loading ? <Spinner size="lg" /> : (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {classes.map((c) => (
 <div key={c._id} className="card hover:shadow-md transition-shadow">
 <div className="flex justify-between items-start mb-2">
 <h3 className="font-semibold text-gray-800">{c.title}</h3>
 <span className="text-primary font-bold">{formatPrice(c.price)}</span>
 </div>
 <p className="text-xs text-gray-500 mb-3 line-clamp-2">{c.description}</p>
 <div className="flex gap-1.5 mb-4">
 <Badge label={c.type} variant="gray" />
 <Badge label={c.level} variant="green" />
 <span className="text-xs text-gray-400 ml-auto">{c.duration}min</span>
 </div>
 <div className="flex gap-2">
 <Button size="sm" variant="secondary" onClick={() => openEdit(c)} className="flex-1">Edit</Button>
 <Button size="sm" variant="danger" onClick={() => handleDelete(c._id)} className="flex-1">Delete</Button>
 </div>
 </div>
 ))}
 {!classes.length && <p className="col-span-3 text-center py-10 text-gray-400">No classes yet. Create one!</p>}
 </div>
 )}
 <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Class' : 'New Class'}>
 <form onSubmit={handleSave} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
 {[['title','Title','text'],['description','Description','text'],['duration','Duration (min)','number'],['capacity','Capacity','number'],['price','Price (USD)','number']].map(([name,label,type]) => (
 <div key={name}>
 <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
 <input type={type} name={name} value={form[name]} onChange={handle} required={name!=='description'}
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
 </div>
 ))}
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Type</label>
 <select name="type" value={form.type} onChange={handle} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none">
 {CLASS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
 </select>
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Level</label>
 <select name="level" value={form.level} onChange={handle} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none">
 {CLASS_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
 </select>
 </div>
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Instructor</label>
 <select name="instructor" value={form.instructor} onChange={handle} required
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none">
 <option value="">Select instructor</option>
 {instructors.map((i) => <option key={i._id} value={i._id}>{i.user?.name}</option>)}
 </select>
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

export default TeacherClasses;