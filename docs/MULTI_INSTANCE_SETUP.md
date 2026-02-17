# Multi-Instance Payload CMS - Local Setup Guide

## 🚀 Quick Start

### 1. Stop current dev server:

```bash
# Press Ctrl+C in your current terminal
```

### 2. Load environment variables:

```bash
# Copy multi-instance config
cp .env.multi .env

# Or load it explicitly
source .env.multi
```

### 3. Start PostgreSQL:

```bash
docker-compose -f docker-compose.postgres.yml up -d
```

### 4. Run database migrations for each tenant:

```bash
# misrut
TENANT_ID=misrut DATABASE_URL="$misrut_DATABASE_URL" PAYLOAD_SECRET="$misrut_PAYLOAD_SECRET" pnpm payload migrate

# synrgy
TENANT_ID=synrgy DATABASE_URL="$synrgy_DATABASE_URL" PAYLOAD_SECRET="$synrgy_PAYLOAD_SECRET" pnpm payload migrate
```

### 5. Start all instances:

```bash
# Option A: Using the helper script
./scripts/start-multi.sh

# Option B: Manual (in separate terminals)
# Terminal 1 - misrut:
TENANT_ID=misrut DATABASE_URL="$misrut_DATABASE_URL" PAYLOAD_SECRET="$misrut_PAYLOAD_SECRET" PORT=3001 npm run dev

# Terminal 2 - synrgy:
TENANT_ID=synrgy DATABASE_URL="$synrgy_DATABASE_URL" PAYLOAD_SECRET="$synrgy_PAYLOAD_SECRET" PORT=3002 npm run dev
```

---

## 🌐 Access the Instances

### misrut

- **Admin Panel**: http://localhost:3001/admin
- **Frontend**: http://localhost:3001

### synrgy

- **Admin Panel**: http://localhost:3002/admin
- **Frontend**: http://localhost:3002

### PostgreSQL (via pgAdmin)

- **Web UI**: http://localhost:5050
- **Email**: admin@payload.com
- **Password**: admin

> **Note**: pgAdmin is optional. Start with: `docker-compose --profile tools -f docker-compose.postgres.yml up -d`

---

## 📊 Database Management

### Connect to PostgreSQL:

```bash
docker exec -it payload-postgres psql -U payload
```

### List databases:

```sql
\l
```

### Connect to specific tenant database:

```sql
\c misrut_db
\dt  -- List tables
```

### View tenant data:

```sql
-- View pages for misrut
\c misrut_db
SELECT id, title, slug FROM pages;

-- View pages for synrgy
\c synrgy_db
SELECT id, title, slug FROM pages;
```

---

## 🧪 Testing Multi-Instance Setup

### 1. Create admin users:

**misrut** (http://localhost:3001/admin):

- Email: admin@misrut.com
- Password: (your choice)

**synrgy** (http://localhost:3002/admin):

- Email: admin@synrgy.com
- Password: (your choice)

### 2. Create test pages:

In each admin panel, create a page with slug `home`:

- misrut: Create "misrut Home" page
- synrgy: Create "synrgy Home" page

### 3. Verify isolation:

- Pages created in misrut should NOT appear in synrgy
- Check databases directly:
  ```bash
  docker exec -it payload-postgres psql -U payload misrut_db -c "SELECT title FROM pages;"
  docker exec -it payload-postgres psql -U payload synrgy_db -c "SELECT title FROM pages;"
  ```

### 4. Test live preview:

- Open a page in misrut admin
- Click "Live Preview"
- Click editable text → field should focus
- Repeat for synrgy

---

## 🛑 Stopping the System

### Stop all instances:

```bash
# Stop Payload instances (Ctrl+C in terminals)
# Stop PostgreSQL:
docker-compose -f docker-compose.postgres.yml down
```

### Restart PostgreSQL:

```bash
docker-compose -f docker-compose.postgres.yml up -d
```

---

## 🐛 Troubleshooting

### PostgreSQL connection errors:

```bash
# Check if PostgreSQL is running:
docker ps | grep payload-postgres

# View logs:
docker logs payload-postgres

# Restart PostgreSQL:
docker-compose -f docker-compose.postgres.yml restart
```

### Port already in use:

```bash
# Check what's using port 3001/3002:
lsof -i :3001
lsof -i :3002

# Kill the process:
kill -9 <PID>
```

### Database doesn't exist:

```bash
# Recreate databases:
docker exec -it payload-postgres psql -U payload -c "CREATE DATABASE misrut_db;"
docker exec -it payload-postgres psql -U payload -c "CREATE DATABASE synrgy_db;"
```

### Migration errors:

```bash
# Reset and re-run migrations:
TENANT_ID=misrut DATABASE_URL="$misrut_DATABASE_URL" PAYLOAD_SECRET="$misrut_PAYLOAD_SECRET" pnpm payload migrate:reset
TENANT_ID=misrut DATABASE_URL="$misrut_DATABASE_URL" PAYLOAD_SECRET="$misrut_PAYLOAD_SECRET" pnpm payload migrate
```

---

## 📁 Project Structure Changes

```
cms-poc-payload/
├── src/
│   ├── tenants.config.ts          # NEW: Tenant registry
│   ├── payload.config.ts           # MODIFIED: Factory function
│   ├── collections/
│   │   ├── Pages.ts                # MODIFIED: Removed site relationship
│   │   └── Sites.ts.backup         # REMOVED: Backed up
│   └── globals/
│       └── DesignSystem.ts         # MODIFIED: Single theme per instance
├── scripts/
│   ├── init-databases.sql          # NEW: Database initialization
│   └── start-multi.sh              # NEW: Multi-instance startup
├── docker-compose.postgres.yml     # NEW: PostgreSQL setup
└── .env.multi                      # NEW: Multi-instance environment
```

---

## ✅ Next Steps

1. ✅ Stop current single-instance dev server
2. ✅ Start PostgreSQL with Docker
3. ✅ Run migrations for both tenants
4. ✅ Start both Payload instances
5. ✅ Create admin users and test data
6. ✅ Verify database isolation
7. ⏳ Add more tenants (see below)

---

## ➕ Adding New Tenants

1. **Update `src/tenants.config.ts`**:

   ```typescript
   {
     id: 'client3',
     name: 'Client 3',
     domain: 'client3.local',
     adminDomain: 'admin.client3.local',
     databaseUrl: process.env.CLIENT3_DATABASE_URL || '...',
     port: 3003,
     payloadSecret: process.env.CLIENT3_PAYLOAD_SECRET || '...',
   }
   ```

2. **Add environment variables** (`.env.multi`):

   ```bash
   CLIENT3_DATABASE_URL=postgresql://payload:payload@localhost:5432/client3_db
   CLIENT3_PAYLOAD_SECRET=client3-secret-xyz
   CLIENT3_PORT=3003
   ```

3. **Create database**:

   ```bash
   docker exec -it payload-postgres psql -U payload -c "CREATE DATABASE client3_db;"
   ```

4. **Run migrations**:

   ```bash
   TENANT_ID=client3 DATABASE_URL="$CLIENT3_DATABASE_URL" PAYLOAD_SECRET="$CLIENT3_PAYLOAD_SECRET" pnpm payload migrate
   ```

5. **Start instance**:
   ```bash
   TENANT_ID=client3 DATABASE_URL="$CLIENT3_DATABASE_URL" PAYLOAD_SECRET="$CLIENT3_PAYLOAD_SECRET" PORT=3003 npm run dev
   ```

---

## 🎯 Current Status

✅ Tenant configuration system created  
✅ Payload config converted to factory function  
✅ Sites collection removed  
✅ Collections updated (no site relationships)  
✅ PostgreSQL setup with Docker  
✅ Multi-instance startup script created  
⏳ Ready for testing

**You can now run the multi-instance setup!**
