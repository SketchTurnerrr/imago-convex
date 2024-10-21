'use client';

import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useQuery,
} from 'convex/react';
import { api } from '@/convex/_generated/api';

import { useState } from 'react';
import { Profile } from '@/components/random-profile-feed';
import { redirect } from 'next/navigation';

export default function Page() {
  const [profileKey, setProfileKey] = useState(0);
  const { isLoading, isAuthenticated } = useConvexAuth();
  console.log('isAuthenticated :', isAuthenticated);

  const currentUser = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : 'skip'
  );

  // const currentUser = useQuery(api.profiles.current);
  // console.log('currentUser :', currentUser);

  // const profile = useQuery(api.profiles.getRandomProfile, {
  //   key: profileKey,
  // });

  const handleNextProfile = () => {
    setProfileKey((prevKey) => prevKey + 1);
  };

  // if (!currentUser) {
  //   redirect('/sign-in');
  // }

  // if (currentUser?.onboarded === false) {
  //   redirect('/onboarding');
  // }

  return (
    <>
      <main className="flex flex-col max-w-2xl gap-8 md:container ">
        {/* <Authenticated>
          {profile ? (
            <Profile
              currentUserId={currentUser?._id}
              profile={profile}
              type="feed"
              onNextProfile={handleNextProfile}
            />
          ) : null}
        </Authenticated> */}
      </main>
    </>
  );
}
