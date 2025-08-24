import { apiSlice } from '../../apiSlice';

export const historyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHistory: builder.query({
      query: () => ({
        url: '/history',
        method: 'GET',
      }),
      providesTags: ['History'],
    }),
  }),
});

export const { useGetHistoryQuery } = historyApi;
