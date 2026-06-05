/**
 * Public base path the app is served from (e.g. "/Countdown" on GitHub Pages,
 * "" when served from a domain root). Used to prefix static asset URLs that
 * Next.js does not rewrite automatically (manifest icons, notification icon).
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Prefix an absolute-from-root asset path with the deployment base path. */
export function withBasePath(path: string): string {
  if (!path.startsWith('/')) return path;
  return `${BASE_PATH}${path}`;
}
