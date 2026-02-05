import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    description:
      'Create and manage website pages. Each page has its own URL based on its slug.',
    components: {
      edit: {
        beforeDocumentControls: ['/components/payload/AdminInspectorBridge'],
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'This becomes the URL. Example: "about" → yoursite.com/about',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      admin: {
        description:
          'Build the page using predefined full-page layouts.',
      },
      blocks: [
        // 🏠 Home Page Layout
        {
          slug: 'homePage',
          labels: { singular: 'Home Page', plural: 'Home Pages' },
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'heading', type: 'text', required: true },
                { name: 'subheading', type: 'text' },
                { name: 'ctaText', type: 'text' },
                { name: 'ctaLink', type: 'text' },
              ],
            },
            {
              name: 'about',
              type: 'group',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'description', type: 'textarea' },
                { name: 'highlightText', type: 'text' },
              ],
            },
            {
              name: 'why',
              type: 'group',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'heading', type: 'text' },
                { name: 'description', type: 'textarea' },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },

        // 📄 About Page Layout
        {
          slug: 'aboutPage',
          labels: { singular: 'About Page', plural: 'About Pages' },
          fields: [
            { name: 'title', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'highlightText', type: 'text' },
          ],
        },

        // 🛠 Services Page Layout
        {
          slug: 'servicesPage',
          labels: { singular: 'Services Page', plural: 'Services Pages' },
          fields: [
            { name: 'sectionTitle', type: 'text' },
            {
              name: 'servicesList',
              type: 'array',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'description', type: 'textarea' },
                { name: 'icon', type: 'text' },
              ],
            },
          ],
        },

        // 📬 Contact Page Layout
        {
          slug: 'contactPage',
          labels: { singular: 'Contact Page', plural: 'Contact Pages' },
          fields: [
            { name: 'email', type: 'email' },
            { name: 'phone', type: 'text' },
            { name: 'address', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}