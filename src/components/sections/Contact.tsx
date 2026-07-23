'use client';

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig, email } from '@/config';
import { usePrefersReducedMotion } from '@/hooks';

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }
    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(40px, 5vw, 60px);
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Contact: React.FC = () => {
  const revealContainer = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    async function animate() {
      const sr = (await import('scrollreveal')).default;
      if (revealContainer.current) {
        sr().reveal(revealContainer.current, srConfig());
      }
    }
    animate();
  }, []);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">What&apos;s Next?</h2>
      <h2 className="title">Contact me</h2>
      <p>
        Whether you want to talk code, triathlon training, photography, or travel plans — my inbox is
        open. Drop a line and I&apos;ll do my best to get back to you!
      </p>
      <a className="email-link" href={`mailto:${email}`}>
        Contact me
      </a>
    </StyledContactSection>
  );
};

export default Contact;
