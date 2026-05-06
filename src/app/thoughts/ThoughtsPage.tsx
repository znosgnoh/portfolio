'use client';

import React from 'react';
import styled from 'styled-components';
import Layout from '@/components/Layout';

const StyledMainContainer = styled.main`
  & > header {
    margin-bottom: 100px;
    text-align: center;
  }
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 15px;
`;

const StyledThought = styled.div`
  ${({ theme }) => theme.mixins.boxShadow};
  padding: 2rem;
  border-radius: var(--border-radius);
  background-color: var(--light-navy);
  transition: var(--transition);

  .content {
    color: var(--light-slate);
    font-size: var(--fz-lg);
    margin-bottom: 1rem;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
  }

  .tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 0.5rem;

    span {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
    }
  }
`;

interface Thought {
  id: string;
  content: string;
  mood: string | null;
  tags: string[];
  createdAt: string;
}

interface ThoughtsPageProps {
  thoughts: Thought[];
}

const ThoughtsPage: React.FC<ThoughtsPageProps> = ({ thoughts }) => {
  return (
    <Layout>
      <StyledMainContainer>
        <header>
          <h1 className="big-heading">Thoughts</h1>
          <p className="subtitle">Random musings and reflections</p>
        </header>

        {thoughts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--slate)' }}>
            No thoughts shared yet. Check back soon!
          </p>
        ) : (
          <StyledGrid>
            {thoughts.map(thought => (
              <StyledThought key={thought.id}>
                <div className="content">{thought.content}</div>
                <div className="meta">
                  <span>{new Date(thought.createdAt).toLocaleDateString()}</span>
                  {thought.mood && <span>{thought.mood}</span>}
                </div>
                {thought.tags.length > 0 && (
                  <div className="tags">
                    {thought.tags.map(tag => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                )}
              </StyledThought>
            ))}
          </StyledGrid>
        )}
      </StyledMainContainer>
    </Layout>
  );
};

export default ThoughtsPage;
