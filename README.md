# LexFlow Frontend

> Personal injury practice management system — Web Service (Next.js)

## Overview

LexFlow is a legal practice management platform built for personal injury law firms. This repository contains the **Web Service** — the Next.js application that handles authentication, matter management, document management, time/billing, and the trust accounting UI.

The backend trust accounting engine runs separately in [`lexflow-backend`](https://github.com/BigRigVibeCoder/lexflow-backend).

## Tech Stack

| Layer | Technology | Version |
|:------|:-----------|:--------|
| Framework | Next.js (App Router) | 15+ |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS + shadcn/ui | 3.x |
| API Layer | tRPC | Latest |
| Auth | NextAuth.js + TOTP MFA | Latest |
| ORM | Drizzle ORM | Latest |
| Database | PostgreSQL | 15 |
| Validation | Zod | Latest |
| Testing | Vitest + Playwright | Latest |
| Logging | pino (structured JSON) | Latest |

## Getting Started

### Prerequisites

- Node.js 20 LTS
- PostgreSQL 15 with `lexflow_main` database
- npm

### Setup

```bash
# 1. Clone with submodules
git clone --recurse-submodules https://github.com/BigRigVibeCoder/lexflow-frontend.git
cd lexflow-frontend

# 2. Copy environment variables
cp .env.example .env.local

# 3. Install dependencies
npm install

# 4. Run development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script | Description |
|:-------|:------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checker |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   └── api/
│       └── health/         # Health check endpoint
├── lib/                    # Shared libraries
│   ├── db/                 # Drizzle ORM database connection
│   ├── errors.ts           # ApplicationError base class (GOV-004)
│   └── logger.ts           # pino structured logger (GOV-006)
└── test/                   # Test setup & utilities
```

## CODEX

This project is governed by the [LexFlow CODEX](./codex/CODEX/00_INDEX/MANIFEST.yaml) — a Markdown-based project management operating system. All development follows the governance standards defined in GOV-001 through GOV-008.

## License

Private — proprietary software.
