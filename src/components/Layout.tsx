'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import Nav from './Nav';
import Social from './Social';
import Email from './Email';
import Footer from './Footer';
import { usePrefersReducedMotion } from '@/hooks';

const Loader = dynamic(() => import('./Loader'), { ssr: false });

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isLoading, setIsLoading] = useState(!prefersReducedMotion);

  return (
    <>
      {isLoading ? (
        <Loader finishLoading={() => setIsLoading(false)} />
      ) : (
        <StyledContent>
          <Nav />
          <Social />
          <Email />
          <div id="content">
            {children}
            <Footer />
          </div>
        </StyledContent>
      )}
    </>
  );
};

export default Layout;
