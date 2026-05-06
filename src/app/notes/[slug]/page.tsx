import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import NoteDetailPage from './NoteDetailPage';

export async function generateStaticParams() {
  let notes: { slug: string }[] = [];
  try {
    notes = await prisma.note.findMany({
      where: { isPublic: true },
      select: { slug: true },
    });
  } catch (e) {}
  return notes.map(n => ({ slug: n.slug }));
}

export default async function NotePage({ params }: { params: { slug: string } }) {
  let note = null;
  try {
    note = await prisma.note.findUnique({
      where: { slug: params.slug },
    });
  } catch (e) {}

  if (!note || !note.isPublic) notFound();

  return <NoteDetailPage note={JSON.parse(JSON.stringify(note))} />;
}
