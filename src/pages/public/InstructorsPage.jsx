import React from 'react';
import { getInstructors } from '../../api/instructorsApi';
import useFetch from '../../hooks/useFetch';
import InstructorCard from '../../components/instructor/InstructorCard';
import PageWrapper from '../../components/layout/PageWrapper';
import Spinner from '../../components/common/Spinner';

const InstructorsPage = () => {
 const { data: instructors, loading, error } = useFetch(getInstructors);

 return (
 <PageWrapper>
 <div className="mb-10 text-center">
 <h1 className="font-serif text-4xl font-bold text-gray-800 mb-2">Our Instructors</h1>
 <p className="text-gray-500 max-w-xl mx-auto">Meet our certified yoga teachers, each bringing a unique style and philosophy to their practice.</p>
 </div>
 {loading && <Spinner size="lg" />}
 {error && <p className="text-center text-red-500">{error}</p>}
 {!loading && (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
 {(instructors || []).map((i) => <InstructorCard key={i._id} instructor={i} />)}
 </div>
 )}
 {!loading && !instructors?.length && (
 <p className="text-center text-gray-400 py-12">Instructors coming soon!</p>
 )}
 </PageWrapper>
 );
};

export default InstructorsPage;