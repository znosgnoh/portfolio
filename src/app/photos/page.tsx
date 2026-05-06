import { prisma } from '@/lib/prisma';
import PhotosPage from './PhotosPage';

export const metadata = {
  title: 'Photos | Nosgnoh',
  description: 'Photo gallery synced from Google Drive.',
};

export default async function Page() {
  let albums: any[] = [];
  try {
    albums = await prisma.album.findMany({
      include: { photos: { take: 4, orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    // DB not connected yet
  }

  return <PhotosPage albums={JSON.parse(JSON.stringify(albums))} />;
}
