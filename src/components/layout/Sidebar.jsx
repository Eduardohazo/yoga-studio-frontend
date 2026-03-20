import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../api/authApi";
import toast from "react-hot-toast";

const ADMIN_LINKS = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/classes", label: "Classes" },
  { to: "/admin/schedule", label: "Schedule" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/instructors", label: "Instructors" },
  { to: "/admin/memberships", label: "Memberships" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/blog", label: "Blog" },
];

const TEACHER_LINKS = [
  { to: "/teacher", label: "Dashboard" },
  { to: "/teacher/schedule", label: "My Schedule" },
  { to: "/teacher/classes", label: "My Classes" },
  { to: "/teacher/memberships", label: "Packages" },
  { to: "/teacher/profile", label: "My Profile" },
];

const Sidebar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === "admin" ? ADMIN_LINKS : TEACHER_LINKS;

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
    logoutUser();
    navigate("/");
    toast.success("Logged out");
  };

  return (
    <aside className="w-full lg:w-64 h-auto lg:min-h-screen bg-gray-900 text-gray-300 flex flex-col shrink-0">
      <div className="p-6 border-b border-gray-700">
        <p className="font-serif text-white text-lg font-bold">Yoga Studio</p>
        <p className="text-xs text-gray-500 mt-1 capitalize">
          {user?.role} Panel
        </p>
      </div>

      <nav className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto p-2 lg:p-4 space-x-2 lg:space-x-0 lg:space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to.split("/").length <= 2}
            className={({ isActive }) =>
              "whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-medium transition-colors " +
              (isActive
                ? "bg-primary text-white"
                : "hover:bg-gray-800 hover:text-white")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm text-white font-medium truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
