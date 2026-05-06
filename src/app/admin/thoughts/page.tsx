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

    textarea { min-height: 120px; resize: vertical; }
  }

  .btn-row {
    display: flex;
    gap: 10px;
    margin-bottom: 2rem;
  }

  button {
    ${({ theme }) => theme.mixins.smallButton};
  }

  .thought-list {
    display: grid;
    gap: 15px;
  }

  .thought-card {
    padding: 1.5rem;
    background-color: var(--light-navy);
    border-radius: var(--border-radius);
    position: relative;

    p { color: var(--light-slate); margin-bottom: 10px; }
    .meta { color: var(--slate); font-size: var(--fz-xxs); font-family: var(--font-mono); }

    .actions {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      gap: 8px;

      button {
        padding: 4px 8px;
        font-size: var(--fz-xxs);
      }
    }
  }
`;

interface Thought {
  id: string;
  content: string;
  mood: string | null;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
}

export default function AdminThoughtsPage() {
  const { data: session, status } = useSession();
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const fetchThoughts = async () => {
    const res = await fetch('/api/thoughts');
    const data = await res.json();
    setThoughts(data);
  };

  useEffect(() => { fetchThoughts(); }, []);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) redirect('/admin/login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/thoughts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        mood: mood || null,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        isPublic,
      }),
    });
    setContent('');
    setMood('');
    setTags('');
    fetchThoughts();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/thoughts/${id}`, { method: 'DELETE' });
    fetchThoughts();
  };

  return (
    <StyledAdmin>
      <div className="admin-header">
        <h1>Manage Thoughts</h1>
        <a href="/admin">&larr; Back to Dashboard</a>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Content</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Mood (optional)</label>
          <input value={mood} onChange={e => setMood(e.target.value)} placeholder="reflective, excited, curious..." />
        </div>
        <div className="form-group">
          <label>Tags (comma-separated)</label>
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder="tech, life, travel" />
        </div>
        <div className="btn-row">
          <label style={{ color: 'var(--light-slate)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
            Public
          </label>
          <button type="submit">Add Thought</button>
        </div>
      </form>

      <div className="thought-list">
        {thoughts.map(thought => (
          <div key={thought.id} className="thought-card">
            <div className="actions">
              <button onClick={() => handleDelete(thought.id)}>Delete</button>
            </div>
            <p>{thought.content}</p>
            <span className="meta">
              {thought.mood && `${thought.mood} · `}
              {new Date(thought.createdAt).toLocaleDateString()}
              {!thought.isPublic && ' · Private'}
            </span>
          </div>
        ))}
      </div>
    </StyledAdmin>
  );
}
