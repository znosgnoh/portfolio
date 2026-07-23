'use client';

import React, { useState, useEffect, useRef, createRef } from 'react';
import styled from 'styled-components';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { navDelay, loaderDelay } from '@/utils';
import { usePrefersReducedMotion } from '@/hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  padding: 0;

  @media (max-width: 480px) and (min-height: 700px) {
    padding-bottom: 10vh;
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 10px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;

    & + p {
      margin-top: 15px;
    }
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Hero: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const itemRefs = useRef(
    Array.from({ length: 5 }, () => createRef<HTMLDivElement>())
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsMounted(true);
      return;
    }
    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);

  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Nosgnoh.</h2>;
  const three = <h3 className="big-heading">I&apos;m TRI-ing</h3>;
  const four = (
    <>
      <p>
        Welcome to my digital home! I&apos;m Nosgnoh, an experienced amateur triathlete who
        temporarily works as a software engineer.
      </p>
      <p>
        Let&apos;s dive into the exciting world of developing, discover innovative technologies, and
        embrace the wonders of travel together.
      </p>
    </>
  );
  const five = (
    <a className="email-link" href="mailto:nosgnohz@gmail.com" target="_blank" rel="noreferrer">
      Contact me
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition
                key={i}
                nodeRef={itemRefs.current[i]}
                classNames="fadeup"
                timeout={loaderDelay}>
                <div
                  ref={itemRefs.current[i]}
                  style={{ transitionDelay: `${i * 100}ms` }}>
                  {item}
                </div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
