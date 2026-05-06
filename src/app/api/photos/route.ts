import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import slugify from 'slugify';

export async function GET() {
  const albums = await prisma.album.findMany({
    include: { _count: { select: { photos: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(albums);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, driveFolderId } = body;

  if (!name) {
    return NextResponse.json({ error: 'Album name is required' }, { status: 400 });
  }

  const album = await prisma.album.create({
    data: {
      name: name.trim(),
      slug: slugify(name, { lower: true, strict: true }),
      description: description || null,
      driveFolderId: driveFolderId || null,
    },
  });

  return NextResponse.json(album, { status: 201 });
}
