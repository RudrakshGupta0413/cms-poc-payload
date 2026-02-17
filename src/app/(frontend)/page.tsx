import { LivePreviewLanding } from '@/components/LivePreviewLanding'
import { BlogCard } from '@/components/BlogCard'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Tenant-aware homepage.
 * - If "pages" collection exists → show the page with slug "home" (Misrut flow)
 * - If "posts" collection exists → show blog listing (Synrgy flow)
 * - Fallback: show a welcome message
 */
export default async function HomePage() {
  const payload = await getPayload({ config })
  const availableSlugs = payload.config.collections.map((c) => c.slug)

  // -- Tenant has "pages" → render the home page --
  if (availableSlugs.includes('pages')) {
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
    })

    const page = result?.docs?.[0]

    if (page) {
      const initialPage = {
        id: page.id,
        title: page.title,
        layout: page.layout ?? [],
      }
      return <LivePreviewLanding initialPage={initialPage} />
    }

    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Welcome</h1>
        <p>Please create a page with the slug <strong>home</strong> in Payload to see your content here.</p>
      </div>
    )
  }

  // -- Tenant has "posts" → show blog listing as homepage --
  if (availableSlugs.includes('posts')) {
    const posts = await payload.find({
      collection: 'posts',
      sort: '-publishedAt',
    })

    return (
      <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <header style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1
              style={{
                fontSize: '3.5rem',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '16px',
                letterSpacing: '-0.02em',
              }}
            >
              Latest Stories
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              Insights, tutorials, and perspectives from our team of writers.
            </p>
          </header>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '32px',
            }}
          >
            {posts.docs.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {posts.docs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>
              <p style={{ fontSize: '1.25rem' }}>No blog posts found. Check back soon!</p>
            </div>
          )}
        </div>
      </main>
    )
  }

  // -- Fallback --
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Welcome</h1>
      <p>Your CMS is running. Visit <a href="/admin">/admin</a> to manage content.</p>
    </div>
  )
}
