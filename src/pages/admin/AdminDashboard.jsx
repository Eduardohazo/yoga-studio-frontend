import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import useFetch from '../../hooks/useFetch';
import { getDashboardStats } from '../../api/adminApi';
import Spinner from '../../components/common/Spinner';
import { formatPrice, formatDate } from '../../utils/formatDate';

const QUICK_LINKS = [
  { to: '/admin/classes',     label: 'Classes',     desc: 'Add, edit or remove classes'    },
  { to: '/admin/schedule',    label: 'Schedule',    desc: 'Manage class sessions'           },
  { to: '/admin/users',       label: 'Users',       desc: 'Manage students and roles'       },
  { to: '/admin/instructors', label: 'Instructors', desc: 'Manage instructor profiles'      },
  { to: '/admin/bookings',    label: 'Bookings',    desc: 'View all bookings'               },
  { to: '/admin/memberships', label: 'Memberships', desc: 'Edit pricing packages'           },
  { to: '/admin/payments',    label: 'Payments',    desc: 'View payment history'            },
  { to: '/admin/blog',        label: 'Blog',        desc: 'Manage blog posts'               },
];

const AdminDashboard = () => {
  const { data, loading } = useFetch(getDashboardStats);
  const stats             = data?.stats || {};
  const recentBookings    = data?.recentBookings || [];
  const upcomingSchedules = data?.upcomingSchedules || [];

  console.log(stats);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="font-serif text-3xl font-bold text-gray-800 mb-1">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mb-8">Full control over your yoga studio.</p>

        {loading ? <Spinner size="lg" /> : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
              {[
                { label: 'Students', value: stats.totalUsers,               bg: 'bg-blue-50',   color: 'text-blue-600'   },
                { label: 'Classes',  value: stats.totalClasses,             bg: 'bg-green-50',  color: 'text-primary'    },
                { label: 'Bookings', value: stats.totalBookings,            bg: 'bg-purple-50', color: 'text-purple-600' },
                { label: 'Members',  value: stats.activeMembers,            bg: 'bg-teal-50',   color: 'text-teal-600'   },
                { label: 'Revenue',  value: formatPrice(stats.totalRevenue || 0), bg: 'bg-yellow-50', color: 'text-yellow-600' },
              ].map((s) => (
                <div key={s.label} className={'rounded-2xl p-4 text-center border-0 ' + s.bg}>
                  <p className={'text-3xl font-bold ' + s.color}>{s.value ?? 0}</p>
                  <p className="text-xs text-gray-600 mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Access */}
            <h2 className="font-serif text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {QUICK_LINKS.map((q) => (
                <Link
                  key={q.to}
                  to={q.to}
                  className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-primary/30 transition-all group"
                >
                  <p className="font-semibold text-gray-800 text-sm group-hover:text-primary transition-colors mb-1">
                    {q.label}
                  </p>
                  <p className="text-xs text-gray-400">{q.desc}</p>
                </Link>
              ))}
            </div>

            {/* Recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-serif text-lg font-semibold text-gray-800">Recent Bookings</h2>
                  <Link to="/admin/bookings" className="text-primary text-xs hover:underline">View all</Link>
                </div>
                <div className="space-y-3">
                  {recentBookings.length ? recentBookings.map((b) => (
                    <div key={b._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-medium text-gray-700 text-sm">{b.user?.name}</p>
                        <p className="text-xs text-gray-400">{b.schedule?.class?.title}</p>
                      </div>
                      <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                        confirmed
                      </span>
                    </div>
                  )) : <p className="text-sm text-gray-400 text-center py-4">No recent bookings.</p>}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-serif text-lg font-semibold text-gray-800">Upcoming Sessions</h2>
                  <Link to="/admin/schedule" className="text-primary text-xs hover:underline">View all</Link>
                </div>
                <div className="space-y-3">
                  {upcomingSchedules.length ? upcomingSchedules.map((s) => (
                    <div key={s._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-medium text-gray-700 text-sm">{s.class?.title}</p>
                        <p className="text-xs text-gray-400">
                          {s.date ? formatDate(s.date) : ''} - {s.startTime}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">{s.instructor?.user?.name}</p>
                    </div>
                  )) : <p className="text-sm text-gray-400 text-center py-4">No upcoming sessions.</p>}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
