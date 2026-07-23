'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import { ClientContentItem } from '@/lib/content';

const StyledTagPage = styled.main`
  max-width: 1000px;

  .tag-heading {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 50px;

    span {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-md);
    }

    h1 {
      font-size: clamp(24px, 5vw, 42px);
    }
  }

  .all-tags-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    color: var(--green);
    margin-bottom: 40px;
    display: inline-block;

    &:hover {
      text-decoration: underline;
    }
  }

  ul {
    ${({ theme }) => theme.mixins.resetList};

    li {
      margin-bottom: 20px;
      font-size: var(--fz-xl);

      a {
        color: var(--lightest-slate);
        &:hover {
          color: var(--green);
        }
      }

      .date {
        display: block;
        color: var(--light-slate);
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        margin-top: 5px;
      }
    }
  }
`;

interface TagPageProps {
  tag: string;
  posts: ClientContentItem[];
}

const TagPage: React.FC<TagPageProps> = ({ tag, posts }) => {
  return (
    <Layout>
      <StyledTagPage>
        <div className="tag-heading">
          <span>#{tag}</span>
          <h1>{posts.length} post{posts.length !== 1 ? 's' : ''}</h1>
        </div>

        <Link href="/pensieve" className="all-tags-link">
          &larr; All posts
        </Link>

        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <Link href={`/pensieve/${post.frontmatter.slug}`}>
                {post.frontmatter.title}
              </Link>
              {post.frontmatter.date && (
                <span className="date">
                  {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
            </li>
          ))}
        </ul>
      </StyledTagPage>
    </Layout>
  );
};

export default TagPage;
