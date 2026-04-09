# Textile Store

E-commerce storefront for premium Nigerian textiles (Ankara, lace, chiffon, Aso-Oke, George, and related categories). Built with **Next.js 14** (App Router), **PostgreSQL** via **Neon**, and **Clerk** authentication.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| UI | [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/) |
| Components | [Radix UI](https://www.radix-ui.com/) primitives, [class-variance-authority](https://cva.style/), `clsx`, `tailwind-merge` |
| Icons | [Lucide React](https://lucide.dev/) |
| Auth | [Clerk](https://clerk.com/) (`@clerk/nextjs`, route protection in middleware) |
| Database | [PostgreSQL](https://www.postgresql.org/) via [Neon serverless](https://neon.tech/) + [@neondatabase/serverless](https://github.com/neondatabase/serverless) |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) + [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) |
| Validation | [Zod](https://zod.dev/) |
| Client state | [Zustand](https://zustand-demo.pmnd.rs/) |
| Media | [Cloudinary](https://cloudinary.com/) (admin image uploads; `res.cloudinary.com` allowed in `next.config.mjs`) |
| Webhooks | [Svix](https://www.svix.com/) (Clerk webhook verification) |

**Remote images:** Unsplash and Cloudinary are configured in `next.config.mjs`.

## Features (high level)

- Product catalog with categories, pricing, stock, and rich product fields (material, pattern, color, unit, etc.).
- User profiles and orders persisted in Postgres (see `src/db/schema.ts`).
- Protected routes with Clerk; public shop/cart and auth pages defined in `src/middleware.ts`.
- Admin flows (e.g. product images) with server-side Cloudinary upload API.

## Prerequisites

- **Node.js** 18+ (recommended: match Vercel/Next 14 expectations)
- **npm** (or pnpm/yarn if you prefer—adjust commands)
- Accounts / keys: **Neon** (Postgres URL), **Clerk** (app + webhook secret if using webhooks), **Cloudinary** (for uploads), optional comma-separated **Clerk user IDs** for admin allowlisting (`ADMIN_USER_IDS` in `src/lib/admin.ts`)

## Getting started

```bash
git clone <your-repo-url>
cd textile-store
npm install
