import React, { useState } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const ContactPage = () => {
 const [form, setForm] = useState({ name: '', email: '', message: '' });
 const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
 e.preventDefault();
 setLoading(true);
 setTimeout(() => {
 toast.success('Message sent! We\'ll get back to you soon.');
 setForm({ name: '', email: '', message: '' });
 setLoading(false);
 }, 800);
 };

 return (
 <PageWrapper>
 <div className="max-w-xl mx-auto">
 <h1 className="font-serif text-4xl font-bold text-gray-800 mb-2">Contact Us</h1>
 <p className="text-gray-500 mb-8">Have a question? We'd love to hear from you.</p>
 <form onSubmit={handleSubmit} className="card space-y-4">
 <Input label="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Your name" required />
 <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="you@email.com" required />
 <div>
 <label className="text-sm font-medium text-gray-700 block mb-1">Message</label>
 <textarea
 value={form.message}
 onChange={(e) => setForm({...form, message: e.target.value})}
 rows={5} required
 placeholder="How can we help?"
 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
 />
 </div>
 <Button type="submit" loading={loading} className="w-full">Send Message</Button>
 </form>
 <div className="mt-8 card text-sm text-gray-600 space-y-2">
 <p>�� 123 Serenity Lane, Guadalajara, México</p>
 <p>��� +52 33 1234 5678</p>
 <p> hello@yogastudio.com</p>
 <p>��� Mon–Fri 6am–9pm · Sat–Sun 7am–7pm</p>
 </div>
 </div>
 </PageWrapper>
 );
};

export default ContactPage;