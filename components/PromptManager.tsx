import React, { useState } from 'react';
import { Prompt } from './prompt';
import { Button } from '@/components/ui/button';
import { CreatePromptDialog } from './create-prompt';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface PromptManagerProps {
  onComplete: () => void;
}

export function PromptManager({ onComplete }: PromptManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dbPrompts = useQuery(api.myFunctions.getUserPrompts);

  if (!dbPrompts) {
    return null;
  }

  const isComplete = dbPrompts.length >= 3;

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="mt-20 mb-4 text-4xl font-bold">Додайте три фрази</h1>
      {dbPrompts.map((prompt) => (
        <Prompt
          key={prompt._id}
          id={prompt._id}
          display={false}
          answer={prompt.answer}
          question={prompt.question}
        />
      ))}
      {dbPrompts.length < 3 && <CreatePromptDialog />}
      <p className="text-sm font-semibold text-gray-400">
        Додайте мінімум 3 фрази.
      </p>
      <Button
        onClick={onComplete}
        disabled={!isComplete}
        className="self-end mt-4"
      >
        {isComplete
          ? 'Далі'
          : 'Додайте ще ' + (3 - dbPrompts.length) + ' фраз(и)'}
      </Button>
    </div>
  );
}
