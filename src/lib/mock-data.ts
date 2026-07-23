/**
 * Mock content for #MeMyselfAndI pages when the database is empty / offline.
 * Used as a UI fallback so layouts can be reviewed without seeding.
 */

export type MockThought = {
  id: string;
  content: string;
  mood: string | null;
  tags: string[];
  createdAt: string;
};

export type MockPhoto = {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  title: string | null;
  width: number | null;
  height: number | null;
};

export type MockAlbum = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  photos: MockPhoto[];
};

export type MockStoryEvent = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  category: string;
  icon: string | null;
};

export const MOCK_THOUGHTS: MockThought[] = [
  {
    id: 'thought-1',
    content:
      'Brick miles before sunrise. Legs heavy, mind quiet — the only meeting that never reschedules.',
    mood: 'focused',
    tags: ['triathlon', 'run'],
    createdAt: '2026-07-18T05:12:00.000Z',
  },
  {
    id: 'thought-2',
    content:
      'Shipped a tiny refactor that deleted 200 lines. Best kind of feature work.',
    mood: 'satisfied',
    tags: ['code', 'react'],
    createdAt: '2026-07-12T14:30:00.000Z',
  },
  {
    id: 'thought-3',
    content:
      'Golden hour on a random side street somewhere in Đà Nẵng. Camera out, itinerary forgotten.',
    mood: 'curious',
    tags: ['travel', 'photography'],
    createdAt: '2026-06-28T10:05:00.000Z',
  },
  {
    id: 'thought-4',
    content:
      'Open-water sighting still feels like a negotiation with the horizon. Keep swimming toward the buoy.',
    mood: 'determined',
    tags: ['triathlon', 'swim'],
    createdAt: '2026-06-15T07:40:00.000Z',
  },
  {
    id: 'thought-5',
    content:
      'Packing list for next trip: one backpack, one lens, one charger, zero expectations.',
    mood: 'restless',
    tags: ['travel', 'backpack'],
    createdAt: '2026-05-22T19:18:00.000Z',
  },
  {
    id: 'thought-6',
    content:
      'Docker finally behaved after I stopped treating the compose file like a wishlist.',
    mood: 'amused',
    tags: ['devops', 'docker'],
    createdAt: '2026-05-03T11:55:00.000Z',
  },
];

function mockPhoto(album: string, index: number, title: string): MockPhoto {
  return {
    id: `${album}-photo-${index}`,
    // Empty src → SafeImage shows sized placeholders (no remote deps)
    url: '',
    thumbnailUrl: null,
    title,
    width: 1200,
    height: 800,
  };
}

export const MOCK_ALBUMS: MockAlbum[] = [
  {
    id: 'album-1',
    name: 'Đà Nẵng 2026',
    slug: 'danang-2026',
    description: 'Coastline rides, morning markets, and soft light after rain.',
    photos: [
      mockPhoto('danang', 1, 'My Khe sunrise'),
      mockPhoto('danang', 2, 'Dragon Bridge night'),
      mockPhoto('danang', 3, 'Marble Mountains steps'),
      mockPhoto('danang', 4, 'Han Market colors'),
      mockPhoto('danang', 5, 'Beach brick session'),
      mockPhoto('danang', 6, 'Cafe laptop hours'),
    ],
  },
  {
    id: 'album-2',
    name: 'Race Day',
    slug: 'race-day',
    description: 'Swim caps, bike racks, and the quiet before the gun.',
    photos: [
      mockPhoto('race', 1, 'Transition setup'),
      mockPhoto('race', 2, 'Open water start'),
      mockPhoto('race', 3, 'Bike out'),
      mockPhoto('race', 4, 'Finish chute'),
    ],
  },
  {
    id: 'album-3',
    name: 'Backpack Notes',
    slug: 'backpack-notes',
    description: 'Train windows, hostel desks, and maps folded the wrong way.',
    photos: [
      mockPhoto('backpack', 1, 'Night train berth'),
      mockPhoto('backpack', 2, 'Mountain pass mist'),
      mockPhoto('backpack', 3, 'Street food stall'),
      mockPhoto('backpack', 4, 'Journal + coffee'),
      mockPhoto('backpack', 5, 'Trail shoes drying'),
    ],
  },
  {
    id: 'album-4',
    name: 'Desk & Dockers',
    slug: 'desk-dockers',
    description: 'Late builds, green terminals, and one stubborn flaky test.',
    photos: [
      mockPhoto('desk', 1, 'Dual monitor setup'),
      mockPhoto('desk', 2, 'Whiteboard spaghetti'),
      mockPhoto('desk', 3, 'Deploy Friday (oops)'),
    ],
  },
];

export const MOCK_STORY_EVENTS: MockStoryEvent[] = [
  {
    id: 'story-1',
    title: 'First Olympic-distance finish',
    description:
      'Crossed the line with jelly legs and a stupid grin. Swim was chaos, bike was wind, run was negotiation — and I still want another one.',
    date: '2025-11-02T00:00:00.000Z',
    category: 'triathlon',
    icon: '🏅',
  },
  {
    id: 'story-2',
    title: 'Solo backpack through Central Vietnam',
    description:
      'Two weeks, one pack, too many cafés. Learned that the best itineraries leave room for wrong turns.',
    date: '2025-04-18T00:00:00.000Z',
    category: 'travel',
    icon: '🎒',
  },
  {
    id: 'story-3',
    title: 'Shipped a production rewrite under deadline',
    description:
      'Migrated a legacy dashboard to a modern stack without taking the business offline. Sleep optional. Coffee mandatory.',
    date: '2024-09-10T00:00:00.000Z',
    category: 'career',
    icon: '💻',
  },
  {
    id: 'story-4',
    title: 'Bought a camera “just for travel”',
    description:
      'Famous last words. Now every commute is a potential frame, and my hard drive disagrees with my hobbies.',
    date: '2023-06-01T00:00:00.000Z',
    category: 'photography',
    icon: '📷',
  },
  {
    id: 'story-5',
    title: 'Learned to love open water',
    description:
      'Pool laps made sense. The bay did not — until the day the panic quieted and the rhythm took over.',
    date: '2022-08-20T00:00:00.000Z',
    category: 'triathlon',
    icon: '🏊',
  },
  {
    id: 'story-6',
    title: 'Started building for the web',
    description:
      'From curious tinkerer to shipping features people actually use. Still chasing elegant solutions to messy problems.',
    date: '2018-01-15T00:00:00.000Z',
    category: 'career',
    icon: '🚀',
  },
];

export function getMockAlbumBySlug(slug: string): MockAlbum | undefined {
  return MOCK_ALBUMS.find(album => album.slug === slug);
}
