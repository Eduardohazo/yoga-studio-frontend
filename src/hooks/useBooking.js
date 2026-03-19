import { useState } from "react";
import { createBooking, cancelBooking } from "../api/bookingsApi";
import toast from "react-hot-toast";

const useBooking = () => {
  const [loading, setLoading] = useState(false);

  const book = async (scheduleId, notes = "") => {
    setLoading(true);
    try {
      const res = await createBooking({ scheduleId, notes });
      toast.success("Booked successfully! ���");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (bookingId) => {
    setLoading(true);
    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { book, cancel, loading };
};

export default useBooking;
