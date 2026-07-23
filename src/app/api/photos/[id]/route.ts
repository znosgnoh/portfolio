import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { name, description, coverPhotoId } = body as {
    name?: string;
    description?: string | null;
    coverPhotoId?: string | null;
  };

  const existing = await prisma.album.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Album not found' }, { status: 404 });
  }

  if (coverPhotoId) {
    const photo = await prisma.photo.findFirst({
      where: { id: coverPhotoId, albumId: id },
      select: { id: true },
    });
    if (!photo) {
      return NextResponse.json(
        { error: 'Cover photo must belong to this album' },
        { status: 400 },
      );
    }
  }

  const album = await prisma.album.update({
    where: { id },
    data: {
      ...(typeof name === 'string' && name.trim()
        ? { name: name.trim() }
        : {}),
      ...(description !== undefined ? { description } : {}),
      ...(coverPhotoId !== undefined ? { coverPhotoId } : {}),
    },
  });

  return NextResponse.json(album);
}
