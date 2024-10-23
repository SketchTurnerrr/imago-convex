'use client';

import { useQuery, useMutation } from 'convex/react';
import { useRef, useEffect } from 'react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import Image from 'next/image';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { GoBackBtn } from '@/components/go-back-btn';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';
import { SendHorizonal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Profile } from '@/components/random-profile-feed';
import { FunctionReturnType } from 'convex/server';
import LoadingMessages from './loading';

type FormValues = {
  message: string;
};

export default function ConversationPage({
  params,
}: {
  params: { id: Id<'conversations'> };
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loggedInUser = useQuery(api.users.current);

  const conversation = useQuery(api.conversations.getConversationById, {
    id: params.id,
  });

  console.log('conversation :', conversation?.participantDetails);
  const sendMessage = useMutation(api.messages.sendMessage);

  const form = useForm<FormValues>({
    defaultValues: {
      message: '',
    },
  });

  const handleSendMessage = async (values: FormValues) => {
    if (values.message.trim()) {
      await sendMessage({
        conversationId: params.id,
        content: values.message,
      });
    }
    form.reset();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const currentUser =
    loggedInUser?._id === conversation?.participantDetails[0]._id
      ? conversation?.participantDetails[0]
      : conversation?.participantDetails[1];

  const otherUser =
    loggedInUser?._id === conversation?.participantDetails[0]._id
      ? conversation?.participantDetails[1]
      : conversation?.participantDetails[0];

  console.log('otherUser :', otherUser);
  if (!conversation) {
    return <LoadingMessages />;
  }

  return (
    <div className="flex flex-col h-[100svh]">
      {/* Header */}
      <header className="flex items-center p-4 bg-purple-50 dark:bg-secondary">
        <GoBackBtn />
        {otherUser?.photos && (
          <Image
            src={otherUser.photos[0].url}
            alt={otherUser.name || 'alt'}
            width={40}
            height={40}
            className="object-cover mr-3 rounded-full aspect-square"
          />
        )}
        <h1 className="text-xl font-bold">{otherUser?.name}</h1>
      </header>

      {/* Messages */}
      <Tabs
        defaultValue="chat"
        className="w-full flex-auto overflow-auto md:mx-auto md:w-[700px]"
      >
        <TabsList className="flex fixed z-50 gap-20 w-screen h-10 md:w-[700px] grid-cols-2 mx-auto bg-white rounded-none items-center">
          <TabsTrigger value="chat" className="text-lg w-fit">
            Чат
          </TabsTrigger>
          <TabsTrigger value="profile" className="text-lg w-fit">
            Профіль
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <div className="mt-10 flex-grow p-4 lg:mx-auto space-y-4 overflow-y-auto lg:min-w-[500px]">
            <Verse />
            {conversation?.messages.map((msg, index) => {
              const isCurrentUser = msg.senderId === currentUser?._id;
              const showAvatar =
                index === 0 ||
                conversation?.messages[index - 1].senderId !== msg.senderId;

              return (
                <div
                  key={msg._id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isCurrentUser && showAvatar ? (
                    <div className="flex-shrink-0 mr-2">
                      <Image
                        src={otherUser?.photos[0]?.url || '/default-avatar.png'}
                        alt={otherUser?.name || 'User'}
                        width={32}
                        height={32}
                        className="object-cover rounded-full aspect-square"
                      />
                    </div>
                  ) : (
                    <div className="w-[40px]"></div>
                  )}
                  <div
                    className={`max-w-xs p-3 rounded-lg  ${
                      isCurrentUser ? 'bg-primary text-white ' : 'bg-accent '
                    }`}
                  >
                    <p className="text-lg">{msg.content}</p>
                    <span
                      className={cn(
                        'block mt-1 text-sm ',
                        isCurrentUser ? 'text-slate-300' : 'text-slate-500'
                      )}
                    >
                      {format(msg._creationTime, 'p', {
                        locale: uk,
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </TabsContent>
        <TabsContent value="profile">
          <Profile
            profile={
              otherUser as FunctionReturnType<
                typeof api.profiles.getRandomProfile
              >
            }
            type="chat"
          />
        </TabsContent>
      </Tabs>
      {/* Message Input */}
      <div className="p-4 md:w-[700px] w-full mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSendMessage)}
            className="flex space-x-2"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      placeholder="Повідомлення..."
                      {...field}
                      className="flex-grow p-2 rounded"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="icon"
              className="text-white transition bg-purple-600 rounded-full hover:bg-purple-700"
            >
              <SendHorizonal />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

function Verse() {
  return (
    <div className="card-verse mb-10 flex max-w-[30ch] flex-col gap-2 mx-auto rounded-lg p-4 text-slate-100 shadow-2xl ">
      <p>
        Нехай з ваших уст не виходить жодне гниле, недоречне слово, a лише
        добре, яке при потребі може зміцнити, принести благодать тим, хто
        слухає.
      </p>
      <p className="self-end italic">Ефесян 4:29</p>
    </div>
  );
}
