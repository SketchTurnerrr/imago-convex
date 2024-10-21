'use client';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function Likes() {
  const likes = useQuery(api.likes.getLikesForUser);

  if (!likes) return <div>Loading...</div>;

  return (
    <main className="flex min-h-[100svh] md:max-w-xl flex-col gap-4 p-4 md:mx-auto ">
      <h1 className="self-start text-4xl font-bold md:mb-4">Вподобали вас</h1>
      <Separator className="md:hidden" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:mx-auto lg:max-w-2xl">
        {likes.map((like) => {
          const gender =
            like.liker.gender === 'male' ? 'Вподобав' : 'Вподобала';
          const type = like.itemType === 'photo' ? 'фото' : 'відповідь';
          const conjunction = like.itemType === 'photo' ? 'ваше' : 'вашу';
          return (
            <div key={like._id} className="mb-8">
              <div className="relative ">
                <div className="p-2 text-sm rounded-lg rounded-bl-none w-fit bg-secondary">
                  {like.comment
                    ? like.comment
                    : `${gender} ${conjunction} ${type}`}
                </div>
              </div>

              <Link
                href={{
                  pathname: `/likes/${like._id}`,
                }}
              >
                <span className="mb-4 text-4xl font-bold capitalize">
                  {like.liker.name}
                </span>
                <Image
                  src={like.likerPhoto?.url || '/error-image.jpg'}
                  width={800}
                  height={800}
                  alt={'person'}
                  className="object-cover rounded-lg aspect-square"
                />
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
