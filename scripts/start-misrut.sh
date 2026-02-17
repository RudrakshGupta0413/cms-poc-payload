#!/bin/bash

# Start Misrut instance individually
# This allows interacting with the terminal for schema prompts

# Load environment variables
source .env.multi

echo "🚀 Starting Misrut instance on port 3001..."
TENANT_ID=misrut \
  DATABASE_URL="$MISRUT_DATABASE_URL" \
  PAYLOAD_SECRET="$MISRUT_PAYLOAD_SECRET" \
  PORT=3001 \
  NEXT_PUBLIC_SERVER_URL="$MISRUT_NEXT_PUBLIC_SERVER_URL" \
  NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN="$MISRUT_NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN" \
  npm run dev
