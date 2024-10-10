import MyProfile from './page.client';
import { api } from '@/convex/_generated/api';
import { auth } from '@clerk/nextjs/server';
import { preloadQuery } from 'convex/nextjs';
import { getAuthToken } from '@/app/auth';

export default async function ProfilePage() {
  const { userId } = auth();

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const token = await getAuthToken();

  const preloadedProfile = await preloadQuery(
    api.profiles.current,
    {},
    { token }
  );

  return <MyProfile preloadedProfile={preloadedProfile} />;
}
