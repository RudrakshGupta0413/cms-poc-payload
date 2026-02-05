import type { CollectionConfig } from 'payload'

// Currently not in use its the previous version of the landing page collection
// Current collection is Pages.ts
/**
 * Site composed of pre-built full pages.
 * - Admin adds full-page layouts (Hero Page, About Page, etc.) in order; each can be added multiple times.
 * - Admin cannot create new page layouts; each page layout is fixed in the Next.js app.
 * - Admin manages all content and images within each page.
 */

export const LandingPage: CollectionConfig = {
  slug: 'landing-page',
  admin: {
    useAsTitle: 'title',
    description:
      'Build the site by adding pre-built full pages (Hero Page, About Page, etc.) in order. You can add each page type multiple times. Page layout is fixed; you manage content and images only.',
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
      admin: { description: 'Internal title for this site or homepage (e.g. "Home").' },
    },
    {
      name: 'layout',
      type: 'blocks',
      admin: {
        description:
          'Add pre-built full pages in order. Each page type can be added multiple times. You cannot create new page layouts—only the options below are available. Each item is one full page.',
      },
      blocks: [
        // Full page: Hero + About 
        {
          slug: 'homePage',
          labels: { singular: 'Home Page', plural: 'Home Pages' },
          fields: [
            {
              name: 'hero',
              type: 'group',
              admin: { description: 'Hero section' },
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
              admin: { description: 'About section' },
              fields: [
                { name: 'title', type: 'text' },
                { name: 'description', type: 'textarea' },
                { name: 'highlightText', type: 'text' },
              ],
            },
            {
              name: 'why',
              type: 'group',
              admin: { description: 'Why This Space Exists section' },
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

        // Full page: About only (standalone About page)
        {
          slug: 'aboutPage',
          labels: { singular: 'About Page', plural: 'About Pages' },
          fields: [
            { name: 'title', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'highlightText', type: 'text' },
          ],
        },

        // Full page: Services
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

        // Full page: Contact
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
