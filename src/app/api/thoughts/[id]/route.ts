import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { content, mood, tags, isPublic } = body;

  const thought = await prisma.thought.update({
    where: { id: params.id },
    data: {
      ...(content !== undefined && { content: content.trim() }),
      ...(mood !== undefined && { mood }),
      ...(tags !== undefined && { tags }),
      ...(isPublic !== undefined && { isPublic }),
    },
  });

  return NextResponse.json(thought);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.thought.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
