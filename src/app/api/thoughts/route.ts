import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const thoughts = await prisma.thought.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json(thoughts);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { content, mood, tags, isPublic } = body;

  if (!content || typeof content !== 'string' || content.length > 2000) {
    return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
  }

  const thought = await prisma.thought.create({
    data: {
      content: content.trim(),
      mood: mood || null,
      tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()) : [],
      isPublic: isPublic !== false,
      authorId: (session.user as any).id,
    },
  });

  return NextResponse.json(thought, { status: 201 });
}
