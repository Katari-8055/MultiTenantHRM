#!/bin/sh

# Wait for DB to be ready (handled by docker-compose healthcheck mostly, but for safety)
echo "Waiting for database to be ready..."

# Run prisma migration or db push
echo "Pushing database schema..."
npx prisma db push || echo "⚠️ Prisma db push failed (check DIRECT_URL / IPv6 connectivity), starting server anyway..."

# Start the application
echo "Starting backend server..."
node index.js
