import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

const InstructorCard = ({ instructor }) => {
 const { user, bio, specialties, photo } = instructor;
 return (
 <div className="card hover:shadow-md transition-shadow text-center group">
 <div className="flex justify-center mb-4">
 <Avatar src={photo || user?.avatar} name={user?.name} size="lg" className="ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all" />
 </div>
 <h3 className="font-serif font-semibold text-lg text-gray-800">{user?.name}</h3>
 <p className="text-sm text-gray-500 mt-1 line-clamp-2">{bio || 'Yoga instructor'}</p>
 {specialties?.length > 0 && (
 <div className="flex flex-wrap justify-center gap-1.5 mt-3">
 {specialties.slice(0, 3).map((s) => <Badge key={s} label={s} variant="gray" />)}
 </div>
 )}
 </div>
 );
};

export default InstructorCard;