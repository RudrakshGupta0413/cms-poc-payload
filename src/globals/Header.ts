import type { GlobalConfig } from 'payload'

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
                { label: 'Page', value: 'page' },
                { label: 'Blog Post', value: 'post' },
                { label: 'Blog Listing', value: 'blogList' },
                { label: 'Custom URL', value: 'custom' },
              ],
              defaultValue: 'page',
            },
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
              required: true,
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'page',
              },
            },
            {
              name: 'post',
              type: 'relationship',
              relationTo: 'posts',
              required: true,
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'post',
              },
            },
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
