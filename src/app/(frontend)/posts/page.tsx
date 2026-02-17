import { getPayload } from 'payload'
import config from '@/payload.config'
import { BlogCard } from '@/components/BlogCard'
import { notFound } from 'next/navigation'

export default async function BlogListing() {
  const payload = await getPayload({ config })
  const availableSlugs = payload.config.collections.map((c) => c.slug)

  // Only render if this tenant has the posts collection
  if (!availableSlugs.includes('posts')) {
    return notFound()
  }

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
