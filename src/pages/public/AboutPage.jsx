import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Link } from 'react-router-dom';

const AboutPage = () => (
 <PageWrapper>
 <div className="max-w-3xl mx-auto">
 <h1 className="font-serif text-4xl font-bold text-gray-800 mb-4">About Our Studio</h1>
 <p className="text-gray-500 text-lg leading-relaxed mb-8">
 Founded with a passion for mindful movement, our yoga studio has been a sanctuary for practitioners of all levels since 2015. We believe yoga is for every body.
 </p>
 <div className="bg-primary/5 rounded-2xl p-8 mb-8">
 <h2 className="font-serif text-2xl font-semibold text-gray-800 mb-3">Our Mission</h2>
 <p className="text-gray-600 leading-relaxed">
 To create an inclusive, welcoming space where students can explore the transformative power of yoga — whether they come for physical strength, mental clarity, or spiritual connection.
 </p>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
 {[['500+', 'Students'], ['10+', 'Instructors'], ['50+', 'Classes / Week']].map(([num, label]) => (
 <div key={label} className="card text-center">
 <p className="font-serif text-4xl font-bold text-primary">{num}</p>
 <p className="text-gray-500 mt-1">{label}</p>
 </div>
 ))}
 </div>
 <Link to="/classes" className="btn-primary">Explore Our Classes</Link>
 </div>
 </PageWrapper>
);

export default AboutPage;