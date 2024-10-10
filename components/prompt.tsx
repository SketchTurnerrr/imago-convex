import React from 'react';

import Image from 'next/image';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface PromptProps {
  id: Id<'prompts'>;
  question: string;
  answer: string;
  display: boolean;
}

export function Prompt({ id, answer, question, display }: PromptProps) {
  const deletePrompt = useMutation(api.myFunctions.deletePrompt);

  async function onDelete() {
    await deletePrompt({ promptId: id });
  }

  if (!display) {
    return (
      <div className="relative flex flex-col p-4 text-sm font-bold border rounded-lg shadow-sm border-slate-100">
        <p>{question}</p>
        <p className="pl-2 mt-2 text-gray-500 border-l border-gray-300">
          {answer}
        </p>
        <div
          onClick={onDelete}
          role="button"
          className="absolute p-1 bg-white rounded-full shadow-md -right-1 -top-1"
        >
          <Image
            src="/x.svg"
            width={14}
            height={14}
            alt="close icon"
            className=""
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-4 rounded-lg bg-white px-4 py-16 dark:bg-secondary md:w-[500px]">
      <p className="font-semibold text-md">{question}</p>
      <h2 className="text-3xl font-bold">{answer}</h2>
      {/* {pathname === '/discover' && (
        <LikeDialog
          itemId={id}
          type="prompt"
          liker={liker}
          likee={likee}
          firstName={null}
          src={null}
          question={question}
          answer={answer}
        />
      )} */}
    </div>
  );
}
