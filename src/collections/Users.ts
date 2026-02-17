import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,  // Simple auth, no restrictions
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    // Email and password added automatically by auth: true
  ],
}
