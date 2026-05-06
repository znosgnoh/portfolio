import React from 'react';

interface IconProps {
  name: string;
}

const IconGitHub = () => (
  <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <title>GitHub</title>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const IconExternal = () => (
  <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <title>External Link</title>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const IconFolder = () => (
  <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <title>Folder</title>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const IconLinkedin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <title>LinkedIn</title>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const IconTwitter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <title>Twitter</title>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const IconStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <title>Star</title>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconFork = () => (
  <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <title>Fork</title>
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

const IconLogo = () => (
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 84 96">
    <title>Logo</title>
    <g transform="translate(-8.000000, -2.000000)">
      <g transform="translate(11.000000, 5.000000)">
        <polygon
          id="Shape"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          points="39 0 0 22 0 67 39 90 78 68 78 23"
        />
        <path
          d="M45.691667,45.15 C48.591667,46.1 50.341667,48.05 50.341667,51.8 C50.341667,57.05 47.041667,59.3 42.191667,59.3 L32.841667,59.3 L32.841667,30.3 L42.041667,30.3 C46.891667,30.3 49.441667,33.1 49.441667,37.45 C49.441667,40.95 47.691667,43.35 45.691667,44.25 L45.691667,45.15 Z M42.041667,43.95 C44.391667,43.95 45.941667,42.8 45.941667,40.05 C45.941667,37.3 44.391667,36.15 42.041667,36.15 L36.491667,36.15 L36.491667,43.95 L42.041667,43.95 Z M42.191667,53.45 C44.541667,53.45 46.841667,52.3 46.841667,49.25 C46.841667,46.2 44.541667,45.05 42.191667,45.05 L36.491667,45.05 L36.491667,53.45 L42.191667,53.45 Z"
          fill="currentColor"
        />
      </g>
    </g>
  </svg>
);

const IconLoader = () => (
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <title>Loader Logo</title>
    <g>
      <g id="B" transform="translate(11.000000, 5.000000)">
        <path
          d="M45.691667,45.15 C48.591667,46.1 50.341667,48.05 50.341667,51.8 C50.341667,57.05 47.041667,59.3 42.191667,59.3 L32.841667,59.3 L32.841667,30.3 L42.041667,30.3 C46.891667,30.3 49.441667,33.1 49.441667,37.45 C49.441667,40.95 47.691667,43.35 45.691667,44.25 L45.691667,45.15 Z M42.041667,43.95 C44.391667,43.95 45.941667,42.8 45.941667,40.05 C45.941667,37.3 44.391667,36.15 42.041667,36.15 L36.491667,36.15 L36.491667,43.95 L42.041667,43.95 Z M42.191667,53.45 C44.541667,53.45 46.841667,52.3 46.841667,49.25 C46.841667,46.2 44.541667,45.05 42.191667,45.05 L36.491667,45.05 L36.491667,53.45 L42.191667,53.45 Z"
          fill="currentColor"
        />
      </g>
      <path
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M 50, 5
                  L 11, 27
                  L 11, 72
                  L 50, 95
                  L 89, 73
                  L 89, 28 z"
        fill="none"
      />
    </g>
  </svg>
);

export const Icon: React.FC<IconProps> = ({ name }) => {
  switch (name) {
    case 'GitHub':
      return <IconGitHub />;
    case 'External':
      return <IconExternal />;
    case 'Folder':
      return <IconFolder />;
    case 'Linkedin':
      return <IconLinkedin />;
    case 'Twitter':
      return <IconTwitter />;
    case 'Star':
      return <IconStar />;
    case 'Fork':
      return <IconFork />;
    case 'Logo':
      return <IconLogo />;
    case 'Loader':
      return <IconLoader />;
    default:
      return <IconExternal />;
  }
};

export { IconLogo, IconLoader, IconGitHub, IconExternal, IconFolder, IconLinkedin, IconTwitter, IconStar, IconFork };
