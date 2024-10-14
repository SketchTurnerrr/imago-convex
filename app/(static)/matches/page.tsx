'use client';

import { useQuery } from 'convex/react';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { api } from '@/convex/_generated/api';
import { uk } from 'date-fns/locale';

export default function MatchesPage() {
  const conversations = useQuery(api.conversations.getUserConversations);
  console.log('conversations :', conversations);

  if (!conversations) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-md p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Знайомства</h1>
      <div className="space-y-4 ">
        {conversations.map((conversation) => (
          <Link
            key={conversation?._id}
            href={`/conversation?s/${conversation?._id}`}
            className="block p-4 transition rounded-lg dark:hover:bg-gray-800 hover:bg-purple-50"
          >
            <div className="flex items-center space-x-4">
              {conversation?.otherParticipantPhoto?.url && (
                <Image
                  src={conversation?.otherParticipantPhoto.url}
                  alt={conversation?.otherParticipant.name}
                  width={50}
                  height={50}
                  className="rounded-full"
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
