'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '@/components/Layout';

const StyledNotesPage = styled.main`
  max-width: 1000px;

  .heading {
    margin-bottom: 50px;
  }

  .notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
  }

  .note-card {
    ${({ theme }) => theme.mixins.boxShadow};
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);

    &:hover {
      transform: translateY(-5px);
    }

    h3 {
      color: var(--lightest-slate);
      font-size: var(--fz-xxl);
      margin-bottom: 10px;
    }

    p {
      color: var(--light-slate);
      font-size: var(--fz-md);
    }

    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      color: var(--slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
    }

    .tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 15px;

      span {
        color: var(--green);
        font-family: var(--font-mono);
        font-size: var(--fz-xxs);
      }
    }
  }
`;

interface Note {
  id: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  updatedAt: string;
}

interface NotesPageProps {
  notes: Note[];
}

const NotesPage: React.FC<NotesPageProps> = ({ notes }) => {
  return (
    <Layout>
      <StyledNotesPage>
        <header className="heading">
          <h1 className="big-heading">Notes</h1>
          <p className="subtitle">Technical notes, snippets, and learnings</p>
        </header>

        {notes.length === 0 ? (
          <p style={{ color: 'var(--slate)' }}>No notes yet. Check back soon!</p>
        ) : (
          <div className="notes-grid">
            {notes.map(note => (
              <Link key={note.id} href={`/notes/${note.slug}`}>
                <div className="note-card">
                  <h3>{note.title}</h3>
                  <p>{note.content.slice(0, 150)}...</p>
                  {note.tags.length > 0 && (
                    <div className="tags">
                      {note.tags.map(tag => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="meta">
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </StyledNotesPage>
    </Layout>
  );
};

export default NotesPage;
