import { prisma } from '@/lib/prisma';
import ThoughtsPage from './ThoughtsPage';

export const metadata = {
  title: 'Thoughts | Nosgnoh',
  description: 'Random thoughts and musings.',
};

export default async function Page() {
  let thoughts: any[] = [];
  try {
    thoughts = await prisma.thought.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } catch {
    // DB not connected yet
  }

  return <ThoughtsPage thoughts={JSON.parse(JSON.stringify(thoughts))} />;
}
