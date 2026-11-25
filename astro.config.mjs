import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Old WordPress URLs that have no page of the same name on the new site.
// (Every other old URL keeps its exact path; only the trailing slash goes, which the host 308s.)
const oldUrls = {
  '/blog/page/2': '/blog',
  '/category/news': '/blog',
};

export default defineConfig({
  site: 'https://www.romanmasonconstruction.co.uk',
  trailingSlash: 'ignore',
  build: { format: 'file' },
  scopedStyleStrategy: 'class',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  redirects: oldUrls,
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  server: { port: 4360 },
  devToolbar: { enabled: false },
  vite: { build: { assetsInlineLimit: 0 } },
});
