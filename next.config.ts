import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  // Keep heavy Node SDKs out of the server bundle graph where possible
  serverExternalPackages: ['googleapis', '@prisma/client', 'prisma', 'pg', '@prisma/adapter-pg'],
  experimental: {
    optimizePackageImports: ['styled-components'],
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
