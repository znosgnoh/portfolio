import { prisma } from '@/lib/prisma';
import StoryPage from './StoryPage';

export const metadata = {
  title: 'My Story | Nosgnoh',
  description: 'A timeline of my journey.',
};

export default async function Page() {
  let events: any[] = [];
  try {
    events = await prisma.storyEvent.findMany({
      orderBy: { date: 'desc' },
    });
  } catch {
    // DB not connected yet
  }

  return <StoryPage events={JSON.parse(JSON.stringify(events))} />;
}
