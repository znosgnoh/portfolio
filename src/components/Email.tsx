'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { email } from '@/config';
import { loaderDelay } from '@/utils';
import { usePrefersReducedMotion } from '@/hooks';

const StyledSideElement = styled.div`
  width: 40px;
  position: fixed;
  bottom: 0;
  right: 40px;
  z-index: 10;
  color: var(--light-slate);

  @media (max-width: 1080px) {
    right: 20px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 1px;
    height: 90px;
    margin: 0 auto;
    background-color: var(--light-slate);
  }

  a {
    margin: 20px auto;
    padding: 10px;
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: var(--fz-lg);
    letter-spacing: 0.1em;
    writing-mode: vertical-rl;

    &:hover,
    &:focus {
      transform: translateY(-3px);
    }
  }
`;

const Email: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsMounted(true);
      return;
    }
    const timeout = setTimeout(() => setIsMounted(true), loaderDelay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <StyledSideElement>
      {prefersReducedMotion ? (
        <StyledLinkWrapper>
          <a href={`mailto:${email}`}>{email}</a>
        </StyledLinkWrapper>
      ) : (
        <TransitionGroup component={null}>
          {isMounted && (
            <CSSTransition classNames="fade" timeout={loaderDelay}>
              <StyledLinkWrapper>
                <a href={`mailto:${email}`}>{email}</a>
              </StyledLinkWrapper>
            </CSSTransition>
          )}
        </TransitionGroup>
      )}
    </StyledSideElement>
  );
};

export default Email;
