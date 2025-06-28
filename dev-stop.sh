#!/bin/bash

# Development stop script for Football Web microservices

echo "🛑 Stopping Football Web Development Environment..."

# Stop development containers
docker-compose -f docker-compose.dev.yml down

echo "✅ Development environment stopped!"
echo ""
echo "💡 To start again, run: ./dev-start.sh"
echo "💡 To remove all data, run: docker-compose -f docker-compose.dev.yml down -v"
