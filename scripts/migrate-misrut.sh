#!/bin/bash

# Helper script to run migrations for Misrut tenant

# Load environment variables
source .env.multi

echo "Running migrations for Misrut..."

TENANT_ID=misrut \
  DATABASE_URL="$MISRUT_DATABASE_URL" \
  PAYLOAD_SECRET="$MISRUT_PAYLOAD_SECRET" \
  npm run payload migrate

echo "Misrut migrations complete!"
