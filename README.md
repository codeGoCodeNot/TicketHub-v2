# TicketHub v2

A production-grade ticket management SaaS built with Next.js 15, TypeScript, and PostgreSQL.

🔗 **Live Demo**: [tickethubv2.johnsenb.dev](https://tickethubv2.johnsenb.dev)

## Features

- **Authentication** — Email, Google, GitHub OAuth via Better Auth
- **Organizations** — Multi-tenant with roles (owner, admin, member), invitations, and permissions
- **Tickets** — Full CRUD with status tracking (OPEN, IN_PROGRESS, DONE), private tickets, ticket-to-ticket references
- **File Attachments** — Upload images and PDFs via AWS S3 with pre-signed URLs
- **Stripe Billing** — Subscriptions, webhooks, auto-deprovisioning on cancel/downgrade
- **REST API** — API key authentication with Argon2 hashing, scopes, revocation, and usage audit trail
- **Activity Log** — Tracks all org events with infinite scroll
- **AI Assistant** — Claude Haiku chatbot with Redis dedup and DB-persisted chat history
- **Background Jobs** — Inngest for transactional emails (invitations, password reset, deprovisioning)
- **Rate Limiting** — IP-based rate limiting via Upstash Redis

## Tech Stack

- **Framework**: Next.js 15 (App Router), TypeScript
- **Database**: PostgreSQL (Supabase), Prisma ORM
- **Auth**: Better Auth
- **Storage**: AWS S3
- **Payments**: Stripe
- **AI**: Anthropic Claude Haiku + Vercel AI SDK
- **Background Jobs**: Inngest
- **Email**: Resend
- **Cache / Rate Limit**: Upstash Redis
- **UI**: Tailwind CSS, shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account
- AWS S3 bucket
- Upstash Redis
- Anthropic API key

### Installation

```bash
git clone https://github.com/codeGoCodeNot/TicketHub-v2
cd TicketHub-v2
pnpm install
```

### Environment Variables

```env
# Database
DATABASE_URL=

# Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

# OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Resend
RESEND_API_KEY=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Anthropic
ANTHROPIC_API_KEY=
```

### Run Locally

```bash
pnpm prisma migrate dev
pnpm dev
```

## Author

**Johnsen Berdin**

- Email: johnsenberdin2930@gmail.com
- GitHub: [@codeGoCodeNot](https://github.com/codeGoCodeNot)
- Website: [johnsenb.dev](https://johnsenb.dev)
