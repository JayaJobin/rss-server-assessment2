# RSS Server — Assessment 2

A containerised RSS Server backend built with Next.js, Sequelize, and SQLite, integrated with the Assessment 1 React frontend.

## Architecture

wk5docker/
- frontend/  — Next.js UI (Assessment 1), extended to consume the live API
- api/       — Next.js API-only app: Sequelize models, migrations, CRUD + operational routes
- docker-compose.yml

| Service    | Role                          | Tech                          | Port |
|------------|-------------------------------|--------------------------------|------|
| frontend   | React UI                      | Next.js                        | 3000 |
| api        | REST API                      | Next.js + Sequelize + SQLite   | 4000 |
| sqlite     | Shared SQLite volume holder   | Alpine container               | -    |

## Database schema

Two related Sequelize models represent the RSS domain:

- FeedSource - id, name, url
- Post - id, slug, title, author, publishedAt, category, summary, body, imageUrl, link, readTime, feedSourceId (FK)

A FeedSource has many Posts; a Post belongs to a FeedSource.

## API endpoints

CRUD:
- GET/POST/PATCH/DELETE /api/feedsources
- GET/POST/PATCH/DELETE /api/posts (supports ?slug=)

Operational:
- GET /api/health - heartbeat (status, uptime, timestamp)
- GET /api/stats - feed statistics (total feed sources, total posts, total API requests)

## Running locally

docker-compose build --no-cache
docker-compose up

Frontend: http://localhost:3000
API: http://localhost:4000/api/...

The api service runs "npx sequelize-cli db:migrate" automatically on startup before starting the dev server, so the SQLite database and tables are created fresh from the migrations in api/migrations/.

## Frontend-backend integration

frontend/lib/apiServer.ts fetches posts server-side over Docker's internal network (http://api:3000) for the homepage and feeds pages. frontend/lib/apiClient.ts is used by the client-side ManageFeeds component (running in the browser) to read/write feed sources against the API's public address.

## Branching

Backend and integration work for Assessment 2 was developed on feature/assessment-2-backend, kept separate from main (Assessment 1's frontend-only state) until reviewed and merged.
