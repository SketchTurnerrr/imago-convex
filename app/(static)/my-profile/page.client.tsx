'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Preloaded, usePreloadedQuery } from 'convex/react';

export default function MyProfile({
  preloadedProfile,
}: {
  preloadedProfile: Preloaded<typeof api.profiles.current>;
}) {
  const profile = usePreloadedQuery(preloadedProfile);
  console.log('profile :', profile);

  if (preloadedProfile === undefined) {
    return <div>Loading...</div>;
  }

  if (preloadedProfile === null) {
    return <div>Profile not found</div>;
  }

  return (
    <div>
      <h1>My Profile</h1>
      <p>Name: {profile.name}</p>
      <p>Location: {profile.location}</p>
      <p>Email: {profile.email}</p>
      {/* Add more  fields as needed */}
    </div>
  );
}
