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

  .sync-section {
    margin: 2rem 0;
    padding: 1.5rem;
    background-color: var(--light-navy);
    border-radius: var(--border-radius);

    h3 { color: var(--lightest-slate); margin-bottom: 1rem; }
    p { color: var(--slate); font-size: var(--fz-sm); margin-bottom: 1rem; }
  }

  .album-list {
    display: grid;
    gap: 15px;
    margin-top: 2rem;
  }

  .album-card {
    padding: 1.5rem;
    background-color: var(--light-navy);
    border-radius: var(--border-radius);

    h3 { color: var(--lightest-slate); margin-bottom: 5px; }
    .meta { color: var(--slate); font-size: var(--fz-xxs); font-family: var(--font-mono); }
    .photo-count { color: var(--green); font-family: var(--font-mono); font-size: var(--fz-xs); }
  }
`;

interface Album {
  id: string;
  name: string;
  description: string | null;
  coverUrl: string | null;
  _count?: { photos: number };
  createdAt: string;
}

export default function AdminPhotosPage() {
  const { data: session, status } = useSession();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [driveFolderId, setDriveFolderId] = useState('');
  const [syncing, setSyncing] = useState(false);

  const fetchAlbums = async () => {
    const res = await fetch('/api/photos');
    const data = await res.json();
    setAlbums(data);
  };

  useEffect(() => { fetchAlbums(); }, []);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) redirect('/admin/login');

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description: description || null, driveFolderId: driveFolderId || null }),
    });
    setName('');
    setDescription('');
    setDriveFolderId('');
    fetchAlbums();
  };

  const handleSync = async (albumId: string) => {
    setSyncing(true);
    await fetch('/api/photos/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ albumId }),
    });
    setSyncing(false);
    fetchAlbums();
  };

  return (
    <StyledAdmin>
      <div className="admin-header">
        <h1>Manage Photos</h1>
        <a href="/admin">&larr; Back to Dashboard</a>
      </div>

      <form onSubmit={handleCreateAlbum}>
        <div className="form-group">
          <label>Album Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Google Drive Folder ID (optional)</label>
          <input value={driveFolderId} onChange={e => setDriveFolderId(e.target.value)} placeholder="For auto-sync from Google Drive" />
        </div>
        <button type="submit">Create Album</button>
      </form>

      <div className="album-list">
        {albums.map(album => (
          <div key={album.id} className="album-card">
            <h3>{album.name}</h3>
            {album.description && <p style={{ color: 'var(--light-slate)' }}>{album.description}</p>}
            <span className="photo-count">{album._count?.photos || 0} photos</span>
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => handleSync(album.id)} disabled={syncing}>
                {syncing ? 'Syncing...' : 'Sync from Drive'}
              </button>
            </div>
            <span className="meta">{new Date(album.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </StyledAdmin>
  );
}
