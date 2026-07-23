import { getPostBySlug, getPosts, toClientContent } from '@/lib/content';
import { notFound } from 'next/navigation';
import PostPage from './PostPage';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return <PostPage post={toClientContent(post)} />;
}
