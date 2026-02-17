import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import type { Config, CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Header } from './globals/Header'
import { DesignSystem } from './globals/DesignSystem'
import type { TenantConfig } from './tenants.config'
import { getCurrentTenant } from './tenants.config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export function createPayloadConfig(tenant: TenantConfig): Config {
  if (!tenant.payloadSecret) {
    throw new Error(`PAYLOAD_SECRET is missing for tenant: ${tenant.id}`)
  }

  if (!tenant.databaseUrl) {
    throw new Error(`DATABASE_URL is missing for tenant: ${tenant.id}`)
  }

  const enabledCollections = tenant.customConfig?.collections || ['users', 'media', 'pages', 'posts']

  // When running `payload generate:importmap`, load ALL collections so the
  // shared importMap file gets entries for every component (Lexical richText, etc.).
  // At runtime, only the tenant's own collections are loaded.
  const isGeneratingImportMap = process.argv.some(arg => arg === 'generate:importmap')

  let collections: CollectionConfig[]
  if (isGeneratingImportMap) {
    collections = [Users, Media, Pages, Posts]
    console.log(`[importMap mode] Loading ALL collections: users, media, pages, posts`)
  } else {
    collections = [Users]
    if (enabledCollections.includes('media')) collections.push(Media)
    if (enabledCollections.includes('pages')) collections.push(Pages)
    if (enabledCollections.includes('posts')) collections.push(Posts)
    console.log(`Loaded collections for ${tenant.name}:`, collections.map(c => c.slug).join(', '))
  }

  const config = buildConfig({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || `http://localhost:${process.env.PORT || 3000}`,
    admin: {
      user: Users.slug,
      importMap: {
        baseDir: path.resolve(dirname),
      },
      meta: {
        titleSuffix: ` - ${tenant.name}`,
        // favicon: `/favicons/${tenant.id}.ico`, // Not supported in MetaConfig
      },
      livePreview: {
        // Enable Live Preview only for collections this tenant actually has
        collections: ['pages', 'posts'].filter(c => enabledCollections.includes(c)),
        url: ({ data, collectionConfig }) => {
          const origin = process.env.NEXT_PUBLIC_SERVER_URL || `http://localhost:${process.env.PORT || 3000}`
          if (collectionConfig?.slug === 'pages') {
            return `${origin}/${data?.slug}?livePreview=true`
          }
          if (collectionConfig?.slug === 'posts') {
            return `${origin}/posts/${data?.slug}?livePreview=true`
          }

          return `${origin}/?livePreview=true`
        },
        breakpoints: [
          {
            label: 'Mobile',
            name: 'mobile',
            width: 375,
            height: 667,
          },
          {
            label: 'Tablet',
            name: 'tablet',
            width: 768,
            height: 1024,
          },
          {
            label: 'Desktop',
            name: 'desktop',
            width: 1440,
            height: 900,
          },
        ],
      },
    },
    editor: lexicalEditor({}),

    // Use conditionally built collections
    collections,

    globals: [Header, DesignSystem],
    secret: tenant.payloadSecret,
    typescript: {
      outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    db: postgresAdapter({
      pool: {
        connectionString: tenant.databaseUrl,
      },
    }),
    sharp,
    plugins: [],
  })

  return config
}

/**
 * Default export for compatibility with existing code
 * Uses the current tenant from TENANT_ID environment variable
 */
const tenant = getCurrentTenant()
console.log(`🚀 Initializing Payload for tenant: ${tenant.name} (${tenant.id})`)
console.log(`📊 Database: ${tenant.databaseUrl.replace(/:[^:@]+@/, ':***@')}`)
console.log(`🌐 Domain: ${tenant.domain}`)
console.log(`⚙️  Admin: ${tenant.adminDomain}`)

export default createPayloadConfig(tenant)

