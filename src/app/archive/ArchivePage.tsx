'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import { IconGitHub, IconExternal } from '@/components/icons';
import { usePrefersReducedMotion } from '@/hooks';
import { srConfig } from '@/config';
import { ContentItem } from '@/lib/content';

const StyledTableContainer = styled.div`
  margin: 100px -20px;

  @media (max-width: 768px) {
    margin: 50px -10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    .hide-on-mobile {
      @media (max-width: 768px) {
        display: none;
      }
    }

    tbody tr {
      &:hover,
      &:focus {
        background-color: var(--light-navy);
      }
    }

    th,
    td {
      padding: 10px;
      text-align: left;

      &:first-child {
        padding-left: 20px;

        @media (max-width: 768px) {
          padding-left: 10px;
        }
      }
      &:last-child {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
        }
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }

    tr {
      cursor: default;
      td:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
      }
      td:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
      }
    }

    td {
      &.year {
        padding-right: 20px;
        color: var(--green);
        font-family: var(--font-mono);
        font-size: var(--fz-sm);

        @media (max-width: 768px) {
          padding-right: 10px;
          font-size: var(--fz-xs);
        }
      }

      &.title {
        padding-top: 15px;
        padding-right: 20px;
        color: var(--lightest-slate);
        font-size: var(--fz-xl);
        font-weight: 600;
        line-height: 1.25;
      }

      &.company {
        font-size: var(--fz-lg);
        white-space: nowrap;
      }

      &.tech {
        font-size: var(--fz-xxs);
        font-family: var(--font-mono);
        line-height: 1.5;

        .separator {
          margin: 0 5px;
        }
        span {
          display: inline-block;
        }
      }

      &.links {
        min-width: 100px;

        div {
          display: flex;
          align-items: center;

          a {
            ${({ theme }) => theme.mixins.flexCenter};
            flex-shrink: 0;
          }

          a + a {
            margin-left: 10px;
          }
        }
      }
    }
  }
`;

interface ArchivePageProps {
  projects: ContentItem[];
}

const ArchivePage: React.FC<ArchivePageProps> = ({ projects }) => {
  const revealTitle = useRef<HTMLHeadingElement>(null);
  const revealTable = useRef<HTMLTableElement>(null);
  const revealProjects = useRef<(HTMLTableRowElement | null)[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    async function animate() {
      const sr = (await import('scrollreveal')).default;
      sr().reveal(revealTitle.current!, srConfig());
      sr().reveal(revealTable.current!, srConfig(200, 0));
      revealProjects.current.forEach((ref, i) => {
        if (ref) sr().reveal(ref, srConfig(i * 10, 0));
      });
    }
    animate();
  }, [prefersReducedMotion]);

  return (
    <Layout>
      <header>
        <h1 className="big-heading" ref={revealTitle}>Archive</h1>
        <p className="subtitle">A big list of things I&apos;ve worked on</p>
      </header>

      <StyledTableContainer ref={revealTable}>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Title</th>
              <th className="hide-on-mobile">Made at</th>
              <th className="hide-on-mobile">Built with</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, i) => {
              const { date, title, tech, github, external, company } = project.frontmatter;
              return (
                <tr
                  key={i}
                  ref={el => { revealProjects.current[i] = el; }}
                >
                  <td className="overline year">
                    {date ? new Date(date).getFullYear() : '—'}
                  </td>
                  <td className="title">{title}</td>
                  <td className="company hide-on-mobile">
                    {company || '—'}
                  </td>
                  <td className="tech hide-on-mobile">
                    {tech?.map((item: string, i: number) => (
                      <span key={i}>
                        {item}
                        {i !== tech.length - 1 && <span className="separator">&middot;</span>}
                      </span>
                    ))}
                  </td>
                  <td className="links">
                    <div>
                      {github && (
                        <a href={github} aria-label="GitHub Link" target="_blank" rel="noopener noreferrer">
                          <IconGitHub />
                        </a>
                      )}
                      {external && (
                        <a href={external} aria-label="External Link" target="_blank" rel="noopener noreferrer">
                          <IconExternal />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </StyledTableContainer>
    </Layout>
  );
};

export default ArchivePage;
