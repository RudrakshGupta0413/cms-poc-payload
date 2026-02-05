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
        if (collectionConfig?.slug === 'pages') {
          return `http://localhost:3000/${data?.slug}?livePreview=true`
        }
        if (collectionConfig?.slug === 'posts') {
          return `http://localhost:3000/posts/${data?.slug}?livePreview=true`
        }

        return `http://localhost:3000/?livePreview=true`
      },
    },
  },
  editor: lexicalEditor({}),
  collections: [Users, Media, Pages, Posts],
  globals: [Header],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
