import MyProfile from './page.client';
import { api } from '@/convex/_generated/api';
import { preloadedQueryResult, preloadQuery } from 'convex/nextjs';
import { getAuthToken } from '@/app/auth';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const token = await getAuthToken();

  const preloadedProfile = await preloadQuery(
    api.profiles.current,
    {},
    { token }
  );

  const isOnboarded = preloadedQueryResult(preloadedProfile).onboarded;
  console.log('notOnboarded :', isOnboarded);

  if (!isOnboarded) {
    redirect('/onboarding');
  }

  const preloadedProfilePhoto = await preloadQuery(
    api.myFunctions.getUserPhotos,
    { single: true },
    { token }
  );

  return (
    <MyProfile
      preloadedProfile={preloadedProfile}
      preloadedProfilePhoto={preloadedProfilePhoto}
    />
  );
}
