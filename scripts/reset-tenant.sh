#!/bin/bash

# Reset a tenant's database completely
# Usage: ./scripts/reset-tenant.sh misrut OR ./scripts/reset-tenant.sh synrgy

if [ -z "$1" ]; then
  echo "Usage: ./scripts/reset-tenant.sh <tenant_id>"
  echo "Example: ./scripts/reset-tenant.sh misrut"
  exit 1
fi

TENANT_ID=$1

# Load environment variables
source .env.multi

if [ "$TENANT_ID" == "misrut" ]; then
  DATABASE_URL="$MISRUT_DATABASE_URL"
elif [ "$TENANT_ID" == "synrgy" ]; then
  DATABASE_URL="$SYNRGY_DATABASE_URL"
else
  echo "❌ Unknown tenant: $TENANT_ID"
  exit 1
fi

echo "⚠️  WARNING: This will DELETE ALL DATA for tenant: $TENANT_ID"
read -p "Are you sure? (type 'yes' to continue): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Aborted."
  exit 0
fi

# Drop and recreate the database
echo "📦 Creating ${TENANT_ID}_db..."
docker-compose -f docker-compose.postgres.yml exec -T postgres psql -U payload -c "CREATE DATABASE ${TENANT_ID}_db;"
docker-compose -f docker-compose.postgres.yml exec -T postgres psql -U payload -c "GRANT ALL PRIVILEGES ON DATABASE ${TENANT_ID}_db TO payload;"

echo "✅ Database reset complete!"
echo ""
echo "Next steps:"
echo "1. Run migrations: ./scripts/migrate-${TENANT_ID}.sh"
echo "2. Start the instance and create a new admin user"
