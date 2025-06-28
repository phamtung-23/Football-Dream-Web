# Football Management System Backend

A comprehensive NestJS backend application for managing football teams, players, matches, and statistics with Redis caching and PostgreSQL database.

## Features

- 🏈 **Team Management**: Create and manage football teams
- 👥 **Player Management**: Add players with detailed stats and positions
- ⚽ **Match Management**: Schedule and track matches with live scoring
- 📊 **Statistics**: Comprehensive match and player statistics
- 🔐 **Authentication**: JWT-based authentication with role management
- 🚀 **Redis Caching**: High-performance caching layer
- 🐘 **PostgreSQL**: Robust relational database with Prisma ORM
- 📚 **API Documentation**: Auto-generated Swagger documentation
- 🐳 **Docker Support**: Complete Docker Compose setup

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT with Passport
- **Validation**: Class-validator
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose

---

# Football Web - Microservices Architecture

A comprehensive microservices-based football management application built with NestJS, PostgreSQL, Redis, and Docker.

## 📁 Project Structure

```
football-web/
├── 🐳 Docker Compose Files
│   ├── docker-compose.dev.yml      # Development environment
│   └── docker-compose.prod.yml     # Production environment
│
├── ⚙️ Environment Files
│   ├── .env.dev                    # Development configuration
│   └── .env.prod                   # Production configuration
│
├── 🚀 Quick Start Scripts
│   ├── dev-start.sh               # Start development
│   ├── dev-stop.sh                # Stop development
│   ├── prod-start.sh              # Start production
│   └── prod-stop.sh               # Stop production
│
├── 🛠️ Microservices
│   ├── api-gateway/               # API Gateway & Load Balancer
│   ├── auth-service/              # Authentication & Authorization
│   ├── user-service/              # User Management
│   ├── teams-service/             # Teams Management
│   └── nginx/                     # Reverse Proxy
│
└── 📚 Documentation
    ├── DEVELOPMENT.md             # Development guide
    └── README.md                  # This file
```

## 🚀 Quick Start

### Development Environment
```bash
# Start development with hot reload
./dev-start.sh

# Stop development
./dev-stop.sh
```

### Production Environment
```bash
# Start production (optimized)
./prod-start.sh

# Stop production
./prod-stop.sh
```

## 🏗️ Architecture Overview

### Microservices
- **API Gateway** (Port 3000): Routes requests to appropriate services
- **Auth Service** (Port 3001): Handles authentication & JWT tokens
- **User Service** (Port 3002): Manages user profiles & data
- **Teams Service** (Port 3003): Manages teams & related data

### Infrastructure
- **Nginx** (Port 80): Load balancer & reverse proxy
- **PostgreSQL** (Port 5433): Primary database with schema separation
- **Redis** (Port 6380): Caching & message broker
- **PgAdmin** (Port 5050): Database administration
- **Redis Commander** (Port 8081): Redis management

## 🌍 Environment Configurations

### Development Features
- ✅ **Hot Reload**: Code changes trigger automatic restarts
- ✅ **Volume Mounts**: Live editing without rebuilds
- ✅ **MailHog**: Email testing at http://localhost:8025
- ✅ **Debug Logging**: Verbose logs for development
- ✅ **Extended JWT**: 24-hour tokens for easier testing

### Production Features  
- ✅ **Multi-stage Builds**: Optimized Docker images
- ✅ **Security**: Non-root users & minimal attack surface
- ✅ **Performance**: Pre-built apps, no dev dependencies
- ✅ **Monitoring**: Production-ready logging
- ✅ **Real SMTP**: Actual email delivery

## 📋 Service Endpoints

| Service | Development | Production | Description |
|---------|-------------|------------|-------------|
| **Nginx** | http://localhost | http://localhost | Main entry point |
| **API Gateway** | http://localhost:3000 | Internal | API routing |
| **Auth Service** | http://localhost:3001 | Internal | Authentication |
| **User Service** | http://localhost:3002 | Internal | User management |
| **Teams Service** | http://localhost:3003 | Internal | Teams management |
| **PgAdmin** | http://localhost:5050 | http://localhost:5050 | DB admin |
| **Redis Commander** | http://localhost:8081 | http://localhost:8081 | Redis admin |
| **MailHog** | http://localhost:8025 | N/A | Email testing |

## 🗄️ Database Schema

Each service has its own database schema for better isolation:

- **auth**: User authentication, tokens, sessions
- **user**: User profiles, preferences, data  
- **teams**: Teams, players, matches, statistics

## 🔧 Development Workflow

### 1. First Time Setup
```bash
# Clone repository
git clone <repository-url>
cd football-web

# Start development environment
./dev-start.sh
```

### 2. Making Changes
```bash
# Edit any service code
vim ./auth-service/src/auth/auth.service.ts

# Changes automatically reload - no restart needed!
```

### 3. Database Operations
```bash
# Create migration
docker-compose -f docker-compose.dev.yml exec auth-service npx prisma migrate dev

# View database in PgAdmin at http://localhost:5050
```

### 4. Email Testing
```bash
# Send email in your app
# View at http://localhost:8025 (MailHog)
```

### 5. Monitoring
```bash
# View all logs
docker-compose -f docker-compose.dev.yml logs -f

# View specific service
docker-compose -f docker-compose.dev.yml logs -f auth-service
```

## 🚀 Production Deployment

### 1. Environment Setup
```bash
# Edit production configuration
vim .env.prod

# Update SMTP settings for real email
# Update JWT secret for security
# Update database passwords
```

### 2. Deploy
```bash
# Deploy to production
./prod-start.sh

# Monitor deployment
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. Scaling (Future)
```bash
# Scale services (when needed)
docker-compose -f docker-compose.prod.yml up --scale user-service=3
docker-compose -f docker-compose.prod.yml up --scale teams-service=2
```

## 🐛 Troubleshooting

### Common Issues

#### Ports Already in Use
```bash
# Check what's using ports
lsof -i :3000,3001,3002,3003,5433,6380,80

# Kill processes if needed
sudo kill -9 <PID>
```

#### Database Connection Issues
```bash
# Reset database
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up postgres -d

# Wait for postgres to start, then restart services
```

#### Code Changes Not Reflecting
```bash
# Restart specific service
docker-compose -f docker-compose.dev.yml restart auth-service

# Full rebuild if package.json changed
docker-compose -f docker-compose.dev.yml up --build auth-service
```

#### Clean Start
```bash
# Nuclear option - clean everything
docker-compose -f docker-compose.dev.yml down -v
docker system prune -af
./dev-start.sh
```

## 📊 Monitoring & Logging

### Development
```bash
# Real-time logs
docker-compose -f docker-compose.dev.yml logs -f

# Service-specific logs
docker-compose -f docker-compose.dev.yml logs -f api-gateway

# Container stats
docker stats
```

### Production
```bash
# System overview
docker-compose -f docker-compose.prod.yml ps

# Performance monitoring
docker stats

# Log analysis
docker-compose -f docker-compose.prod.yml logs --since=1h
```

## 🔒 Security Considerations

### Development
- Uses weak JWT secrets for easier debugging
- Exposes all service ports for direct access
- Includes development tools in containers

### Production
- Strong JWT secrets (change in .env.prod)
- Services only accessible through Nginx
- Minimal container attack surface
- Non-root user execution

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test in development: `./dev-start.sh`
4. Test in production mode: `./prod-start.sh`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push branch: `git push origin feature/amazing-feature`
7. Open Pull Request

## 📚 Additional Documentation

- [Development Guide](./DEVELOPMENT.md) - Detailed development workflow
- [API Documentation](./api-docs/) - API endpoints & schemas
- [Deployment Guide](./deployment/) - Production deployment steps

## 🏈 Let's Build Something Amazing!

This microservices architecture provides a solid foundation for a scalable football management application. Happy coding! 🚀
