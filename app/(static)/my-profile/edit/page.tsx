import { getAuthToken } from '@/app/auth';
import { EditProfilePage } from './edit-profile';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export default async function Page() {
  const { userId } = auth();

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const token = await getAuthToken();

  const preloadedProfilePhotos = await preloadQuery(
    api.myFunctions.getUserPhotos,
    { single: false },
    { token }
  );

  const preloadedProfilePrompts = await preloadQuery(
    api.myFunctions.getUserPrompts,
    {},
    { token }
  );

  return (
    <EditProfilePage
      preloadedProfilePhotos={preloadedProfilePhotos}
      preloadedProfilePrompts={preloadedProfilePrompts}
    />
  );
}
