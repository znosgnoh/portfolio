# Implementation Plan

## Architecture Decision: Gatsby → Next.js Migration

The new features (API routes, authentication, database, server-side logic) fundamentally conflict with Gatsby's static-site approach. **Migrating to Next.js** is required because:

- **Admin panel** needs server-side auth + API routes
- **Google Drive integration** needs server-side API calls with credentials
- **Database (Prisma)** needs server-side ORM access
- **Dynamic content** (thoughts, notes, story) needs ISR/SSR, not rebuild-on-every-change
- **Vercel deployment** is already the target — Next.js has first-class support

### Migration Strategy
- Preserve all existing pages, styling, and UX
- Port styled-components, ScrollReveal, animations as-is
- Convert GraphQL markdown queries → local file reads with `gray-matter` + `remark`
- Keep all existing content in `content/` folder (markdown files)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Styled-Components (existing) + CSS Variables |
| Database | Vercel Postgres |
| ORM | Prisma |
| Auth | NextAuth.js v5 (credentials provider) |
| Photos | Google Drive API v3 |
| Markdown | gray-matter + remark + rehype + prism |
| Image Optimization | Next.js Image component |
| Deployment | Vercel |
| Package Manager | npm |

---

## Phase 1: Next.js Migration (Foundation)

### 1.1 Project Setup
```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (ThemeProvider, GlobalStyle, fonts)
│   ├── page.tsx                  # Homepage (Hero, About, Jobs, Featured, Projects, Contact)
│   ├── archive/page.tsx          # Project archive
│   ├── pensieve/
│   │   ├── page.tsx              # Blog index
│   │   ├── [slug]/page.tsx       # Blog post
│   │   └── tags/[tag]/page.tsx   # Tag archive
│   ├── thoughts/page.tsx         # Random thoughts
│   ├── notes/page.tsx            # Technical notes
│   ├── photos/
│   │   ├── page.tsx              # Albums grid
│   │   └── [slug]/page.tsx       # Album detail
│   ├── story/page.tsx            # Personal story timeline
│   ├── admin/
│   │   ├── layout.tsx            # Admin layout with sidebar
│   │   ├── page.tsx              # Dashboard
│   │   ├── login/page.tsx        # Login form
│   │   ├── thoughts/page.tsx     # Manage thoughts
│   │   ├── notes/page.tsx        # Manage notes
│   │   ├── photos/page.tsx       # Manage photos/sync
│   │   ├── story/page.tsx        # Manage story
│   │   ├── posts/page.tsx        # Manage blog posts
│   │   └── projects/page.tsx     # Manage projects
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── thoughts/route.ts
│       ├── notes/route.ts
│       ├── photos/
│       │   ├── route.ts
│       │   └── sync/route.ts
│       ├── story/route.ts
│       ├── posts/route.ts
│       └── projects/route.ts
├── components/                   # Ported from current src/components
│   ├── sections/                 # Homepage sections (hero, about, jobs, etc.)
│   ├── icons/                    # SVG icon components
│   ├── layout/                   # Layout, Nav, Menu, Footer, Social, Email
│   └── ui/                       # Shared UI (buttons, cards, modals, editor)
├── styles/                       # Ported: GlobalStyle, variables, mixins, theme, prism
├── hooks/                        # Ported: useScrollDirection, usePrefersReducedMotion, etc.
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── auth.ts                   # NextAuth config
│   ├── google-drive.ts           # Google Drive API helpers
│   ├── markdown.ts               # Markdown parsing (gray-matter + remark)
│   └── content.ts                # Read local markdown content from /content
├── config.ts                     # Ported from src/config.js
└── types/                        # TypeScript types
    ├── index.ts
    └── prisma.ts
content/                          # Keep existing markdown content
├── posts/
├── featured/
├── jobs/
├── projects/
prisma/
├── schema.prisma                 # Database schema
└── seed.ts                       # Initial admin user seed
```

### 1.2 Install Dependencies
```bash
npm install next react react-dom typescript @types/react @types/node
npm install styled-components @types/styled-components
npm install prisma @prisma/client
npm install next-auth @auth/prisma-adapter
npm install googleapis
npm install gray-matter remark remark-html rehype-prism-plus
npm install react-helmet react-transition-group animejs scrollreveal
npm install framer-motion  # Replace ScrollReveal for SSR compatibility
npm install lodash
npm install --save-dev @types/lodash
```

### 1.3 Migrate Existing Pages
- Convert each Gatsby page component to Next.js page
- Replace `useStaticQuery`/`graphql` with local file reads via `lib/content.ts`
- Replace `gatsby-plugin-image` with `next/image`
- Port `gatsby-node.js` dynamic routes to `[slug]` directories
- Keep all styled-components as-is (install SWC plugin for SSR)

### 1.4 Configuration
- `next.config.js`: compiler.styledComponents, images.domains, redirects
- Port webpack aliases to `tsconfig.json` paths
- Environment variables: `.env.local` for secrets

---

## Phase 2: Database & Auth

### 2.1 Prisma Schema
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String?
  createdAt DateTime @default(now())
}

model Thought {
  id        String   @id @default(cuid())
  body      String
  tags      String[] // PostgreSQL array
  published Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Note {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  body      String   // Markdown content
  tags      String[]
  published Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Album {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  driveFolderId String @unique
  coverUrl    String?
  photoCount  Int      @default(0)
  sortOrder   Int      @default(0)
  published   Boolean  @default(true)
  syncedAt    DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  photos      Photo[]
}

model Photo {
  id          String   @id @default(cuid())
  driveFileId String   @unique
  url         String
  thumbnailUrl String?
  width       Int?
  height      Int?
  name        String?
  sortOrder   Int      @default(0)
  albumId     String
  album       Album    @relation(fields: [albumId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
}

model StoryEntry {
  id        String   @id @default(cuid())
  title     String
  body      String   // Markdown
  imageUrl  String?
  chapter   String   // Education, Career, Travel, etc.
  date      DateTime
  sortOrder Int      @default(0)
  published Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2.2 Auth Setup
- NextAuth.js with CredentialsProvider
- Single admin user seeded via `prisma/seed.ts`
- Middleware at `/admin/*` to protect routes
- JWT session strategy (stateless, works with Vercel serverless)

### 2.3 Database Commands
```bash
npx prisma generate
npx prisma db push          # Development
npx prisma migrate deploy   # Production
npx prisma db seed          # Create admin user
```

---

## Phase 3: New Features

### 3.1 Thoughts & Notes
- **API routes**: CRUD endpoints at `/api/thoughts` and `/api/notes`
- **Public pages**: SSR with ISR (revalidate every 60s)
- **Admin pages**: Table view + create/edit forms with markdown preview
- **Tags**: Extracted from content, displayed as filter chips

### 3.2 Photos (Google Drive)
- **Service account**: Create in Google Cloud Console, share Drive folder with it
- **Sync flow**:
  1. Admin clicks "Sync" or cron triggers `/api/photos/sync`
  2. API lists folders in root Drive folder → creates/updates Album records
  3. For each album folder, lists image files → creates/updates Photo records
  4. Generates thumbnail URLs via Drive API
- **Public display**:
  - Albums grid with lazy-loaded cover images
  - Album detail with masonry grid + lightbox (click to enlarge)
  - Images served via Google Drive's `webContentLink` or a proxy route
- **Environment variables**:
  ```
  GOOGLE_DRIVE_FOLDER_ID=<root-folder-id>
  GOOGLE_SERVICE_ACCOUNT_EMAIL=<service-account@...iam.gserviceaccount.com>
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=<private-key>
  ```

### 3.3 Personal Story
- **API routes**: CRUD at `/api/story`
- **Public page**: Vertical timeline, grouped by chapter
- **Admin page**: Sortable list + form editor with image upload
- **Display**: Alternating cards with date markers and scroll animations

### 3.4 Admin Panel
- **Login**: `/admin/login` — email/password form
- **Dashboard**: `/admin` — overview stats (post count, photo count, etc.)
- **Section pages**: Table + CRUD forms for each content type
- **Components**:
  - `AdminLayout`: Sidebar nav + header with logout
  - `DataTable`: Sortable, paginated table
  - `MarkdownEditor`: Textarea with live preview
  - `ImageUpload`: Drag-and-drop with preview
  - `ConfirmDialog`: Delete confirmation modals

---

## Phase 4: Polish & Deploy

### 4.1 SEO & Performance
- OpenGraph meta tags on all public pages
- Sitemap generation (`next-sitemap`)
- Proper `robots.txt` (exclude `/admin`)
- Image optimization via `next/image` with blur placeholders
- ISR for dynamic content pages

### 4.2 Navigation Updates
Update `config.ts` navLinks:
```typescript
navLinks: [
  { name: 'About', url: '/#about' },
  { name: 'Experience', url: '/#jobs' },
  { name: 'Work', url: '/#projects' },
  { name: 'Photos', url: '/photos' },
  { name: 'Story', url: '/story' },
  { name: 'Blog', url: '/pensieve' },
]
```

### 4.3 Environment Variables (Vercel)
```
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=<random-32-char-string>
NEXTAUTH_URL=https://nosgnoh.life

# Google Drive
GOOGLE_DRIVE_FOLDER_ID=...
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=...

# Admin seed
ADMIN_EMAIL=nosgnohz@gmail.com
ADMIN_PASSWORD=<hashed-on-seed>
```

### 4.4 Deployment Checklist
- [ ] Vercel project linked
- [ ] Vercel Postgres database provisioned
- [ ] Environment variables set in Vercel dashboard
- [ ] Google Cloud service account created and Drive folder shared
- [ ] `prisma migrate deploy` runs in Vercel build command
- [ ] Admin user seeded
- [ ] Custom domain configured (nosgnoh.life)

---

## Execution Order

| Step | Task | Depends On |
|------|------|-----------|
| 1 | Initialize Next.js + TypeScript + styled-components | — |
| 2 | Port existing components & pages (homepage, blog, archive) | 1 |
| 3 | Set up Prisma schema + Vercel Postgres | 1 |
| 4 | Implement NextAuth.js + admin login | 3 |
| 5 | Build Thoughts & Notes (API + pages + admin) | 3, 4 |
| 6 | Build Personal Story (API + page + admin) | 3, 4 |
| 7 | Set up Google Drive integration + Photos (API + pages + admin) | 3, 4 |
| 8 | Polish: SEO, navigation, animations, responsive design | 2–7 |
| 9 | Deploy to Vercel with all env vars | 8 |

---

## Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio"
  }
}
```
