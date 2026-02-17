import { LivePreviewLanding } from '@/components/LivePreviewLanding'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { Page as PageType } from '@/payload-types'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const availableSlugs = payload.config.collections.map((c) => c.slug)

  // Only query pages if the collection exists for this tenant
  if (!availableSlugs.includes('pages')) {
    return notFound()
  }

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const page = result?.docs?.[0]

  if (!page) {
    return notFound()
  }

  const initialPage: PageType = {
    ...page,
    layout: page.layout ?? [],
  }

  return <LivePreviewLanding initialPage={initialPage} />
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const availableSlugs = payload.config.collections.map((c) => c.slug)

  // If this tenant doesn't have pages, return empty params
  if (!availableSlugs.includes('pages')) {
    return []
  }

  const pages = await payload.find({
    collection: 'pages',
    limit: 1000,
  })

  return pages.docs.map(({ slug }) => ({
    slug,
  }))
}
