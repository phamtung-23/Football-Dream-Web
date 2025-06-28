#!/bin/bash

# Database Migration Script for Development Environment
# This script runs Prisma migrations for all services

echo "🗄️  Running database migrations for all services..."

# Check if development environment is running
if ! docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    echo "❌ Development environment is not running. Please start it first with ./dev-start.sh"
    exit 1
fi

echo "📊 Running Auth Service migrations..."
docker-compose -f docker-compose.dev.yml exec auth-service npx prisma migrate deploy

echo "👥 Running User Service migrations..."
docker-compose -f docker-compose.dev.yml exec user-service npx prisma migrate deploy

echo "⚽ Running Teams Service migrations..."
docker-compose -f docker-compose.dev.yml exec teams-service npx prisma migrate deploy

echo "✅ All migrations completed!"

echo ""
echo "📋 Database schemas created:"
echo "   🔐 auth - Authentication tables"
echo "   👥 user - User management tables"
echo "   ⚽ teams - Teams and matches tables"

echo ""
echo "🌐 You can now access:"
echo "   📊 PgAdmin: http://localhost:5050"
echo "   🔗 API: http://localhost/api/v1/"
