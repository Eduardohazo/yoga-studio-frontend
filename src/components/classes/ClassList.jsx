import React from 'react';
import ClassCard from './ClassCard';
import Spinner from '../common/Spinner';

const ClassList = ({ classes, loading, error }) => {
 if (loading) return <div className="py-20"><Spinner size="lg" /></div>;
 if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
 if (!classes?.length) return <p className="text-center text-gray-400 py-10">No classes found.</p>;
 return (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {classes.map((cls) => <ClassCard key={cls._id} cls={cls} />)}
 </div>
 );
};

export default ClassList;