#!/bin/bash

# Development startup script for Football Web microservices

echo "🏈 Starting Football Web Development Environment..."

# Check if .env.dev exists
if [ ! -f .env.dev ]; then
    echo "❌ .env.dev file not found!"
    echo "Please create .env.dev file with development configurations"
    exit 1
fi

# Copy development environment variables
cp .env.dev .env
echo "✅ Development environment variables loaded"

# Start development containers
echo "🚀 Starting development containers..."
docker-compose -f docker-compose.dev.yml up -d

echo "🎉 Development environment started!"
echo ""
echo "📋 Available services:"
echo "   🌐 Nginx (Load Balancer): http://localhost"
echo "   🚪 API Gateway: http://localhost:3000"
echo "   🔐 Auth Service: http://localhost:3001"
echo "   👥 User Service: http://localhost:3002"
echo "   ⚽ Teams Service: http://localhost:3003"
echo "   🗄️  PgAdmin: http://localhost:5050"
echo "   📮 Redis Commander: http://localhost:8081"
echo "   📧 MailHog (Email testing): http://localhost:8025"
echo ""
echo "💡 Tips:"
echo "   - Code changes will automatically reload"
echo "   - Use 'docker-compose -f docker-compose.dev.yml logs [service]' to view logs"
echo "   - Use 'docker-compose -f docker-compose.dev.yml down' to stop all services"
