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

const StyledTimeline = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background-color: var(--lightest-navy);

    @media (max-width: 768px) {
      left: 20px;
    }
  }
`;

const StyledEvent = styled.div<{ isLeft: boolean }>`
  position: relative;
  width: 50%;
  padding: 20px 40px;
  ${({ isLeft }) => (isLeft ? 'left: 0;' : 'left: 50%;')}

  @media (max-width: 768px) {
    width: 100%;
    left: 0;
    padding-left: 60px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 30px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--green);
    ${({ isLeft }) => (isLeft ? 'right: -6px;' : 'left: -6px;')}

    @media (max-width: 768px) {
      left: 14px;
    }
  }

  .event-card {
    ${({ theme }) => theme.mixins.boxShadow};
    padding: 1.5rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);

    h3 {
      color: var(--lightest-slate);
      margin-bottom: 0.5rem;
      font-size: var(--fz-xl);
    }

    .date {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      margin-bottom: 0.5rem;
    }

    .category {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    p {
      color: var(--light-slate);
      font-size: var(--fz-md);
    }
  }
`;

interface StoryEvent {
  id: string;
  title: string;
  description: string | null;
  date: string;
  category: string;
  icon: string | null;
}

interface StoryPageProps {
  events: StoryEvent[];
}

const StoryPage: React.FC<StoryPageProps> = ({ events }) => {
  return (
    <Layout>
      <StyledMainContainer>
        <header>
          <h1 className="big-heading">My Story</h1>
          <p className="subtitle">A timeline of my journey</p>
        </header>

        {events.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--slate)' }}>
            Story timeline coming soon!
          </p>
        ) : (
          <StyledTimeline>
            {events.map((event, i) => (
              <StyledEvent key={event.id} isLeft={i % 2 === 0}>
                <div className="event-card">
                  <span className="category">{event.category}</span>
                  <span className="date">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </span>
                  <h3>{event.title}</h3>
                  {event.description && <p>{event.description}</p>}
                </div>
              </StyledEvent>
            ))}
          </StyledTimeline>
        )}
      </StyledMainContainer>
    </Layout>
  );
};

export default StoryPage;
