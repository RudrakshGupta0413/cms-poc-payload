import type { GlobalConfig } from 'payload'

export const DesignSystem: GlobalConfig = {
  slug: 'design-system',
  admin: {
    description: 'Manage global design tokens and themes for all sites.',
  },
  fields: [
    {
      name: 'themes',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'site',
          type: 'relationship',
          relationTo: 'sites',
          required: true,
        },
        {
          name: 'colors',
          type: 'group',
          fields: [
            { name: 'primary', type: 'text', defaultValue: '#000000' },
            { name: 'secondary', type: 'text', defaultValue: '#ffffff' },
            { name: 'accent', type: 'text', defaultValue: '#ef4444' },
          ],
        },
        {
          name: 'typography',
          type: 'group',
          fields: [
            { name: 'fontFamily', type: 'text', defaultValue: 'Inter, sans-serif' },
            { name: 'baseFontSize', type: 'text', defaultValue: '16px' },
          ],
        },
      ],
    },
  ],
}
