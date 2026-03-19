import { configureStore } from '@reduxjs/toolkit';
import authReducer     from './slices/authSlice';
import classesReducer  from './slices/classesSlice';
import scheduleReducer from './slices/scheduleSlice';
import bookingsReducer from './slices/bookingsSlice';

const store = configureStore({
  reducer: {
    auth:     authReducer,
    classes:  classesReducer,
    schedule: scheduleReducer,
    bookings: bookingsReducer,
  },
  devTools: true,
});

export default store;
