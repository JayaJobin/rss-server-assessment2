# RSS Server — Assessment 2

A containerised RSS Server backend built with Next.js, Sequelize, and SQLite, integrated with the Assessment 1 React frontend.

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

Every route above increments the shared request counter used by /api/count, so it reflects real traffic across posts, feedsources, authors, and the RSS feed itself, not just one endpoint.

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
