import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import { getPackages, createPackage, updatePackage, deletePackage } from '../../api/membershipsApi';
import { formatPrice } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', type: 'monthly', price: 0, classCredits: '', durationDays: 30, features: '', isActive: true };

const TeacherMemberships = () => {
 const [packages, setPackages] = useState([]);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [showModal, setShowModal] = useState(false);
 const [editing, setEditing] = useState(null);
 const [form, setForm] = useState(EMPTY);

 const load = async () => {
 setLoading(true);
 try { const res = await getPackages(); setPackages(res.data.data); }
 finally { setLoading(false); }
 };
 useEffect(() => { load(); }, []);

 const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
 const openEdit = (p) => {
 setEditing(p._id);
 setForm({ name: p.name, description: p.description, type: p.type, price: p.price, classCredits: p.classCredits || '', durationDays: p.durationDays, features: (p.features || []).join('\n'), isActive: p.isActive });
 setShowModal(true);
 };

 const handleSave = async (e) => {
 e.preventDefault();
 setSaving(true);
 const payload = { ...form, features: form.features.split('\n').filter(Boolean), classCredits: form.classCredits || null };
 try {
 if (editing) { await updatePackage(editing, payload); toast.success('Package updated'); }
 else { await createPackage(payload); toast.success('Package created'); }
 setShowModal(false); load();
 } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
 finally { setSaving(false); }
 };

 const handleDelete = async (id) => {
 if (!window.confirm('Deactivate this package?')) return;
 try { await deletePackage(id); toast.success('Package deactivated'); load(); }
 catch { toast.error('Error'); }
 };

 return (
 <div className="flex min-h-screen">
 <Sidebar />
 <div className="flex-1 p-8">
 <div className="flex items-center justify-between mb-6">
 <h1 className="font-serif text-3xl font-bold text-gray-800">Membership Packages</h1>
 <Button onClick={openNew}>+ New Package</Button>
 </div>
 {loading ? <Spinner size="lg" /> : (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {packages.map((p) => (
 <div key={p._id} className="card">
 <div className="flex justify-between items-start mb-1">
 <h3 className="font-semibold text-gray-800">{p.name}</h3>
 <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
 </div>
 <p className="text-sm text-gray-500 mb-2">{p.description}</p>
 <p className="text-xl font-bold text-primary mb-1">{formatPrice(p.price)}<span className="text-xs font-normal text-gray-400"> /{p.type}</span></p>
 {p.classCredits && <p className="text-xs text-gray-500 mb-3">{p.classCredits} credits</p>}
 {p.features?.length > 0 && (
 <ul className="text-xs text-gray-500 space-y-1 mb-3">
 {p.features.map((f, i) => <li key={i}> {f}</li>)}
 </ul>
 )}
 <div className="flex gap-2 mt-auto">
 <Button size="sm" variant="secondary" onClick={() => openEdit(p)} className="flex-1">Edit</Button>
 <Button size="sm" variant="danger" onClick={() => handleDelete(p._id)} className="flex-1">Deactivate</Button>
 </div>
 </div>
 ))}
 {!packages.length && <p className="col-span-3 text-center py-10 text-gray-400">No packages yet.</p>}
 </div>
 )}
 <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Package' : 'New Package'}>
 <form onSubmit={handleSave} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
 {[['name','Name','text'],['description','Description','text'],['price','Price (USD)','number'],['durationDays','Duration (days)','number'],['classCredits','Class Credits (blank = unlimited)','number']].map(([name,label,type]) => (
 <div key={name}>
 <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
 <input type={type} name={name} value={form[name]} onChange={handle} required={!['description','classCredits'].includes(name)}
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
 </div>
 ))}
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Type</label>
 <select name="type" value={form.type} onChange={handle} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none">
 {['monthly','yearly','class-pack','drop-in'].map((t) => <option key={t} value={t}>{t}</option>)}
 </select>
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Features (one per line)</label>
 <textarea name="features" value={form.features} onChange={handle} rows={4} placeholder="Unlimited classes&#10;App access&#10;Guest passes"
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
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

export default TeacherMemberships;