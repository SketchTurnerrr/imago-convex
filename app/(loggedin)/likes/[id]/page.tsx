'use client';
import Image from 'next/image';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Profile } from '@/components/random-profile-feed';

type Photo = {
  _id: Id<'photos'>;
  _creationTime: number;
  userId: Id<'users'>;
  url: string;
  order: number;
};

type Prompt = {
  _id: Id<'prompts'>;
  _creationTime: number;
  question: string;
  answer: string;
  userId: Id<'users'>;
};

export default function Page({ params }: { params: { id: Id<'likes'> } }) {
  const like = useQuery(api.likes.getLikeById, { likeId: params.id });

  const isPhoto = (item: Photo | Prompt): item is Photo => {
    if (!item) return false;
    return 'url' in item;
  };

  const isPrompt = (item: Photo | Prompt): item is Prompt => {
    return 'question' in item;
  };

  const profile = useQuery(api.profiles.getProfileById, {
    id: like?.likerId,
  });

  if (!like || !profile) {
    return <div>Loading...</div>;
  }

  const renderLike =
    like.itemType === 'photo' && isPhoto(like.item!) ? (
      <div className="mx-auto p-4 md:w-[500px] md:px-0">
        <div className="relative h">
          <Image
            src={like.item?.url}
            width={500}
            height={500}
            alt={'k'}
            className="aspect-[16/9] rounded-lg object-cover"
          />

          <div className="absolute p-2 bg-indigo-200 rounded-lg text-background -bottom-2">
            {like.comment
              ? like.comment
              : like.liker.gender === 'male'
                ? 'Вподобав' + ' ваше фото'
                : 'Вподобала' + ' ваше фото'}
          </div>
        </div>
      </div>
    ) : (
      <div className="relative mx-auto my-4 p-4 md:w-[500px] md:px-0">
        <div className="relative p-4 space-y-4 rounded-lg bg-secondary">
          <p>
            {like.itemType === 'prompt' && isPrompt(like.item!)
              ? like.item?.question
              : null}
          </p>
          <p className="text-xl font-semibold truncate">
            {like.itemType === 'prompt' && isPrompt(like.item!)
              ? like.item?.answer
              : null}
          </p>
        </div>
        <div className="absolute p-2 bg-indigo-200 rounded-lg text-background -bottom-4">
          {like.comment
            ? like.comment
            : like.liker.gender === 'male'
              ? 'Вподобав' + ' вашу відповідь'
              : 'Вподобала' + ' вашу відповідь'}
        </div>
      </div>
    );

  return (
    <>
      {renderLike}

      <Profile type="like" profile={profile} likeId={like._id} />
    </>
  );
}
