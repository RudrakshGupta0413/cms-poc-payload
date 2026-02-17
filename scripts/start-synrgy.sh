#!/bin/bash

# Start Synrgy instance individually
# This allows interacting with the terminal for schema prompts

# Load environment variables
source .env.multi

echo "🚀 Starting Synrgy instance on port 3002..."
TENANT_ID=synrgy \
  DATABASE_URL="$SYNRGY_DATABASE_URL" \
  PAYLOAD_SECRET="$SYNRGY_PAYLOAD_SECRET" \
  PORT=3002 \
  NEXT_PUBLIC_SERVER_URL="$SYNRGY_NEXT_PUBLIC_SERVER_URL" \
  NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN="$SYNRGY_NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN" \
  npm run dev
