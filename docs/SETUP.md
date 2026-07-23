# Environment Setup Guide

This guide walks you through setting up **PostgreSQL**, **NextAuth**, and **Google Drive API** for local development.

---

## Table of Contents

1. [PostgreSQL Database](#1-postgresql-database)
2. [NextAuth Authentication](#2-nextauth-authentication)
3. [Google Drive API (Service Account)](#3-google-drive-api-service-account)
4. [Google Analytics (Optional)](#4-google-analytics-optional)
5. [Final Steps](#5-final-steps)

---

## 1. PostgreSQL Database

### Recommended: Neon on Vercel (production + local via env pull)

1. In the Vercel dashboard open project **portfolio** → **Storage** → create **Neon Postgres**, or run after CLI login:
   ```bash
   vercel login
   vercel link   # project: portfolio
   vercel install neon
   ```
2. Connect the store to **Development / Preview / Production**.
3. Pull secrets locally and map Prisma names:
   ```bash
   vercel env pull .env.local
   ```
   Ensure:
   - `DATABASE_URL` = pooled Neon URL (runtime)
   - `DIRECT_URL` = unpooled / `DATABASE_URL_UNPOOLED` (migrations / `prisma db push`)
4. Apply schema + seed:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

### Option A: Install PostgreSQL locally (macOS)

```bash
# Install via Homebrew
brew install postgresql@16

# Start the service
brew services start postgresql@16

# Create the database
createdb nosgnoh_life
```

### Option B: Use Docker

```bash
docker run --name nosgnoh-postgres \
  -e POSTGRES_USER=nosgnoh \
  -e POSTGRES_PASSWORD=your-password \
  -e POSTGRES_DB=nosgnoh_life \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### Option C: Use a cloud provider

- **Neon** (free tier): https://neon.tech — serverless PostgreSQL, great for Vercel deployments
- **Supabase** (free tier): https://supabase.com — managed PostgreSQL with extras
- **Railway** (free tier): https://railway.app

### Configure the connection string

Edit your `.env` file (copy from `.env.example` first):

```bash
cp .env.example .env
```

Set your `DATABASE_URL`:

```env
# Local PostgreSQL (default user, no password)
DATABASE_URL="postgresql://nosgnoh:your-password@localhost:5432/nosgnoh_life?schema=public"

# Or Neon example:
DATABASE_URL="postgresql://nosgnoh:xxx@ep-xxx.us-east-2.aws.neon.tech/nosgnoh_life?sslmode=require"
```

### Run migrations & seed

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Seed the admin user
npx prisma db seed
```

### Verify it works

```bash
# Open Prisma Studio to browse your database
npx prisma studio
```

This opens a web UI at http://localhost:5555 where you can see your tables and data.

---

## 2. NextAuth Authentication

NextAuth is already configured with a **Credentials provider** (email + password). You just need to set two environment variables.

### Generate a secret

```bash
# Generate a random 32-byte secret
openssl rand -base64 32
```

Copy the output.

### Configure `.env`

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paste-your-generated-secret-here"
```

> **Important for production (Vercel):**
> - `NEXTAUTH_URL` is automatically inferred on Vercel — you don't need to set it.
> - `NEXTAUTH_SECRET` is **required** in production. Add it to your Vercel environment variables.

### Set admin credentials for seeding

```env
ADMIN_EMAIL="nosgnohz@gmail.com"
ADMIN_PASSWORD="choose-a-strong-password"
```

After running `npx prisma db seed`, you can log in at http://localhost:3000/admin/login with these credentials.

### How it works

- Uses **JWT strategy** (no database sessions needed)
- Login endpoint: `/admin/login`
- Protected routes: All `/admin/*` pages and `POST/PUT/DELETE` API routes
- Session is stored in an HTTP-only cookie

---

## 3. Google Drive API (Service Account)

The photo gallery syncs images from a Google Drive folder using a **service account** (no user OAuth flow needed).

### Step 1: Create a Google Cloud project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it (e.g., `nosgnoh-life`) and click **Create**

### Step 2: Enable the Google Drive API

1. In your project, go to **APIs & Services** → **Library**
2. Search for **"Google Drive API"**
3. Click on it and press **Enable**

### Step 3: Create a Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"Service account"**
3. Fill in:
   - **Name:** `drive-reader` (or anything)
   - **ID:** auto-generated
4. Click **Create and Continue**
5. Skip the optional "Grant access" steps → click **Done**

### Step 4: Generate a key

1. In the **Credentials** page, click on your new service account
2. Go to the **Keys** tab
3. Click **"Add Key"** → **"Create new key"**
4. Choose **JSON** → click **Create**
5. A `.json` file will download. Open it and find:
   - `client_email` — looks like `drive-reader@your-project.iam.gserviceaccount.com`
   - `private_key` — a long string starting with `-----BEGIN PRIVATE KEY-----`

### Step 5: Share your Drive folder with the service account

1. Go to [Google Drive](https://drive.google.com/)
2. Create a folder for your photos (or use an existing one)
3. Right-click the folder → **Share**
4. Paste the `client_email` from step 4 (e.g., `drive-reader@your-project.iam.gserviceaccount.com`)
5. Set permission to **Viewer**
6. Click **Send**

### Step 6: Get the folder ID

1. Open the folder in Google Drive
2. Look at the URL: `https://drive.google.com/drive/folders/XXXXXXXXXXXXXXXXX`
3. The `XXXXXXXXXXXXXXXXX` part is your folder ID

### Step 7: Configure `.env`

```env
GOOGLE_CLIENT_EMAIL="drive-reader@your-project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...your-key-here...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID="your-folder-id-here"
```

> **Tips:**
> - The `GOOGLE_PRIVATE_KEY` must be on a **single line** with `\n` for newlines
> - In the downloaded JSON file, the key already has `\n` characters — copy it as-is
> - On Vercel, paste the key exactly as it appears in the JSON (with `\n` literals)

### Recommended Drive layout

```
Nosgnoh.life/          ← GOOGLE_DRIVE_FOLDER_ID (root)
  Đà Nẵng 2026/        ← album folder
  Race Day/
  Backpack Notes/
```

Share the **root** folder (or each album) with the service account as **Viewer**.

### How it works

- Admin goes to `/admin/photos` → **Discover albums from Drive** (`POST /api/photos/discover`) upserts albums from root child folders
- **Sync all** / per-album **Sync from Drive** (`POST /api/photos/sync`) upserts photos by `driveFileId` and sets `lastSyncedAt`
- Public `/photos` pages read **Postgres only** (mock fallback only in development when empty)
- Image URLs stay on Drive (`https://drive.google.com/uc?export=view&id={fileId}`)

---

## 4. Google Analytics (Optional)

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new **GA4 property**
3. Get your **Measurement ID** (starts with `G-`)
4. Add to `.env`:

```env
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

---

## 5. Final Steps

### Complete `.env` example

```env
# Database
DATABASE_URL="postgresql://nosgnoh:password@localhost:5432/nosgnoh_life?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-openssl-generated-secret"

# Admin credentials (for seeding)
ADMIN_EMAIL="nosgnohz@gmail.com"
ADMIN_PASSWORD="your-strong-password"

# Google Drive API (Service Account)
GOOGLE_CLIENT_EMAIL="drive-reader@your-project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID="your-folder-id"

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### Startup commands

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Push schema to database
npx prisma db push

# 4. Seed admin user
npx prisma db seed

# 5. Start dev server
npm run dev
```

### Vercel deployment checklist

When deploying to Vercel, add these environment variables in **Settings → Environment Variables**:

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | Use Neon/Supabase connection string with `?sslmode=require` |
| `NEXTAUTH_SECRET` | Yes | Same secret you generated with `openssl rand -base64 32` |
| `ADMIN_EMAIL` | No | Only needed if running seed |
| `ADMIN_PASSWORD` | No | Only needed if running seed |
| `GOOGLE_CLIENT_EMAIL` | Yes* | Required for photo gallery |
| `GOOGLE_PRIVATE_KEY` | Yes* | Required for photo gallery |
| `GOOGLE_DRIVE_FOLDER_ID` | Yes* | Required for photo gallery |
| `NEXT_PUBLIC_GA_ID` | No | For analytics tracking |

> *Only required if you use the photo gallery feature.

### Build command for Vercel

```bash
npx prisma generate && next build
```

Set this as your **Build Command** in Vercel project settings, or add to `package.json`:

```json
"scripts": {
  "vercel-build": "prisma generate && next build"
}
```
