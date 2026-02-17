#!/bin/bash

# Start PostgreSQL (if not already running)
echo "🐘 Starting PostgreSQL..."
docker-compose -f docker-compose.postgres.yml up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be healthy..."
until docker-compose -f docker-compose.postgres.yml exec -T postgres pg_isready -U payload > /dev/null 2>&1; do
  sleep 1
done

echo "✅ PostgreSQL is ready!"

# Start Misrut instance
echo "🚀 Starting Misrut instance on port 3001..."
TENANT_ID=misrut \
  DATABASE_URL="$MISRUT_DATABASE_URL" \
  PAYLOAD_SECRET="$MISRUT_PAYLOAD_SECRET" \
  PORT=3001 \
  NEXT_PUBLIC_SERVER_URL="$MISRUT_NEXT_PUBLIC_SERVER_URL" \
  NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN="$MISRUT_NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN" \
  npm run dev &

MISRUT_PID=$!

# Give Misrut a moment to start
sleep 3

# Start Synrgy instance  
echo "🚀 Starting Synrgy instance on port 3002..."
TENANT_ID=synrgy \
  DATABASE_URL="$SYNRGY_DATABASE_URL" \
  PAYLOAD_SECRET="$SYNRGY_PAYLOAD_SECRET" \
  PORT=3002 \
  NEXT_PUBLIC_SERVER_URL="$SYNRGY_NEXT_PUBLIC_SERVER_URL" \
  NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN="$SYNRGY_NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN" \
  npm run dev &

SYNRGY_PID=$!

echo ""
echo "✅ Multi-instance setup complete!"
echo ""
echo "📍 MISRUT:"
echo "   Admin:    http://localhost:3001/admin"
echo "   Frontend: http://localhost:3001"
echo ""
echo "📍 SYNRGY:"
echo "   Admin:    http://localhost:3002/admin"
echo "   Frontend: http://localhost:3002"
echo ""
echo "📊 PostgreSQL:"
echo "   Port: 5432"
echo "   User: payload"
echo "   Password: payload"
echo ""
echo "🛑 To stop all instances:"
echo "   Press Ctrl+C, then run: docker-compose -f docker-compose.postgres.yml down"
echo ""

# Wait for all background processes
wait $MISRUT_PID $SYNRGY_PID
