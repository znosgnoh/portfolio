import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(notes);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, tags, published } = body;

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
  }

  const slug = slugify(title, { lower: true, strict: true });

  const note = await prisma.note.create({
    data: {
      title: title.trim(),
      slug,
      content: content.trim(),
      tags: Array.isArray(tags) ? tags : [],
      isPublic: published !== false,
      authorId: (session.user as any).id,
    },
  });

  return NextResponse.json(note, { status: 201 });
}
