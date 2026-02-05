import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Header } from './globals/Header'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET is missing. Please set it in your environment variables.')
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Please set it in your environment variables.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      // Enable Live Preview for these collections (required for the eye icon / panel to show)
      collections: ['pages', 'posts'],
      url: ({ data, collectionConfig }) => {
        const origin = process.env.NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN || 'http://localhost:3000'
        if (collectionConfig?.slug === 'pages') {
          return `${origin}/${data?.slug}?livePreview=true`
        }
        if (collectionConfig?.slug === 'posts') {
          return `${origin}/posts/${data?.slug}?livePreview=true`
        }

        return `${origin}/?livePreview=true`
      },
    },
  },
  editor: lexicalEditor({}),
  collections: [Users, Media, Pages, Posts],
  globals: [Header],
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  sharp,
  plugins: [],
})
