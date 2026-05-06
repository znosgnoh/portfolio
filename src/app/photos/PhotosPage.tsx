'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import Layout from '@/components/Layout';

const StyledMainContainer = styled.main`
  & > header {
    margin-bottom: 100px;
    text-align: center;
  }
`;

const StyledAlbumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const StyledAlbumCard = styled.div`
  ${({ theme }) => theme.mixins.boxShadow};
  border-radius: var(--border-radius);
  background-color: var(--light-navy);
  overflow: hidden;
  transition: var(--transition);

  &:hover {
    transform: translateY(-5px);
  }

  .album-cover {
    position: relative;
    width: 100%;
    height: 200px;
    background-color: var(--lightest-navy);
  }

  .album-info {
    padding: 1.5rem;

    h3 {
      color: var(--lightest-slate);
      margin-bottom: 0.5rem;
    }

    p {
      color: var(--slate);
      font-size: var(--fz-sm);
    }

    .photo-count {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
    }
  }
`;

interface Photo {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  title: string | null;
}

interface Album {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  photos: Photo[];
}

interface PhotosPageProps {
  albums: Album[];
}

const PhotosPage: React.FC<PhotosPageProps> = ({ albums }) => {
  return (
    <Layout>
      <StyledMainContainer>
        <header>
          <h1 className="big-heading">Photos</h1>
          <p className="subtitle">Moments captured and organized</p>
        </header>

        {albums.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--slate)' }}>
            No photo albums yet. Check back soon!
          </p>
        ) : (
          <StyledAlbumGrid>
            {albums.map(album => (
              <Link key={album.id} href={`/photos/${album.slug}`}>
                <StyledAlbumCard>
                  <div className="album-cover">
                    {album.photos[0] && (
                      <Image
                        src={album.photos[0].thumbnailUrl || album.photos[0].url}
                        alt={album.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <div className="album-info">
                    <h3>{album.name}</h3>
                    {album.description && <p>{album.description}</p>}
                    <span className="photo-count">{album.photos.length} photos</span>
                  </div>
                </StyledAlbumCard>
              </Link>
            ))}
          </StyledAlbumGrid>
        )}
      </StyledMainContainer>
    </Layout>
  );
};

export default PhotosPage;
