import { getPosts, getAllTags } from '@/lib/content';
import TagPage from './TagPage';

export async function generateStaticParams() {
  const posts = await getPosts();
  const tags = getAllTags(posts);
  return Object.keys(tags).map(tag => ({ tag }));
}

export function generateMetadata({ params }: { params: { tag: string } }) {
  return {
    title: `#${params.tag} | Pensieve`,
    description: `Posts tagged with ${params.tag}`,
  };
}

export default async function TagRoute({ params }: { params: { tag: string } }) {
  const posts = (await getPosts()).filter(
    post => post.frontmatter.tags?.includes(params.tag)
  );

  return <TagPage tag={params.tag} posts={JSON.parse(JSON.stringify(posts))} />;
}
