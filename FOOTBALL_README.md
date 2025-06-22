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

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Quick Start

### 1. Clone and Setup

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Update the `.env` file with your preferred settings.

### 3. Start Infrastructure Services

Start PostgreSQL and Redis using Docker Compose:

```bash
# From the root directory (where docker-compose.yml is located)
cd ..
docker-compose up -d postgres redis
```

### 4. Database Setup

Generate Prisma client and run migrations:

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### 5. Start the Application

```bash
npm run start:dev
```

The application will be available at:
- **API**: http://localhost:3000/api/v1
- **Swagger Documentation**: http://localhost:3000/api/docs

## Available Services

### Infrastructure Services (Docker Compose)

```bash
# Start all services
docker-compose up -d

# Start specific services
docker-compose up -d postgres redis

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Available Services:**
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **pgAdmin**: http://localhost:5050 (admin@football.com / admin123)
- **Redis Commander**: http://localhost:8081

### Development Commands

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:reset       # Reset database
npm run db:studio          # Open Prisma Studio

# Testing
npm run test               # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:cov          # Test coverage

# Code Quality
npm run lint              # ESLint
npm run format            # Prettier
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Teams
- `GET /api/v1/teams` - Get all teams
- `GET /api/v1/teams/:id` - Get team by ID

### Players
- Coming soon...

### Matches
- Coming soon...

## Database Schema

The application uses a comprehensive database schema for football management:

- **Users**: Authentication and user management
- **Teams**: Football teams with detailed information
- **Players**: Player profiles with positions and statistics
- **Matches**: Match scheduling and results
- **Leagues**: League management
- **MatchStats**: Detailed match statistics
- **Comments**: Match discussions

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `NODE_ENV` | Environment | development |
| `PORT` | Application port | 3000 |
| `API_PREFIX` | API route prefix | api/v1 |

## Project Structure

```
src/
├── auth/              # Authentication module
│   ├── dto/          # Data transfer objects
│   ├── guards/       # Auth guards
│   └── strategies/   # Passport strategies
├── teams/            # Teams module
├── players/          # Players module
├── matches/          # Matches module
├── prisma/           # Prisma service
└── main.ts           # Application entry point

prisma/
├── schema.prisma     # Database schema
└── migrations/       # Database migrations
```

## License

This project is licensed under the MIT License.
