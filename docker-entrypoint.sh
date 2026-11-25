#!/bin/sh
set -e

if [ ! -d "/app/node_modules/next" ]; then
  echo "📦 Installing npm dependencies..."
  npm install
fi

echo "⏳ Checking PostgreSQL connection (${DB_HOST:-postgres15}:${DB_PORT:-5432})..."
for i in $(seq 1 15); do
  if pg_isready -h "${DB_HOST:-postgres15}" -p "${DB_PORT:-5432}" -U "${DB_USER:-postgres}" >/dev/null 2>&1; then
    echo "✅ PostgreSQL container (${DB_HOST:-postgres15}) is reachable!"
    break
  fi
  echo "Waiting for PostgreSQL... ($i/15)"
  sleep 1
done

exec "$@"
