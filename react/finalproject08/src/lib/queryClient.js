import { QueryClient } from "@tanstack/react-query";

//src/lib/queryClient.js
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,

      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,

      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      onError: (error) => {
        console.error("Query Error:", error);
      },
    },

    mutations: {
      retry: false,

      onError: (error) => {
        console.error("Mutation Error:", error);
      },
    },
  },
});
