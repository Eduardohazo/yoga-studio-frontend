import React from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

const InstructorProfile = ({ instructor }) => {
 const { user, bio, specialties, certifications, photo, socialLinks } = instructor;
 return (
 <div className="card">
 <div className="flex flex-col sm:flex-row gap-6 items-start">
 <Avatar src={photo || user?.avatar} name={user?.name} size="lg" />
 <div className="flex-1">
 <h2 className="font-serif text-2xl font-bold text-gray-800">{user?.name}</h2>
 <p className="text-gray-600 mt-2 leading-relaxed">{bio}</p>
 {specialties?.length > 0 && (
 <div className="flex flex-wrap gap-2 mt-3">
 {specialties.map((s) => <Badge key={s} label={s} variant="green" />)}
 </div>
 )}
 {certifications?.length > 0 && (
 <div className="mt-4">
 <h4 className="text-sm font-semibold text-gray-700 mb-2">Certifications</h4>
 <ul className="space-y-1">
 {certifications.map((c, i) => (
 <li key={i} className="text-sm text-gray-600"> {c.name} — {c.issuer} ({c.year})</li>
 ))}
 </ul>
 </div>
 )}
 </div>
 </div>
 </div>
 );
};

export default InstructorProfile;