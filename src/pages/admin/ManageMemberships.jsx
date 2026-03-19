import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import { getPackages, createPackage, updatePackage, deletePackage } from '../../api/membershipsApi';
import { formatPrice } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', type: 'monthly', price: 0, classCredits: '', durationDays: 30, features: '', isActive: true, order: 0 };
const S = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

const ManageMemberships = () => {
 const [packages, setPackages] = useState([]);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [showModal, setModal] = useState(false);
 const [deleteModal, setDeleteModal] = useState(null);
 const [editing, setEditing] = useState(null);
 const [form, setForm] = useState(EMPTY);

 const load = async () => {
 setLoading(true);
 try { const r = await getPackages(); setPackages(r.data.data || []); }
 catch { toast.error('Failed to load packages'); }
 finally { setLoading(false); }
 };
 useEffect(() => { load(); }, []);

 const h = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
 const openEdit = (p) => {
 setEditing(p._id);
 setForm({ name: p.name, description: p.description || '', type: p.type, price: p.price, classCredits: p.classCredits || '', durationDays: p.durationDays, features: (p.features || []).join('\n'), isActive: p.isActive, order: p.order || 0 });
 setModal(true);
 };

 const handleSave = async (e) => {
 e.preventDefault(); setSaving(true);
 const payload = { ...form, features: form.features.split('\n').filter(Boolean), classCredits: form.classCredits || null };
 try {
 if (editing) { await updatePackage(editing, payload); toast.success('Package updated '); }
 else { await createPackage(payload); toast.success('Package created '); }
 setModal(false); load();
 } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
 finally { setSaving(false); }
 };

 const handleDelete = async (id) => {
 try { await deletePackage(id); toast.success('Package deactivated'); setDeleteModal(null); load(); }
 catch { toast.error('Error'); }
 };

 return (
 <div className="flex min-h-screen bg-gray-50">
 <Sidebar />
 <div className="flex-1 p-8 overflow-auto">
 <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
 <div>
 <h1 className="font-serif text-3xl font-bold text-gray-800">Membership Packages</h1>
 <p className="text-gray-500 text-sm mt-1">{packages.length} packages</p>
 </div>
 <Button onClick={openNew}>+ New Package</Button>
 </div>

 {loading ? <Spinner size="lg" /> : (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {packages.map((p) => (
 <div key={p._id} className="card hover:shadow-md transition-shadow flex flex-col">
 <div className="flex justify-between items-start mb-2">
 <h3 className="font-serif font-bold text-lg text-gray-800">{p.name}</h3>
 <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
 {p.isActive ? 'Active' : 'Inactive'}
 </span>
 </div>
 <p className="text-sm text-gray-500 mb-3 flex-1">{p.description}</p>
 <div className="mb-3">
 <span className="text-2xl font-bold text-primary">{formatPrice(p.price)}</span>
 <span className="text-xs text-gray-400"> / {p.type}</span>
 </div>
 <div className="text-xs text-gray-500 space-y-0.5 mb-3">
 <p>��� {p.durationDays} days</p>
 <p>��� {p.classCredits ? `${p.classCredits} credits` : 'Unlimited classes'}</p>
 </div>
 {p.features?.length > 0 && (
 <ul className="text-xs text-gray-500 space-y-0.5 mb-4">
 {p.features.map((f, i) => <li key={i}> {f}</li>)}
 </ul>
 )}
 <div className="flex gap-2 mt-auto">
 <Button size="sm" variant="secondary" onClick={() => openEdit(p)} className="flex-1">Edit</Button>
 <Button size="sm" variant="danger" onClick={() => setDeleteModal(p)} className="flex-1">Delete</Button>
 </div>
 </div>
 ))}
 {!packages.length && <p className="col-span-3 text-center py-12 text-gray-400">No packages yet. Create one!</p>}
 </div>
 )}

 <Modal isOpen={showModal} onClose={() => setModal(false)} title={editing ? 'Edit Package' : 'New Package'}>
 <form onSubmit={handleSave} className="space-y-4">
 <div className="grid grid-cols-2 gap-3">
 <div className="col-span-2">
 <label className="label-base">Package Name *</label>
 <input name="name" value={form.name} onChange={h} required className={S} placeholder="Monthly Unlimited" />
 </div>
 <div className="col-span-2">
 <label className="label-base">Description</label>
 <input name="description" value={form.description} onChange={h} className={S} placeholder="Short description for students" />
 </div>
 <div>
 <label className="label-base">Type *</label>
 <select name="type" value={form.type} onChange={h} className={S}>
 {['monthly','yearly','class-pack','drop-in'].map(t => <option key={t} value={t}>{t}</option>)}
 </select>
 </div>
 <div>
 <label className="label-base">Price (USD) *</label>
 <input type="number" name="price" value={form.price} onChange={h} required min="0" step="0.01" className={S} />
 </div>
 <div>
 <label className="label-base">Duration (days)</label>
 <input type="number" name="durationDays" value={form.durationDays} onChange={h} min="1" className={S} />
 </div>
 <div>
 <label className="label-base">Credits (blank = unlimited)</label>
 <input type="number" name="classCredits" value={form.classCredits} onChange={h} min="1" className={S} placeholder="e.g. 10" />
 </div>
 <div>
 <label className="label-base">Display Order</label>
 <input type="number" name="order" value={form.order} onChange={h} min="0" className={S} />
 </div>
 <div className="flex items-center gap-2 pt-6">
 <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="h-4 w-4 text-primary rounded" />
 <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (visible to students)</label>
 </div>
 <div className="col-span-2">
 <label className="label-base">Features (one per line)</label>
 <textarea name="features" value={form.features} onChange={h} rows={4}
 placeholder={"Unlimited classes\nApp access\nGuest passes\nPriority booking"}
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
 </div>
 </div>
 <div className="flex gap-3 pt-2">
 <Button type="button" variant="secondary" onClick={() => setModal(false)} className="flex-1">Cancel</Button>
 <Button type="submit" loading={saving} className="flex-1">{editing ? 'Update Package' : 'Create Package'}</Button>
 </div>
 </form>
 </Modal>

 <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Package">
 <div className="text-center py-4">
 <p className="text-4xl mb-4"></p>
 <p className="text-gray-700 font-medium mb-1">Delete <span className="text-primary">"{deleteModal?.name}"</span>?</p>
 <p className="text-gray-500 text-sm mb-6">This will deactivate the package. Existing active memberships will not be affected.</p>
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
export default ManageMemberships;