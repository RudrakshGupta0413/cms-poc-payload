import type { GlobalConfig } from 'payload'
import { getCurrentTenant } from '../tenants.config'

const tenant = getCurrentTenant()
const enabledCollections = tenant.customConfig?.collections || ['users', 'media', 'pages', 'posts']

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'link',
          type: 'group',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'type',
              type: 'radio',
              options: [
                ...(enabledCollections.includes('pages') ? [{ label: 'Page', value: 'page' }] : []),
                ...(enabledCollections.includes('posts') ? [
                  { label: 'Blog Post', value: 'post' },
                  { label: 'Blog Listing', value: 'blogList' },
                ] : []),
                { label: 'Custom URL', value: 'custom' },
              ],
              defaultValue: enabledCollections.includes('pages') ? 'page' : 'custom',
            },
            ...(enabledCollections.includes('pages') ? [{
              name: 'page',
              type: 'relationship' as const,
              relationTo: 'pages' as const,
              admin: {
                condition: (_: any, siblingData: any) => siblingData?.type === 'page',
              },
            }] : []),
            ...(enabledCollections.includes('posts') ? [{
              name: 'post',
              type: 'relationship' as const,
              relationTo: 'posts' as const,
              admin: {
                condition: (_: any, siblingData: any) => siblingData?.type === 'post',
              },
            }] : []),
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'custom',
              },
            },
          ],
        },
      ],
    },
  ],
}
