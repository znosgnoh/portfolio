# Project Rules

1. **Architecture & Framework:**
   - Use ONLY Next.js App Router under `src/app/` (Next.js 16 + React 19). DO NOT use the Pages router.
   - Prefer Server Components for data fetching and metadata. Use Client Components (`"use client"`) only when interactivity is required (forms, hooks, ScrollReveal, session UI).
   - Follow the existing pattern: server `page.tsx` fetches data → client `*Page.tsx` renders styled UI.
   - `params` and `searchParams` are async — always `await` them in pages and route handlers.
   - Prefer `next/dynamic` for heavy client-only libs (animejs Loader, below-fold sections). Use `React.cache()` for repeated server content reads. Pass slim props via `toClientContent()`.

2. **Styling:**
   - Use ONLY styled-components + the existing theme (`src/styles/theme.ts`, `variables.ts`, `mixins.ts`). Do not introduce Tailwind or new CSS frameworks.
   - Preserve the Brittany Chiang design language (navy + `#64ffda` green accent, Calibre/SF Mono). Do not replace with generic AI portfolio aesthetics (purple gradients, cream + terracotta, Inter-only type).
   - Put global CSS only in `GlobalStyle` / shared style modules — avoid one-off CSS files.

3. **TypeScript & Types:**
   - 100% TypeScript. Avoid `any` where practical (existing NextAuth session casts are an exception until types are tightened).
   - Align API payloads with Prisma models (`isPublic`, `StoryEvent`, Thought `content`, etc.).

4. **Content sources:**
   - Portfolio core (jobs, featured, projects, pensieve posts) stays in `content/**` markdown unless explicitly building a CMS.
   - Thoughts, notes, photos, and story use Prisma / Postgres.
   - Load markdown only through `src/lib/content.ts` helpers.

5. **API & Security:**
   - Never hardcode secrets (`NEXTAUTH_SECRET`, DB URLs, Google private key). Use `.env` / Vercel env.
   - Mutating admin routes must call `getServerSession(authOptions)` and return 401 when unauthenticated.
   - Return standard HTTP status codes and clear JSON `{ error: string }` so the admin UI can show feedback.
   - Prefer filtering `isPublic` on any public-facing notes/thoughts API responses.

6. **Database:**
   - Use the Prisma singleton from `src/lib/prisma.ts` (`@/generated/prisma/client` + `@prisma/adapter-pg`).
   - After schema changes: `npx prisma generate`, then `npx prisma db push` (or migrate). Seed admin with `npm run db:seed`.
   - Do not import `@prisma/client` directly — client is generated under `src/generated/prisma`.
