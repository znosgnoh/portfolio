# Project: Nosgnoh Life — Personal Portfolio

## 1. Overview

Personal portfolio and life site for **Nosgnoh** (package: `nosgnoh-life`), live at [nosgnoh.vercel.app](https://nosgnoh.vercel.app/). Originally based on Brittany Chiang’s Gatsby portfolio design; **migrated to Next.js 14 App Router**.

The site combines:

| Area | Source | Purpose |
| --- | --- | --- |
| Homepage | Markdown (`content/`) | Hero, About, Experience, Featured, Projects, Contact |
| Pensieve (blog) | Markdown (`content/posts/`) | Long-form posts with tags |
| Archive | Markdown (`content/projects/`) | Full project table |
| Thoughts | Postgres | Short-form public musings |
| Notes | Postgres | Longer technical notes with slugs |
| Photos | Google Drive → Postgres | Album gallery + Drive sync |
| Story | Postgres | Personal timeline events |
| Admin | NextAuth credentials | CRUD for thoughts, notes, photos, story |

**Important:** Root `README.md` still documents Gatsby/yarn. Ignore it for agent work — follow this file, `package.json`, and `docs/SETUP.md`.

---

## 2. Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | **Next.js 16** (App Router under `src/app/`, Turbopack default) |
| UI | React 19, TypeScript 5.9 |
| Styling | **styled-components 6** (SWC compiler flag; CSS variables + theme) |
| Fonts | `next/font/local` — Calibre + SF Mono (`src/lib/fonts.ts`) |
| Database | PostgreSQL via **Prisma 7** + `@prisma/adapter-pg` (`DATABASE_URL` runtime; `DIRECT_URL` for CLI) |
| Auth | **next-auth 4** — Credentials + JWT (not Auth.js v5) |
| Markdown | gray-matter + remark + remark-html |
| Drive | googleapis (service account, readonly) |
| Animation | scrollreveal (dynamic import), animejs **v4** (Loader only), react-transition-group |
| Lint | ESLint 9 flat config (`eslint.config.mjs`); `npm run lint` → `eslint .` |
| Deploy | Vercel |
| Node | `.nvmrc` → **22** (Next 16 requires ≥20.9) |

Path aliases (`tsconfig.json`): `@/*`, `@/components/*`, `@/styles/*`, `@/hooks/*`, `@/utils/*`, `@/lib/*`, `@/config`, `@/fonts/*`.

---

## 3. Directory Structure

```
portfolio/
├── content/                 # Static markdown (portfolio + blog)
│   ├── featured/            # Featured projects (folder + index.md + images)
│   ├── jobs/                # Work experience (folder + index.md)
│   ├── posts/               # Blog posts (folder + index.md)
│   └── projects/            # Other projects (flat *.md)
├── docs/
│   ├── Features.md          # Product requirements (includes planned items)
│   ├── IMPLEMENTATION_PLAN.md
│   └── SETUP.md             # Local env setup
├── prisma/
│   ├── schema.prisma
│   └── seed.ts              # Admin user upsert
├── static/                  # OG images (og.png)
├── src/
│   ├── app/                 # App Router pages + API routes
│   ├── components/          # Layout chrome + homepage sections + icons
│   ├── config.ts            # email, socials, navLinks, colors, srConfig
│   ├── fonts/               # Calibre + SFMono font files
│   ├── hooks/               # scroll direction, reduced motion, click outside
│   ├── lib/                 # prisma, auth, content, google-drive, registry
│   ├── styles/              # GlobalStyle, theme, variables, mixins, Prism
│   ├── types/styled.d.ts
│   └── utils/
└── .env.example
```

There is **no** `middleware.ts`. Admin protection is client-side (`useSession`) plus `getServerSession` on mutating APIs.

---

## 4. Database Schema (Prisma)

Datasource: PostgreSQL. Connection URLs live in `prisma.config.ts` (CLI) and the `@prisma/adapter-pg` client (runtime) — not in the schema `url` fields.

**Client:** generated to `src/generated/prisma` (`provider = "prisma-client"`). Import from `@/generated/prisma/client`.

### User

| Field | Type | Notes |
| --- | --- | --- |
| `id` | String (cuid) | PK |
| `email` | String | Unique |
| `name` | String? | |
| `passwordHash` | String | bcrypt |
| `role` | Enum | `ADMIN` \| `USER` (default `ADMIN`) |
| `thoughts`, `notes` | Relations | |

### Thought

Short-form musings (tweet-like).

| Field | Type | Notes |
| --- | --- | --- |
| `id` | String (cuid) | PK |
| `content` | String | Body (API max 2000 chars) |
| `mood` | String? | Optional |
| `tags` | String[] | |
| `isPublic` | Boolean | Default `true` |
| `authorId` | String | FK → User |

### Note

Longer technical notes with URL slugs.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | String (cuid) | PK |
| `title` | String | |
| `content` | String | |
| `slug` | String | Unique; slugified from title on create |
| `category` | String? | |
| `tags` | String[] | |
| `isPublic` | Boolean | Default `true`; API may use `published` → maps to `isPublic` |
| `authorId` | String | FK → User |

### Photo

Cached Google Drive image metadata.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | String (cuid) | PK |
| `title`, `description` | String? | |
| `driveFileId` | String | Unique Drive file id |
| `url` | String | Prefer `webContentLink`, else `https://drive.google.com/uc?id=...` |
| `thumbnailUrl` | String? | |
| `width`, `height` | Int? | |
| `takenAt` | DateTime? | |
| `albumId` | String? | FK → Album |

### Album

| Field | Type | Notes |
| --- | --- | --- |
| `id` | String (cuid) | PK |
| `name` | String | |
| `slug` | String | Unique |
| `description` | String? | |
| `coverPhotoId` | String? | Set to first photo on sync if empty |
| `driveFolderId` | String? | Unique; used by sync |

### StoryEvent

Personal timeline entry.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | String (cuid) | PK |
| `title` | String | Required |
| `description` | String? | |
| `date` | DateTime | Required |
| `category` | String | Required (e.g. Education, Career, Travel) |
| `icon`, `imageUrl` | String? | |
| `order` | Int | Default `0` |

**Seed (`prisma/seed.ts`):** upserts admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (bcrypt cost 12), name `"Nosgnoh"`, role `ADMIN`.

---

## 5. Application Routes

Pattern: thin **server** `page.tsx` (data fetch + metadata) → client `*Page.tsx` (styled UI).

| Path | Type | Description |
| --- | --- | --- |
| `/` | Page | Homepage — Hero → About → Jobs → Featured → Projects → Contact |
| `/archive` | Page | All projects table (markdown) |
| `/pensieve` | Page | Blog index + tag counts |
| `/pensieve/[slug]` | Page | Post detail (`generateStaticParams`) |
| `/pensieve/tags/[tag]` | Page | Posts filtered by tag |
| `/thoughts` | Page | Public thoughts (Prisma; empty if DB down) |
| `/notes` | Page | Public notes list |
| `/notes/[slug]` | Page | Note detail; 404 if private/missing |
| `/photos` | Page | Albums grid (up to 4 photos each preview) |
| `/photos/[slug]` | **Missing** | Linked in UI/docs but not implemented yet |
| `/story` | Page | Timeline (`StoryEvent` by date desc) |
| `/admin` | Page | Dashboard (client session gate) |
| `/admin/login` | Page | Credentials form |
| `/admin/thoughts` | Page | Thoughts CRUD |
| `/admin/notes` | Page | Notes CRUD |
| `/admin/photos` | Page | Create album + Drive sync |
| `/admin/story` | Page | Story timeline CRUD |

Site identity / nav: `src/config.ts` (`email`, `socialMedia`, `navLinks`, `colors`, `srConfig`).

---

## 6. API Routes

| Method | Path | Auth | Behavior |
| --- | --- | --- | --- |
| * | `/api/auth/[...nextauth]` | — | NextAuth handler |
| GET | `/api/thoughts` | Public | Public thoughts, desc, take 50 |
| POST | `/api/thoughts` | Session | Create; content required, max 2000 |
| PUT/DELETE | `/api/thoughts/[id]` | Session | Update / delete |
| GET | `/api/notes` | Public | **Returns all notes** (no `isPublic` filter — admin-oriented) |
| POST | `/api/notes` | Session | Create; slugify title; `published` → `isPublic` |
| PUT/DELETE | `/api/notes/[id]` | Session | Update / delete |
| GET | `/api/photos` | Public | Albums + photo counts |
| POST | `/api/photos` | Session | Create album (name, description, driveFolderId) |
| POST | `/api/photos/sync` | Session | List Drive images for album folder; upsert Photos |
| GET | `/api/story` | Public | All story events by date desc |
| POST | `/api/story` | Session | Create (title, date, category required) |
| PUT/DELETE | `/api/story/[id]` | Session | Update / delete |

Auth pattern: `getServerSession(authOptions)` → 401 if no `session.user`. Author id from `(session.user as any).id`.

**Not implemented (planned in docs):** `/api/posts`, `/api/projects`, markdown CMS for blog/jobs/projects, NextAuth middleware for `/admin/*`.

---

## 7. Auth (NextAuth)

**Config:** `src/lib/auth.ts`

- Provider: Credentials (email + password)
- Lookup `User` by email; `bcryptjs.compare` vs `passwordHash`
- Session strategy: **JWT**
- JWT/session callbacks attach `role` and `id` (`token.sub`) onto `session.user`
- Custom sign-in page: `/admin/login`

**Protection model:**

- No `middleware.ts`
- Admin pages: client `useSession` + redirect to `/admin/login`
- Mutations: `getServerSession` on API routes
- Login: `signIn('credentials', { redirect: false })` then push `/admin`

`admin/layout.tsx` wraps children in `SessionProvider` only.

---

## 8. Content System (Markdown)

**Loader:** `src/lib/content.ts` — reads `content/`, supports `dir/Name/index.md` or flat `dir/file.md`.

Helpers:

- `getFeaturedProjects()` — sort by date ascending
- `getProjects()` — exclude `showInProjects === false`, date desc
- `getJobs()` — date desc
- `getPosts()` — exclude `draft`, date desc
- `getPostBySlug`, `getAllTags`

### Front matter conventions

**Posts:** `title`, `description`, `date`, `draft`, `slug`, `tags[]`

**Featured:** `date`, `title`, `cover`, `github`, `external?`, `tech[]`

**Jobs:** `date`, `title`, `company`, `location`, `range`, `url` + markdown bullet body

**Projects:** `date`, `title`, `github`, `external`, `tech[]`, `showInProjects`

Serialize markdown results to client components with `JSON.parse(JSON.stringify(...))` to strip non-serializable values.

**Rule of thumb:** Keep portfolio/blog content in markdown; use Prisma only for thoughts, notes, photos, and story unless building a markdown CMS.

---

## 9. Styling & Design System

Brittany Chiang visual language — preserve it when editing UI:

| Token | Hex |
| --- | --- |
| Navy | `#0a192f` |
| Light Navy | `#112240` |
| Lightest Navy | `#233554` |
| Slate | `#8892b0` |
| Light Slate | `#a8b2d1` |
| Lightest Slate | `#ccd6f6` |
| White | `#e6f1ff` |
| Green (accent) | `#64ffda` |

Implementation:

1. CSS variables in `src/styles/variables.ts` (injected by `GlobalStyle`)
2. Theme + mixins in `src/styles/theme.ts` / `mixins.ts`
3. styled-components everywhere; SSR via `StyledComponentsRegistry` + `ThemeWrapper`
4. `next.config.js`: `compiler.styledComponents: true`; remote images for `drive.google.com` and `lh3.googleusercontent.com`
5. ScrollReveal via dynamic `import('scrollreveal')` + `srConfig` from `config.ts`

Fonts: Calibre + SF Mono files live under `src/fonts/`; GlobalStyle may not fully wire `@font-face` yet — do not replace with Inter/system defaults when adding styles.

---

## 10. User Flows

### 10.1 Visitor — Portfolio

1. Open `/` — loader (optional) → hero → scroll sections
2. Nav links jump to anchors or Pensieve / Thoughts / Photos / Story
3. Blog: `/pensieve` → post or tag filter
4. Projects: Featured on home; full list on `/archive`

### 10.2 Visitor — Dynamic content

1. `/thoughts` — public musings (graceful empty if DB unavailable)
2. `/notes` → `/notes/[slug]` for a note
3. `/photos` — albums from synced Drive folders
4. `/story` — chronological life events

### 10.3 Admin — Content management

1. `/admin/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD` (seeded user)
2. Dashboard → Thoughts / Notes / Photos / Story
3. Photos: create album with `driveFolderId` → **Sync** to pull images via service account
4. Mutations hit `/api/*` with session cookie

---

## 11. Google Drive Integration

- Service account credentials: `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`
- Sync uses each album’s `driveFolderId` (not only root `GOOGLE_DRIVE_FOLDER_ID`)
- Share Drive folders with the service account email (viewer)
- `POST /api/photos/sync`: lists images, skips existing `driveFileId`, sets cover if unset
- Implementation: `src/lib/google-drive.ts`

---

## 12. Environment Variables

```env
# Database (Vercel Postgres / Neon)
DATABASE_URL=          # pooled (runtime)
DIRECT_URL=            # direct (migrations / db push)

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Admin seed credentials
ADMIN_EMAIL=
ADMIN_PASSWORD=

# Google Drive (service account) — optional for photos
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_DRIVE_FOLDER_ID=

# Google Analytics — documented; not wired in src yet
NEXT_PUBLIC_GA_ID=
```

Full local setup: `docs/SETUP.md`.

---

## 13. Scripts & Workflow

```bash
npm run dev          # next dev
npm run build        # prisma generate && next build
npm run start        # next start
npm run lint         # next lint (also husky pre-commit)
npm run db:push      # prisma db push
npm run db:migrate   # prisma migrate dev
npm run db:seed      # tsx prisma/seed.ts
npm run db:studio    # prisma studio
```

**Typical local setup:**

1. `cp .env.example .env` and fill values
2. `nvm use` (Node 22) → `npm install`
3. `npx prisma db push` → `npx prisma db seed`
4. `npm run dev` → http://localhost:3000
5. Admin: http://localhost:3000/admin/login

**Vercel:** set the same env vars; build already runs `prisma generate`. Prefer `db push` / Neon unless committed migrations are introduced.

---

## 14. Key Implementation Notes

- **Server/client split:** Server `page.tsx` fetches; client `*Page.tsx` owns styled-components and interactivity.
- **Async params (Next 15+):** `params` / `searchParams` in pages and route handlers are `Promise`s — always `await` them.
- **Performance patterns:**
  - Homepage: `Promise.all` for jobs/featured/projects; below-fold sections via `next/dynamic`; Loader (animejs) `dynamic(..., { ssr: false })`.
  - Content loaders wrapped in `React.cache()`; pass `toClientContent()` (omit raw markdown) to client components.
  - Fonts via `next/font/local`; images use `next/image` with `sizes` / AVIF+WebP.
  - `serverExternalPackages`: `googleapis`, `@prisma/client`, `prisma`.
- **DB resilience:** Public DB pages wrap Prisma in try/catch and show empty UI if the DB is down.
- **Prisma singleton:** `src/lib/prisma.ts` uses `PrismaPg` adapter + caches the client on `globalThis` in non-production. Config: `prisma.config.ts`. After schema changes: `npx prisma generate` then `npx prisma db push` (or migrate).
- **animejs v4:** use `createTimeline` / `createDrawable` named imports (not the v3 default `anime` export).
- **Auth gap:** No middleware — harden `/admin/*` with middleware if improving security.
- **Notes API:** `GET /api/notes` returns all notes when authenticated; public-only when unauthenticated.
- **Naming drift:** API `published` → schema `isPublic`; thoughts use `content` (not `body`); model is `StoryEvent` (not `StoryEntry`).
- **React 19:** `CSSTransition` must use `nodeRef` (no `findDOMNode`).
- **Plan vs shipped:** No `/photos/[slug]` album detail; no markdown CMS for posts/jobs/projects; NextAuth v4 (docs may mention v5); ScrollReveal still used (not framer-motion).
- **Static assets:** Serve from `public/` (no longer gitignored). OG images also under `static/`.
- **Do not** hardcode secrets; use `.env` / Vercel env. Never commit `.env`.

---

## 15. Related Docs

| File | Use |
| --- | --- |
| `docs/Features.md` | Product requirements (includes unbuilt CMS items) |
| `docs/IMPLEMENTATION_PLAN.md` | Migration rationale and phased plan (schema drafts may be outdated — trust `prisma/schema.prisma`) |
| `docs/SETUP.md` | Postgres, NextAuth, Drive, Vercel env |
| `.claude/rules.md` | Hard constraints for coding agents |
| `.claude/commands/*` | Story → plan → code agent prompts |
