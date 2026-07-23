import { prisma } from '@/lib/prisma';
import { MOCK_ALBUMS } from '@/lib/mock-data';
import PhotosPage from './PhotosPage';

export const metadata = {
  title: 'Photos | Nosgnoh',
  description: 'Photo gallery synced from Google Drive.',
};

export default async function Page() {
  let albums: typeof MOCK_ALBUMS = [];

  try {
    const rows = await prisma.album.findMany({
      include: { photos: { take: 4, orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });
    if (rows.length > 0) {
      albums = JSON.parse(JSON.stringify(rows));
    }
    // Empty DB → empty gallery (do not substitute mock once Drive/DB is wired)
  } catch {
    // Only use mock when the database is unreachable in local development
    if (process.env.NODE_ENV === 'development') {
      albums = MOCK_ALBUMS;
    }
  }

  return <PhotosPage albums={albums} />;
}
