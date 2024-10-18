import { api } from '@/convex/_generated/api';

import { preloadQuery } from 'convex/nextjs';
import { getAuthToken } from '@/app/auth';
import { MatchesPage } from './page.client';

export default async function Page() {
  const token = await getAuthToken();

  const preloadedConversations = await preloadQuery(
    api.conversations.getUserConversations,
    {},
    { token }
  );

  return <MatchesPage serverConversations={preloadedConversations} />;
}
