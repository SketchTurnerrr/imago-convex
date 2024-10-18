import { api } from '@/convex/_generated/api';
import { useConvexAuth, useQuery } from 'convex/react';

export function useCurrentUser() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : 'skip'
  );
  // Combine the authentication state with the user existence check
  return {
    isLoading: isLoading || (isAuthenticated && user === null),
    isAuthenticated: isAuthenticated && user !== null,
  };
}
