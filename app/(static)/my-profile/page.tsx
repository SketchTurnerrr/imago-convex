import MyProfile from './page.client';
import { api } from '@/convex/_generated/api';
import { preloadedQueryResult, preloadQuery } from 'convex/nextjs';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const preloadedProfile = await preloadQuery(api.profiles.current, {});

  // const preloadedProfilePhoto = await preloadQuery(
  //   api.myFunctions.getUserPhotos,
  //   { single: true }
  // );

  return (
    <MyProfile
      preloadedProfile={preloadedProfile}
      preloadedProfilePhoto={preloadedProfilePhoto}
    />
  );
}
