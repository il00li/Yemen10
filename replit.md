# Replit Project Documentation

## Overview

This is a full-stack e-commerce application built with React, Express, and PostgreSQL. The application appears to be designed for a Saudi Arabian market (based on Arabic text and Riyal currency), featuring product catalog management, delivery area configuration, and WhatsApp integration for order processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter (lightweight client-side routing)
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Style**: RESTful API endpoints
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot module replacement via Vite integration

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for database migrations
- **In-Memory Fallback**: MemStorage class for development/testing

## Key Components

### Database Schema
Three main entities defined in `shared/schema.ts`:
1. **Products**: Product catalog with pricing in halalas (smallest currency unit)
2. **Delivery Areas**: Geographic delivery zones with fees and timing
3. **Settings**: Key-value configuration storage

### Frontend Components
- **Product Management**: Product display cards with WhatsApp integration
- **Admin Interface**: Modal-based administration for products, delivery areas, and settings
- **Glass UI Effects**: Custom glass-morphism design system
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Backend Services
- **Storage Layer**: Abstracted storage interface (IStorage) with memory and database implementations
- **API Routes**: RESTful endpoints for products, delivery areas, and settings
- **Request Logging**: Custom middleware for API request/response logging

## Data Flow

1. **Client Request**: React components use TanStack Query to fetch data
2. **API Layer**: Express routes handle HTTP requests with validation
3. **Storage Layer**: Abstracted storage interface manages data persistence
4. **Database**: PostgreSQL stores persistent data via Drizzle ORM
5. **Response**: JSON responses with error handling

### Order Processing Flow
1. User selects product from catalog
2. WhatsApp integration generates pre-filled message
3. External WhatsApp conversation handles order completion
4. No internal order management system

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: Via DATABASE_URL environment variable

### UI Framework
- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first styling

### Development Tools
- **Replit Integration**: Custom plugins for development environment
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast bundling for production builds

## Deployment Strategy

### Development
- **Vite Dev Server**: Hot module replacement for frontend
- **tsx**: TypeScript execution for backend
- **Concurrent Serving**: Express serves both API and frontend in development

### Production Build Process
1. **Frontend**: Vite builds optimized React bundle to `dist/public`
2. **Backend**: ESBuild bundles Express server to `dist/index.js`
3. **Static Serving**: Express serves pre-built frontend files
4. **Environment**: NODE_ENV=production for optimizations

### Configuration Requirements
- **DATABASE_URL**: PostgreSQL connection string
- **Environment Variables**: Managed via process.env
- **Port Configuration**: Flexible port binding for hosting platforms

### Architectural Decisions

**Database Choice**: PostgreSQL was chosen for its reliability and JSON support for settings. Drizzle ORM provides type safety while maintaining SQL flexibility.

**State Management**: TanStack Query eliminates the need for complex client-side state management by handling server state synchronization, caching, and error handling.

**Monorepo Structure**: Shared TypeScript types between frontend and backend ensure consistency and reduce duplication.

**WhatsApp Integration**: External messaging platform handles order processing, reducing internal complexity while leveraging familiar user experience in target market.

**Glass Design System**: Custom UI components provide unique visual identity while maintaining accessibility through Radix UI primitives.