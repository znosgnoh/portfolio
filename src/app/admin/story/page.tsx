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

    textarea, input, select {
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

    textarea { min-height: 100px; resize: vertical; }
  }

  button {
    ${({ theme }) => theme.mixins.smallButton};
  }

  .event-list {
    display: grid;
    gap: 15px;
    margin-top: 2rem;
  }

  .event-card {
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

interface StoryEvent {
  id: string;
  title: string;
  description: string | null;
  date: string;
  category: string;
  icon: string | null;
}

export default function AdminStoryPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [icon, setIcon] = useState('');

  const fetchEvents = async () => {
    const res = await fetch('/api/story');
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => { fetchEvents(); }, []);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) redirect('/admin/login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description: description || null,
        date,
        category,
        icon: icon || null,
      }),
    });
    setTitle('');
    setDescription('');
    setDate('');
    setCategory('');
    setIcon('');
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/story/${id}`, { method: 'DELETE' });
    fetchEvents();
  };

  return (
    <StyledAdmin>
      <div className="admin-header">
        <h1>Manage Story</h1>
        <a href="/admin">&larr; Back to Dashboard</a>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input value={category} onChange={e => setCategory(e.target.value)} required placeholder="education, career, personal, travel" />
        </div>
        <div className="form-group">
          <label>Icon (emoji, optional)</label>
          <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="🎓 💼 ✈️" />
        </div>
        <button type="submit">Add Event</button>
      </form>

      <div className="event-list">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <div className="actions">
              <button onClick={() => handleDelete(event.id)}>Delete</button>
            </div>
            <h3>{event.icon} {event.title}</h3>
            {event.description && <p>{event.description}</p>}
            <span className="meta">
              {event.category} · {new Date(event.date).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </StyledAdmin>
  );
}
