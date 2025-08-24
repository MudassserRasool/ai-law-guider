import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BACKEND_BASE_URL } from '../../constants/enviroments';

// Function to clear all auth-related data and reload the app
const handleUnauthorized = () => {
  // Clear all authentication-related localStorage items
  localStorage.removeItem('authToken');
  localStorage.removeItem('legal-vision-auth-user');

  // Clear any other app-specific localStorage items if needed
  // You can add more localStorage.removeItem() calls here for other data

  // Reload the application to reset state
  window.location.reload();
};

// Custom base query with 401 handling
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: BACKEND_BASE_URL,
  prepareHeaders: (headers) => {
    // Add authentication headers if needed
    const token = localStorage.getItem('authToken');

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    // headers.set('Content-Type', 'application/json')
    return headers;
  },
});

// Wrapper function to handle 401 responses
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQueryWithAuth(args, api, extraOptions);

  // Check if the response status is 401 (Unauthorized)
  if (result.error && result.error.status === 401) {
    console.log(
      'Unauthorized access detected. Clearing auth data and reloading...'
    );
    handleUnauthorized();
  }

  return result;
};

// Define the base API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['History'],
  endpoints: () => ({
    // Base endpoints can be defined here or in separate slices
  }),
});

export default apiSlice;
