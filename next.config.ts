import type { NextConfig } from 'next';

// The site is served from https://arbmarta.github.io/Arborist-Practice-Questions/,
// so production builds need this prefix. Local `npm run dev` stays at the root.
const basePath = process.env.NODE_ENV === 'production' ? '/Arborist-Practice-Questions' : '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
export default nextConfig;
