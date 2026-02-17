# Database Access Guide

## 🗄️ Accessing Your Databases

You have two PostgreSQL databases running on `localhost:5433`:

- `misrut_db` - misrut instance data
- `synrgy_db` - synrgy instance data

---

## Method 1: Command Line (psql)

### Connect to misrut

```bash
psql -h localhost -p 5433 -U payload -d misrut_db
```

### Connect to synrgy

```bash
psql -h localhost -p 5433 -U payload -d synrgy_db
```

**Password**: `payload`

### Useful SQL Commands

```sql
-- List all tables
\dt

-- View table structure
\d pages
\d posts
\d users
\d media

-- Query data
SELECT * FROM pages;
SELECT * FROM posts;
SELECT * FROM users;
SELECT email, "createdAt" FROM users;

-- Count records
SELECT COUNT(*) FROM pages;
SELECT COUNT(*) FROM posts;

-- Exit
\q
```

---

## Method 2: pgAdmin (Web UI)

### Start pgAdmin

```bash
docker-compose -f docker-compose.postgres.yml up -d pgadmin
```

### Access pgAdmin

1. Open browser: http://localhost:5050
2. Login:
   - Email: `admin@admin.com`
   - Password: `admin`

### Add Server Connection

1. Right-click "Servers" → Create → Server
2. **General** tab:
   - Name: `Payload DB`
3. **Connection** tab:
   - Host: `postgres` (or `localhost`)
   - Port: `5432` (internal) or `5433` (external)
   - Username: `payload`
   - Password: `payload`
4. Click **Save**

### Browse Tables

- Servers → Payload DB → Databases → misrut_db → Schemas → public → Tables
- Servers → Payload DB → Databases → synrgy_db → Schemas → public → Tables

---

## Method 3: DBeaver (Recommended GUI)

### Install DBeaver

```bash
# Ubuntu/Debian
sudo snap install dbeaver-ce

# Or download from: https://dbeaver.io/download/
```

### Connect to Database

1. Click **New Database Connection**
2. Select **PostgreSQL**
3. Connection settings:
   - Host: `localhost`
   - Port: `5433`
   - Database: `misrut_db` (or `synrgy_db`)
   - Username: `payload`
   - Password: `payload`
4. Click **Test Connection** → **Finish**

---

## Quick Database Check Script

Create a helper script to quickly view table contents:

```bash
#!/bin/bash
# Save as: scripts/check-db.sh

echo "=== misrut DATABASE ==="
psql -h localhost -p 5433 -U payload -d misrut_db -c "\dt"
echo ""
psql -h localhost -p 5433 -U payload -d misrut_db -c "SELECT COUNT(*) as total_pages FROM pages;"
psql -h localhost -p 5433 -U payload -d misrut_db -c "SELECT COUNT(*) as total_posts FROM posts;"
psql -h localhost -p 5433 -U payload -d misrut_db -c "SELECT email FROM users;"

echo ""
echo "=== synrgy DATABASE ==="
psql -h localhost -p 5433 -U payload -d synrgy_db -c "\dt"
echo ""
psql -h localhost -p 5433 -U payload -d synrgy_db -c "SELECT COUNT(*) as total_pages FROM pages;"
psql -h localhost -p 5433 -U payload -d synrgy_db -c "SELECT COUNT(*) as total_posts FROM posts;"
psql -h localhost -p 5433 -U payload -d synrgy_db -c "SELECT email FROM users;"
```

Make executable:

```bash
chmod +x scripts/check-db.sh
./scripts/check-db.sh
```

---

## Connection Details Summary

| Parameter | Value                      |
| --------- | -------------------------- |
| Host      | `localhost`                |
| Port      | `5433`                     |
| Username  | `payload`                  |
| Password  | `payload`                  |
| Databases | `misrut_db`, `synrgy_db` |

---

## Common Tables

Both databases have the same schema:

- `users` - Admin users
- `pages` - Page content
- `posts` - Blog posts
- `media` - Uploaded files
- `payload_preferences` - User preferences
- `payload_migrations` - Migration history
