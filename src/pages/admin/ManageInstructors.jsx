import React from "react";
import Sidebar from "../../components/layout/Sidebar";
import useFetch from "../../hooks/useFetch";
import { getInstructors } from "../../api/instructorsApi";
import InstructorCard from "../../components/instructor/InstructorCard";
import Spinner from "../../components/common/Spinner";

const ManageInstructors = () => {
  const { data: instructors, loading } = useFetch(getInstructors);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <h1 className="font-serif text-3xl font-bold text-gray-800 mb-6">
          Instructors
        </h1>

        {loading ? (
          <Spinner size="lg" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {(instructors || []).map((i) => (
              <InstructorCard key={i._id} instructor={i} />
            ))}
            {!(instructors || []).length && (
              <p className="col-span-1 text-center text-gray-400 py-12 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                No instructors yet. Assign the teacher role to users first.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageInstructors;