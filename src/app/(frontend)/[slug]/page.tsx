import { LivePreviewLanding } from '@/components/LivePreviewLanding'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

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

  const initialPage = {
    id: page.id,
    title: page.title,
    layout: (page.layout ?? []) as any,
  }

  return <LivePreviewLanding initialPage={initialPage} />
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'pages',
    limit: 1000,
  })

  return pages.docs.map(({ slug }) => ({
    slug,
  }))
}
