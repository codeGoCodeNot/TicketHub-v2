# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Next.js dev server on port 3000
pnpm build            # Production build
pnpm lint             # ESLint
pnpm type             # TypeScript type-check (tsc --noEmit)
pnpm email:dev        # React Email preview server
pnpm stripe:seed      # Seed Stripe products/prices

# Database
pnpm prisma migrate dev    # Apply pending migrations
pnpm prisma studio         # Open Prisma visual browser
```

No test suite is configured — quality relies on TypeScript strict mode + ESLint.

## Architecture Overview

Single Next.js 16 (App Router) application. All source lives in `src/`.

**Stack:**
- **Framework**: Next.js 16 with React 19, React Compiler enabled, server actions body limit 4 MB
- **Database**: PostgreSQL via Prisma 7 with pg adapter; `DATABASE_URL` for pooler, `DIRECT_URL` for direct connection (Supabase)
- **Auth**: Better Auth v1.5.5 with Prisma adapter — email/password (Argon2), Google OAuth, GitHub OAuth, Organizations plugin (multi-tenant), Admin plugin
- **AI**: Claude Haiku 4.5 via `@ai-sdk/anthropic` + Vercel AI SDK for streaming chat
- **Payments**: Stripe subscriptions — Free / Basic ($1.99/mo) / Business ($4.99/mo)
- **Email**: Resend + React Email templates
- **Background jobs**: Inngest (email verification, password reset, invitation, Stripe deprovisioning)
- **File storage**: AWS S3 (ap-southeast-2) with presigned URLs
- **Caching / Rate limiting**: Upstash Redis (IP-based via `src/lib/ratelimit.ts`)
- **UI**: Tailwind CSS v4, shadcn/ui (Radix primitives), Phosphor icons, Sonner toasts

## Source Layout

```
src/
├── app/
│   ├── (authenticated)/   # Protected routes (layout enforces auth + active org)
│   └── api/               # auth, stripe webhook, chat, s3, tickets
├── components/            # Shared UI: ui/, form/, sidebar/, icons/, theme/
├── emails/                # Account/org-level React Email templates
├── features/              # Domain modules (see below)
├── lib/                   # Singletons & cross-cutting: auth.ts, prisma.ts, inngest.ts, stripe/, aws.ts, ratelimit.ts
├── utils/                 # Pure helpers: password.ts (Argon2), currency.ts, get-ip.ts, url.ts
└── path.ts                # Type-safe route constants for all app pages
```

**Feature folder convention** — each domain under `src/features/<name>/` may contain:
```
actions/      # "use server" mutations
components/   # React components
data/         # Raw Prisma queries
queries/      # Read-only server operations
emails/       # Domain email templates
inngest/      # Inngest job definitions
```

## Key Patterns

### Server Actions
All mutations are `"use server"` functions. Standard pattern:
1. Validate input with Zod
2. Call `getAuthOrRedirect()` to get user + active org (redirects if unauthenticated)
3. Prisma mutation
4. Write activity log entry
5. `revalidatePath()` + optionally `setCookieByKey()` to surface a toast

### Data Access
- **Queries** (`queries/`) are server-only functions returning data to Server Components.
- **Data** (`data/`) holds raw Prisma calls shared across queries and actions.
- `getSession()` (src/lib/get-session.ts) is a `React.cache` wrapper — one DB hit per request.
- `getAuth()` (src/lib/get-auth.ts) extracts the user from the session.

### Multi-tenancy
Routes under `(authenticated)/` are scoped to an active organization stored in `session.activeOrganizationId`. `getAuthOrRedirect()` validates the full chain: user → email verified → org exists → active org set.

### Ticket Model
Tickets belong to an org and optionally reference another ticket (self-join). Status enum: `OPEN | IN_PROGRESS | DONE`. `bounty` stored in cents (use `src/utils/currency.ts` converters). `private` flag gates visibility by plan.

### Credentials (API Keys)
Secret is generated once and returned to the user; only the Argon2 hash is stored. Revocation is soft-delete via `revokedAt`. Every API request appends a `CredentialUsage` row for auditing.

### Stripe Billing
Webhook at `/api/stripe` handles `customer.subscription.*` events. Plan limits: Free = 1 member, Basic = 3, Business = unlimited. Downgrade/cancellation triggers Inngest job to deprovision excess members and send notification emails.

### Chat (AI)
`POST /api/chat` authenticates the user, deduplicates the request via a Redis hash of the user message (24 h TTL), calls Claude Haiku with a TicketHub system prompt, streams the response, and persists both the user message and assistant reply to `chatMessage`.

## Path Aliases

`@/*` maps to `src/*` (configured in `tsconfig.json` and Next.js).

## Environment Variables

Required variables (see `environment.d.ts` for the full typed list):
- `DATABASE_URL`, `DIRECT_URL` — PostgreSQL (pooled + direct)
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_BUCKET_NAME`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `RESEND_API_KEY`
- `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`
- `ANTHROPIC_API_KEY`
