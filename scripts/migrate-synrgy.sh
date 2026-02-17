#!/bin/bash

# Helper script to run migrations for Synrgy tenant

# Load environment variables
source .env.multi

echo "Running migrations for Synrgy..."

TENANT_ID=synrgy \
  DATABASE_URL="$SYNRGY_DATABASE_URL" \
  PAYLOAD_SECRET="$SYNRGY_PAYLOAD_SECRET" \
  npm run payload migrate

echo "Synrgy migrations complete!"
