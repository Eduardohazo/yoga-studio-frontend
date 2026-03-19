import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';

const QUICK = [
  { to: '/teacher/schedule',    label: 'Manage Schedule',  desc: 'Create, edit or cancel sessions'    },
  { to: '/teacher/classes',     label: 'Manage Classes',   desc: 'Update your class offerings'        },
  { to: '/teacher/memberships', label: 'Packages',         desc: 'Add or update membership packages'  },
  { to: '/teacher/profile',     label: 'My Profile',       desc: 'Update your instructor bio'         },
];

const TeacherDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="font-serif text-3xl font-bold text-gray-800 mb-1">Teacher Hub</h1>
        <p className="text-gray-500 mb-8">Hello, {user?.name?.split(' ')[0]}! Manage your classes here.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {QUICK.map((q) => (
            <Link key={q.to} to={q.to}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:border-primary/30 transition-all group">
              <p className="font-semibold text-gray-800 group-hover:text-primary transition-colors mb-1">{q.label}</p>
              <p className="text-sm text-gray-500">{q.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
