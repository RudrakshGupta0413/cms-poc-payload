import type { GlobalConfig } from 'payload'

/**
 * Design System Global
 * 
 * Each Payload instance (tenant) has its own design system configuration.
 * NO LONGER manages multiple site themes - each instance is isolated.
 */
export const DesignSystem: GlobalConfig = {
  slug: 'design-system',
  admin: {
    description: 'Manage design tokens and theme for this site.',
  },
  fields: [
    {
      name: 'colors',
      type: 'group',
      fields: [
        {
          name: 'primary',
          type: 'text',
          defaultValue: '#000000',
          admin: {
            description: 'Primary brand color (hex code)',
          },
        },
        {
          name: 'secondary',
          type: 'text',
          defaultValue: '#ffffff',
          admin: {
            description: 'Secondary brand color (hex code)',
          },
        },
        {
          name: 'accent',
          type: 'text',
          defaultValue: '#ef4444',
          admin: {
            description: 'Accent color for CTA buttons and highlights (hex code)',
          },
        },
      ],
    },
    {
      name: 'typography',
      type: 'group',
      fields: [
        {
          name: 'fontFamily',
          type: 'text',
          defaultValue: 'Inter, sans-serif',
          admin: {
            description: 'Font family for body text',
          },
        },
        {
          name: 'baseFontSize',
          type: 'text',
          defaultValue: '16px',
          admin: {
            description: 'Base font size',
          },
        },
      ],
    },
  ],
}
