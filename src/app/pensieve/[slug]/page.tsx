import { getPostBySlug, getPosts } from '@/lib/content';
import { notFound } from 'next/navigation';
import PostPage from './PostPage';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return <PostPage post={JSON.parse(JSON.stringify(post))} />;
}
