'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import styled from 'styled-components';

const StyledAdmin = styled.div`
  min-height: 100vh;
  background-color: var(--navy);
  padding: 2rem;

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h1 { color: var(--lightest-slate); }
    a { color: var(--green); font-family: var(--font-mono); font-size: var(--fz-sm); }
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      margin-bottom: 0.5rem;
    }

    textarea, input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--lightest-navy);
      border-radius: var(--border-radius);
      background-color: var(--light-navy);
      color: var(--lightest-slate);
      font-size: var(--fz-md);
      font-family: inherit;

      &:focus {
        border-color: var(--green);
        outline: none;
      }
    }

    textarea { min-height: 200px; resize: vertical; }
  }

  button {
    ${({ theme }) => theme.mixins.smallButton};
  }

  .note-list {
    display: grid;
    gap: 15px;
    margin-top: 2rem;
  }

  .note-card {
    padding: 1.5rem;
    background-color: var(--light-navy);
    border-radius: var(--border-radius);
    position: relative;

    h3 { color: var(--lightest-slate); margin-bottom: 5px; }
    p { color: var(--light-slate); font-size: var(--fz-sm); }
    .meta { color: var(--slate); font-size: var(--fz-xxs); font-family: var(--font-mono); margin-top: 10px; }

    .actions {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      gap: 8px;

      button { padding: 4px 8px; font-size: var(--fz-xxs); }
    }
  }
`;

interface Note {
  id: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  published: boolean;
  createdAt: string;
}

export default function AdminNotesPage() {
  const { data: session, status } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(true);

  const fetchNotes = async () => {
    const res = await fetch('/api/notes');
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => { fetchNotes(); }, []);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) redirect('/admin/login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        published,
      }),
    });
    setTitle('');
    setContent('');
    setTags('');
    fetchNotes();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    fetchNotes();
  };

  return (
    <StyledAdmin>
      <div className="admin-header">
        <h1>Manage Notes</h1>
        <a href="/admin">&larr; Back to Dashboard</a>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Content (Markdown)</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Tags (comma-separated)</label>
          <input value={tags} onChange={e => setTags(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1.5rem' }}>
          <label style={{ color: 'var(--light-slate)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
            Published
          </label>
          <button type="submit">Save Note</button>
        </div>
      </form>

      <div className="note-list">
        {notes.map(note => (
          <div key={note.id} className="note-card">
            <div className="actions">
              <button onClick={() => handleDelete(note.id)}>Delete</button>
            </div>
            <h3>{note.title}</h3>
            <p>{note.content.slice(0, 200)}...</p>
            <span className="meta">
              {note.published ? 'Published' : 'Draft'} · {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </StyledAdmin>
  );
}
