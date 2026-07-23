import { getPosts, getAllTags, toClientContent } from '@/lib/content';
import PensievePage from './PensievePage';

export const metadata = {
  title: 'Blog | Nosgnoh',
  description: 'A collection of thoughts and writings.',
};

export default async function Page() {
  const posts = await getPosts();
  const tags = getAllTags(posts);

  return <PensievePage posts={posts.map(toClientContent)} tags={tags} />;
}
