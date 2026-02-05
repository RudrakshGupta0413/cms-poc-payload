import { LivePreviewLanding } from '@/components/LivePreviewLanding'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
  })

  const page = result?.docs?.[0]

  if (!page) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Welcome</h1>
        <p>Please create a page with the slug <strong>home</strong> in Payload to see your content here.</p>
      </div>
    )
  }

  const initialPage = {
    id: page.id,
    title: page.title,
    layout: page.layout ?? [],
  }

  return <LivePreviewLanding initialPage={initialPage} />
}
