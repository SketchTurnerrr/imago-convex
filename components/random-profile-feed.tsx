import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Cross from '@/public/cross.svg';
import { FunctionReturnType } from 'convex/server';
import { api } from '@/convex/_generated/api';
import { differenceInYears, parse } from 'date-fns';
import { ArrowRight, CakeIcon, MapPin } from 'lucide-react';

interface RandomProfileFeedProps {
  profile: FunctionReturnType<typeof api.myFunctions.getRandomProfile>;
  onNextProfile: () => void;
}

export function RandomProfileFeed({
  profile,

  onNextProfile,
}: RandomProfileFeedProps) {
  if (!profile) {
    return <div>Someting went wrong</div>;
  }

  const sortedPhotos = profile.photos.sort((a, b) => a.order - b.order);
  const sortedPrompts = profile.prompts.slice(0, 3);

  const calculateAge = (dob: string) => {
    const parsedDate = parse(dob, 'dd.MM.yyyy', new Date());
    return differenceInYears(new Date(), parsedDate);
  };

  const age = calculateAge(profile.dob);

  const handleMatch = () => {
    // Implement match functionality here
    console.log('Matched with', profile.name);
  };

  return (
    <>
      <Card className="w-full max-w-md md:max-w-lg mx-auto mb-[120px] rounded-none border-none bg-[hsl(0, 0%, 12%)]">
        <CardHeader>
          <CardTitle className="text-4xl">{profile.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 ">
          {sortedPhotos[0] && (
            <Image
              src={sortedPhotos[0].url}
              alt={`${name}'s photo`}
              width={1000}
              height={1000}
              priority
              className="w-full h-auto rounded-lg"
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
            <div className="px-4 py-10 space-y-4 rounded-lg bg-purple-50 dark:bg-secondary">
              <p className="font-semibold">{sortedPrompts[0].question}</p>
              <p>{sortedPrompts[0].answer}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {sortedPhotos[1] && (
              <Image
                src={sortedPhotos[1].url}
                alt={`${name}'s photo`}
                width={1000}
                height={1000}
                className="w-full h-auto rounded-lg"
              />
            )}
            {sortedPhotos[2] && (
              <Image
                src={sortedPhotos[2].url}
                alt={`${name}'s photo`}
                width={1000}
                height={1000}
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>

          {sortedPrompts[1] && (
            <div className="px-4 py-10 space-y-4 rounded-lg bg-purple-50 dark:bg-secondary">
              <p className="font-semibold">{sortedPrompts[1].question}</p>
              <p>{sortedPrompts[1].answer}</p>
            </div>
          )}

          {sortedPhotos[3] && (
            <Image
              src={sortedPhotos[3].url}
              alt={`${name}'s photo`}
              width={1000}
              height={1000}
              className="w-full h-auto rounded-lg"
            />
          )}

          {sortedPrompts[2] && (
            <div className="px-4 py-10 space-y-4 rounded-lg dark:bg-secondary bg-purple-50">
              <p className="font-semibold">{sortedPrompts[2].question}</p>
              <p>{sortedPrompts[2].answer}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {sortedPhotos[4] && (
              <Image
                src={sortedPhotos[4].url}
                alt={`${name}'s photo`}
                width={1000}
                height={1000}
                className="w-full h-auto rounded-lg"
              />
            )}
            {sortedPhotos[5] && (
              <Image
                src={sortedPhotos[5].url}
                alt={`${name}'s photo`}
                width={1000}
                height={1000}
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="fixed left-0 right-0 flex justify-between px-8 space-x-4 bottom-20 md:justify-around md:bottom-10">
        <Button
          onClick={onNextProfile}
          className="flex items-center justify-center px-3 rounded-full w-14 h-14"
          // variant="ghost"
        >
          <ArrowRight className="w-24 h-24" />
        </Button>
        <Button
          onClick={handleMatch}
          className="flex items-center justify-center px-3 rounded-full w-14 h-14"
          variant="default"
        >
          <Image
            src="/hand-waving.svg"
            width={24}
            height={24}
            alt="hand waving"
            className="w-full h-full text-red-400"
          />
        </Button>
      </div>
    </>
  );
}
