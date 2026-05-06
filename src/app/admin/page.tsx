'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
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
    margin-bottom: 3rem;

    h1 {
      color: var(--lightest-slate);
    }

    button {
      ${({ theme }) => theme.mixins.smallButton};
    }
  }

  .admin-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-gap: 20px;
  }

  .admin-card {
    ${({ theme }) => theme.mixins.boxShadow};
    padding: 2rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);

    &:hover {
      transform: translateY(-5px);
    }

    h3 {
      color: var(--lightest-slate);
      margin-bottom: 0.5rem;
    }

    p {
      color: var(--slate);
      font-size: var(--fz-sm);
    }
  }
`;

export default function AdminPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) redirect('/admin/login');

  const sections = [
    { title: 'Thoughts', description: 'Manage your thoughts and musings', href: '/admin/thoughts' },
    { title: 'Notes', description: 'Create and edit notes', href: '/admin/notes' },
    { title: 'Photos', description: 'Manage photo albums and sync from Google Drive', href: '/admin/photos' },
    { title: 'Story', description: 'Edit your timeline events', href: '/admin/story' },
  ];

  return (
    <StyledAdmin>
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>

      <div className="admin-grid">
        {sections.map(section => (
          <Link key={section.href} href={section.href}>
            <div className="admin-card">
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </StyledAdmin>
  );
}
