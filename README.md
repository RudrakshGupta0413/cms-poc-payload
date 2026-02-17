# Multi-Tenant Payload CMS

A **single codebase** that powers multiple independent websites — each with its own database, admin panel, collections, and frontend. Built with [Payload CMS 3](https://payloadcms.com/) + [Next.js 15](https://nextjs.org/) + PostgreSQL.

## Current Tenants

| Tenant     | Purpose             | Collections         | Port   | Admin URL                   |
| ---------- | ------------------- | ------------------- | ------ | --------------------------- |
| **Misrut** | Pages-based website | Users, Media, Pages | `3001` | http://localhost:3001/admin |
| **Synrgy** | Blog platform       | Users, Media, Posts | `3002` | http://localhost:3002/admin |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                 Single Codebase                 │
│            (Payload CMS + Next.js)              │
├────────────────────┬────────────────────────────┤
│                    │                            │
│   TENANT_ID=misrut │   TENANT_ID=synrgy         │
│   PORT=3001        │   PORT=3002                │
│                    │                            │
│   Collections:     │   Collections:             │
│   - Users          │   - Users                  │
│   - Media          │   - Media                  │
│   - Pages          │   - Posts (blog)            │
│                    │                            │
├────────────────────┼────────────────────────────┤
│   misrut_db        │   synrgy_db                │
│   (PostgreSQL)     │   (PostgreSQL)             │
└────────────────────┴────────────────────────────┘
         ▲  Both share one PostgreSQL server  ▲
         └────── Docker (port 5433) ──────────┘
```

**Key idea:** The same code runs as two separate Next.js processes. Each process reads the `TENANT_ID` environment variable to decide which collections to load and which database to connect to. The databases are completely isolated — data created in Misrut can never appear in Synrgy and vice versa.

---

## Prerequisites

- **Node.js** ≥ 20.9.0
- **npm** ≥ 9
- **Docker** (for PostgreSQL)

---

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url> cms-poc-payload
cd cms-poc-payload
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.multi .env
```

This copies the multi-tenant config into `.env`. The file contains connection strings, secrets, and ports for both tenants.

### 3. Start PostgreSQL

```bash
docker-compose -f docker-compose.postgres.yml up -d
```

This starts a PostgreSQL 16 container on **port 5433** (not the default 5432, to avoid conflicts). It automatically creates two databases: `misrut_db` and `synrgy_db` using the `scripts/init-databases.sql` script.

### 4. Generate the Import Map

This step registers all admin UI components (rich text editor, custom components, etc.). **Run this once** after cloning, or whenever you add new collections/fields:

```bash
TENANT_ID=misrut \
  DATABASE_URL="postgresql://payload:payload@localhost:5433/misrut_db" \
  PAYLOAD_SECRET="misrut-development-secret-change-in-production-abc123" \
  npx cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap
```

### 5. Start Both Tenants

**Option A — Helper script (starts both at once):**

```bash
source .env.multi
./scripts/start-multi.sh
```

**Option B — Manual (in separate terminals):**

```bash
# Terminal 1 — Misrut
TENANT_ID=misrut \
  DATABASE_URL="postgresql://payload:payload@localhost:5433/misrut_db" \
  PAYLOAD_SECRET="misrut-development-secret-change-in-production-abc123" \
  PORT=3001 npm run dev
```

```bash
# Terminal 2 — Synrgy
TENANT_ID=synrgy \
  DATABASE_URL="postgresql://payload:payload@localhost:5433/synrgy_db" \
  PAYLOAD_SECRET="synrgy-development-secret-change-in-production-xyz789" \
  PORT=3002 npm run dev
```

### 6. Create Admin Users

Visit each admin panel and create your first admin account:

| Tenant | URL                         | Suggested Email    |
| ------ | --------------------------- | ------------------ |
| Misrut | http://localhost:3001/admin | `admin@misrut.com` |
| Synrgy | http://localhost:3002/admin | `admin@synrgy.com` |

---

## How It Works

### Tenant Configuration — `src/tenants.config.ts`

Every tenant is defined in this file with an `id`, database URL, port, secret, and the list of collections it should load:

```typescript
{
  id: 'misrut',
  customConfig: {
    collections: ['users', 'media', 'pages'],  // pages-only website
  }
}
{
  id: 'synrgy',
  customConfig: {
    collections: ['users', 'media', 'posts'],  // blog platform
  }
}
```

### Payload Config Factory — `src/payload.config.ts`

At startup, `getCurrentTenant()` reads the `TENANT_ID` env var, looks up the tenant config, and builds a Payload config with only that tenant's collections. This means:

- **Misrut admin** only shows Users, Media, and Pages
- **Synrgy admin** only shows Users, Media, and Posts

The config also handles a special case: when generating the importMap (`payload generate:importmap`), it loads **all** collections regardless of tenant, so the shared importMap file contains entries for every component (Lexical editor, custom admin components, etc.).

### Tenant-Aware Frontend Routes

The frontend routes (`src/app/(frontend)/`) dynamically check which collections exist for the current tenant:

| Route           | Behavior                                                                           |
| --------------- | ---------------------------------------------------------------------------------- |
| `/` (homepage)  | Shows pages with slug `home` if tenant has Pages, blog listing if tenant has Posts |
| `/[slug]`       | Renders a page by slug (404 if tenant doesn't have Pages)                          |
| `/posts`        | Blog listing (404 if tenant doesn't have Posts)                                    |
| `/posts/[slug]` | Single blog post (404 if tenant doesn't have Posts)                                |

### Live Preview

Both tenants support Payload's Live Preview feature. When editing a Page or Post in the admin panel, you can see real-time changes in an embedded preview iframe. The preview URL is dynamically generated based on the collection type and slug.

---

## Collections & Globals

### Collections

| Collection | Slug    | Used By | Description                                                             |
| ---------- | ------- | ------- | ----------------------------------------------------------------------- |
| **Users**  | `users` | Both    | Auth-enabled. Provides admin panel access.                              |
| **Media**  | `media` | Both    | File uploads with auto-generated sizes.                                 |
| **Pages**  | `pages` | Misrut  | Block-based page builder (Home, About, Services, Contact layouts).      |
| **Posts**  | `posts` | Synrgy  | Blog posts with Lexical rich text editor, featured image, publish date. |

### Globals

| Global           | Slug            | Description                                                 |
| ---------------- | --------------- | ----------------------------------------------------------- |
| **Header**       | `header`        | Site navigation with links to pages, posts, or custom URLs. |
| **DesignSystem** | `design-system` | Theme configuration (colors, fonts, spacing).               |

---

## Database

### Overview

A single PostgreSQL 16 server (Docker container named `payload-postgres`) hosts separate databases for each tenant:

| Database    | Tenant | Connection String                                       |
| ----------- | ------ | ------------------------------------------------------- |
| `misrut_db` | Misrut | `postgresql://payload:payload@localhost:5433/misrut_db` |
| `synrgy_db` | Synrgy | `postgresql://payload:payload@localhost:5433/synrgy_db` |

**Credentials:** User = `payload`, Password = `payload`, Port = `5433`

### Connecting to the Database

```bash
# Connect to PostgreSQL
docker exec -it payload-postgres psql -U payload

# List all databases
\l

# Connect to a specific tenant database
\c misrut_db
\dt          -- list all tables

# Query data
SELECT id, title, slug FROM pages;
```

### Key Tables (auto-created by Payload)

Each database contains its own set of tables. Common tables include:

| Table                 | Description                               |
| --------------------- | ----------------------------------------- |
| `users`               | Admin user accounts                       |
| `media`               | Uploaded file metadata                    |
| `pages`               | Page content (Misrut only)                |
| `pages_blocks_*`      | Block data for page layouts (Misrut only) |
| `posts`               | Blog post content (Synrgy only)           |
| `header`              | Global header/navigation config           |
| `_header_nav_items`   | Navigation link items                     |
| `design_system`       | Global theme settings                     |
| `payload_migrations`  | Migration tracking                        |
| `payload_preferences` | Admin UI preferences                      |

### pgAdmin (Optional Web UI)

```bash
docker-compose --profile tools -f docker-compose.postgres.yml up -d
```

Access at http://localhost:5050 — Email: `admin@payload.com`, Password: `admin`

### Database Reset

To completely reset a tenant's database:

```bash
./scripts/reset-tenant.sh misrut
# or
./scripts/reset-tenant.sh synrgy
```

---

## Project Structure

```
cms-poc-payload/
├── src/
│   ├── payload.config.ts         # Factory function — builds tenant-specific Payload config
│   ├── tenants.config.ts         # Tenant registry (IDs, databases, collections)
│   ├── payload-types.ts          # Auto-generated TypeScript types
│   │
│   ├── collections/
│   │   ├── Users.ts              # Auth-enabled admin users
│   │   ├── Media.ts              # File uploads
│   │   ├── Pages.ts              # Block-based pages (Misrut)
│   │   └── Posts.ts              # Blog posts with rich text (Synrgy)
│   │
│   ├── globals/
│   │   ├── Header.ts             # Navigation config
│   │   └── DesignSystem.ts       # Theme/design tokens
│   │
│   ├── components/
│   │   ├── Header.tsx            # Frontend header/nav component
│   │   ├── LivePreviewLanding.tsx # Live preview for pages
│   │   ├── LivePreviewPost.tsx   # Live preview for posts
│   │   ├── BlogCard.tsx          # Blog post card component
│   │   ├── Editable.tsx          # Click-to-edit component
│   │   └── payload/
│   │       └── AdminInspectorBridge.tsx  # Admin ↔ preview focus bridge
│   │
│   └── app/
│       ├── (frontend)/           # Public-facing routes
│       │   ├── page.tsx          # Homepage (tenant-aware)
│       │   ├── [slug]/page.tsx   # Dynamic pages (Misrut)
│       │   ├── posts/page.tsx    # Blog listing (Synrgy)
│       │   └── posts/[slug]/     # Single post (Synrgy)
│       │
│       └── (payload)/            # Payload admin routes
│           └── admin/
│               └── importMap.js  # Auto-generated component registry
│
├── scripts/
│   ├── init-databases.sql        # Creates misrut_db and synrgy_db on first Docker start
│   ├── start-multi.sh            # Starts PostgreSQL + both tenants
│   ├── start-misrut.sh           # Starts Misrut only
│   ├── start-synrgy.sh           # Starts Synrgy only
│   ├── migrate-misrut.sh         # Run migrations for Misrut
│   ├── migrate-synrgy.sh         # Run migrations for Synrgy
│   └── reset-tenant.sh           # Reset a tenant's database
│
├── docker-compose.postgres.yml   # PostgreSQL + optional pgAdmin
├── .env.multi                    # Multi-tenant environment variables
├── .env.example                  # Single-instance env template
└── package.json
```

---

## Environment Variables

All variables are defined in `.env.multi`:

| Variable                        | Example                                                 | Description                              |
| ------------------------------- | ------------------------------------------------------- | ---------------------------------------- |
| `MISRUT_TENANT_ID`              | `misrut`                                                | Tenant identifier                        |
| `MISRUT_DATABASE_URL`           | `postgresql://payload:payload@localhost:5433/misrut_db` | PostgreSQL connection string             |
| `MISRUT_PAYLOAD_SECRET`         | `misrut-development-secret-...`                         | Encryption key (change in production!)   |
| `MISRUT_PORT`                   | `3001`                                                  | Dev server port                          |
| `MISRUT_NEXT_PUBLIC_SERVER_URL` | `http://localhost:3001`                                 | Used for live preview URLs               |
| `SYNRGY_*`                      | _(same pattern)_                                        | Same variables for Synrgy on port `3002` |

---

## Common Commands

| Action                        | Command                                                                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Install dependencies**      | `npm install`                                                                                                                     |
| **Start PostgreSQL**          | `docker-compose -f docker-compose.postgres.yml up -d`                                                                             |
| **Stop PostgreSQL**           | `docker-compose -f docker-compose.postgres.yml down`                                                                              |
| **Start both tenants**        | `source .env.multi && ./scripts/start-multi.sh`                                                                                   |
| **Start Misrut only**         | `TENANT_ID=misrut DATABASE_URL="..." PAYLOAD_SECRET="..." PORT=3001 npm run dev`                                                  |
| **Start Synrgy only**         | `TENANT_ID=synrgy DATABASE_URL="..." PAYLOAD_SECRET="..." PORT=3002 npm run dev`                                                  |
| **Clean start (clear cache)** | `npm run devsafe` (deletes `.next` folder first)                                                                                  |
| **Generate importMap**        | `TENANT_ID=misrut DATABASE_URL="..." PAYLOAD_SECRET="..." npx cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap` |
| **Generate TypeScript types** | `TENANT_ID=misrut DATABASE_URL="..." PAYLOAD_SECRET="..." npx cross-env NODE_OPTIONS=--no-deprecation payload generate:types`     |
| **Run migrations**            | `TENANT_ID=misrut DATABASE_URL="..." PAYLOAD_SECRET="..." npx cross-env NODE_OPTIONS=--no-deprecation payload migrate`            |
| **Reset tenant DB**           | `./scripts/reset-tenant.sh misrut`                                                                                                |
| **Start pgAdmin**             | `docker-compose --profile tools -f docker-compose.postgres.yml up -d`                                                             |

---

## Adding a New Tenant

1. **Register in `src/tenants.config.ts`:**

   ```typescript
   {
     id: 'newclient',
     name: 'New Client',
     domain: process.env.NEWCLIENT_DOMAIN || 'newclient.local',
     adminDomain: process.env.NEWCLIENT_ADMIN_DOMAIN || 'admin.newclient.local',
     databaseUrl: process.env.NEWCLIENT_DATABASE_URL || 'postgresql://payload:payload@localhost:5433/newclient_db',
     port: parseInt(process.env.NEWCLIENT_PORT || '3003'),
     payloadSecret: process.env.NEWCLIENT_PAYLOAD_SECRET || 'newclient-secret-change-in-production',
     customConfig: {
       collections: ['users', 'media', 'pages', 'posts'], // choose which collections
     }
   }
   ```

2. **Add environment variables to `.env.multi`:**

   ```bash
   NEWCLIENT_DATABASE_URL=postgresql://payload:payload@localhost:5433/newclient_db
   NEWCLIENT_PAYLOAD_SECRET=newclient-development-secret
   NEWCLIENT_PORT=3003
   ```

3. **Create the database:**

   ```bash
   docker exec -it payload-postgres psql -U payload -c "CREATE DATABASE newclient_db;"
   ```

4. **Run migrations:**

   ```bash
   TENANT_ID=newclient DATABASE_URL="$NEWCLIENT_DATABASE_URL" \
     PAYLOAD_SECRET="$NEWCLIENT_PAYLOAD_SECRET" npx cross-env NODE_OPTIONS=--no-deprecation payload migrate
   ```

5. **Start the instance:**

   ```bash
   TENANT_ID=newclient DATABASE_URL="$NEWCLIENT_DATABASE_URL" \
     PAYLOAD_SECRET="$NEWCLIENT_PAYLOAD_SECRET" PORT=3003 npm run dev
   ```

---

## Stopping Everything

```bash
# Stop Payload instances
# Press Ctrl+C in each terminal (or Ctrl+C if using start-multi.sh)

# Stop PostgreSQL
docker-compose -f docker-compose.postgres.yml down

# Stop PostgreSQL AND delete all data
docker-compose -f docker-compose.postgres.yml down -v
```

---

## Troubleshooting

| Problem                           | Solution                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| **PostgreSQL connection refused** | Run `docker-compose -f docker-compose.postgres.yml up -d` and check `docker ps`     |
| **Port already in use**           | `lsof -i :3001` → `kill -9 <PID>`                                                   |
| **Rich text editor not showing**  | Regenerate importMap (see step 4 in Quick Start) and restart with `npm run devsafe` |
| **importMap component not found** | Delete `src/app/(payload)/admin/importMap.js`, regenerate, and clear `.next`        |
| **Database doesn't exist**        | `docker exec -it payload-postgres psql -U payload -c "CREATE DATABASE <db_name>;"`  |
| **Migration errors**              | Reset with `./scripts/reset-tenant.sh <tenant-id>` then re-run migrations           |

---

## Tech Stack

| Technology     | Version   | Purpose                      |
| -------------- | --------- | ---------------------------- |
| Payload CMS    | 3.74.0    | Headless CMS framework       |
| Next.js        | 15.4.11   | React framework (App Router) |
| PostgreSQL     | 16        | Database (via Docker)        |
| Lexical        | (bundled) | Rich text editor             |
| Sharp          | 0.34.2    | Image processing             |
| Docker Compose | -         | Local PostgreSQL setup       |
