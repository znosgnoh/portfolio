'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import { ContentItem } from '@/lib/content';

const StyledPostContainer = styled.main`
  .post-header {
    margin-bottom: 50px;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    color: var(--green);

    .arrow {
      display: block;
      margin-right: 10px;
    }

    a {
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
  }

  .post-title {
    font-size: clamp(28px, 5vw, 48px);
    margin-bottom: 10px;
  }

  .post-meta {
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .post-content {
    color: var(--light-slate);
    font-size: var(--fz-lg);
    line-height: 1.7;

    h2, h3, h4 {
      margin: 2em 0 1em;
      color: var(--lightest-slate);
    }

    a {
      color: var(--green);
    }

    ul, ol {
      padding-left: 2em;
      margin-bottom: 1em;
    }

    img {
      max-width: 100%;
      border-radius: var(--border-radius);
    }
  }

  .tags {
    display: flex;
    gap: 10px;
    margin-top: 50px;
    flex-wrap: wrap;

    a {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      padding: 5px 10px;
      border: 1px solid var(--green);
      border-radius: var(--border-radius);

      &:hover {
        background-color: var(--green-tint);
      }
    }
  }
`;

interface PostPageProps {
  post: ContentItem;
}

const PostPage: React.FC<PostPageProps> = ({ post }) => {
  return (
    <Layout>
      <StyledPostContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link href="/pensieve">All posts</Link>
        </span>

        <div className="post-header">
          <h1 className="post-title">{post.frontmatter.title}</h1>
          <span className="post-meta">
            {post.frontmatter.date && new Date(post.frontmatter.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.html }} />

        {post.frontmatter.tags && (
          <div className="tags">
            {post.frontmatter.tags.map(tag => (
              <Link key={tag} href={`/pensieve/tags/${tag}`}>
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </StyledPostContainer>
    </Layout>
  );
};

export default PostPage;
