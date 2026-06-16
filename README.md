# 📚 Peer & Shelf — Student Resource Network

Built for the H0: Hack the Zero Stack Hackathon (AWS + Vercel).

## What this actually is

A full-stack Next.js + MongoDB marketplace where students can:
- **List & discover** textbooks, notes, and study materials
- **Scan books** — real OCR via Google Cloud Vision + ISBN lookup via Open Library
- **Request resources** — matched against real MongoDB listings by subject/curriculum
- **Find mentors** — browse and request sessions from senior students
- **Wishlist** — request a resource, get matched if it exists in the DB

## What it is NOT (honest)

- Not AI-powered matching — wishlist matching is MongoDB regex queries
- Not real-time chat — messaging is not built yet
- Not authentication-protected — auth is deferred
- No reviews system — reviews show count but display is not built

---

## Stack

- **Frontend + API**: Next.js 15 App Router (TypeScript)
- **Database**: MongoDB Atlas via Mongoose
- **Book OCR**: Google Cloud Vision API
- **Book metadata**: Open Library API (free, no key needed)
- **Deployment**: Vercel

---

## Setup

### 1. Install
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/peer-and-shelf
GOOGLE_CLOUD_VISION_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Getting your Google Cloud Vision key:**
1. Go to https://console.cloud.google.com
2. Enable "Cloud Vision API"
3. Create credentials → API key
4. Restrict key to "Cloud Vision API" only

**Open Library** requires no key — it's a free public API.

### 3. Seed database
```bash
npm run dev
# Visit: http://localhost:3000/api/seed
```

### 4. Run
```bash
npm run dev
```

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/listings`       | Fetch listings (filterable) |
| POST   | `/api/listings`       | Create listing |
| GET    | `/api/listings/[id]`  | Get single listing |
| PATCH  | `/api/listings/[id]`  | Update (e.g. increment saves) |
| DELETE | `/api/listings/[id]`  | Delete listing |
| GET    | `/api/mentors`        | Fetch mentors (filterable) |
| GET    | `/api/mentors/[id]`   | Get single mentor |
| GET    | `/api/wishlist`       | Fetch wishlist items |
| POST   | `/api/wishlist`       | Request resource + run matching |
| DELETE | `/api/wishlist?id=x`  | Remove wishlist item |
| GET    | `/api/notifications`  | Fetch notifications |
| PATCH  | `/api/notifications`  | Mark all as read |
| POST   | `/api/scan`           | OCR a book image (Vision API) |
| POST   | `/api/requests`       | Create a resource request |
| GET    | `/api/requests`       | Fetch all requests |
| GET    | `/api/seed`           | Seed DB with sample data |

---

## Deploying to Vercel

```bash
npm i -g vercel
vercel
```

In Vercel dashboard → Settings → Environment Variables, add:
- `MONGODB_URI`
- `GOOGLE_CLOUD_VISION_API_KEY`

After deploying, hit `https://your-app.vercel.app/api/seed` once.
