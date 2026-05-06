# Main Features

## 1. Keep Current Features (Portfolio Core)
- **Homepage**: Hero, About, Experience, Featured Projects, Projects Grid, Contact
- **Blog (Pensieve)**: Markdown-driven posts with tags, code highlighting, responsive images
- **Archive**: Searchable table of all projects
- **Existing UX**: ScrollReveal animations, mobile menu, dark theme, PWA support

## 2. Random Thoughts & Technical Notes
- **Route**: `/thoughts` (random thoughts) and `/notes` (technical notes)
- **Content model**: Title, body (rich text/markdown), tags, date, category (thought | note)
- **Display**: Card-based grid layout, filterable by tags
- **Features**:
  - Short-form random thoughts (no title required, tweet-like)
  - Long-form technical notes (title + structured content + code blocks)
  - Tag-based filtering and search
  - Pagination (12 items per page)

## 3. Photos (Google Drive Integration)
- **Route**: `/photos` and `/photos/[albumSlug]`
- **Source**: Google Drive API — reads folder structure as albums
  - Drive folder structure: `Nosgnoh/<AlbumName>` (e.g., `Nosgnoh/Danang-2026`)
- **Database**: Vercel Postgres + Prisma ORM for caching album metadata
  - Stores: album name, slug, cover photo URL, photo count, sync timestamp
  - Caches photo URLs to reduce API calls
- **Display**:
  - Albums grid with cover photos and names
  - Individual album: masonry/grid gallery with lightbox viewer
  - Lazy-loaded images with blur placeholders
- **Sync**: Background job to refresh album data from Drive periodically

## 4. Personal Story
- **Route**: `/story`
- **Content model**: Timeline-based entries with title, date, body, optional image
- **Display**:
  - Vertical timeline layout
  - Alternating left/right entries with scroll animations
  - Section headers for life chapters (Education, Career, Travel, etc.)
- **Features**:
  - Rich text content with embedded images
  - Milestone markers for key events

## 5. Admin Panel (Protected CMS)
- **Route**: `/admin` and `/admin/*`
- **Authentication**: Single admin user, NextAuth.js with credentials provider (email/password)
  - Protected by middleware — redirects unauthenticated users to login
  - Session-based auth with JWT tokens
- **CRUD capabilities**:
  - **Thoughts & Notes**: Create, edit, delete, toggle publish status
  - **Photos**: Trigger Drive sync, reorder albums, set cover photos, edit metadata
  - **Story**: Add/edit/reorder/delete timeline entries
  - **Blog Posts**: Create, edit, delete markdown posts (with live preview)
  - **Projects**: Manage featured & archive projects
  - **Experience**: Add/edit job entries
- **UI**: Dashboard with sidebar navigation, data tables, form editors
- **Rich text editor**: Markdown editor with preview for long-form content