import { apiSlice } from '../../apiSlice';

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (formData) => ({
        url: '/chat',
        method: 'POST',
        body: formData,
      }),
    }),
    getChatById: builder.query({
      query: (chatId) => ({
        url: `/history/${chatId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useSendMessageMutation, useGetChatByIdQuery } = chatApi;
