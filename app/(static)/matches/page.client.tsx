'use client';

import { Preloaded, usePreloadedQuery } from 'convex/react';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { api } from '@/convex/_generated/api';
import { uk } from 'date-fns/locale';
import LoadingConversations from './loading';
import { useRouter } from 'next/navigation';

export function MatchesPage({
  serverConversations,
}: {
  serverConversations: Preloaded<typeof api.conversations.getUserConversations>;
}) {
  const router = useRouter();

  const conversations = usePreloadedQuery(serverConversations);

  if (!conversations) {
    return <LoadingConversations />;
  }

  return (
    <div className="container p-4 mx-auto md:max-w-xl">
      <h1 className="mb-4 text-4xl font-bold">Знайомства</h1>
      <div className="space-y-4 ">
        {conversations.length === 0 && <div>Поки що немає знайомств</div>}

        {conversations.map((conversation) => (
          <Link
            key={conversation?._id}
            href={`/matches/${conversation?._id}`}
            className="block p-4 transition rounded-lg dark:hover:bg-gray-800 hover:bg-purple-50"
          >
            <div className="flex items-center space-x-4">
              {conversation?.otherParticipantPhoto?.url && (
                <Image
                  src={conversation?.otherParticipantPhoto.url}
                  alt={conversation?.otherParticipant.name || 'alt'}
                  width={50}
                  height={50}
                  className="object-cover rounded-full aspect-square"
                />
              )}
              <div className="flex-grow">
                <h2 className="font-semibold">
                  {conversation?.otherParticipant?.name}
                </h2>
                <p className="text-sm text-gray-500 truncate">
                  {conversation?.lastMessage?.content}
                </p>
              </div>
              {conversation?.lastMessage && (
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(
                    conversation?.lastMessage._creationTime,
                    {
                      addSuffix: true,
                      locale: uk,
                    }
                  )}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
