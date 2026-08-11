# RSS Server — Assessment 2

A containerised RSS Server backend built with Next.js, Sequelize, and SQLite, integrated with the Assessment 1 React frontend.

## Repository

This is the dedicated repository for **Assessment 2**, kept separate from the Assessment 1 frontend repository per the tutor's advice to use one repository per assessment.

- **Assessment 2 (this repo):** https://github.com/JayaJobin/rss-server-assessment2
- **Assessment 1:** https://github.com/JayaJobin/rss-server-frontend

## Architecture

wk5docker/
- frontend/  — Next.js UI (Assessment 1), extended to consume the live API, including an RSS Client page
- api/       — Next.js API-only app: Sequelize models, migrations, CRUD + operational routes
- docker-compose.yml

| Service    | Role                          | Tech                          | Port |
|------------|-------------------------------|--------------------------------|------|
| frontend   | React UI + RSS Client         | Next.js                        | 3000 |
| api        | REST API + RSS feed           | Next.js + Sequelize + SQLite   | 4000 |
| sqlite     | Shared SQLite volume holder   | Alpine container               | -    |

## Database schema

The database uses Sequelize ORM with SQLite. The main models are User, Author, FeedSource and Post.

- User - id, name, lineStatus (legacy demo model, unrelated to the RSS domain)
- Author - id, name, email
- FeedSource - id, name, url
- Post - id, slug, title, author, publishedAt, category, summary, body, imageUrl, link, readTime, feedSourceId (FK), authorId (FK)

A FeedSource can contain multiple Posts, and an Author can create multiple Posts. Each Post stores information such as title, author/description, publication date, image, link and category.

Relationships:
- FeedSource.hasMany(Post) / Post.belongsTo(FeedSource)
- Author.hasMany(Post) / Post.belongsTo(Author)

## API endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET/POST/PATCH/DELETE | /api/posts | CRUD for posts |
| GET/POST/PATCH/DELETE | /api/feedsources | CRUD for feed sources |
| GET/POST/PATCH/DELETE | /api/authors | CRUD for authors |
| GET | /api/health | Heartbeat (status, uptime, timestamp) |
| GET | /api/count | Running count of API requests |
| GET | /api/stats | Feed statistics (totals + request count) |
| GET | /api/rss | Live RSS 2.0 XML feed generated from Posts |

The CRUD routes (posts, feedsources, authors), the RSS feed route, and the `/api/count` endpoint itself all increment the shared request counter. `/api/health` and `/api/stats` only read the current value, they do not increment it.

## Running locally

docker-compose build --no-cache
docker-compose up

Frontend: http://localhost:3000
RSS Client: http://localhost:3000/rss-client
API: http://localhost:4000/api/...

The api service runs "npx sequelize-cli db:migrate" automatically on startup before starting the dev server, so the SQLite database and tables are created fresh from the migrations in api/migrations/.

## Environment configuration

The frontend reads the API's public address from the NEXT_PUBLIC_API_URL environment variable (set in docker-compose.yml), instead of a hardcoded IP, so the deployment address can change without editing source code.

## Frontend-backend integration

frontend/lib/apiServer.ts fetches posts server-side over Docker's internal network (http://api:3000) for the homepage and feeds pages. frontend/lib/apiClient.ts is used by client-side components (ManageFeeds, ManagePosts) running in the browser to read/write data against the API's public address. frontend/app/rss-client/page.tsx acts as an independent RSS Client: it fetches /api/rss directly and parses the raw RSS 2.0 XML in the browser.

## Branching

Backend and integration work for Assessment 2 was developed on feature/assessment-2-backend, kept separate from main (Assessment 1's frontend-only state) until reviewed and merged.

## Entity Relationship Diagram

┌──────────────┐
│ FeedSource │
├──────────────┤
│ id │
│ name │
│ url │
└──────┬───────┘
│ 1
│
│ *
┌──────▼───────┐
│ Post │
├──────────────┤
│ id │
│ slug │
│ title │
│ author │ (display name string)
│ summary │
│ body │
│ publishedAt │
│ imageUrl │
│ link │
│ readTime │
│ category │
│ authorId FK │──────┐
│ feedSourceId │ │ *
└──────────────┘ │
│ 1
┌──────▼───────┐
│ Author │
├──────────────┤
│ id │
│ name │
│ email │
└──────────────┘

A `FeedSource` has many `Post`s, and an `Author` has many `Post`s. `Post.author` stores a plain display-name string (useful when a post comes from a feed with no registered author), while `Post.authorId` optionally links to a full `Author` profile — both fields are nullable so the schema tolerates posts imported without complete metadata.

## API Documentation

Base URL: `http://<host>:4000`

| Endpoint | Method | Body / Params | Response |
|---|---|---|---|
| `/api/posts` | GET | `?id=` or `?slug=` optional | Post or array of Posts (includes FeedSource + Author) |
| `/api/posts` | POST | `{ slug, title, author, publishedAt, category, summary, body, imageUrl?, link?, readTime?, feedSourceId?, authorId? }` | Created Post, 201 |
| `/api/posts` | PATCH | `?id=` + any updatable fields | Updated Post |
| `/api/posts` | DELETE | `?id=` | 204 No Content |
| `/api/feedsources` | GET/POST/PATCH/DELETE | `{ name, url }` | FeedSource CRUD |
| `/api/authors` | GET/POST/PATCH/DELETE | `{ name, email? }` | Author CRUD |
| `/api/users` | GET/POST/PATCH/DELETE | `{ name, lineStatus }` | Legacy demo model, unrelated to the RSS domain |
| `/api/health` | GET | — | `{ status, uptimeSeconds, timestamp }` |
| `/api/count` | GET | — | `{ count }` — running total of API requests |
| `/api/stats` | GET | — | `{ totalFeedSources, totalPosts, totalApiRequests }` |
| `/api/rss` | GET | — | Full RSS 2.0 XML feed of all Posts |
| `/api/rss/[category]` | GET | category in path | RSS 2.0 XML feed filtered to that category only |

## API Response Format

- Successful reads/writes return JSON (or RSS XML for `/api/rss*`) with standard HTTP status codes: `200` (OK), `201` (Created), `204` (No Content, on delete).
- Errors return a plain-text message with an appropriate status: `400` (missing/invalid body or id), `404` (record not found), `500` (unexpected server error).
- All CRUD and RSS routes send CORS headers (`Access-Control-Allow-Origin: *`) so the frontend can call the API from a different port/host in this Docker Compose setup.

## Health Monitoring

- `GET /api/health` reports process uptime and a timestamp, confirming the API process is alive.
- `GET /api/count` and `GET /api/stats` are incremented on every CRUD/RSS request, giving a simple live traffic counter without any extra logging infrastructure.

## Docker Architecture

Three services, defined in `docker-compose.yml`:

| Service | Image | Purpose |
|---|---|---|
| `frontend` | built from `frontend/Dockerfile` | Next.js UI, port 3000 |
| `api` | built from `api/Dockerfile` | Next.js + Sequelize API, port 4000 (mapped from container port 3000) |
| `sqlite` | `alpine` | Holds the shared `sqlite_data` named volume so the database file survives container restarts |

On startup, the `api` service runs `npx sequelize-cli db:migrate` before starting the dev server, so the schema is (re)built from `api/migrations/` every time the stack comes up — no manual migration step required.

## RSS Server → RSS Client Workflow

1. Posts are created via `POST /api/posts` (through the Manage Posts admin page or directly against the API).
2. `GET /api/rss` (or `/api/rss/[category]`) queries the `Post` table with Sequelize and serialises the results into RSS 2.0 XML on the fly — there is no separate "feed generation" step or cache.
3. `frontend/app/rss-client/page.tsx` acts as an independent RSS Client: it fetches that XML directly with `fetch()`, parses it in the browser with `DOMParser`, and renders it as cards — completely separate from the admin "Feeds" page, demonstrating a genuine server → client feed handoff.
4. The category filter buttons on that page are populated dynamically from `GET /api/posts`, so a new category typed into a post automatically becomes a filter option without any code change.

## Testing

Manual endpoint testing performed via `curl` against the running Docker containers:

| Request | Expected | Result |
|---|---|---|
| `GET /api/health` | 200, `status: "ok"` | ✅ Pass |
| `GET /api/count` | 200, numeric count | ✅ Pass |
| `GET /api/stats` | 200, totals object | ✅ Pass |
| `GET /api/posts` | 200, array of posts | ✅ Pass |
| `GET /api/feedsources` | 200, array of feed sources | ✅ Pass |
| `GET /api/rss` | 200, valid RSS 2.0 XML | ✅ Pass |
| `GET /api/rss/[category]` | 200, XML filtered to that category only | ✅ Pass |
| `docker-compose ps` | All 3 containers "Up" | ✅ Pass |

Frontend integration was verified manually in-browser: homepage and Feeds page display live database content, and the RSS Client page correctly switches feeds when a category button is clicked.

## Environment Variables

| Variable | Used by | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | frontend (browser-side) | Public address of the API, e.g. `http://<ec2-ip>:4000`, set in `docker-compose.yml` so it isn't hardcoded in source |
| `API_INTERNAL_URL` | frontend (server-side) | Internal Docker network address of the API (defaults to `http://api:3000`) used for server-rendered pages |
| `NODE_ENV` | both services | Standard Next.js environment flag |

## Git Branching Strategy

Backend and integration work for Assessment 2 was developed on `feature/assessment-2-backend`, kept separate from `main` (Assessment 1's frontend-only state) until reviewed and merged. Commits on that branch track incremental backend work: schema/migrations, CRUD routes, operational endpoints, Docker setup, the RSS Client, and the dynamic category-filtering feature added afterwards.

## Known Limitations

- `Post.author` is a free-text display name separate from the optional `Post.authorId` relationship — this was a deliberate choice to support posts from feeds without a registered author profile, but it means the two can technically disagree if not kept in sync manually.
- `publishedAt` is stored as a string rather than a native `DATE` column, matching how dates arrive from example feed sources; a future iteration could migrate this to a proper `DATE` type with stricter validation.
- Foreign keys (`feedSourceId`, `authorId`) are nullable to allow posts to be created without a linked feed/author; a stricter schema could enforce these as required once all data sources are guaranteed to supply them.
- The `User` model is a legacy artifact from an earlier lab exercise and is unrelated to the RSS domain; it is left in place for reference but not used by any RSS feature.
