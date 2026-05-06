import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const events = await prisma.storyEvent.findMany({
    orderBy: { date: 'desc' },
  });
  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, date, category, icon, imageUrl } = body;

  if (!title || !date || !category) {
    return NextResponse.json({ error: 'Title, date, and category are required' }, { status: 400 });
  }

  const event = await prisma.storyEvent.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      date: new Date(date),
      category: category.trim(),
      icon: icon || null,
      imageUrl: imageUrl || null,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
