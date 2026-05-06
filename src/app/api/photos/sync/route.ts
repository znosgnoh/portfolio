import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { listFilesInFolder } from '@/lib/google-drive';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { albumId } = body;

  if (!albumId) {
    return NextResponse.json({ error: 'Album ID is required' }, { status: 400 });
  }

  const album = await prisma.album.findUnique({ where: { id: albumId } });
  if (!album || !album.driveFolderId) {
    return NextResponse.json({ error: 'Album not found or no Drive folder linked' }, { status: 400 });
  }

  try {
    const files = await listFilesInFolder(album.driveFolderId);

    for (const file of files) {
      const exists = await prisma.photo.findFirst({
        where: { driveFileId: file.id },
      });

      if (!exists) {
        await prisma.photo.create({
          data: {
            url: file.webContentLink || `https://drive.google.com/uc?id=${file.id}`,
            thumbnailUrl: file.thumbnailLink || null,
            title: file.name || null,
            driveFileId: file.id,
            albumId: album.id,
          },
        });
      }
    }

    // Update album cover if none set
    if (!album.coverPhotoId) {
      const firstPhoto = await prisma.photo.findFirst({
        where: { albumId: album.id },
      });
      if (firstPhoto) {
        await prisma.album.update({
          where: { id: album.id },
          data: { coverPhotoId: firstPhoto.id },
        });
      }
    }

    const count = await prisma.photo.count({ where: { albumId: album.id } });
    return NextResponse.json({ synced: files.length, total: count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 });
  }
}
