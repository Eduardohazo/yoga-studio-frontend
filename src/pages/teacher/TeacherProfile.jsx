import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import { getInstructors, updateMyProfile } from '../../api/instructorsApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TeacherProfile = () => {
 const { user } = useAuth();
 const [saving, setSaving] = useState(false);
 const [form, setForm] = useState({ bio: '', specialties: '', photo: '', socialLinks: { instagram: '', website: '' } });

 useEffect(() => {
 getInstructors().then((res) => {
 const mine = res.data.data?.find((i) => i.user?._id === user?._id || i.user?.email === user?.email);
 if (mine) setForm({ bio: mine.bio || '', specialties: (mine.specialties || []).join(', '), photo: mine.photo || '', socialLinks: mine.socialLinks || { instagram: '', website: '' } });
 }).catch(() => {});
 }, []);

 const handleSubmit = async (e) => {
 e.preventDefault();
 setSaving(true);
 const payload = { ...form, specialties: form.specialties.split(',').map((s) => s.trim()).filter(Boolean) };
 try { await updateMyProfile(payload); toast.success('Profile updated!'); }
 catch (err) { toast.error(err.response?.data?.message || 'Error'); }
 finally { setSaving(false); }
 };

 return (
 <div className="flex min-h-screen">
 <Sidebar />
 <div className="flex-1 p-8 max-w-xl">
 <h1 className="font-serif text-3xl font-bold text-gray-800 mb-6">My Instructor Profile</h1>
 <form onSubmit={handleSubmit} className="card space-y-4">
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Bio</label>
 <textarea value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} rows={4}
 placeholder="Tell students about yourself, your style, your journey..."
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Specialties (comma separated)</label>
 <input value={form.specialties} onChange={(e) => setForm({...form, specialties: e.target.value})}
 placeholder="Vinyasa, Yin, Meditation"
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Photo URL</label>
 <input value={form.photo} onChange={(e) => setForm({...form, photo: e.target.value})}
 placeholder="https://..."
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Instagram</label>
 <input value={form.socialLinks.instagram} onChange={(e) => setForm({...form, socialLinks: {...form.socialLinks, instagram: e.target.value}})}
 placeholder="@handle"
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
 </div>
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Website</label>
 <input value={form.socialLinks.website} onChange={(e) => setForm({...form, socialLinks: {...form.socialLinks, website: e.target.value}})}
 placeholder="https://..."
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
 </div>
 </div>
 <Button type="submit" loading={saving} className="w-full">Save Profile</Button>
 </form>
 </div>
 </div>
 );
};

export default TeacherProfile;