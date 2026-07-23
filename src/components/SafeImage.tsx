'use client';

import React, { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import ImagePlaceholder from './ImagePlaceholder';

type SafeImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src?: string | null;
  alt: string;
  /** Used for the placeholder when `fill` is not set. */
  width?: number;
  height?: number;
  placeholderLabel?: string;
};

/**
 * Renders next/image when `src` is present; falls back to a sized placeholder
 * if the src is missing or the image fails to load.
 */
const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  width,
  height,
  fill,
  className,
  placeholderLabel,
  ...rest
}) => {
  const [failed, setFailed] = useState(false);
  const hasSrc = Boolean(src) && !failed;

  if (!hasSrc) {
    return (
      <ImagePlaceholder
        fill={Boolean(fill)}
        width={typeof width === 'number' ? width : undefined}
        height={typeof height === 'number' ? height : undefined}
        className={className}
        alt={alt}
        label={placeholderLabel}
      />
    );
  }

  return (
    <Image
      {...rest}
      src={src as string}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

export default SafeImage;
