import React, { useEffect, useState } from "react";
import BookingCard from "../../components/booking/BookingCard";
import Spinner from "../../components/common/Spinner";
import PageWrapper from "../../components/layout/PageWrapper";
import { getMyBookings } from "../../api/bookingsApi"; // <- your API function

const FILTERS = ["all", "confirmed", "attended", "cancelled"];

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getMyBookings(); // fetch bookings from your API
      setBookings(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const shown =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <PageWrapper>
      <h1 className="font-serif text-3xl font-bold text-gray-800 mb-6">
        My Bookings
      </h1>
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <div className="space-y-4">
          {shown.length ? (
            shown.map((b) => (
              <BookingCard key={b._id} booking={b} onCancelled={fetchBookings} />
            ))
          ) : (
            <p className="text-center text-gray-400 py-10">No bookings found.</p>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default MyBookingsPage;