import { prisma } from '@/lib/prisma';
import { getMockAlbumBySlug, MOCK_ALBUMS } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import AlbumPage from './AlbumPage';

export async function generateStaticParams() {
  const slugs = new Set<string>();
  try {
    const albums = await prisma.album.findMany({ select: { slug: true } });
    albums.forEach(a => slugs.add(a.slug));
  } catch {
    // DB unavailable at build
  }
  if (slugs.size === 0 && process.env.NODE_ENV === 'development') {
    MOCK_ALBUMS.forEach(a => slugs.add(a.slug));
  }
  return Array.from(slugs).map(slug => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const album = await resolveAlbum(slug);
  if (!album) return { title: 'Album | Nosgnoh' };
  return {
    title: `${album.name} | Photos`,
    description: album.description || `Photos from ${album.name}`,
  };
}

async function resolveAlbum(slug: string) {
  try {
    const album = await prisma.album.findUnique({
      where: { slug },
      include: { photos: { orderBy: { createdAt: 'desc' } } },
    });
    if (album) return JSON.parse(JSON.stringify(album));
    return null;
  } catch {
    // DB unreachable — mock only in local development
    if (process.env.NODE_ENV === 'development') {
      return getMockAlbumBySlug(slug) ?? null;
    }
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const album = await resolveAlbum(slug);
  if (!album) notFound();
  return <AlbumPage album={album} />;
}
