'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import { ClientContentItem } from '@/lib/content';

const StyledMainContainer = styled.main`
  & > header {
    margin-bottom: 100px;
    text-align: center;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 50px;

    a {
      ${({ theme }) => theme.mixins.smallButton};
      font-size: var(--fz-xxs);
    }
  }
`;

const StyledPostList = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  li {
    margin-bottom: 30px;
    padding: 25px 30px;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);

    &:hover {
      background-color: var(--lightest-navy);
    }

    h3 {
      margin-bottom: 5px;
      color: var(--lightest-slate);
      font-size: var(--fz-xxl);
    }

    .post-meta {
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      margin-bottom: 10px;
    }

    p {
      color: var(--slate);
    }

    .tags {
      display: flex;
      gap: 10px;
      margin-top: 10px;

      span {
        color: var(--green);
        font-family: var(--font-mono);
        font-size: var(--fz-xxs);
      }
    }
  }
`;

interface PensievePageProps {
  posts: ClientContentItem[];
  tags: Record<string, number>;
}

const PensievePage: React.FC<PensievePageProps> = ({ posts, tags }) => {
  return (
    <Layout>
      <StyledMainContainer>
        <header>
          <h1 className="big-heading">Pensieve</h1>
          <p className="subtitle">A collection of memories and writings</p>
        </header>

        <div className="tag-list">
          {Object.entries(tags)
            .sort((a, b) => b[1] - a[1])
            .map(([tag, count]) => (
              <Link key={tag} href={`/pensieve/tags/${tag}`}>
                #{tag} ({count})
              </Link>
            ))}
        </div>

        <StyledPostList>
          {posts.map(post => (
            <li key={post.slug}>
              <Link href={`/pensieve/${post.slug}`}>
                <h3>{post.frontmatter.title}</h3>
                <span className="post-meta">
                  {post.frontmatter.date && new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                {post.frontmatter.tags && (
                  <div className="tags">
                    {post.frontmatter.tags.map(tag => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </StyledPostList>
      </StyledMainContainer>
    </Layout>
  );
};

export default PensievePage;
