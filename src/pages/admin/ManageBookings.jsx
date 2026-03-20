import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Badge from "../../components/common/Badge";
import Spinner from "../../components/common/Spinner";
import { getAllBookings } from "../../api/bookingsApi";
import axiosClient from "../../api/axiosClient";
import { formatDate } from "../../utils/formatDate";
import toast from "react-hot-toast";

const statusColor = {
  confirmed: "green",
  cancelled: "red",
  attended: "blue",
  "no-show": "gray",
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const r = await getAllBookings();
      setBookings(r.data.data || []);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const markAttended = async (id) => {
    try {
      await axiosClient.patch(`/bookings/${id}/attend`);
      toast.success("Marked as attended");
      load();
    } catch {
      toast.error("Could not update booking");
    }
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.schedule?.class?.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800">
              All Bookings
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {bookings.length} total bookings
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by student, email or class..."
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white w-full sm:max-w-xs"
          />
          <div className="flex gap-2 flex-wrap">
            {["all", "confirmed", "attended", "cancelled", "no-show"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                    statusFilter === s
                      ? "bg-primary text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-primary"
                  }`}
                >
                  {s}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Spinner size="lg" />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
                <tr>
                  {[
                    "Student",
                    "Email",
                    "Class",
                    "Date",
                    "Status",
                    "Payment",
                    "Notes",
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
                {filtered.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-gray-800 truncate">
                      {b.user?.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[150px]">
                      {b.user?.email}
                    </td>
                    <td className="px-4 py-3 text-gray-700 truncate">
                      {b.schedule?.class?.title}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {b.createdAt ? formatDate(b.createdAt) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge label={b.status} variant={statusColor[b.status]} />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 capitalize">
                      {b.paymentStatus}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-[100px] truncate">
                      {b.notes || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {b.status === "confirmed" && (
                        <button
                          onClick={() => markAttended(b._id)}
                          className="text-xs text-green-600 hover:underline font-medium whitespace-nowrap"
                        >
                          Mark attended
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400">
                      No bookings found.
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
export default ManageBookings;
