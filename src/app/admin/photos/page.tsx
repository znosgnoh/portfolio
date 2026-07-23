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
    flex-wrap: wrap;
    gap: 1rem;

    h1 {
      color: var(--lightest-slate);
    }
    a {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
    }
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 2rem;
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

    textarea,
    input,
    select {
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

    textarea {
      min-height: 100px;
      resize: vertical;
    }
  }

  button {
    ${({ theme }) => theme.mixins.smallButton};
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .status {
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    margin-bottom: 1.5rem;
  }

  .error {
    color: #ff7b72;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    margin-bottom: 1.5rem;
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

    h3 {
      color: var(--lightest-slate);
      margin-bottom: 5px;
    }
    .meta {
      color: var(--slate);
      font-size: var(--fz-xxs);
      font-family: var(--font-mono);
      display: block;
      margin-top: 10px;
    }
    .photo-count {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 12px;
    }
  }

  .edit-panel {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--lightest-navy);
  }
`;

interface Album {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverPhotoId: string | null;
  driveFolderId: string | null;
  lastSyncedAt: string | null;
  _count?: { photos: number };
  createdAt: string;
}

export default function AdminPhotosPage() {
  const { data: session, status } = useSession();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [driveFolderId, setDriveFolderId] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editCoverPhotoId, setEditCoverPhotoId] = useState('');

  const fetchAlbums = async () => {
    const res = await fetch('/api/photos');
    const data = await res.json();
    setAlbums(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) redirect('/admin/login');

  const runAction = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await fn();
      await fetchAlbums();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setBusy(false);
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    await runAction(async () => {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: description || null,
          driveFolderId: driveFolderId || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create album');
      }
      setName('');
      setDescription('');
      setDriveFolderId('');
      setMessage('Album created');
    });
  };

  const handleDiscover = async () => {
    await runAction(async () => {
      const res = await fetch('/api/photos/discover', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Discover failed');
      setMessage(
        `Discovered ${data.discovered} folders (${data.created} created, ${data.updated} updated)`,
      );
    });
  };

  const handleSyncAll = async () => {
    await runAction(async () => {
      const res = await fetch('/api/photos/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync all failed');
      setMessage(`Synced ${data.syncedAlbums} album(s)`);
    });
  };

  const handleSync = async (albumId: string) => {
    await runAction(async () => {
      const res = await fetch('/api/photos/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ albumId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      setMessage(`Synced “${data.name}”: ${data.total} photos`);
    });
  };

  const startEdit = (album: Album) => {
    setEditingId(album.id);
    setEditDescription(album.description || '');
    setEditCoverPhotoId(album.coverPhotoId || '');
  };

  const handleSaveEdit = async (albumId: string) => {
    await runAction(async () => {
      const res = await fetch(`/api/photos/${albumId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: editDescription || null,
          coverPhotoId: editCoverPhotoId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setEditingId(null);
      setMessage('Album metadata saved');
    });
  };

  return (
    <StyledAdmin>
      <div className="admin-header">
        <h1>Manage Photos</h1>
        <a href="/admin">&larr; Back to Dashboard</a>
      </div>

      <div className="toolbar">
        <button type="button" onClick={handleDiscover} disabled={busy}>
          Discover albums from Drive
        </button>
        <button type="button" onClick={handleSyncAll} disabled={busy}>
          Sync all
        </button>
      </div>

      {message && <p className="status">{message}</p>}
      {error && <p className="error">{error}</p>}

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
          <input
            value={driveFolderId}
            onChange={e => setDriveFolderId(e.target.value)}
            placeholder="For auto-sync from Google Drive"
          />
        </div>
        <button type="submit" disabled={busy}>
          Create Album
        </button>
      </form>

      <div className="album-list">
        {albums.map(album => (
          <div key={album.id} className="album-card">
            <h3>{album.name}</h3>
            {album.description && (
              <p style={{ color: 'var(--light-slate)' }}>{album.description}</p>
            )}
            <span className="photo-count">{album._count?.photos || 0} photos</span>
            <div className="actions">
              <button
                type="button"
                onClick={() => handleSync(album.id)}
                disabled={busy || !album.driveFolderId}
              >
                Sync from Drive
              </button>
              <button type="button" onClick={() => startEdit(album)} disabled={busy}>
                Edit metadata
              </button>
            </div>
            {editingId === album.id && (
              <div className="edit-panel">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Cover photo ID</label>
                  <input
                    value={editCoverPhotoId}
                    onChange={e => setEditCoverPhotoId(e.target.value)}
                    placeholder="Photo cuid from this album"
                  />
                </div>
                <div className="actions">
                  <button type="button" onClick={() => handleSaveEdit(album.id)} disabled={busy}>
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingId(null)} disabled={busy}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <span className="meta">
              slug: {album.slug}
              {album.driveFolderId ? ` · drive: ${album.driveFolderId}` : ' · no Drive folder'}
              {album.lastSyncedAt
                ? ` · synced ${new Date(album.lastSyncedAt).toLocaleString()}`
                : ' · never synced'}
              {' · '}
              {new Date(album.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </StyledAdmin>
  );
}
