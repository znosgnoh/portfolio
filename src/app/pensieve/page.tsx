import Link from 'next/link';
import { getPosts, getAllTags } from '@/lib/content';
import PensievePage from './PensievePage';

export const metadata = {
  title: 'Blog | Nosgnoh',
  description: 'A collection of thoughts and writings.',
};

export default async function Page() {
  const posts = await getPosts();
  const tags = getAllTags(posts);

  return <PensievePage posts={JSON.parse(JSON.stringify(posts))} tags={tags} />;
}
