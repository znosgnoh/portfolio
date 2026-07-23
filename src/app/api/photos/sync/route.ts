import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { driveViewUrl, listFilesInFolder } from '@/lib/google-drive';

type SyncResult = {
  albumId: string;
  name: string;
  synced: number;
  upserted: number;
  removed: number;
  total: number;
};

async function syncAlbum(albumId: string): Promise<SyncResult> {
  const album = await prisma.album.findUnique({ where: { id: albumId } });
  if (!album || !album.driveFolderId) {
    throw new Error('Album not found or no Drive folder linked');
  }

  const files = await listFilesInFolder(album.driveFolderId);
  const driveIds = new Set(files.map(f => f.id));
  let upserted = 0;

  for (const file of files) {
    const url = file.webContentLink || driveViewUrl(file.id);
    const thumbnailUrl = file.thumbnailLink || null;
    const width = file.imageMediaMetadata?.width ?? null;
    const height = file.imageMediaMetadata?.height ?? null;
    const takenAt = file.imageMediaMetadata?.time
      ? new Date(file.imageMediaMetadata.time)
      : null;

    await prisma.photo.upsert({
      where: { driveFileId: file.id },
      create: {
        driveFileId: file.id,
        url,
        thumbnailUrl,
        title: file.name || null,
        width,
        height,
        takenAt: takenAt && !Number.isNaN(takenAt.getTime()) ? takenAt : null,
        albumId: album.id,
      },
      update: {
        url,
        thumbnailUrl,
        title: file.name || null,
        width,
        height,
        takenAt: takenAt && !Number.isNaN(takenAt.getTime()) ? takenAt : null,
        albumId: album.id,
      },
    });
    upserted += 1;
  }

  // Remove DB photos whose Drive files disappeared from this album
  const stale = await prisma.photo.findMany({
    where: { albumId: album.id },
    select: { id: true, driveFileId: true },
  });
  const staleIds = stale.filter(p => !driveIds.has(p.driveFileId)).map(p => p.id);
  let removed = 0;
  if (staleIds.length > 0) {
    const result = await prisma.photo.deleteMany({
      where: { id: { in: staleIds } },
    });
    removed = result.count;
  }

  const refreshed = await prisma.album.findUnique({
    where: { id: album.id },
    include: { photos: { take: 1, orderBy: { createdAt: 'asc' } } },
  });

  const coverStillValid =
    refreshed?.coverPhotoId &&
    (await prisma.photo.findFirst({
      where: { id: refreshed.coverPhotoId, albumId: album.id },
      select: { id: true },
    }));

  await prisma.album.update({
    where: { id: album.id },
    data: {
      lastSyncedAt: new Date(),
      coverPhotoId: coverStillValid
        ? refreshed!.coverPhotoId
        : refreshed?.photos[0]?.id ?? null,
    },
  });

  const total = await prisma.photo.count({ where: { albumId: album.id } });

  return {
    albumId: album.id,
    name: album.name,
    synced: files.length,
    upserted,
    removed,
    total,
  };
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { albumId, all } = body as { albumId?: string; all?: boolean };

  if (!albumId && !all) {
    return NextResponse.json(
      { error: 'Provide albumId or all: true' },
      { status: 400 },
    );
  }

  try {
    if (all) {
      const albums = await prisma.album.findMany({
        where: { driveFolderId: { not: null } },
        select: { id: true },
      });
      const results: SyncResult[] = [];
      for (const album of albums) {
        results.push(await syncAlbum(album.id));
      }
      return NextResponse.json({
        syncedAlbums: results.length,
        results,
      });
    }

    const result = await syncAlbum(albumId!);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Sync failed';
    const status = message.includes('not found') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
