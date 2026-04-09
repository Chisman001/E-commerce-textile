# Bug Solutions & Patterns

This file documents known issues and fixes used in this project.

---

## 1. Clerk + Next.js 14 App Router

**Issue**: `@clerk/nextjs@7` requires Next.js 15+.

**Fix**: Use `@clerk/nextjs@5` which fully supports Next.js 14 App Router.

```bash
npm install "@clerk/nextjs@5"
```

---

## 2. Neon Serverless + Drizzle ORM

**Pattern**: Always import `neon` from `@neondatabase/serverless` and pass it to `drizzle` from `drizzle-orm/neon-http`.

```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

**Note**: Do NOT use `drizzle-orm/neon-serverless` — use `neon-http` for serverless environments.

---

## 3. Drizzle Schema: Numeric fields returned as strings

**Issue**: Drizzle returns `numeric` fields as strings, not numbers.

**Fix**: Always call `parseFloat()` when using numeric values from the DB.

```ts
const price = parseFloat(product.price); // correct
formatNaira(parseFloat(product.price));
```

---

## 4. Clerk Webhook: Missing CLERK_WEBHOOK_SECRET

**Issue**: Webhook route returns 500 if `CLERK_WEBHOOK_SECRET` is not set.

**Fix**: Add `CLERK_WEBHOOK_SECRET=whsec_...` to `.env.local` after creating the webhook endpoint in the Clerk Dashboard.

For local testing, use [ngrok](https://ngrok.com) to expose localhost and register as the webhook URL.

---

## 5. Next.js: Route Group Layout

**Pattern**: The `(main)` route group wraps all public/protected pages with Navbar + Footer + CartSidebar. Sign-in and sign-up pages are outside this group to show a clean auth layout.

---

## 6. Drizzle Kit Push

**Command to push schema to Neon** (no manual SQL needed):

```bash
npm run db:push
```

**Command to seed the database:**

```bash
npm run db:seed
```

---

## 7. Zustand SSR Hydration Mismatch

**Issue**: Zustand `persist` middleware can cause hydration mismatch with SSR.

**Fix**: The cart store uses `partialize` to only persist `items`. The `isOpen` state is intentionally not persisted to avoid hydration issues.

---

## 8. Next.js Image: External domains

**Issue**: `next/image` blocks external image URLs by default.

**Fix**: Add `remotePatterns` to `next.config.js`:

```js
images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
  ],
},
```

---

## 9. Clerk Auth in Server Components

**Pattern**: Use `auth()` from `@clerk/nextjs/server` in Server Components and API routes:

```ts
import { auth } from "@clerk/nextjs/server";
const { userId } = auth();
if (!userId) redirect("/sign-in");
```

Use `useUser()` or `useAuth()` hooks only in Client Components.

---

## 10. Drizzle `and()` with dynamic conditions

**Pattern**: Build conditions as an array and spread into `and()`:

```ts
const conditions = [eq(products.isActive, true)];
if (category) conditions.push(eq(products.categoryId, categoryId));
const result = await db.select().from(products).where(and(...conditions));
```

---

## 11. Shop filters: `useSearchParams()` out of sync with Server Components

**Issue**: A client filter sidebar used `useSearchParams()` for “selected” styles while the product list and title came from server `searchParams`. After `router.push`, highlights could show the previous URL until a full refresh.

**Fix**: Pass the same `searchParams` fields from the Server Component into the client filter component as props, and build `router.push` query strings with a small helper from those props (do not read the live URL for UI state).

---

## 12. Shop grid: stale card images after `router.push`

**Issue**: After changing shop filters via `router.push`, product titles and counts update from the server but `next/image` on cards can keep showing the previous category’s pictures until a full page refresh.

**Fix**:

1. Give `<Image>` a `key` tied to the displayed URL in `ProductCard` so the image remounts when `src` changes, for example:

```tsx
key={`${product.id}-${product.images[0]}`}
```

2. Optionally pass `key={shopProductGridKey(searchParams)}` on `ProductGrid` in the shop page so the grid subtree remounts when any shop query param changes.

3. Call `router.refresh()` after each `router.push` from [`ShopFilters`](src/components/shop/shop-filters.tsx) so the App Router refetches RSC for `/shop` with the new query string.

4. On the shop page, set `export const dynamic = "force-dynamic"` so the listing is not served from a stale static snapshot.

---

## 13. Admin product images: PATCH replaces the full array

**Issue**: The admin form only sent locally queued URLs. Without loading existing images from the DB, saving could overwrite the product with an incomplete list, or users left before saving and expected uploads to persist.

**Fix**: `GET /api/admin/products/[slug]` returns `{ slug, name, images }` for admins. The product images form uses **Load product** to fill the list, then uploads append; **Save** still replaces `products.images` with the full array in one `PATCH`.

---

## 14. Debug: shop categories vs Neon mismatch

**Tool**: In development only, `GET /api/debug/categories` returns `{ count, databaseHost, categories }` from the same `db` as the app. Compare `databaseHost` and slugs to the Neon branch you query in the SQL editor. If they differ, `DATABASE_URL` or branch selection is wrong.

**Note**: Route returns 404 in production. Clerk allows `/api/debug/(.*)` as a public route for local checks.


