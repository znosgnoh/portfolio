'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createTimeline, createDrawable } from 'animejs';
import { IconLoader } from '@/components/icons';

const StyledLoader = styled.div`
  ${({ theme }) => theme.mixins.flexCenter};
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: var(--dark-navy);
  z-index: 99;

  .logo-wrapper {
    width: max(100px, 80px);
    max-width: 100px;
    transition: var(--transition);
    opacity: ${props => (props.theme ? 1 : 0)};
    svg {
      display: block;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      fill: none;
      user-select: none;
      #N {
        opacity: 0;
        transform-box: view-box;
        transform-origin: 50px 50px;
      }
    }
  }
`;

interface LoaderProps {
  finishLoading: () => void;
}

const Loader: React.FC<LoaderProps> = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);

  const animate = () => {
    const drawable = createDrawable('#logo #hex');
    const start = 300;
    const duration = 1600;

    const loader = createTimeline({
      defaults: { ease: 'inOutQuart' },
      onComplete: () => finishLoading(),
    });

    // Hex paint + N spin/fade run together and finish at the same time
    loader
      .add(
        drawable,
        {
          draw: ['0 0', '0 1'],
          duration,
        },
        start
      )
      .add(
        '#logo #N',
        {
          opacity: { from: 0, to: 1 },
          rotate: { from: '0turn', to: '1turn' },
          duration,
          ease: 'inOutCubic',
        },
        start
      )
      .add(
        '#logo',
        {
          opacity: 0,
          scale: 0.1,
          duration: 300,
        },
        start + duration + 400
      )
      .add(
        '.loader',
        {
          opacity: 0,
          zIndex: -1,
          duration: 200,
        },
        '<'
      );
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(true);
      requestAnimationFrame(() => animate());
    }, 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <StyledLoader className="loader">
      <div className="logo-wrapper">
        {isMounted && <IconLoader />}
      </div>
    </StyledLoader>
  );
};

export default Loader;
