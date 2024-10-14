import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Cross from '@/public/cross.svg';
import { FunctionReturnType } from 'convex/server';
import { api } from '@/convex/_generated/api';
import { differenceInYears, parse } from 'date-fns';
import { ArrowRight, CakeIcon, MapPin } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import { LikeDialog } from './like-dialog';
import { Prompt } from './prompt';
import { RemoveLikeBtn } from './remove-like-btn';
import { MatchBtn } from './match-btn';

interface ProfileProps {
  type: 'like' | 'feed';
  likeId?: Id<'likes'>;
  profile: FunctionReturnType<typeof api.myFunctions.getRandomProfile>;
  onNextProfile?: () => void;
  currentUserId?: Id<'profiles'>;
}

function PhotoComponent({
  photo,
  name,
  currentUserId,
  profileId,
}: {
  photo: {
    _id: Id<'photos'>;
    profileId: Id<'profiles'>;
    url: string;
    order: number;
  };
  name: string | undefined;
  currentUserId?: Id<'profiles'>;
  profileId: Id<'profiles'>;
}) {
  return (
    <div className="relative">
      <Image
        src={photo?.url}
        alt={`${name}'s photo`}
        width={1000}
        height={1000}
        className="w-full h-auto rounded-lg"
      />
      <LikeDialog
        itemId={photo._id}
        type="photo"
        liker={currentUserId}
        likee={profileId}
        url={photo.url}
        name={name}
      />
    </div>
  );
}

function PromptComponent({
  prompt,
  currentUserId,
  profileId,
}: {
  prompt: {
    _id: Id<'prompts'>;
    profileId: Id<'profiles'>;
    question: string;
    answer: string;
  };
  currentUserId?: Id<'profiles'>;
  profileId: Id<'profiles'>;
}) {
  return (
    <Prompt
      question={prompt.question}
      answer={prompt.answer}
      display={true}
      liker={currentUserId}
      likee={profileId}
      id={prompt._id}
    />
  );
}

export function Profile({
  profile,
  type,
  likeId,
  currentUserId,
  onNextProfile,
}: ProfileProps) {
  if (!profile) {
    return <div>Something went wrong</div>;
  }

  const sortedPhotos = profile.photos.sort((a, b) => a.order - b.order);
  const sortedPrompts = profile.prompts.slice(0, 3);

  const calculateAge = (dob: string) => {
    const parsedDate = parse(dob, 'dd.MM.yyyy', new Date());
    return differenceInYears(new Date(), parsedDate);
  };

  const age = calculateAge(profile.dob);

  return (
    <>
      <Card className="w-full max-w-md md:max-w-lg mx-auto mb-[120px] rounded-none border-none bg-[hsl(0, 0%, 12%)] shadow-none">
        <CardHeader className="px-4 pb-0">
          <CardTitle className="text-4xl">{profile.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {sortedPhotos[0] && (
            <PhotoComponent
              photo={sortedPhotos[0]}
              name={profile.name}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}

          <div className="flex justify-between p-4 text-sm rounded-lg bg-purple-50 dark:bg-secondary">
            <span className="flex items-center gap-2">
              <CakeIcon />
              {age}
            </span>

            <span className="flex items-center gap-2">
              <Cross />
              {profile.denomination}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              {profile.custom_location
                ? profile.custom_location
                : profile.location}
            </span>
          </div>

          {sortedPrompts[0] && (
            <PromptComponent
              prompt={sortedPrompts[0]}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}

          {sortedPhotos[1] && (
            <PhotoComponent
              photo={sortedPhotos[1]}
              name={profile.name}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}

          {sortedPhotos[2] && (
            <PhotoComponent
              photo={sortedPhotos[2]}
              name={profile.name}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}

          {sortedPrompts[1] && (
            <PromptComponent
              prompt={sortedPrompts[1]}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}

          {sortedPhotos[3] && (
            <PhotoComponent
              photo={sortedPhotos[3]}
              name={profile.name}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}

          {sortedPrompts[2] && (
            <PromptComponent
              prompt={sortedPrompts[2]}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}

          {sortedPhotos[4] && (
            <PhotoComponent
              photo={sortedPhotos[4]}
              name={profile.name}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}

          {sortedPhotos[5] && (
            <PhotoComponent
              photo={sortedPhotos[5]}
              name={profile.name}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}

          {sortedPhotos[6] && (
            <PhotoComponent
              photo={sortedPhotos[6]}
              name={profile.name}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}
        </CardContent>
      </Card>

      <div className="fixed left-0 right-0 flex justify-between px-8 space-x-4 bottom-20 md:justify-around md:bottom-10">
        {type === 'feed' ? (
          <Button
            onClick={onNextProfile}
            size="icon"
            className="flex items-center justify-center rounded-full w-14 h-14"
          >
            <ArrowRight className="w-8 h-8" />
          </Button>
        ) : (
          <RemoveLikeBtn />
        )}
        {type === 'feed' ? (
          <div role="none" aria-description="empty div to fill up space"></div>
        ) : (
          <MatchBtn likeId={likeId} receiverId={profile._id} />
        )}
      </div>
    </>
  );
}
