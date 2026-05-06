'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '@/components/Layout';

const StyledNoteDetail = styled.main`
  max-width: 800px;

  .breadcrumb {
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    color: var(--green);

    .arrow {
      margin-right: 10px;
    }

    a {
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      font-weight: 600;
    }
  }

  .note-title {
    font-size: clamp(28px, 5vw, 48px);
    margin-bottom: 10px;
  }

  .note-meta {
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    margin-bottom: 40px;
  }

  .note-content {
    color: var(--light-slate);
    font-size: var(--fz-lg);
    line-height: 1.8;
    white-space: pre-wrap;

    h2, h3 {
      color: var(--lightest-slate);
      margin: 2em 0 1em;
    }

    code {
      background-color: var(--lightest-navy);
      padding: 2px 6px;
      border-radius: 3px;
      font-size: var(--fz-md);
    }
  }

  .tags {
    display: flex;
    gap: 10px;
    margin-top: 50px;
    flex-wrap: wrap;

    span {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      padding: 5px 10px;
      border: 1px solid var(--green);
      border-radius: var(--border-radius);
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
  createdAt: string;
}

interface NoteDetailPageProps {
  note: Note;
}

const NoteDetailPage: React.FC<NoteDetailPageProps> = ({ note }) => {
  return (
    <Layout>
      <StyledNoteDetail>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link href="/notes">All notes</Link>
        </span>

        <h1 className="note-title">{note.title}</h1>
        <p className="note-meta">
          Last updated {new Date(note.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="note-content">{note.content}</div>

        {note.tags.length > 0 && (
          <div className="tags">
            {note.tags.map(tag => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </StyledNoteDetail>
    </Layout>
  );
};

export default NoteDetailPage;
