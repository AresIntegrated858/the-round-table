/**
 * queryClient.ts — TanStack Query client.
 *
 * Default `staleTime: 30s` keeps the feed snappy without hammering
 * Supabase. Mutations don't get retried by default — too risky for
 * payment-adjacent calls.
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
