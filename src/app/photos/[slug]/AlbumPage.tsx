'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import SafeImage from '@/components/SafeImage';

const StyledMainContainer = styled.main`
  & > header {
    margin-bottom: 50px;

    .back-link {
      display: inline-block;
      margin-bottom: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      color: var(--green);
    }

    h1 {
      margin-bottom: 10px;
    }

    .subtitle {
      color: var(--slate);
      max-width: 540px;
    }

    .photo-count {
      display: inline-block;
      margin-top: 15px;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
    }
  }
`;

const StyledPhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  grid-gap: 15px;
`;

const StyledPhotoCard = styled.figure`
  margin: 0;
  background-color: var(--light-navy);
  border-radius: var(--border-radius);
  overflow: hidden;
  ${({ theme }) => theme.mixins.boxShadow};

  .frame {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 2;
    background-color: var(--lightest-navy);
  }

  figcaption {
    padding: 12px 14px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
  }
`;

interface Photo {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  title: string | null;
  width?: number | null;
  height?: number | null;
}

interface Album {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  photos: Photo[];
}

interface AlbumPageProps {
  album: Album;
}

const AlbumPage: React.FC<AlbumPageProps> = ({ album }) => {
  return (
    <Layout>
      <StyledMainContainer>
        <header>
          <Link className="back-link" href="/photos">
            ← All albums
          </Link>
          <h1 className="big-heading">{album.name}</h1>
          {album.description && <p className="subtitle">{album.description}</p>}
          <span className="photo-count">
            {album.photos.length} {album.photos.length === 1 ? 'photo' : 'photos'}
          </span>
        </header>

        <StyledPhotoGrid>
          {album.photos.map(photo => (
            <StyledPhotoCard key={photo.id}>
              <div className="frame">
                <SafeImage
                  src={photo.thumbnailUrl || photo.url || null}
                  alt={photo.title || album.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  placeholderLabel={photo.title || album.name}
                />
              </div>
              {photo.title && <figcaption>{photo.title}</figcaption>}
            </StyledPhotoCard>
          ))}
        </StyledPhotoGrid>
      </StyledMainContainer>
    </Layout>
  );
};

export default AlbumPage;
