#!/bin/bash

# Production startup script for Football Web microservices

echo "🏈 Starting Football Web Production Environment..."

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    echo "❌ .env.prod file not found!"
    echo "Please create .env.prod file with production configurations"
    exit 1
fi

# Copy production environment variables
cp .env.prod .env
echo "✅ Production environment variables loaded"

# Start production containers
echo "🚀 Starting production containers..."
docker-compose -f docker-compose.prod.yml up --build -d

echo "🎉 Production environment started!"
echo ""
echo "📋 Available services:"
echo "   🌐 Nginx (Load Balancer): http://localhost"
echo "   🗄️  PgAdmin: http://localhost:5050"
echo "   📮 Redis Commander: http://localhost:8081"
echo ""
echo "💡 Production Tips:"
echo "   - Services are running in optimized mode"
echo "   - Use 'docker-compose -f docker-compose.prod.yml logs [service]' to view logs"
echo "   - Use './prod-stop.sh' to stop all services"
echo "   - Monitor services with 'docker-compose -f docker-compose.prod.yml ps'"
