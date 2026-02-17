import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'

interface PostProps {
  params: Promise<{
    slug: string
  }>
}

import { Post as PostType } from '@/payload-types'
import { LivePreviewPost } from '@/components/LivePreviewPost'

export default async function Post({ params }: PostProps) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const availableSlugs = payload.config.collections.map((c) => c.slug)

  // Only render if this tenant has the posts collection
  if (!availableSlugs.includes('posts')) {
    return notFound()
  }

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const post = result?.docs?.[0]

  if (!post) {
    return notFound()
  }

  return <LivePreviewPost initialPost={post as PostType} />
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const availableSlugs = payload.config.collections.map((c) => c.slug)

  // If this tenant doesn't have posts, return empty params
  if (!availableSlugs.includes('posts')) {
    return []
  }

  const posts = await payload.find({
    collection: 'posts',
    limit: 1000,
  })

  return posts.docs.map(({ slug }) => ({
    slug,
  }))
}
