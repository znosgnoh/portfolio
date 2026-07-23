import { prisma } from '@/lib/prisma';
import { MOCK_STORY_EVENTS } from '@/lib/mock-data';
import StoryPage from './StoryPage';

export const metadata = {
  title: 'My Story | Nosgnoh',
  description: 'A timeline of my journey.',
};

export default async function Page() {
  let events = MOCK_STORY_EVENTS;
  try {
    const rows = await prisma.storyEvent.findMany({
      orderBy: { date: 'desc' },
    });
    if (rows.length > 0) {
      events = JSON.parse(JSON.stringify(rows));
    }
  } catch {
    // DB not connected — show mock UI data
  }

  return <StoryPage events={events} />;
}
