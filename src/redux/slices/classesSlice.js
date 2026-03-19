import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getClasses } from "../../api/classesApi";

export const fetchClasses = createAsyncThunk(
  "classes/fetchAll",
  async (filters, { rejectWithValue }) => {
    try {
      const res = await getClasses(filters);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

const classesSlice = createSlice({
  name: "classes",
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
    filters: { type: "", level: "", page: 1, limit: 12 },
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    resetFilters: (state) => {
      state.filters = { type: "", level: "", page: 1, limit: 12 };
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchClasses.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchClasses.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.classes || [];
        s.total = a.payload.total || 0;
      })
      .addCase(fetchClasses.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export const { setFilter, resetFilters } = classesSlice.actions;
export const selectClasses = (s) => s.classes.items;
export const selectClassesLoading = (s) => s.classes.loading;
export const selectClassesFilters = (s) => s.classes.filters;
export default classesSlice.reducer;

