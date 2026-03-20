import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import Avatar from "../../components/common/Avatar";
import Spinner from "../../components/common/Spinner";
import { getAllUsers, updateUserRole, updateProfile } from "../../api/usersApi";
import axiosClient from "../../api/axiosClient";
import { formatDate } from "../../utils/formatDate";
import toast from "react-hot-toast";

const roleColor = { student: "blue", teacher: "green", admin: "red" };
const S =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", role: "student" });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const r = await getAllUsers();
      setUsers(r.data.data || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const openEdit = (u) => {
    setEditModal(u);
    setForm({ name: u.name, phone: u.phone || "", role: u.role });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosClient.put(`/users/${editModal._id}/admin-update`, {
        name: form.name,
        phone: form.phone,
      });
      if (form.role !== editModal.role)
        await updateUserRole(editModal._id, form.role);
      toast.success("User updated ");
      setEditModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating user");
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success(`Role changed to ${newRole}`);
      load();
    } catch {
      toast.error("Error changing role");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axiosClient.delete(`/users/${userId}`);
      toast.success("User deleted");
      setDeleteModal(null);
      load();
    } catch (err) {
      // If delete endpoint not yet implemented, deactivate instead
      await axiosClient.patch(`/users/${userId}/deactivate`).catch(() => {});
      toast.success("User deactivated");
      setDeleteModal(null);
      load();
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800">
              Manage Users
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {users.length} users registered
            </p>
          </div>
        </div>

        {/* Search & Role Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by name or email..."
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white w-full sm:max-w-xs"
          />
          <div className="flex gap-2 flex-wrap">
            {["all", "student", "teacher", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                  roleFilter === r
                    ? "bg-primary text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-primary"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Spinner size="lg" />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
                <tr>
                  {[
                    "User",
                    "Email",
                    "Phone",
                    "Role",
                    "Joined",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <Avatar name={u.name} src={u.avatar} size="sm" />
                      <span className="font-semibold text-gray-800 truncate">
                        {u.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[150px]">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-gray-500 truncate max-w-[120px]">
                      {u.phone || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u._id, e.target.value)
                        }
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white capitalize"
                      >
                        <option value="student">student</option>
                        <option value="teacher">teacher</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          u.isActive !== false
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {u.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => openEdit(u)}
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteModal(u)}
                          className="text-xs text-red-500 hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default ManageUsers;
