import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api';

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // session: sessionReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
