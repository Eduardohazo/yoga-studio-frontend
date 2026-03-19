import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../api/authApi';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try { await logout(); } catch {}
    logoutUser();
    navigate('/');
    toast.success('Logged out');
  };

  const dash = !user ? null
    : user.role === 'admin'   ? { to: '/admin',   label: 'Admin Panel'  }
    : user.role === 'teacher' ? { to: '/teacher', label: 'Teacher Hub'  }
    : { to: '/dashboard', label: 'My Account' };

  const cls = ({ isActive }) =>
    'text-sm font-medium transition-colors ' +
    (isActive ? 'text-primary' : 'text-gray-600 hover:text-primary');

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="font-serif text-2xl font-bold text-primary shrink-0">
            Yoga Studio
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <NavLink to="/classes"     className={cls}>Classes</NavLink>
            <NavLink to="/instructors" className={cls}>Instructors</NavLink>
            <NavLink to="/pricing"     className={cls}>Pricing</NavLink>
            <NavLink to="/about"       className={cls}>About</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/schedule" className="btn-primary px-5 py-2 text-sm font-semibold">
              Book a Class
            </Link>
            {user ? (
              <>
                {dash && (
                  <Link to={dash.to} className="btn-secondary px-4 py-2 text-xs">
                    {dash.label}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm text-gray-600 hover:text-primary font-medium">
                Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg"
            onClick={() => setOpen(!open)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
          <Link to="/schedule" className="block btn-primary text-center mb-3" onClick={() => setOpen(false)}>
            Book a Class
          </Link>
          {[
            ['/classes',     'Classes'],
            ['/instructors', 'Instructors'],
            ['/pricing',     'Pricing'],
            ['/about',       'About'],
            ['/blog',        'Blog'],
            ['/contact',     'Contact'],
          ].map(([to, label]) => (
            <NavLink key={to} to={to}
              className="block text-sm text-gray-600 py-1.5 hover:text-primary"
              onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
          <hr className="border-gray-100 my-2" />
          {user ? (
            <>
              {dash && (
                <Link to={dash.to}
                  className="block text-sm text-primary font-medium py-1"
                  onClick={() => setOpen(false)}>
                  {dash.label}
                </Link>
              )}
              <button
                onClick={() => { handleLogout(); setOpen(false); }}
                className="block text-sm text-red-500 py-1">
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="block text-sm text-gray-600 py-1" onClick={() => setOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
