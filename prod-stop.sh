#!/bin/bash

# Production stop script for Football Web microservices

echo "🛑 Stopping Football Web Production Environment..."

# Stop production containers
docker-compose -f docker-compose.prod.yml down

echo "✅ Production environment stopped!"
echo ""
echo "💡 To start again, run: ./prod-start.sh"
echo "💡 To remove all data, run: docker-compose -f docker-compose.prod.yml down -v"
echo "💡 To view logs, run: docker-compose -f docker-compose.prod.yml logs"
