import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyBookings } from "../../api/bookingsApi";

export const fetchMyBookings = createAsyncThunk(
  "bookings/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyBookings();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMyBookings.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchMyBookings.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchMyBookings.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export const selectBookings = (s) => s.bookings.items;
export const selectBookingsLoading = (s) => s.bookings.loading;
export default bookingsSlice.reducer;

