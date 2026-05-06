import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content');

export interface FrontMatter {
  title?: string;
  date?: string;
  slug?: string;
  draft?: boolean;
  tags?: string[];
  cover?: string;
  tech?: string[];
  github?: string;
  external?: string;
  cta?: string;
  company?: string;
  location?: string;
  range?: string;
  url?: string;
  showInProjects?: boolean;
  [key: string]: unknown;
}

export interface ContentItem {
  frontmatter: FrontMatter;
  content: string;
  html: string;
  slug: string;
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

function getMarkdownFiles(dir: string): string[] {
  const fullPath = path.join(contentDirectory, dir);
  if (!fs.existsSync(fullPath)) return [];
  
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const indexPath = path.join(fullPath, entry.name, 'index.md');
      if (fs.existsSync(indexPath)) {
        files.push(path.join(dir, entry.name, 'index.md'));
      }
    } else if (entry.name.endsWith('.md')) {
      files.push(path.join(dir, entry.name));
    }
  }

  return files;
}

export async function getContent(dir: string): Promise<ContentItem[]> {
  const files = getMarkdownFiles(dir);
  const items: ContentItem[] = [];

  for (const file of files) {
    const fullPath = path.join(contentDirectory, file);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const htmlContent = await markdownToHtml(content);
    
    // Strip any path prefix from slug (e.g., "/pensieve/clickable-cards" → "clickable-cards")
    const rawSlug = data.slug || path.basename(path.dirname(file)) || path.basename(file, '.md');
    const slug = rawSlug.split('/').filter(Boolean).pop() || rawSlug;

    items.push({
      frontmatter: data as FrontMatter,
      content,
      html: htmlContent,
      slug,
    });
  }

  return items;
}

export async function getFeaturedProjects(): Promise<ContentItem[]> {
  const items = await getContent('featured');
  return items.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date || 0).getTime();
    const dateB = new Date(b.frontmatter.date || 0).getTime();
    return dateA - dateB;
  });
}

export async function getProjects(): Promise<ContentItem[]> {
  const items = await getContent('projects');
  return items
    .filter(item => item.frontmatter.showInProjects !== false)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date || 0).getTime();
      const dateB = new Date(b.frontmatter.date || 0).getTime();
      return dateB - dateA;
    });
}

export async function getJobs(): Promise<ContentItem[]> {
  const items = await getContent('jobs');
  return items.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date || 0).getTime();
    const dateB = new Date(b.frontmatter.date || 0).getTime();
    return dateB - dateA;
  });
}

export async function getPosts(): Promise<ContentItem[]> {
  const items = await getContent('posts');
  return items
    .filter(item => !item.frontmatter.draft)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date || 0).getTime();
      const dateB = new Date(b.frontmatter.date || 0).getTime();
      return dateB - dateA;
    });
}

export async function getPostBySlug(slug: string): Promise<ContentItem | null> {
  const posts = await getPosts();
  return posts.find(p => p.slug === slug) || null;
}

export function getAllTags(posts: ContentItem[]): Record<string, number> {
  const tags: Record<string, number> = {};
  posts.forEach(post => {
    post.frontmatter.tags?.forEach(tag => {
      tags[tag] = (tags[tag] || 0) + 1;
    });
  });
  return tags;
}
