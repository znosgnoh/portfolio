import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import slugify from 'slugify';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { listChildFolders } from '@/lib/google-drive';

function uniqueSlug(base: string, existing: Set<string>): string {
  let slug = base || 'album';
  if (!existing.has(slug)) return slug;
  let i = 2;
  while (existing.has(`${slug}-${i}`)) i += 1;
  return `${slug}-${i}`;
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!rootFolderId) {
    return NextResponse.json(
      { error: 'GOOGLE_DRIVE_FOLDER_ID is not configured' },
      { status: 500 },
    );
  }

  try {
    const folders = await listChildFolders(rootFolderId);
    const existingAlbums = await prisma.album.findMany({
      select: { id: true, slug: true, driveFolderId: true, name: true },
    });

    const byDriveId = new Map(
      existingAlbums
        .filter(a => a.driveFolderId)
        .map(a => [a.driveFolderId as string, a]),
    );
    const usedSlugs = new Set(existingAlbums.map(a => a.slug));

    let created = 0;
    let updated = 0;
    const albums = [];

    for (const folder of folders) {
      const existing = byDriveId.get(folder.id);
      if (existing) {
        const album = await prisma.album.update({
          where: { id: existing.id },
          data: { name: folder.name },
        });
        updated += 1;
        albums.push(album);
        continue;
      }

      const baseSlug = slugify(folder.name, { lower: true, strict: true });
      const slug = uniqueSlug(baseSlug, usedSlugs);
      usedSlugs.add(slug);

      const album = await prisma.album.create({
        data: {
          name: folder.name,
          slug,
          driveFolderId: folder.id,
        },
      });
      created += 1;
      albums.push(album);
    }

    return NextResponse.json({
      discovered: folders.length,
      created,
      updated,
      albums,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Discover failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
