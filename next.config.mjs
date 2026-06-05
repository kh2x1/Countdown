/** @type {import('next').NextConfig} */

// When deploying to GitHub Pages (a project site), the app is served from a
// sub-path like https://<user>.github.io/<repo>/. Set NEXT_PUBLIC_BASE_PATH to
// "/<repo>" in CI. Locally it stays empty so `npm run dev` works at the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  // Static HTML export — required for GitHub Pages (no Node server).
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  basePath: basePath || undefined,
  images: {
    // GitHub Pages cannot run the Next image optimizer; serve images as-is.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'media.api-sports.io' },
    ],
  },
};

export default nextConfig;
