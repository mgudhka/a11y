# 🌐 Enterprise Digital Accessibility SaaS Platform

A comprehensive, multi-tenant enterprise platform for detecting, reporting, and remediating web accessibility issues using automated scanning with Playwright, axe-core, and Siteimprove Alfa.

## 🏗️ Architecture

This platform is built as a monorepo with separate backend and frontend applications:

### Backend (NestJS + TypeScript)
- **Framework**: NestJS with TypeORM and PostgreSQL
- **Queue System**: Redis + BullMQ for background job processing  
- **Scanning Engines**: Playwright with axe-core and Siteimprove Alfa
- **Storage**: S3-compatible (MinIO) for artifacts and screenshots
- **API**: REST API with OpenAPI/Swagger documentation

### Frontend (Next.js + React)
- **Framework**: Next.js 15 with React 18
- **Styling**: Tailwind CSS with DaisyUI components
- **Authentication**: NextAuth.js with multiple providers
- **State Management**: SWR for data fetching

### Infrastructure
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis 7
- **Storage**: MinIO (S3-compatible)
- **Containerization**: Docker & Docker Compose

## 📊 Core Features

### 🔍 Accessibility Scanning
- **Web Crawling**: Automated discovery and scanning of web pages
- **URL Lists**: Direct scanning of specific URLs
- **Multiple Engines**: axe-core and Siteimprove Alfa integration
- **Real-time Processing**: Background job queue with progress tracking
- **Result Normalization**: Unified findings across different engines

### 📈 Reporting & Analytics
- **Executive Dashboard**: High-level metrics and compliance scores
- **Developer Dashboard**: Detailed findings with remediation guidance
- **Project Manager Dashboard**: Progress tracking and resource allocation
- **Priority Scoring**: Five-factor algorithm for issue prioritization

### ⚖️ Governance & Compliance
- **Waivers**: Request and approve exceptions for specific findings
- **Suppressions**: Rule-based filtering of findings
- **Audit Logging**: Complete activity tracking for compliance
- **WCAG Compliance**: Standards-based reporting (A, AA, AAA)

### 🔧 CI/CD Integration
- **CLI Tool**: Standalone scanner for build pipelines
- **Configurable Thresholds**: Fail builds based on accessibility issues
- **API Integration**: Programmatic access to all platform features
- **Webhooks**: Real-time notifications for scan completion

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/mgudhka/a11y.git
cd a11y
```

### 2. Environment Setup

```bash
# Copy environment configuration
cp .env.a11y .env

# Install dependencies
npm install
cd backend && npm install && cd ..
```

### 3. Start Services with Docker

```bash
# Start all services (PostgreSQL, Redis, MinIO, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Initialize Database

```bash
# Run database migrations
cd backend
npm run migration:run

# Seed initial data (optional)
npm run seed
```

### 5. Access the Platform

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **MinIO Console**: http://localhost:9001 (admin/admin)
- **Test Site**: http://localhost:8080

## 📁 Project Structure

```
a11y/
├── backend/                    # NestJS backend application
│   ├── src/
│   │   ├── entities/          # TypeORM database entities
│   │   ├── modules/           # Feature modules
│   │   │   ├── scanning/      # Scanning engine and jobs
│   │   │   ├── findings/      # Accessibility findings
│   │   │   ├── projects/      # Project management
│   │   │   └── ...
│   │   ├── config/           # Configuration files
│   │   └── database/         # Migrations and seeds
│   ├── Dockerfile
│   └── package.json
├── frontend/                  # Next.js frontend (to be implemented)
├── fixture-site/             # Test site with accessibility issues
│   ├── index.html
│   └── Dockerfile
├── docker-compose.yml        # Development orchestration
├── .env                     # Environment configuration
└── README.md
```

**Enterprise Digital Accessibility SaaS Platform** - Building inclusive web experiences through automated accessibility testing and continuous compliance monitoring.
