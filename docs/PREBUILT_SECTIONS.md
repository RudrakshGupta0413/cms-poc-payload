# Pre-built full pages (page-level, fixed layouts)

This project uses **pre-built full pages only**: each "page" in the CMS is one full page. Some page types (e.g. **Home Page**) contain **multiple sections** (Hero + About) inside one page; others (About Page, Contact Page) are one section per page.

## How it works

1. **Payload** (`src/collections/LandingPage.ts`)
   - The **layout** field is a blocks field where each block is one **full page**:
     - **Home Page** = one full page with **Hero section + About section** (both on the same page).
     - **About Page** = one full page with only the About section.
     - **Services Page** = one full page with the Services section.
     - **Contact Page** = one full page with the Contact section.
   - The admin adds "Home Page", "About Page", etc. Each time they add "Home Page", they get **another full page** that contains Hero + About. They cannot create new page types or change the structure.

2. **Admin can**
   - Add full pages in any order and repeat (e.g. Home Page → Contact Page → Home Page).
   - Edit all content within each page (and within each section inside a page).

3. **Admin cannot**
   - Create a new page layout type.
   - Change the layout/structure of a page or the sections inside it.

## Data shape change (Home Page = Hero + About)

The **Home Page** block contains two groups: **hero** and **about**. So one "Home Page" in the list = one full page that renders Hero section then About section. If you had previously used separate "Hero" and "About" blocks, replace them with one **Home Page** block and fill in the Hero and About sections inside it. Old hero/about-only blocks are no longer in the schema.

## Restricting to only 2 page types (e.g. Home + Contact)

If you only want Hero Page and About Page:

1. Open `src/collections/LandingPage.ts`.
2. Remove the **services** and **contact** block definitions from the `blocks` array.
3. Remove the corresponding `case 'services'` and `case 'contact'` branches from `src/components/LivePreviewLanding.tsx` (and any other frontend that renders `page.layout`).

After that, the admin will only see "Add Hero Page" and "Add About Page" in the CMS.

## Adding a new pre-built page (developer only)

To add a new page type (e.g. "Pricing Page"):

1. **Payload** – In `src/collections/LandingPage.ts`, add a new block to the `blocks` array:
   - `slug: 'pricing'`
   - `labels: { singular: 'Pricing Page', plural: 'Pricing Pages' }`
   - `fields: [ ... ]` (all content fields for that full page)

2. **Frontend** – In `src/components/LivePreviewLanding.tsx`, add a new `case 'pricing':` that renders the full page layout (same structure and field names).

3. Run `pnpm run generate:types` (or `npm run generate:types`) after changing the collection.

The admin will then see "Add Pricing Page" and can add it and edit its content; they cannot change the page’s layout.
