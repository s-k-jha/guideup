// Build-time sitemap generator. Runs before `vite build` (see package.json "prebuild").
// Fetches published articles + publicly-listed mentors from the live API so the
// sitemap reflects real content without requiring a server-rendered frontend.
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SITE_URL = 'https://guideup.in'
const API_URL = process.env.VITE_API_URL || 'https://guideup-api.onrender.com/api'

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/sessions', priority: '0.9', changefreq: 'weekly' },
  { path: '/mentors', priority: '0.8', changefreq: 'weekly' },
  { path: '/become-a-mentor', priority: '0.6', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'daily' },
  { path: '/terms', priority: '0.2', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.2', changefreq: 'yearly' },
  { path: '/refund', priority: '0.2', changefreq: 'yearly' },
]

function urlEntry(path, lastmod, priority = '0.6', changefreq = 'monthly') {
  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    ${lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

async function main() {
  let articles = []
  let mentors = []

  try {
    const res = await fetch(`${API_URL}/sitemap-data`)
    const json = await res.json()
    articles = json?.data?.articles || []
    mentors = json?.data?.mentors || []
  } catch (err) {
    console.warn('[sitemap] Could not fetch dynamic sitemap data, generating static routes only:', err.message)
  }

  const entries = [
    ...STATIC_ROUTES.map((r) => urlEntry(r.path, null, r.priority, r.changefreq)),
    ...articles.map((a) => urlEntry(`/blog/${a.slug}`, a.updatedAt, '0.7', 'monthly')),
    ...mentors.map((m) => urlEntry(`/mentors/${m.slug}`, m.updatedAt, '0.5', 'monthly')),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`

  const outPath = resolve(process.cwd(), 'public', 'sitemap.xml')
  writeFileSync(outPath, xml)
  console.log(`[sitemap] Wrote ${entries.length} URLs to ${outPath}`)
}

main()
