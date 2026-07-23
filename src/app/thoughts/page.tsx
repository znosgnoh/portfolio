import { prisma } from '@/lib/prisma';
import { MOCK_THOUGHTS } from '@/lib/mock-data';
import ThoughtsPage from './ThoughtsPage';

export const metadata = {
  title: 'Thoughts | Nosgnoh',
  description: 'Random thoughts and musings.',
};

export default async function Page() {
  let thoughts = MOCK_THOUGHTS;
  try {
    const rows = await prisma.thought.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    if (rows.length > 0) {
      thoughts = JSON.parse(JSON.stringify(rows));
    }
  } catch {
    // DB not connected — show mock UI data
  }

  return <ThoughtsPage thoughts={thoughts} />;
}
