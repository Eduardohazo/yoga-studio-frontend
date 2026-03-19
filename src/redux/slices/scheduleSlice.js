import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSchedules } from "../../api/scheduleApi";

export const fetchSchedule = createAsyncThunk(
  "schedule/fetch",
  async (params, { rejectWithValue }) => {
    try {
      const res = await getSchedules(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: { sessions: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchSchedule.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchSchedule.fulfilled, (s, a) => {
        s.loading = false;
        s.sessions = a.payload;
      })
      .addCase(fetchSchedule.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export const selectSessions = (s) => s.schedule.sessions;
export const selectScheduleLoading = (s) => s.schedule.loading;
export default scheduleSlice.reducer;

