import { getPosts, getAllTags, toClientContent } from '@/lib/content';
import TagPage from './TagPage';

export async function generateStaticParams() {
  const posts = await getPosts();
  const tags = getAllTags(posts);
  return Object.keys(tags).map(tag => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return {
    title: `#${tag} | Pensieve`,
    description: `Posts tagged with ${tag}`,
  };
}

export default async function TagRoute({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = (await getPosts()).filter(post =>
    post.frontmatter.tags?.includes(tag)
  );

  return <TagPage tag={tag} posts={posts.map(toClientContent)} />;
}
