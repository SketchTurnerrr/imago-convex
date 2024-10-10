import { UTApi } from 'uploadthing/server';
import { NextResponse } from 'next/server';

const utapi = new UTApi();

export async function POST(request: Request) {
  const { fileKey } = await request.json();

  try {
    await utapi.deleteFiles(fileKey);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file from UploadThing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
