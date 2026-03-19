import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBookings } from "../../redux/slices/bookingsSlice";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BookingCard from "../../components/booking/BookingCard";
import Spinner from "../../components/common/Spinner";
import PageWrapper from "../../components/layout/PageWrapper";

const DashboardPage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const { items: bookings = [], loading } = useSelector(
    (state) => state.bookings,
  );
  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const upcoming = (bookings || [])
    .filter((b) => b.status === "confirmed")
    .slice(0, 3);
  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-800">
          Welcome back, {user?.name?.split(" ")[0]} ���
        </h1>
        <p className="text-gray-500 mt-1">Here's your practice overview.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Bookings", value: bookings.length },
          { label: "Upcoming", value: upcoming.length },
          {
            label: "Attended",
            value: bookings.filter((b) => b.status === "attended").length,
          },
          {
            label: "Cancelled",
            value: bookings.filter((b) => b.status === "cancelled").length,
          },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <p className="text-3xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-semibold text-gray-800">
          Upcoming Classes
        </h2>
        <Link
          to="/my-bookings"
          className="text-primary text-sm hover:underline"
        >
          View all →
        </Link>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="space-y-3">
          {upcoming.length ? (
            upcoming.map((b) => (
              <BookingCard
                key={b._id}
                booking={b}
                onCancelled={() => dispatch(fetchMyBookings())}
              />
            ))
          ) : (
            <div className="card text-center py-10">
              <p className="text-gray-400 mb-4">No upcoming classes.</p>
              <Link to="/schedule" className="btn-primary">
                Browse Schedule
              </Link>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default DashboardPage;

