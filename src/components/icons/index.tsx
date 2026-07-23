import React from 'react';

interface IconProps {
  name: string;
}

const iconDefaults = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const IconGitHub = () => (
  <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" {...iconDefaults}>
    <title>GitHub</title>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const IconExternal = () => (
  <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" {...iconDefaults}>
    <title>External Link</title>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const IconFolder = () => (
  <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" {...iconDefaults}>
    <title>Folder</title>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const IconLinkedin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" {...iconDefaults}>
    <title>LinkedIn</title>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const IconTwitter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" {...iconDefaults}>
    <title>Twitter</title>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const IconStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" {...iconDefaults}>
    <title>Star</title>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconFork = () => (
  <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" {...iconDefaults}>
    <title>Fork</title>
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

/** Hexagon + letter N — stroke only (no fill). */
const letterN = (
  <g
    fill="none"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
    strokeLinejoin="round">
    {/* Left stem */}
    <line x1="28" y1="30" x2="28" y2="60" />
    {/* Diagonal: top-left → bottom-right */}
    <line x1="28" y1="30" x2="50" y2="60" />
    {/* Right stem */}
    <line x1="50" y1="30" x2="50" y2="60" />
  </g>
);

const IconLogo = () => (
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 84 96" fill="none">
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
        {letterN}
      </g>
    </g>
  </svg>
);

const IconLoader = () => (
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <title>Loader Logo</title>
    <g>
      {/* Letter N centered on hexagon (50,50); CSS transform-origin spins in place */}
      <g id="N">
        <g transform="translate(11 5)">{letterN}</g>
      </g>
      <path
        id="hex"
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

export {
  IconLogo,
  IconLoader,
  IconGitHub,
  IconExternal,
  IconFolder,
  IconLinkedin,
  IconTwitter,
  IconStar,
  IconFork,
};
