import { createBrowserRouter } from 'react-router-dom';
import store from '../redux/store';
import { fetchClasses }  from '../redux/slices/classesSlice';
import { fetchSchedule } from '../redux/slices/scheduleSlice';
import { format, addDays, startOfWeek } from 'date-fns';

// App shell
import App from '../App';

// Guards
import ProtectedRoute from '../components/guards/ProtectedRoute';
import AdminRoute     from '../components/guards/AdminRoute';
import TeacherRoute   from '../components/guards/TeacherRoute';

// Public
import HomePage        from '../pages/public/HomePage';
import ClassesPage     from '../pages/public/ClassesPage';
import SchedulePage    from '../pages/public/SchedulePage';
import InstructorsPage from '../pages/public/InstructorsPage';
import PricingPage     from '../pages/public/PricingPage';
import AboutPage       from '../pages/public/AboutPage';
import BlogPage        from '../pages/public/BlogPage';
import ContactPage     from '../pages/public/ContactPage';
import NotFoundPage    from '../pages/NotFoundPage';

// Auth
import LoginPage    from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// User
import DashboardPage  from '../pages/user/DashboardPage';
import MyBookingsPage from '../pages/user/MyBookingsPage';
import ProfilePage    from '../pages/user/ProfilePage';
import MembershipPage from '../pages/user/MembershipPage';

// Teacher
import TeacherDashboard   from '../pages/teacher/TeacherDashboard';
import TeacherSchedule    from '../pages/teacher/TeacherSchedule';
import TeacherClasses     from '../pages/teacher/TeacherClasses';
import TeacherMemberships from '../pages/teacher/TeacherMemberships';
import TeacherProfile     from '../pages/teacher/TeacherProfile';

// Admin
import AdminDashboard    from '../pages/admin/AdminDashboard';
import ManageClasses     from '../pages/admin/ManageClasses';
import ManageSchedule    from '../pages/admin/ManageSchedule';
import ManageBookings    from '../pages/admin/ManageBookings';
import ManageUsers       from '../pages/admin/ManageUsers';
import ManageInstructors from '../pages/admin/ManageInstructors';
import ManageMemberships from '../pages/admin/ManageMemberships';
import ManagePayments    from '../pages/admin/ManagePayments';
import ManageBlog        from '../pages/admin/ManageBlog';

const router = createBrowserRouter([
  {
    path:    '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      // Public routes — preload data via loaders
      {
        index:   true,
        element: <HomePage />,
        loader:  () => { store.dispatch(fetchClasses({ limit: 6 })); return null; },
      },
      {
        path:    'classes',
        element: <ClassesPage />,
        loader:  () => { store.dispatch(fetchClasses({ limit: 12 })); return null; },
      },
      {
        path:    'schedule',
        element: <SchedulePage />,
        loader:  () => {
          const w = startOfWeek(new Date(), { weekStartsOn: 1 });
          store.dispatch(fetchSchedule({ from: format(w,'yyyy-MM-dd'), to: format(addDays(w,6),'yyyy-MM-dd') }));
          return null;
        },
      },
      { path: 'instructors', element: <InstructorsPage /> },
      { path: 'pricing',     element: <PricingPage />     },
      { path: 'about',       element: <AboutPage />       },
      { path: 'blog',        element: <BlogPage />        },
      { path: 'contact',     element: <ContactPage />     },

      // Auth
      { path: 'login',    element: <LoginPage />    },
      { path: 'register', element: <RegisterPage /> },

      // Student
      { path: 'dashboard',   element: <ProtectedRoute><DashboardPage /></ProtectedRoute>  },
      { path: 'my-bookings', element: <ProtectedRoute><MyBookingsPage /></ProtectedRoute> },
      { path: 'profile',     element: <ProtectedRoute><ProfilePage /></ProtectedRoute>    },
      { path: 'membership',  element: <ProtectedRoute><MembershipPage /></ProtectedRoute> },

      // Teacher
      { path: 'teacher',             element: <TeacherRoute><TeacherDashboard /></TeacherRoute>   },
      { path: 'teacher/schedule',    element: <TeacherRoute><TeacherSchedule /></TeacherRoute>    },
      { path: 'teacher/classes',     element: <TeacherRoute><TeacherClasses /></TeacherRoute>     },
      { path: 'teacher/memberships', element: <TeacherRoute><TeacherMemberships /></TeacherRoute> },
      { path: 'teacher/profile',     element: <TeacherRoute><TeacherProfile /></TeacherRoute>     },

      // Admin
      { path: 'admin',             element: <AdminRoute><AdminDashboard /></AdminRoute>    },
      { path: 'admin/classes',     element: <AdminRoute><ManageClasses /></AdminRoute>     },
      { path: 'admin/schedule',    element: <AdminRoute><ManageSchedule /></AdminRoute>    },
      { path: 'admin/bookings',    element: <AdminRoute><ManageBookings /></AdminRoute>    },
      { path: 'admin/users',       element: <AdminRoute><ManageUsers /></AdminRoute>       },
      { path: 'admin/instructors', element: <AdminRoute><ManageInstructors /></AdminRoute> },
      { path: 'admin/memberships', element: <AdminRoute><ManageMemberships /></AdminRoute> },
      { path: 'admin/payments',    element: <AdminRoute><ManagePayments /></AdminRoute>    },
      { path: 'admin/blog',        element: <AdminRoute><ManageBlog /></AdminRoute>        },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;
