import { getAuthUserId } from '@convex-dev/auth/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { convexAuth } from '@convex-dev/auth/server';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log('file url', file.url);

      return { uploadedBy: 'todo' };
    }
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
