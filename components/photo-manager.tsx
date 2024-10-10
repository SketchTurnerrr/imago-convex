'use client';
import React, { useEffect, useState } from 'react';
import { UploadDropzone } from '@/lib/uploadthing';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';

import { Id } from '@/convex/_generated/dataModel';
import { Loader2, UploadIcon } from 'lucide-react';
import { Button } from './ui/button';

const PHOTO_COUNT = 6;

export function PhotoManager({ onComplete }: { onComplete: () => void }) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const photos = useQuery(api.myFunctions.getUserPhotos);
  const addPhoto = useMutation(api.myFunctions.addPhoto);
  const removePhoto = useMutation(api.myFunctions.removePhoto);

  if (!photos) {
    return null;
  }
  const isComplete = photos.length >= 3;

  const handleUpload = async (index: number, url: string) => {
    try {
      await addPhoto({ url, order: index });
      setUploadingIndex(null);
    } catch (error) {
      console.error('Error adding photo:', error);
    }
  };

  const handleRemove = async (photoId: Id<'photos'>) => {
    try {
      await removePhoto({ id: photoId });
    } catch (error) {
      console.error('Error removing photo:', error);
    }
  };

  if (photos === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="mt-20 mb-4 text-3xl">Додайте мінімум 3 фото</h1>
      <div className="grid grid-cols-3 gap-4 ">
        {Array.from({ length: PHOTO_COUNT }).map((_, index) => {
          const photo = photos.find((p) => p.order === index);
          return (
            <div
              key={index}
              className="relative flex items-center justify-center aspect-square *:mt-0"
            >
              {photo ? (
                <>
                  <Image
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                  <div
                    onClick={() => handleRemove(photo._id)}
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
                </>
              ) : (
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]) {
                      handleUpload(index, res[0].url);
                    }
                  }}
                  onUploadBegin={() => setUploadingIndex(index)}
                  className="outline-2 outline-orange-300 outline-dashed rounded-lg cursor-pointer bg-[url('/placeholder.png')] bg-center bg-no-repeat bg-cover w-full border-none"
                  appearance={{
                    label: 'hidden',
                    button: 'hidden',
                    allowedContent: 'hidden',
                  }}
                  content={{
                    uploadIcon:
                      uploadingIndex === index ? (
                        <Loader2 className="w-10 h-10 animate-spin" />
                      ) : (
                        <UploadIcon className="w-10 h-10 text-white" />
                      ),
                  }}
                  config={{
                    mode: 'auto',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-sm font-semibold text-gray-400">
        Додайте мінімум 3 фото.
      </p>
      <Button
        onClick={onComplete}
        disabled={!isComplete}
        className="self-end mt-auto"
      >
        {isComplete ? 'Далі' : `Додайте ще ${3 - photos.length} фото`}
      </Button>
    </>
  );
}
