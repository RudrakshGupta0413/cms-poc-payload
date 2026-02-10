import type { CollectionConfig } from 'payload'

export const Sites: CollectionConfig = {
  slug: 'sites',
  admin: {
    useAsTitle: 'name',
    description: 'Manage different projects or sites (e.g., Mistrut, Synergy).',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'domain',
      type: 'text',
      admin: {
        description: 'The domain where this site is hosted (e.g., mistrut.com).',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
