'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { navLinks } from '@/config';
import { loaderDelay } from '@/utils';
import { useScrollDirection, usePrefersReducedMotion } from '@/hooks';
import { Icon } from '@/components/icons';
import Menu from './Menu';

const StyledHeader = styled.header<{ scrollDirection: string; scrolledToTop: boolean }>`
  ${({ theme }) => theme.mixins.flexBetween};
  position: fixed;
  top: 0;
  z-index: 11;
  padding: 0px 50px;
  width: 100%;
  height: var(--nav-height);
  background-color: rgba(10, 25, 47, 0.85);
  filter: none !important;
  pointer-events: auto !important;
  user-select: auto !important;
  backdrop-filter: blur(10px);
  transition: var(--transition);

  @media (max-width: 1080px) {
    padding: 0 40px;
  }
  @media (max-width: 768px) {
    padding: 0 25px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${props =>
      props.scrollDirection === 'up' &&
      !props.scrolledToTop &&
      `
        height: var(--nav-scroll-height);
        transform: translateY(0px);
        background-color: rgba(10, 25, 47, 0.85);
        box-shadow: 0 10px 30px -10px var(--navy-shadow);
      `};
    ${props =>
      props.scrollDirection === 'down' &&
      !props.scrolledToTop &&
      `
        height: var(--nav-scroll-height);
        transform: translateY(calc(var(--nav-scroll-height) * -1));
        box-shadow: 0 10px 30px -10px var(--navy-shadow);
      `};
  }
`;

const StyledNav = styled.nav`
  ${({ theme }) => theme.mixins.flexBetween};
  position: relative;
  width: 100%;
  color: var(--lightest-slate);
  font-family: var(--font-mono);
  counter-reset: item 0;
  z-index: 12;

  .logo {
    ${({ theme }) => theme.mixins.flexCenter};
    a {
      color: var(--green);
      width: 42px;
      height: 42px;

      &:hover,
      &:focus {
        svg {
          fill: var(--green-tint);
        }
      }

      svg {
        fill: none;
        transition: var(--transition);
        user-select: none;
      }
    }
  }
`;

const StyledLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  ol {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      margin: 0 5px;
      position: relative;
      counter-increment: item 1;
      font-size: var(--fz-xs);

      a {
        padding: 10px;

        &:before {
          content: '0' counter(item) '.';
          margin-right: 5px;
          color: var(--green);
          font-size: var(--fz-xxs);
          text-align: right;
        }
      }
    }
  }

  .resume-button {
    ${({ theme }) => theme.mixins.smallButton};
    margin-left: 15px;
    font-size: var(--fz-xs);
  }
`;

const Nav: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const scrollDirection = useScrollDirection();
  const [scrolledToTop, setScrolledToTop] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleScroll = () => {
    setScrolledToTop(window.scrollY < 50);
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsMounted(true);
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), 100);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const timeout = prefersReducedMotion ? 0 : loaderDelay;

  return (
    <StyledHeader scrollDirection={scrollDirection} scrolledToTop={scrolledToTop}>
      <StyledNav>
        <div className="logo" tabIndex={-1}>
          {prefersReducedMotion ? (
            <Link href="/" aria-label="home">
              <Icon name="Logo" />
            </Link>
          ) : (
            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames="fade" timeout={timeout}>
                  <Link href="/" aria-label="home">
                    <Icon name="Logo" />
                  </Link>
                </CSSTransition>
              )}
            </TransitionGroup>
          )}
        </div>

        <StyledLinks>
          <ol>
            {prefersReducedMotion ? (
              <>
                {navLinks.map(({ url, name }, i) => (
                  <li key={i}>
                    <Link href={url}>{name}</Link>
                  </li>
                ))}
              </>
            ) : (
              <TransitionGroup component={null}>
                {isMounted &&
                  navLinks.map(({ url, name }, i) => (
                    <CSSTransition key={i} classNames="fadedown" timeout={timeout}>
                      <li key={i} style={{ transitionDelay: `${(i + 1) * 100}ms` }}>
                        <Link href={url}>{name}</Link>
                      </li>
                    </CSSTransition>
                  ))}
              </TransitionGroup>
            )}
          </ol>

          {prefersReducedMotion ? (
            <a className="resume-button" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              Resume
            </a>
          ) : (
            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames="fadedown" timeout={timeout}>
                  <div style={{ transitionDelay: `${(navLinks.length + 1) * 100}ms` }}>
                    <a className="resume-button" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                      Resume
                    </a>
                  </div>
                </CSSTransition>
              )}
            </TransitionGroup>
          )}
        </StyledLinks>

        <Menu />
      </StyledNav>
    </StyledHeader>
  );
};

export default Nav;
