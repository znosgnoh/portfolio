'use client';

import React from 'react';
import styled from 'styled-components';

const StyledPlaceholder = styled.div<{
  $width?: number;
  $height?: number;
  $fill?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(
    145deg,
    var(--lightest-navy) 0%,
    var(--light-navy) 55%,
    var(--navy) 100%
  );
  color: var(--slate);
  border: 1px solid var(--lightest-navy);
  overflow: hidden;
  user-select: none;

  ${({ $fill, $width, $height }) =>
    $fill
      ? `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  `
      : `
    width: ${$width ?? 400}px;
    height: ${$height ?? 300}px;
    max-width: 100%;
    aspect-ratio: ${$width ?? 400} / ${$height ?? 300};
  `}

  svg {
    width: min(28%, 64px);
    height: auto;
    opacity: 0.55;
    color: var(--green);
  }

  .label {
    position: absolute;
    bottom: 12px;
    left: 12px;
    right: 12px;
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    color: var(--slate);
    text-align: center;
    opacity: 0.7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

interface ImagePlaceholderProps {
  width?: number;
  height?: number;
  /** Fill a relatively positioned parent (e.g. album cover). */
  fill?: boolean;
  label?: string;
  className?: string;
  alt?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width = 400,
  height = 300,
  fill = false,
  label,
  className,
  alt = 'Image placeholder',
}) => {
  return (
    <StyledPlaceholder
      className={className}
      $width={width}
      $height={height}
      $fill={fill}
      role="img"
      aria-label={alt}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.5" />
        <path d="M21 15l-5-5L5 19" />
      </svg>
      {label ? <span className="label">{label}</span> : null}
    </StyledPlaceholder>
  );
};

export default ImagePlaceholder;
