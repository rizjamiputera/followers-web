interface Article {
    slug: string
    updatedAt?: string
    publishedAt?: string
}

interface Event {
    slug: string
    updatedAt?: string
    publishedAt?: string
}

interface Category {
    slug: string
}

interface Speaker {
    slug: string
    updatedAt?: string
}

type PaginatedResponse<T> = { data: T[] } | T[]

function toArray<T>(res: PaginatedResponse<T>): T[] {
    if (Array.isArray(res)) return res
    if (res && Array.isArray((res as { data: T[] }).data)) return (res as { data: T[] }).data
    return []
}

function isoDate(d: Date): string {
    return d.toISOString().split('T')[0] ?? ''
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return isoDate(new Date())
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? isoDate(new Date()) : isoDate(d)
}

function urlEntry(loc: string, lastmod?: string): string {
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${formatDate(lastmod)}</lastmod>\n  </url>`
}

export default defineEventHandler(async (event) => {
    const { public: { apiUri, webUri } } = useRuntimeConfig(event)

    const base = webUri.replace(/\/$/, '')
    const today = new Date().toISOString().split('T')[0]

    const [articlesResult, eventsResult, categoriesResult, speakersResult] = await Promise.allSettled([
        $fetch<PaginatedResponse<Article>>(`${apiUri}/v1/article/published`, {
            query: { limit: 1000 },
        }),
        $fetch<PaginatedResponse<Event>>(`${apiUri}/v1/event/published`, {
            query: { limit: 1000 },
        }),
        $fetch<PaginatedResponse<Category>>(`${apiUri}/v1/categories`),
        $fetch<PaginatedResponse<Speaker>>(`${apiUri}/v1/speakers`, {
            query: { limit: 1000 },
        }),
    ])

    const articles = articlesResult.status === 'fulfilled' ? toArray(articlesResult.value) : []
    const events = eventsResult.status === 'fulfilled' ? toArray(eventsResult.value) : []
    const categories = categoriesResult.status === 'fulfilled' ? toArray(categoriesResult.value) : []
    const speakers = speakersResult.status === 'fulfilled' ? toArray(speakersResult.value) : []

    const staticPages = ['/', '/kegiatan', '/creator']

    const entries: string[] = [
        ...staticPages.map(path => urlEntry(`${base}${path}`, today)),
        ...articles.map(a => urlEntry(`${base}/read/${a.slug}`, a.updatedAt ?? a.publishedAt)),
        ...events.map(e => urlEntry(`${base}/event/${e.slug}`, e.updatedAt ?? e.publishedAt)),
        ...categories.map(c => urlEntry(`${base}/kategori/${c.slug}`)),
        ...speakers.map(s => urlEntry(`${base}/pemateri/${s.slug}`, s.updatedAt)),
    ]

    setHeader(event, 'Content-Type', 'application/xml')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`
})
