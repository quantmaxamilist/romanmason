# Old → new URLs

The old site was WordPress (Elementor). Every page keeps its exact path; only the trailing slash goes
(`"trailingSlash": false` in `vercel.json` sends `/about/` → `/about` with a single 308).
Checked on the production build: 32 of 32 old URLs reach a live page in at most one redirect.

| Old URL | New URL | How |
| --- | --- | --- |
| `/` | `/` | same |
| `/about/` | `/about` | trailing-slash redirect |
| `/services/` | `/services` | trailing-slash redirect |
| `/gallery/` | `/gallery` | trailing-slash redirect |
| `/contact/` | `/contact` | trailing-slash redirect |
| `/blog/` | `/blog` | trailing-slash redirect |
| `/blog/page/2/` | `/blog` | 301 (all 16 posts are on one page now) |
| `/category/news/` | `/blog` | 301 |
| `/cookie-policy/` | `/cookie-policy` | trailing-slash redirect |
| `/privacy-policy/` | `/privacy-policy` | trailing-slash redirect |
| `/YYYY/MM/DD/<slug>/` (16 blog posts) | `/YYYY/MM/DD/<slug>` | trailing-slash redirect |
| `/sitemap_index.xml`, `/page-sitemap.xml`, `/post-sitemap.xml`, `/category-sitemap.xml`, `/local-sitemap.xml` | `/sitemap-index.xml` | 301 |
| `/locations.kml` | `/contact` | 301 |
| `/feed` | `/blog` | 301 |

The rules live in three places so any host works: `vercel.json` (Vercel), `public/_redirects`
(Netlify / Cloudflare Pages) and `redirects` in `astro.config.mjs` (meta-refresh stubs for plain static hosts).

Not redirected: old image URLs under `/wp-content/uploads/…` (they will 404; nothing on the new site links to them).
