import { prisma } from '@/lib/prisma';
import NotesPage from './NotesPage';

export const metadata = {
  title: 'Notes | Nosgnoh',
  description: 'Technical notes and learnings',
};

export default async function Notes() {
  let notes: any[] = [];
  try {
    notes = await prisma.note.findMany({
      where: { isPublic: true },
      orderBy: { updatedAt: 'desc' },
    });
  } catch (e) {}

  return <NotesPage notes={JSON.parse(JSON.stringify(notes))} />;
}
